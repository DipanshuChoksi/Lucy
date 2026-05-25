import { Request, Response } from 'express';
import { settingsService } from '../services/settings.service';

export class SettingsController {
  async getSettings(req: Request, res: Response) {
    try {
      const telegramId = req.query.telegramId as string;
      if (!telegramId) {
        return res.status(400).json({ error: 'telegramId is required' });
      }

      const user = await settingsService.getSettings(telegramId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.json(user);
    } catch (error) {
      console.error('Error fetching settings:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async updateSettings(req: Request, res: Response) {
    try {
      let { telegramId, githubToken, obsidianRepo, techStack } = req.body;
      if (!telegramId) {
        return res.status(400).json({ error: 'telegramId is required' });
      }
      telegramId = String(telegramId);

      const user = await settingsService.updateSettings(telegramId, {
        githubToken,
        obsidianRepo,
        techStack,
      });

      return res.json(user);
    } catch (error) {
      console.error('Error updating settings:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export const settingsController = new SettingsController();
