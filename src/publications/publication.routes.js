import { Router } from 'express';
import {
  createPublication,
  getPublications,
  getPublicationById,
  updatePublication,
  deletePublication,
} from './publication.controller.js';
import { validateJWT } from '../../middlewares/validate-JWT.js';
import { validatePublicationCreate, validatePublicationUpdate } from '../../middlewares/validation.js';

const router = Router();

// POST   /gestoropinion/v1/publications
router.post('/', validateJWT, validatePublicationCreate, createPublication);

// GET    /gestoropinion/v1/publications
router.get('/', getPublications);

// GET    /gestoropinion/v1/publications/:id
router.get('/:id', getPublicationById);

// PUT    /gestoropinion/v1/publications/:id
router.put('/:id', validateJWT, validatePublicationUpdate, updatePublication);

// DELETE /gestoropinion/v1/publications/:id
router.delete('/:id', validateJWT, deletePublication);

export default router;