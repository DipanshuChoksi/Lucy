import { Router } from 'express';
import { youtubeController } from '../controllers/youtube.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

router.post('/youtube/process', authenticateToken, youtubeController.processVideo);

export default router;
