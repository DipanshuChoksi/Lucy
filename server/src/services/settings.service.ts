import { prisma } from '../lib/prisma';
import { encrypt, decrypt } from '../utils/encryption.util';

export interface UpdateSettingsDto {
  githubToken?: string;
  obsidianRepo?: string;
  techStack?: string;
  storageProvider?: string;
  s3Bucket?: string;
  s3Region?: string;
  s3AccessKeyId?: string;
  s3SecretAccessKey?: string;
}

export class SettingsService {
  async getSettings(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (user) {
      if (user.githubToken) user.githubToken = decrypt(user.githubToken);
      if (user.s3AccessKeyId) user.s3AccessKeyId = decrypt(user.s3AccessKeyId);
      if (user.s3SecretAccessKey) user.s3SecretAccessKey = decrypt(user.s3SecretAccessKey);
    }
    return user;
  }

  async updateSettings(email: string, data: UpdateSettingsDto) {
    const githubToken = data.githubToken ? encrypt(data.githubToken) : undefined;
    const s3AccessKeyId = data.s3AccessKeyId ? encrypt(data.s3AccessKeyId) : undefined;
    const s3SecretAccessKey = data.s3SecretAccessKey ? encrypt(data.s3SecretAccessKey) : undefined;

    return prisma.user.upsert({
      where: { email },
      update: {
        githubToken: data.githubToken === '' ? null : githubToken,
        obsidianRepo: data.obsidianRepo === '' ? null : data.obsidianRepo,
        techStack: data.techStack === '' ? null : data.techStack,
        storageProvider: data.storageProvider === '' ? undefined : data.storageProvider,
        s3Bucket: data.s3Bucket === '' ? null : data.s3Bucket,
        s3Region: data.s3Region === '' ? null : data.s3Region,
        s3AccessKeyId: data.s3AccessKeyId === '' ? null : s3AccessKeyId,
        s3SecretAccessKey: data.s3SecretAccessKey === '' ? null : s3SecretAccessKey,
      },
      create: {
        email,
        githubToken,
        obsidianRepo: data.obsidianRepo || undefined,
        techStack: data.techStack || undefined,
        storageProvider: data.storageProvider || undefined,
        s3Bucket: data.s3Bucket || undefined,
        s3Region: data.s3Region || undefined,
        s3AccessKeyId,
        s3SecretAccessKey,
      },
    });
  }
}

export const settingsService = new SettingsService();
