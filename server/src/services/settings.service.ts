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
      include: {
        settings: true,
        githubIntegration: true,
        s3Integration: true,
      },
    });
    if (user) {
      if (user.githubIntegration?.encryptedToken) user.githubIntegration.encryptedToken = decrypt(user.githubIntegration.encryptedToken);
      if (user.s3Integration?.accessKeyId) user.s3Integration.accessKeyId = decrypt(user.s3Integration.accessKeyId);
      if (user.s3Integration?.secretAccessKey) user.s3Integration.secretAccessKey = decrypt(user.s3Integration.secretAccessKey);
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
        settings: {
          upsert: {
            create: {
              techStack: data.techStack || undefined,
              storageProvider: data.storageProvider || "GITHUB",
            },
            update: {
              techStack: data.techStack === '' ? null : data.techStack,
              storageProvider: data.storageProvider === '' ? undefined : data.storageProvider,
            }
          }
        },
        githubIntegration: {
          upsert: {
            create: {
              encryptedToken: githubToken,
              repoName: data.obsidianRepo || undefined,
            },
            update: {
              encryptedToken: data.githubToken === '' ? null : githubToken,
              repoName: data.obsidianRepo === '' ? null : data.obsidianRepo,
            }
          }
        },
        s3Integration: {
          upsert: {
            create: {
              bucket: data.s3Bucket || undefined,
              region: data.s3Region || undefined,
              accessKeyId: s3AccessKeyId,
              secretAccessKey: s3SecretAccessKey,
            },
            update: {
              bucket: data.s3Bucket === '' ? null : data.s3Bucket,
              region: data.s3Region === '' ? null : data.s3Region,
              accessKeyId: data.s3AccessKeyId === '' ? null : s3AccessKeyId,
              secretAccessKey: data.s3SecretAccessKey === '' ? null : s3SecretAccessKey,
            }
          }
        }
      },
      create: {
        email,
        settings: {
          create: {
            techStack: data.techStack || undefined,
            storageProvider: data.storageProvider || "GITHUB",
          }
        },
        githubIntegration: {
          create: {
            encryptedToken: githubToken,
            repoName: data.obsidianRepo || undefined,
          }
        },
        s3Integration: {
          create: {
            bucket: data.s3Bucket || undefined,
            region: data.s3Region || undefined,
            accessKeyId: s3AccessKeyId,
            secretAccessKey: s3SecretAccessKey,
          }
        }
      },
      include: {
        settings: true,
        githubIntegration: true,
        s3Integration: true,
      }
    });
  }
}

export const settingsService = new SettingsService();
