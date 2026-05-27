import { Request, Response } from 'express';
import { youtubeService } from '../services/youtube.service';
import { contentService } from '../services/content.service';
import { githubService } from '../services/github.service';
import { settingsService } from '../services/settings.service';

export class YouTubeController {
  async processVideo(req: Request, res: Response) {
    try {
      const { youtubeLink } = req.body;
      const email = 'web-user@example.com'; // using a dummy ema  il instead of dummy telegramId

      if (!youtubeLink) {
        return res.status(400).json({ error: 'youtubeLink is required' });
      }

      // 1. Fetch user settings to get Obsidian repository info
      const userSettings = await settingsService.getSettings(email);
      if (!userSettings || !userSettings.obsidianRepo) {
        return res.status(400).json({
          error: 'Obsidian repository is not configured. Please set it up in the settings first.'
        });
      }

      // 2. Extract video ID for naming the file uniquely
      const videoId = YouTubeController.extractVideoId(youtubeLink);
      const filename = `youtube-${videoId}.md`;

      // 3. Extract transcript
      const transcriptText = await youtubeService.extractText(youtubeLink);
      if (!transcriptText || transcriptText.trim().length === 0) {
        return res.status(422).json({ error: 'Could not extract transcript. Please verify captions are enabled on the video.' });
      }

      // 4. Process transcript into structured notes & flashcards via LLM
      const structuredNotes = await contentService.processContent(transcriptText);


      // 5. Push the notes to the user's Obsidian GitHub repository
      await githubService.pushToRepository(
        userSettings.obsidianRepo,
        filename,
        structuredNotes
      );

      return res.json({
        success: true,
        message: `Successfully processed and saved to ${userSettings.obsidianRepo}/${filename}`,
        summary: structuredNotes
      });
    } catch (error: any) {
      console.error('Error in YouTubeController.processVideo:', error);
      return res.status(500).json({
        error: error.message || 'An error occurred while processing the YouTube video.'
      });
    }
  }

  private static extractVideoId(url: string): string {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : `video-${Date.now()}`;
  }
}

export const youtubeController = new YouTubeController();
