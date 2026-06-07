import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { StorageAdapter } from './storage.adapter';

export class S3StorageAdapter implements StorageAdapter {
  private s3Client: S3Client;

  constructor(region: string, accessKeyId: string, secretAccessKey: string) {
    this.s3Client = new S3Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  public async pushToRepository(
    bucket: string,
    filename: string,
    content: string
  ): Promise<void> {
    try {
      const command = new PutObjectCommand({
        Bucket: bucket,
        Key: filename,
        Body: content,
        ContentType: 'text/markdown',
      });

      await this.s3Client.send(command);
    } catch (error) {
      console.error('S3 Upload Error:', error);
      throw new Error(`Failed to upload to S3: ${(error as Error).message}`);
    }
  }
}
