import { Request, Response } from 'express';
import { notesController } from '../notes.controller';
import { prisma } from '../../lib/prisma';
import { settingsService } from '../../services/settings.service';
import { GitHubStorageAdapter } from '../../services/storage/github.adapter';
import { S3StorageAdapter } from '../../services/storage/s3.adapter';

jest.mock('../../lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
    file: {
      findUnique: jest.fn(),
    },
  },
}));

jest.mock('../../services/settings.service', () => ({
  settingsService: {
    getSettings: jest.fn(),
  },
}));

jest.mock('../../services/storage/github.adapter');
jest.mock('../../services/storage/s3.adapter');

describe('Notes Controller', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    mockReq = {
      query: {},
      params: {},
    };
    mockRes = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  describe('getNotesList', () => {
    it('should return 400 if email is missing', async () => {
      await notesController.getNotesList(mockReq as Request, mockRes as Response);
      expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    it('should return 404 if user not found', async () => {
      mockReq.query = { email: 'test@test.com' };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      await notesController.getNotesList(mockReq as Request, mockRes as Response);
      expect(mockRes.status).toHaveBeenCalledWith(404);
    });

    it('should return notes if user is found', async () => {
      mockReq.query = { email: 'test@test.com' };
      const user = { files: [{ id: 1, title: 'Note 1' }] };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);
      await notesController.getNotesList(mockReq as Request, mockRes as Response);
      expect(mockRes.json).toHaveBeenCalledWith({ notes: user.files });
    });
  });

  describe('getNoteContent', () => {
    it('should return 400 if email or id missing', async () => {
      await notesController.getNoteContent(mockReq as Request, mockRes as Response);
      expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    it('should return 404 if user settings not found', async () => {
      mockReq.query = { email: 'test@test.com' };
      mockReq.params = { id: '1' };
      (settingsService.getSettings as jest.Mock).mockResolvedValue(null);
      await notesController.getNoteContent(mockReq as Request, mockRes as Response);
      expect(mockRes.status).toHaveBeenCalledWith(404);
    });

    it('should return 404 if file not found or unauthorized', async () => {
      mockReq.query = { email: 'test@test.com' };
      mockReq.params = { id: '1' };
      (settingsService.getSettings as jest.Mock).mockResolvedValue({ id: 1 });
      (prisma.file.findUnique as jest.Mock).mockResolvedValue(null);
      await notesController.getNoteContent(mockReq as Request, mockRes as Response);
      expect(mockRes.status).toHaveBeenCalledWith(404);
    });

    it('should get note content from GITHUB', async () => {
      mockReq.query = { email: 'test@test.com' };
      mockReq.params = { id: '1' };
      (settingsService.getSettings as jest.Mock).mockResolvedValue({
        id: 1,
        githubIntegration: { repoName: 'repo', encryptedToken: 'token' }
      });
      (prisma.file.findUnique as jest.Mock).mockResolvedValue({
        userId: 1, storageType: 'GITHUB', filename: 'note.json'
      });
      const mockGetNoteContent = jest.fn().mockResolvedValue('github-content');
      (GitHubStorageAdapter as jest.Mock).mockImplementation(() => ({
        getNoteContent: mockGetNoteContent
      }));

      await notesController.getNoteContent(mockReq as Request, mockRes as Response);
      expect(mockRes.json).toHaveBeenCalledWith({ content: 'github-content' });
    });

    it('should get note content from S3', async () => {
      mockReq.query = { email: 'test@test.com' };
      mockReq.params = { id: '1' };
      (settingsService.getSettings as jest.Mock).mockResolvedValue({
        id: 1,
        s3Integration: { bucket: 'b', region: 'r', accessKeyId: 'a', secretAccessKey: 's' }
      });
      (prisma.file.findUnique as jest.Mock).mockResolvedValue({
        userId: 1, storageType: 'S3', filename: 'note.json'
      });
      const mockGetNoteContent = jest.fn().mockResolvedValue('s3-content');
      (S3StorageAdapter as jest.Mock).mockImplementation(() => ({
        getNoteContent: mockGetNoteContent
      }));

      await notesController.getNoteContent(mockReq as Request, mockRes as Response);
      expect(mockRes.json).toHaveBeenCalledWith({ content: 's3-content' });
    });
  });
});
