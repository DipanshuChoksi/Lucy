"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.settingsService = exports.SettingsService = void 0;
const prisma_1 = require("../lib/prisma");
class SettingsService {
    async getSettings(telegramId) {
        return prisma_1.prisma.user.findUnique({
            where: { telegramId },
        });
    }
    async updateSettings(telegramId, data) {
        return prisma_1.prisma.user.upsert({
            where: { telegramId },
            update: {
                githubToken: data.githubToken,
                obsidianRepo: data.obsidianRepo,
                techStack: data.techStack,
            },
            create: {
                telegramId,
                githubToken: data.githubToken,
                obsidianRepo: data.obsidianRepo,
                techStack: data.techStack,
            },
        });
    }
}
exports.SettingsService = SettingsService;
exports.settingsService = new SettingsService();
