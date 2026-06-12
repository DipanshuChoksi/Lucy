import { Request, Response } from 'express';
import { getCsrfToken, register, login, googleCallback, logout, me } from '../auth.controller';
import { prisma } from '../../lib/prisma';
import argon2 from 'argon2';
import * as csrfMiddleware from '../../middlewares/csrf.middleware';
import * as authUtil from '../../utils/auth.util';

jest.mock('../../lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

jest.mock('argon2', () => ({
  hash: jest.fn(),
  verify: jest.fn(),
}));

jest.mock('../../middlewares/csrf.middleware', () => ({
  generateToken: jest.fn(),
}));

jest.mock('../../utils/auth.util', () => ({
  setTokenCookie: jest.fn(),
}));

describe('Auth Controller', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    mockReq = {
      body: {},
    };
    mockRes = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      clearCookie: jest.fn(),
      redirect: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe('getCsrfToken', () => {
    it('should generate and return csrf token', () => {
      (csrfMiddleware.generateToken as jest.Mock).mockReturnValue('test-token');
      getCsrfToken(mockReq as Request, mockRes as Response);
      expect(mockRes.json).toHaveBeenCalledWith({ csrfToken: 'test-token' });
    });
  });

  describe('register', () => {
    it('should return 400 if email or password missing', async () => {
      await register(mockReq as Request, mockRes as Response);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Email and password are required' });
    });

    it('should return 400 if password is too short', async () => {
      mockReq.body = { email: 'test@test.com', password: 'short' };
      await register(mockReq as Request, mockRes as Response);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Password must be at least 8 characters long' });
    });

    it('should return 409 if user already exists', async () => {
      mockReq.body = { email: 'test@test.com', password: 'password123' };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 1 });
      await register(mockReq as Request, mockRes as Response);
      expect(mockRes.status).toHaveBeenCalledWith(409);
    });

    it('should register user and set cookie', async () => {
      mockReq.body = { email: 'test@test.com', password: 'password123' };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (argon2.hash as jest.Mock).mockResolvedValue('hashed');
      (prisma.user.create as jest.Mock).mockResolvedValue({ id: 1, email: 'test@test.com' });

      await register(mockReq as Request, mockRes as Response);

      expect(authUtil.setTokenCookie).toHaveBeenCalledWith(mockRes, 1);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({ id: 1, email: 'test@test.com' });
    });
  });

  describe('login', () => {
    it('should return 400 if email or password missing', async () => {
      await login(mockReq as Request, mockRes as Response);
      expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    it('should return 401 on invalid credentials (user not found)', async () => {
      mockReq.body = { email: 'test@test.com', password: 'password123' };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      await login(mockReq as Request, mockRes as Response);
      expect(mockRes.status).toHaveBeenCalledWith(401);
    });

    it('should return 401 on invalid password', async () => {
      mockReq.body = { email: 'test@test.com', password: 'password123' };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({ passwordHash: 'hash' });
      (argon2.verify as jest.Mock).mockResolvedValue(false);
      await login(mockReq as Request, mockRes as Response);
      expect(mockRes.status).toHaveBeenCalledWith(401);
    });

    it('should login user and set cookie', async () => {
      mockReq.body = { email: 'test@test.com', password: 'password123' };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 1, email: 'test@test.com', passwordHash: 'hash' });
      (argon2.verify as jest.Mock).mockResolvedValue(true);
      await login(mockReq as Request, mockRes as Response);
      expect(authUtil.setTokenCookie).toHaveBeenCalledWith(mockRes, 1);
      expect(mockRes.json).toHaveBeenCalledWith({ id: 1, email: 'test@test.com' });
    });
  });

  describe('googleCallback', () => {
    it('should redirect to frontend dashboard on success', () => {
      mockReq.user = { id: 1 };
      googleCallback(mockReq as Request, mockRes as Response);
      expect(authUtil.setTokenCookie).toHaveBeenCalledWith(mockRes, 1);
      expect(mockRes.redirect).toHaveBeenCalled();
    });

    it('should redirect to login on failure', () => {
      googleCallback(mockReq as Request, mockRes as Response);
      expect(mockRes.redirect).toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('should clear cookie', () => {
      logout(mockReq as Request, mockRes as Response);
      expect(mockRes.clearCookie).toHaveBeenCalledWith('auth_token');
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Logged out' });
    });
  });

  describe('me', () => {
    it('should return user info', () => {
      (mockReq as any).user = { id: 1, email: 'test@test.com' };
      me(mockReq as Request, mockRes as Response);
      expect(mockRes.json).toHaveBeenCalledWith({ id: 1, email: 'test@test.com' });
    });
  });
});
