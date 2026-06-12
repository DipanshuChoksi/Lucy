import { Request, Response } from 'express';
import { youtubeController } from '../youtube.controller';
import { youtubeService } from '../../services/youtube.service';
import { contentService } from '../../services/content.service';
import { settingsService } from '../../services/settings.service';
import { prisma } from '../../lib/prisma';
import { GitHubStorageAdapter } from '../../services/storage/github.adapter';
import { S3StorageAdapter } from '../../services/storage/s3.adapter';

jest.mock('../../services/youtube.service', () => ({
  youtubeService: {
    extractText: jest.fn(),
    getVideoMetadata: jest.fn(),
  },
}));

jest.mock('../../services/content.service', () => ({
  contentService: {
    processContent: jest.fn(),
  },
}));

jest.mock('../../services/settings.service', () => ({
  settingsService: {
    getSettings: jest.fn(),
  },
}));

jest.mock('../../lib/prisma', () => ({
  prisma: {
    file: {
      create: jest.fn(),
    },
  },
}));

jest.mock('../../services/storage/github.adapter');
jest.mock('../../services/storage/s3.adapter');

describe('YouTube Controller', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    mockReq = {
      body: {},
    };
    mockRes = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  describe('processVideo', () => {
    it('should return 400 if youtubeLink is missing', async () => {
      await youtubeController.processVideo(mockReq as Request, mockRes as Response);
      expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    it('should return 400 if user settings not found', async () => {
      mockReq.body = { youtubeLink: 'link', email: 'test@test.com' };
      (settingsService.getSettings as jest.Mock).mockResolvedValue(null);
      await youtubeController.processVideo(mockReq as Request, mockRes as Response);
      expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    it('should return 422 if transcript extraction fails', async () => {
      mockReq.body = { youtubeLink: 'link', email: 'test@test.com' };
      (settingsService.getSettings as jest.Mock).mockResolvedValue({ id: 1 });
      (youtubeService.extractText as jest.Mock).mockResolvedValue('');
      await youtubeController.processVideo(mockReq as Request, mockRes as Response);
      expect(mockRes.status).toHaveBeenCalledWith(422);
    });

    it('should process video and push to GITHUB', async () => {
      mockReq.body = { youtubeLink: 'http://youtube.com/watch?v=12345678901', email: 'test@test.com' };
      (settingsService.getSettings as jest.Mock).mockResolvedValue({
        id: 1,
        githubIntegration: { repoName: 'repo', encryptedToken: 'token' },
        settings: { storageProvider: 'GITHUB' }
      });
      (youtubeService.extractText as jest.Mock).mockResolvedValue('transcript');
      (contentService.processContent as jest.Mock).mockResolvedValue('notes');
      (youtubeService.getVideoMetadata as jest.Mock).mockResolvedValue({
        title: 'Video Title', channelName: 'Channel', channelUrl: 'url', thumbnail: 'thumb'
      });

      const mockPush = jest.fn().mockResolvedValue(true);
      (GitHubStorageAdapter as jest.Mock).mockImplementation(() => ({
        pushToRepository: mockPush
      }));

      await youtubeController.processVideo(mockReq as Request, mockRes as Response);

      expect(mockPush).toHaveBeenCalledWith('repo', 'Video Title.json', 'notes');
      expect(prisma.file.create).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    });

    it('should process video and push to S3', async () => {
      mockReq.body = { youtubeLink: 'http://youtube.com/watch?v=12345678901', email: 'test@test.com' };
      (settingsService.getSettings as jest.Mock).mockResolvedValue({
        id: 1,
        s3Integration: { bucket: 'b', region: 'r', accessKeyId: 'a', secretAccessKey: 's' },
        settings: { storageProvider: 'S3' }
      });
      (youtubeService.extractText as jest.Mock).mockResolvedValue('transcript');
      (contentService.processContent as jest.Mock).mockResolvedValue('notes');
      (youtubeService.getVideoMetadata as jest.Mock).mockResolvedValue({
        title: 'Video Title'
      });

      const mockPush = jest.fn().mockResolvedValue(true);
      (S3StorageAdapter as jest.Mock).mockImplementation(() => ({
        pushToRepository: mockPush
      }));

      await youtubeController.processVideo(mockReq as Request, mockRes as Response);

      expect(mockPush).toHaveBeenCalledWith('b', 'Video Title.json', 'notes');
      expect(prisma.file.create).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    });
  });
});
