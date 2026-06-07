import { Request, Response } from 'express';
import { settingsService } from '../services/settings.service';
import { GitHubStorageAdapter } from '../services/storage/github.adapter';
import { S3StorageAdapter } from '../services/storage/s3.adapter';
import { NoteMetadata } from '../services/storage/storage.adapter';

export class NotesController {
  async getNotesList(req: Request, res: Response) {
    try {
      const email = req.query.email as string;
      if (!email) {
        return res.status(400).json({ error: 'email is required' });
      }

      const userSettings = await settingsService.getSettings(email);
      if (!userSettings) {
        return res.status(404).json({ error: 'User settings not found.' });
      }

      const allNotes: NoteMetadata[] = [];

      // Fetch from GitHub if configured
      if (userSettings.obsidianRepo && userSettings.githubToken) {
        const githubAdapter = new GitHubStorageAdapter(userSettings.githubToken);
        const githubNotes = await githubAdapter.listNotes(userSettings.obsidianRepo);
        allNotes.push(...githubNotes);
      }

      // Fetch from S3 if configured
      if (
        userSettings.s3Bucket &&
        userSettings.s3Region &&
        userSettings.s3AccessKeyId &&
        userSettings.s3SecretAccessKey
      ) {
        const s3Adapter = new S3StorageAdapter(
          userSettings.s3Region,
          userSettings.s3AccessKeyId,
          userSettings.s3SecretAccessKey
        );
        const s3Notes = await s3Adapter.listNotes(userSettings.s3Bucket);
        allNotes.push(...s3Notes);
      }

      // Sort notes by lastModified descending if available, else just return them
      allNotes.sort((a, b) => {
        const dateA = a.lastModified ? new Date(a.lastModified).getTime() : 0;
        const dateB = b.lastModified ? new Date(b.lastModified).getTime() : 0;
        return dateB - dateA;
      });

      return res.json({ notes: allNotes });
    } catch (error: any) {
      console.error('Error in NotesController.getNotesList:', error);
      return res.status(500).json({
        error: error.message || 'An error occurred while fetching notes.',
      });
    }
  }

  async getNoteContent(req: Request, res: Response) {
    try {
      const email = req.query.email as string;
      const filename = req.query.filename as string;
      const source = req.query.source as string;

      if (!email || !filename || !source) {
        return res.status(400).json({ error: 'email, filename, and source are required' });
      }

      const userSettings = await settingsService.getSettings(email);
      if (!userSettings) {
        return res.status(404).json({ error: 'User settings not found.' });
      }

      let content = '';

      if (source === 'GITHUB') {
        if (!userSettings.obsidianRepo || !userSettings.githubToken) {
          return res.status(400).json({ error: 'GitHub is not fully configured.' });
        }
        const githubAdapter = new GitHubStorageAdapter(userSettings.githubToken);
        content = await githubAdapter.getNoteContent(userSettings.obsidianRepo, filename);
      } else if (source === 'S3') {
        if (!userSettings.s3Bucket || !userSettings.s3Region || !userSettings.s3AccessKeyId || !userSettings.s3SecretAccessKey) {
          return res.status(400).json({ error: 'S3 is not fully configured.' });
        }
        const s3Adapter = new S3StorageAdapter(
          userSettings.s3Region,
          userSettings.s3AccessKeyId,
          userSettings.s3SecretAccessKey
        );
        content = await s3Adapter.getNoteContent(userSettings.s3Bucket, filename);
      } else {
        return res.status(400).json({ error: 'Invalid source. Must be GITHUB or S3.' });
      }

      return res.json({ content });
    } catch (error: any) {
      console.error('Error in NotesController.getNoteContent:', error);
      return res.status(500).json({
        error: error.message || 'An error occurred while fetching note content.',
      });
    }
  }
}

export const notesController = new NotesController();
