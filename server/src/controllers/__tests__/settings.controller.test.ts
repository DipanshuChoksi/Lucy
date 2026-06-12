import { Request, Response } from 'express';
import { settingsController } from '../settings.controller';
import { settingsService } from '../../services/settings.service';

jest.mock('../../services/settings.service', () => ({
  settingsService: {
    getSettings: jest.fn(),
    updateSettings: jest.fn(),
  },
}));

describe('Settings Controller', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    mockReq = {
      query: {},
      body: {},
    };
    mockRes = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  describe('getSettings', () => {
    it('should return 400 if email is missing', async () => {
      await settingsController.getSettings(mockReq as Request, mockRes as Response);
      expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    it('should return 404 if user not found', async () => {
      mockReq.query = { email: 'test@test.com' };
      (settingsService.getSettings as jest.Mock).mockResolvedValue(null);
      await settingsController.getSettings(mockReq as Request, mockRes as Response);
      expect(mockRes.status).toHaveBeenCalledWith(404);
    });

    it('should return settings and mask secrets', async () => {
      mockReq.query = { email: 'test@test.com' };
      (settingsService.getSettings as jest.Mock).mockResolvedValue({
        id: 1,
        email: 'test@test.com',
        githubIntegration: { encryptedToken: 'token', repoName: 'repo' },
        s3Integration: { accessKeyId: 'key', secretAccessKey: 'secret', bucket: 'b', region: 'r' },
        settings: { techStack: 'stack', storageProvider: 'S3' }
      });
      await settingsController.getSettings(mockReq as Request, mockRes as Response);
      expect(mockRes.json).toHaveBeenCalledWith({
        id: 1, email: 'test@test.com', githubToken: '***', obsidianRepo: 'repo',
        techStack: 'stack', storageProvider: 'S3', s3Bucket: 'b', s3Region: 'r',
        s3AccessKeyId: '***', s3SecretAccessKey: '***'
      });
    });
  });

  describe('updateSettings', () => {
    it('should return 400 if email is missing', async () => {
      await settingsController.updateSettings(mockReq as Request, mockRes as Response);
      expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    it('should update settings and return them', async () => {
      mockReq.body = { email: 'test@test.com', githubToken: 'new_token' };
      (settingsService.updateSettings as jest.Mock).mockResolvedValue({
        id: 1,
        email: 'test@test.com',
        githubIntegration: { encryptedToken: 'new_token', repoName: 'repo' }
      });
      await settingsController.updateSettings(mockReq as Request, mockRes as Response);
      expect(settingsService.updateSettings).toHaveBeenCalledWith('test@test.com', {
        githubToken: 'new_token', obsidianRepo: undefined, storageProvider: undefined,
        s3Bucket: undefined, s3Region: undefined, s3AccessKeyId: undefined, s3SecretAccessKey: undefined
      });
      expect(mockRes.json).toHaveBeenCalled();
    });
  });
});
