import { Router } from 'express';
import {
  createComment,
  getCommentsByPublication,
  updateComment,
  deleteComment,
} from './comment.controller.js';
import { validateJWT } from '../../middlewares/validate-JWT.js';
import { validateComment } from '../../middlewares/validation.js';

// el mergeParams me sirve para poder acceder a parametros de otras entidades
const router = Router({ mergeParams: true });

// POST   /api/v1/publications/:publicationId/comments
router.post('/', validateJWT, validateComment, createComment);

// GET    /api/v1/publications/:publicationId/comments
router.get('/', getCommentsByPublication);

// PUT    /api/v1/publications/:publicationId/comments/:commentId
router.put('/:commentId', validateJWT, validateComment, updateComment);

// DELETE /api/v1/publications/:publicationId/comments/:commentId
router.delete('/:commentId', validateJWT, deleteComment);

export default router;