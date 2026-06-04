import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';


export function getJwtSecret(): string {
  if (process.env.JWT_SECRET_KEY) return process.env.JWT_SECRET_KEY;

  return "This-is-top-secret";
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies['__Secure-token'];
  if (!token) return res.status(401).json({ error: 'Authentication required' });

  try {
    const payload = jwt.verify(token, getJwtSecret(), { algorithms: ['HS256'] }) as { userId: number };
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Attach user to request
    (req as any).user = user;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};


export const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID || 'mock-client-id',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'mock-client-secret',
    callbackURL: '/api/auth/google/callback',
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails?.[0].value;
      if (!email) {
        return done(new Error('No email found from Google profile'), undefined);
      }

      let user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        user = await prisma.user.create({
          data: {
            email,
            googleId: profile.id,
          },
        });
      } else if (!user.googleId) {
        // Link Google account
        user = await prisma.user.update({
          where: { email },
          data: { googleId: profile.id },
        });
      }

      done(null, user);
    } catch (err) {
      done(err, undefined);
    }
  }
)