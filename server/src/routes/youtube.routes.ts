import { Router } from 'express';
import { youtubeController } from '../controllers/youtube.controller';

const router = Router();

router.post('/youtube/process', youtubeController.processVideo);

export default router;
