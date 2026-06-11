import { YoutubeTranscript } from 'youtube-transcript';

export interface VideoMetadata {
  title: string;
  channelName: string;
  channelUrl: string;
  thumbnail: string;
}

export class YouTubeService {
  /**
   * Fetches the raw transcript objects for a given YouTube video.
   * @param videoIdOrUrl The YouTube video ID or full URL.
   * @returns An array of transcript chunks with text, duration, and offset.
   */
  public async fetchTranscript(videoIdOrUrl: string) {
    try {
      const transcript = await YoutubeTranscript.fetchTranscript(videoIdOrUrl);
      return transcript;
    } catch (error) {
      console.error('Error fetching YouTube transcript:', error);
      throw new Error('Failed to fetch YouTube transcript. Ensure the video has captions enabled.');
    }
  }

  /**
   * Fetches the transcript and extracts only the combined text as a single string.
   * @param videoIdOrUrl The YouTube video ID or full URL.
   * @returns A single string containing the entire transcript text.
   */
  public async extractText(videoIdOrUrl: string): Promise<string> {
    const transcript = await this.fetchTranscript(videoIdOrUrl);
    return transcript.map(chunk => chunk.text).join(' ');
  }

  public async getVideoMetadata(url: string): Promise<VideoMetadata> {
    const endpoint = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;

    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error('Failed to fetch video metadata');
    }

    const data = await response.json();
    return {
      title: data.title,
      channelName: data.author_name,
      channelUrl: data.author_url,
      thumbnail: data.thumbnail_url,
    };
  }

}

export const youtubeService = new YouTubeService();
