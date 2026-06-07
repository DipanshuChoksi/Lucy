import { StorageAdapter } from './storage.adapter';

export class GitHubStorageAdapter implements StorageAdapter {
  private githubToken: string;

  constructor(githubToken: string) {
    this.githubToken = githubToken;
  }
  /**
   * Pushes a Markdown file to a GitHub repository.
   * @param repo The repository in the format "owner/repo".
   * @param filename The desired filename (e.g., "react-hooks-summary.md").
   * @param content The Markdown content to push.
   */
  public async pushToRepository(
    repo: string,
    filename: string,
    content: string
  ): Promise<void> {
    // We store all notes in a specific folder called "Lucy-Notes"
    const path = `${filename}`;

    const url = `https://api.github.com/repos/${repo}/contents/${path}`;
    console.log(url)
    // Base64 encode the content for the GitHub API
    const base64Content = Buffer.from(content, 'utf-8').toString('base64');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 seconds timeout

    try {
      // First, try to get the file to check if it exists and get its sha
      let sha: string | undefined;
      const getResponse = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      });

      if (getResponse.ok) {
        const fileData = await getResponse.json();
        sha = fileData.sha;
      }

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Add/Update ${filename} via Lucy Assistant`,
          content: base64Content,
          ...(sha && { sha }), // Include sha if the file exists
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.status === 403 || response.status === 429) {
        const rateLimitReset = response.headers.get('x-ratelimit-reset');
        if (rateLimitReset) {
          const resetDate = new Date(parseInt(rateLimitReset) * 1000);
          console.error(`GitHub Rate Limit Exceeded. Resets at ${resetDate.toLocaleString()}`);
          throw new Error(`GitHub API rate limit exceeded. Please try again after ${resetDate.toLocaleTimeString()}.`);
        }
        throw new Error('GitHub API rate limit exceeded.');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('GitHub API Error:', errorData);
        if (response.status === 404) {
          throw new Error(`GitHub repository not found or no access. Please check the repository name in your settings and ensure your token has access.`);
        }
        if (response.status === 401) {
          throw new Error(`GitHub token is invalid or expired. Please check your GitHub token in settings.`);
        }
        throw new Error(`Failed to push to GitHub: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.error('GitHub API Timeout');
        throw new Error('GitHub API request timed out after 15 seconds.');
      }
      throw error; // Re-throw other errors
    }
  }
}
