import { Router } from 'express';
import passport from 'passport';
import { authenticateToken, googleStrategy } from '../middlewares/auth.middleware';
import { getCsrfToken, googleCallback, login, logout, me, register } from '../controllers/auth.controller';

const router = Router();

// Configure Google Strategy
passport.use(googleStrategy);

router.get('/csrf-token', getCsrfToken);

router.post('/register', register);

router.post('/login', login);

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  googleCallback
);

router.post('/logout', logout);

router.get('/me', authenticateToken, me);

export default router;
