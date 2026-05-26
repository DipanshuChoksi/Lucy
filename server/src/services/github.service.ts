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
    const path = `Lucy-Notes/${filename}`;
    const url = `https://api.github.com/repos/${repo}/contents/${path}`;

    // Base64 encode the content for the GitHub API
    const base64Content = Buffer.from(content, 'utf-8').toString('base64');

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
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('GitHub API Error:', errorData);
      throw new Error(`Failed to push to GitHub: ${response.status} ${response.statusText}`);
    }
  }
}

export const githubService = new GitHubService();



