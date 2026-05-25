"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.settingsController = exports.SettingsController = void 0;
const settings_service_1 = require("../services/settings.service");
class SettingsController {
    async getSettings(req, res) {
        try {
            const telegramId = req.query.telegramId;
            if (!telegramId) {
                return res.status(400).json({ error: 'telegramId is required' });
            }
            const user = await settings_service_1.settingsService.getSettings(telegramId);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            return res.json(user);
        }
        catch (error) {
            console.error('Error fetching settings:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
    async updateSettings(req, res) {
        try {
            const { telegramId, githubToken, obsidianRepo, techStack } = req.body;
            if (!telegramId) {
                return res.status(400).json({ error: 'telegramId is required' });
            }
            const user = await settings_service_1.settingsService.updateSettings(telegramId, {
                githubToken,
                obsidianRepo,
                techStack,
            });
            return res.json(user);
        }
        catch (error) {
            console.error('Error updating settings:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}
exports.SettingsController = SettingsController;
exports.settingsController = new SettingsController();
