import { Router } from 'express';
import { updateProfile, changePassword } from './profile.controller.js';
import { validateJWT } from '../../middlewares/validate-JWT.js';
import { upload, handleUploadError } from '../../helpers/file-upload.js';
import { validateUpdateProfile, validateChangePassword } from '../../middlewares/validation.js';

const router = Router();

// PUT /api/v1/profile  → editar perfil
router.put(
  '/',
  validateJWT,
  upload.single('profilePicture'),
  handleUploadError,
  validateUpdateProfile,
  updateProfile
);

// PUT /api/v1/profile/change-password  → cambiar contraseña
router.put('/change-password', validateJWT, validateChangePassword, changePassword);

export default router;