import { Request, Response } from 'express';
import { settingsService } from '../services/settings.service';

export class SettingsController {
  async getSettings(req: Request, res: Response) {
    try {
      const email = req.query.email as string;
      if (!email) {
        return res.status(400).json({ error: 'email is required' });
      }

      const user = await settingsService.getSettings(email);
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
      let { email, githubToken, obsidianRepo } = req.body;
      if (!email) {
        return res.status(400).json({ error: 'email is required' });
      }
      email = String(email);

      const user = await settingsService.updateSettings(email, {
        githubToken,
        obsidianRepo,
      });

      return res.json(user);
    } catch (error) {
      console.error('Error updating settings:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export const settingsController = new SettingsController();
