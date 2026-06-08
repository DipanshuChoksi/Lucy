import { Request, Response } from 'express';
import { youtubeService } from '../services/youtube.service';
import { contentService } from '../services/content.service';
import { StorageAdapter } from '../services/storage/storage.adapter';
import { GitHubStorageAdapter } from '../services/storage/github.adapter';
import { S3StorageAdapter } from '../services/storage/s3.adapter';
import { settingsService } from '../services/settings.service';
import { prisma } from '../lib/prisma';

export class YouTubeController {
  async processVideo(req: Request, res: Response) {
    try {
      const { youtubeLink, email } = req.body;

      if (!youtubeLink) {
        return res.status(400).json({ error: 'youtubeLink is required' });
      }

      // 1. Fetch user settings to get Storage config
      const userSettings = await settingsService.getSettings(email);
      if (!userSettings) {
        return res.status(400).json({ error: 'User settings not found.' });
      }

      // 2. Extract video ID for naming the file uniquely
      const videoId = YouTubeController.extractVideoId(youtubeLink);

      // 3. Extract transcript
      const transcriptText = await youtubeService.extractText(youtubeLink);
      if (!transcriptText || transcriptText.trim().length === 0) {
        return res.status(422).json({ error: 'Could not extract transcript. Please verify captions are enabled on the video.' });
      }

      // 4. Process transcript into structured notes & flashcards via LLM
      const { title, content: structuredNotes } = await contentService.processContent(transcriptText);

      // We still include the videoId to ensure uniqueness, but we use the extracted title as well
      const filename = `${title}-${videoId}.md`;

      // 5. Push the notes to the user's selected storage provider
      let storageAdapter: StorageAdapter;
      let target: string;

      if (userSettings.settings?.storageProvider === 'S3') {
        if (!userSettings.s3Integration?.bucket || !userSettings.s3Integration?.region || !userSettings.s3Integration?.accessKeyId || !userSettings.s3Integration?.secretAccessKey) {
          return res.status(400).json({
            error: 'S3 storage is not fully configured in settings.'
          });
        }
        storageAdapter = new S3StorageAdapter(
          userSettings.s3Integration.region,
          userSettings.s3Integration.accessKeyId,
          userSettings.s3Integration.secretAccessKey
        );
        target = userSettings.s3Integration.bucket;
      } else {
        if (!userSettings.githubIntegration?.repoName || !userSettings.githubIntegration?.encryptedToken) {
          return res.status(400).json({
            error: 'Obsidian GitHub repository or GitHub Token is not configured in settings.'
          });
        }
        storageAdapter = new GitHubStorageAdapter(userSettings.githubIntegration.encryptedToken);
        target = userSettings.githubIntegration.repoName;
      }

      await storageAdapter.pushToRepository(
        target,
        filename,
        structuredNotes
      );

      await prisma.file.create({
        data: {
          userId: userSettings.id,
          title: title,
          storageType: userSettings.settings?.storageProvider === 'S3' ? 'S3' : 'GITHUB',
          filename: filename
        }
      });

      return res.json({
        success: true,
        message: `Successfully processed and saved to ${target}/${filename}`,
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
