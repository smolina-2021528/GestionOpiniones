import { Router } from 'express';
import {
  createPublication,
  getPublications,
  getPublicationById,
  updatePublication,
  deletePublication,
} from './publication.controller.js';
import { validateJWT } from '../../middlewares/validate-JWT.js';
import { validatePublication } from '../../middlewares/validation.js';

const router = Router();

// POST   /api/v1/publications 
router.post('/', validateJWT, validatePublication, createPublication);

// GET    /api/v1/publications  
router.get('/', getPublications);

// GET    /api/v1/publications/:id  
router.get('/:id', getPublicationById);

// PUT    /api/v1/publications/:id 
router.put('/:id', validateJWT, validatePublication, updatePublication);

// DELETE /api/v1/publications/:id
router.delete('/:id', validateJWT, deletePublication);

export default router;