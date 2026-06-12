import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

jest.mock('pg', () => ({
  Pool: jest.fn(),
}));

jest.mock('@prisma/adapter-pg', () => ({
  PrismaPg: jest.fn(),
}));

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(),
}));

describe('Prisma setup', () => {
  let originalEnv: string | undefined;

  beforeEach(() => {
    jest.clearAllMocks();
    delete global.prisma;
    jest.resetModules();
    originalEnv = process.env.NODE_ENV;
  });

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
  });

  it('should initialize PrismaClient with PrismaPg adapter and Pool', () => {
    const { prisma } = require('../prisma');

    expect(Pool).toHaveBeenCalledTimes(1);
    expect(PrismaPg).toHaveBeenCalledTimes(1);
    expect(PrismaClient).toHaveBeenCalledTimes(1);
    
    // In test environment (which is not 'production'), it sets global.prisma
    expect(global.prisma).toBe(prisma);
  });

  it('should reuse global.prisma instance if it exists', () => {
    const mockPrismaInstance = { mock: true };
    global.prisma = mockPrismaInstance as any;

    const { prisma } = require('../prisma');

    expect(prisma).toBe(mockPrismaInstance);
    // Note: Pool and PrismaPg are still initialized due to being top-level in the module,
    // but PrismaClient constructor is skipped because of `global.prisma || new PrismaClient`
    expect(PrismaClient).not.toHaveBeenCalled();
  });
});
