import { Router } from 'express';
import { llmController } from '../controllers/llm.controller';

const router = Router();

router.post('/llm/generate', llmController.generateContent);

export default router;
