import { Router } from 'express';
import {
  register,
  login,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
  getProfile,
  getProfileById,
} from './auth.controller.js';
import { validateJWT } from '../../middlewares/validate-JWT.js';
import {
  authRateLimit,
  requestLimit,
  emailRateLimit,
} from '../../middlewares/request-limit.js';
import { upload, handleUploadError } from '../../helpers/file-upload.js';
import {
  validateRegister,
  validateLogin,
  validateVerifyEmail,
  validateResendVerification,
  validateForgotPassword,
  validateResetPassword,
} from '../../middlewares/validation.js';

const router = Router();

/* ============================================================
   RUTAS PÚBLICAS
   ============================================================ */

// Registro de usuario (con imagen de perfil opcional)
router.post(
  '/register',
  authRateLimit,
  upload.single('profilePicture'),
  handleUploadError,
  validateRegister,
  register
);

// Login
router.post('/login', authRateLimit, validateLogin, login);

// Verificar email con token
router.post('/verify-email', requestLimit, validateVerifyEmail, verifyEmail);

// Reenviar email de verificación
router.post(
  '/resend-verification',
  emailRateLimit,
  validateResendVerification,
  resendVerification
);

// Recuperar contraseña (envía email con token)
router.post(
  '/forgot-password',
  emailRateLimit,
  validateForgotPassword,
  forgotPassword
);

// Resetear contraseña con token
router.post(
  '/reset-password',
  authRateLimit,
  validateResetPassword,
  resetPassword
);

/* ============================================================
   RUTAS PROTEGIDAS (REQUIEREN JWT)
   ============================================================ */

// Obtener perfil del usuario autenticado
router.get('/profile', validateJWT, getProfile);

// Obtener perfil por ID (semi-público, con rate limit)
router.post('/profile/by-id', requestLimit, getProfileById);

export default router;
