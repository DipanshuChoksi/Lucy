import { prisma } from '../lib/prisma';

export interface UpdateSettingsDto {
  githubToken?: string;
  obsidianRepo?: string;
  techStack?: string;
}

export class SettingsService {
  async getSettings(telegramId: string) {
    return prisma.user.findUnique({
      where: { telegramId },
    });
  }

  async updateSettings(telegramId: string, data: UpdateSettingsDto) {
    return prisma.user.upsert({
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

export const settingsService = new SettingsService();
