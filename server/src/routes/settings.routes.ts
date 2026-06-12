import { Router } from 'express';
import { settingsController } from '../controllers/settings.controller';
import { authenticateToken } from '../middlewares/auth.middleware';
import { doubleCsrfProtection } from '../middlewares/csrf.middleware';

const router = Router();

router.get('/settings', authenticateToken, settingsController.getSettings);
router.patch('/settings', authenticateToken, doubleCsrfProtection, settingsController.updateSettings);

export default router;
