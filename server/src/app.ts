import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import settingsRoutes from './routes/settings.routes';
import youtubeRoutes from './routes/youtube.routes';
import authRoutes from './routes/auth.routes';
import notesRoutes from './routes/notes.routes';
import { doubleCsrfProtection } from './middlewares/csrf.middleware';
import dotenv from "dotenv"

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// CSRF Protection for state-changing routes
// Mount this before routes that need protection
app.use(doubleCsrfProtection);

// Register API routes
app.use('/api/auth', authRoutes);
app.use('/api', settingsRoutes);
app.use('/api', youtubeRoutes);
app.use('/api', notesRoutes);

export default app;
