export class GitHubService {
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
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${process.env.GITHUB_PERSONAL_ACCESS_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Add ${filename} via Lucy Assistant`,
          content: base64Content,
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

export const githubService = new GitHubService();



