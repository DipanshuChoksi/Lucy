import { Request, Response } from 'express';
import { settingsService } from '../services/settings.service';

export class SettingsController {
  async getSettings(req: Request, res: Response) {
    try {
      const email = (req as any).user?.email;
      if (!email) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const user = await settingsService.getSettings(email);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.json({
        id: user.id,
        email: user.email,
        githubToken: user.githubIntegration?.encryptedToken || null,
        obsidianRepo: user.githubIntegration?.repoName,
        techStack: user.settings?.techStack,
        storageProvider: user.settings?.storageProvider,
        s3Bucket: user.s3Integration?.bucket,
        s3Region: user.s3Integration?.region,
        s3AccessKeyId: user.s3Integration?.accessKeyId || null,
        s3SecretAccessKey: user.s3Integration?.secretAccessKey || null,
      });
    } catch (error) {
      console.error('Error fetching settings:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async updateSettings(req: Request, res: Response) {
    //TODO: Add validation when we have selected storage provider and that storage provider's information
    try {
      const email = (req as any).user?.email;
      if (!email) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      let { githubToken, obsidianRepo, storageProvider, s3Bucket, s3Region, s3AccessKeyId, s3SecretAccessKey } = req.body;

      const user = await settingsService.updateSettings(email, {
        githubToken,
        obsidianRepo,
        storageProvider,
        s3Bucket,
        s3Region,
        s3AccessKeyId,
        s3SecretAccessKey
      });

      return res.json({
        id: user.id,
        email: user.email,
        githubToken: githubToken || user.githubIntegration?.encryptedToken || null,
        obsidianRepo: user.githubIntegration?.repoName,
        techStack: user.settings?.techStack,
        storageProvider: user.settings?.storageProvider,
        s3Bucket: user.s3Integration?.bucket,
        s3Region: user.s3Integration?.region,
        s3AccessKeyId: s3AccessKeyId || user.s3Integration?.accessKeyId || null,
        s3SecretAccessKey: s3SecretAccessKey || user.s3Integration?.secretAccessKey || null,
      });
    } catch (error) {
      console.error('Error updating settings:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export const settingsController = new SettingsController();
