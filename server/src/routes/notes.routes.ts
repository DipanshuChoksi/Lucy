import { Router } from 'express';
import { notesController } from '../controllers/notes.controller';
import { doubleCsrfProtection } from '../middlewares/csrf.middleware';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// Endpoint to list notes. Using a GET request.
router.get('/notes', authenticateToken, doubleCsrfProtection, notesController.getNotesList);

// Endpoint to fetch specific note content. Using a GET request.
router.get('/notes/content/:id', authenticateToken, doubleCsrfProtection, notesController.getNoteContent);

// Endpoint to delete a specific note. Using a DELETE request.
router.delete('/notes/:id', authenticateToken, doubleCsrfProtection, notesController.deleteNote);

export default router;
