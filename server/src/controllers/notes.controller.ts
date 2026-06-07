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

      const user = await settingsService.getSettings(email);
      if (!user) {
        return res.status(404).json({ error: 'User settings not found.' });
      }

      const allNotes: NoteMetadata[] = [];

      // Fetch from GitHub if configured
      if (user.githubIntegration?.repoName && user.githubIntegration?.encryptedToken) {
        const githubAdapter = new GitHubStorageAdapter(user.githubIntegration.encryptedToken);
        const githubNotes = await githubAdapter.listNotes(user.githubIntegration.repoName);
        allNotes.push(...githubNotes);
      }

      // Fetch from S3 if configured
      if (
        user.s3Integration?.bucket &&
        user.s3Integration?.region &&
        user.s3Integration?.accessKeyId &&
        user.s3Integration?.secretAccessKey
      ) {
        const s3Adapter = new S3StorageAdapter(
          user.s3Integration.region,
          user.s3Integration.accessKeyId,
          user.s3Integration.secretAccessKey
        );
        const s3Notes = await s3Adapter.listNotes(user.s3Integration.bucket);
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

      const user = await settingsService.getSettings(email);
      if (!user) {
        return res.status(404).json({ error: 'User settings not found.' });
      }

      let content = '';

      if (source === 'GITHUB') {
        if (!user.githubIntegration?.repoName || !user.githubIntegration?.encryptedToken) {
          return res.status(400).json({ error: 'GitHub is not fully configured.' });
        }
        const githubAdapter = new GitHubStorageAdapter(user.githubIntegration.encryptedToken);
        content = await githubAdapter.getNoteContent(user.githubIntegration.repoName, filename);
      } else if (source === 'S3') {
        if (!user.s3Integration?.bucket || !user.s3Integration?.region || !user.s3Integration?.accessKeyId || !user.s3Integration?.secretAccessKey) {
          return res.status(400).json({ error: 'S3 is not fully configured.' });
        }
        const s3Adapter = new S3StorageAdapter(
          user.s3Integration.region,
          user.s3Integration.accessKeyId,
          user.s3Integration.secretAccessKey
        );
        content = await s3Adapter.getNoteContent(user.s3Integration.bucket, filename);
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
