import { S3Client, PutObjectCommand, ListObjectsV2Command, GetObjectCommand, DeleteObjectCommand, CopyObjectCommand } from '@aws-sdk/client-s3';
import { StorageAdapter, NoteMetadata } from './storage.adapter';

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

  public async listNotes(bucket: string): Promise<NoteMetadata[]> {
    try {
      const command = new ListObjectsV2Command({
        Bucket: bucket,
      });

      const response = await this.s3Client.send(command);
      const items = response.Contents || [];

      return items
        .filter(item => item.Key && item.Key.endsWith('.md'))
        .map(item => ({
          filename: item.Key as string,
          source: 'S3',
          lastModified: item.LastModified,
        }));
    } catch (error) {
      console.error('S3 List Error:', error);
      return [];
    }
  }

  public async getNoteContent(bucket: string, filename: string): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: bucket,
        Key: filename,
      });

      const response = await this.s3Client.send(command);

      if (!response.Body) {
        throw new Error('S3 response body is empty');
      }

      // Convert stream to string
      const stream = response.Body as NodeJS.ReadableStream;
      return await new Promise<string>((resolve, reject) => {
        const chunks: any[] = [];
        stream.on('data', chunk => chunks.push(chunk));
        stream.on('error', reject);
        stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
      });
    } catch (error) {
      console.error('S3 Get Content Error:', error);
      throw new Error(`Failed to fetch note content from S3: ${(error as Error).message}`);
    }
  }

  public async deleteNote(bucket: string, filename: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: bucket,
        Key: filename,
      });

      await this.s3Client.send(command);
    } catch (error) {
      console.error('S3 Delete Error:', error);
      throw new Error(`Failed to delete note from S3: ${(error as Error).message}`);
    }
  }

  public async renameNote(bucket: string, oldFilename: string, newFilename: string): Promise<void> {
    try {
      const copyCommand = new CopyObjectCommand({
        Bucket: bucket,
        CopySource: `${bucket}/${encodeURIComponent(oldFilename)}`,
        Key: newFilename,
      });
      await this.s3Client.send(copyCommand);

      const deleteCommand = new DeleteObjectCommand({
        Bucket: bucket,
        Key: oldFilename,
      });
      await this.s3Client.send(deleteCommand);
    } catch (error) {
      console.error('S3 Rename Error:', error);
      throw new Error(`Failed to rename note in S3: ${(error as Error).message}`);
    }
  }
}
