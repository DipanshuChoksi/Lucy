import { Request, Response } from 'express';
import { settingsService } from '../services/settings.service';
import { GitHubStorageAdapter } from '../services/storage/github.adapter';
import { S3StorageAdapter } from '../services/storage/s3.adapter';
import { prisma } from '../lib/prisma';

export class NotesController {
  async getNotesList(req: Request, res: Response) {
    try {
      const email = req.query.email as string;
      if (!email) {
        return res.status(400).json({ error: 'email is required' });
      }
      const q = req.query.q as string;

      const user = await prisma.user.findUnique({
        where: { email },
        include: {
          files: {
            where: q ? { title: { contains: q, mode: 'insensitive' } } : undefined,
            orderBy: { createdAt: 'desc' },
            include: { metadata: true }
          }
        }
      });
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }

      return res.json({ notes: user.files });
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
      const id = parseInt(req.params.id as string, 10);

      if (!email || !id) {
        return res.status(400).json({ error: 'email and id are required' });
      }

      const user = await settingsService.getSettings(email);
      if (!user) {
        return res.status(404).json({ error: 'User settings not found.' });
      }

      const file = await prisma.file.findUnique({ where: { id } });
      if (!file || file.userId !== user.id) {
        return res.status(404).json({ error: 'File not found.' });
      }

      let content = '';
      const source = file.storageType;
      const filename = file.filename;

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
