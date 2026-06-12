import { Router } from 'express';
import { notesController } from '../controllers/notes.controller';
import { doubleCsrfProtection } from '../middlewares/csrf.middleware';

const router = Router();

// Endpoint to list notes. Using a GET request.
router.get('/notes', doubleCsrfProtection, notesController.getNotesList);

// Endpoint to fetch specific note content. Using a GET request.
router.get('/notes/content/:id', doubleCsrfProtection, notesController.getNoteContent);

// Endpoint to delete a specific note. Using a DELETE request.
router.delete('/notes/:id', doubleCsrfProtection, notesController.deleteNote);

export default router;
