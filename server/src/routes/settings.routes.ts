import { Router } from 'express';
import { settingsController } from '../controllers/settings.controller';

const router = Router();

router.get('/settings', settingsController.getSettings);
router.patch('/settings', settingsController.updateSettings);

export default router;
