import { prisma } from '../lib/prisma';

export interface UpdateSettingsDto {
  githubToken?: string;
  obsidianRepo?: string;
  techStack?: string;
}

export class SettingsService {
  async getSettings(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async updateSettings(email: string, data: UpdateSettingsDto) {
    return prisma.user.upsert({
      where: { email },
      update: {
        githubToken: data.githubToken,
        obsidianRepo: data.obsidianRepo,
        techStack: data.techStack,
      },
      create: {
        email,
        githubToken: data.githubToken,
        obsidianRepo: data.obsidianRepo,
        techStack: data.techStack,
      },
    });
  }
}

export const settingsService = new SettingsService();
