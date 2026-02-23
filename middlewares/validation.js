import { body, validationResult } from 'express-validator';

// middleware para manejar las respuestas en las validaciones
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Errores de validación',
      errors: errors.array().map((error) => ({
        field: error.path,
        message: error.msg,
        value: error.value,
      })),
    });
  }
  next();
};

// validaciones para registrar un usuario
export const validateRegister = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('El nombre es obligatorio')
    .isLength({ max: 25 })
    .withMessage('El nombre no puede tener más de 25 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage('El nombre solo puede contener letras y espacios'),

  body('surname')
    .trim()
    .notEmpty()
    .withMessage('El apellido es obligatorio')
    .isLength({ max: 25 })
    .withMessage('El apellido no puede tener más de 25 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage('El apellido solo puede contener letras y espacios'),

  body('username')
    .trim()
    .notEmpty()
    .withMessage('El nombre de usuario es obligatorio')
    .isLength({ max: 50 })
    .withMessage('El nombre de usuario no puede tener más de 50 caracteres'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('El correo electrónico es obligatorio')
    .isEmail()
    .withMessage('El correo electrónico no tiene un formato válido')
    .isLength({ max: 150 })
    .withMessage('El correo electrónico no puede tener más de 150 caracteres'),

  body('password')
    .notEmpty()
    .withMessage('La contraseña es obligatoria')
    .isLength({ min: 8, max: 255 })
    .withMessage('La contraseña debe tener entre 8 y 255 caracteres'),

  body('phone')
    .notEmpty()
    .withMessage('El número de teléfono es obligatorio')
    .matches(/^\d{8}$/)
    .withMessage('El número de teléfono debe tener exactamente 8 dígitos'),

  handleValidationErrors,
];

// validaciones para poder hacer login
export const validateLogin = [
  body('emailOrUsername')
    .trim()
    .notEmpty()
    .withMessage('Email o nombre de usuario es requerido'),

  body('password').notEmpty().withMessage('La contraseña es requerida'),

  handleValidationErrors,
];

//validaciones para verificar un correo
export const validateVerifyEmail = [
  body('token').notEmpty().withMessage('El token de verificación es requerido'),

  handleValidationErrors,
];

//validaciones para reenviar una verificacion
export const validateResendVerification = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('El email es obligatorio')
    .isEmail()
    .withMessage('Debe proporcionar un email válido'),

  handleValidationErrors,
];

// validaciones para una contraseña olvidada
export const validateForgotPassword = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('El email es obligatorio')
    .isEmail()
    .withMessage('Debe proporcionar un email válido'),

  handleValidationErrors,
];

//validaciones para resetear una contraseña
export const validateResetPassword = [
  body('token').notEmpty().withMessage('El token de recuperación es requerido'),

  body('newPassword')
    .notEmpty()
    .withMessage('La nueva contraseña es obligatoria')
    .isLength({ min: 8 })
    .withMessage('La nueva contraseña debe tener al menos 8 caracteres'),

  handleValidationErrors,
];

//validaciones para poder actualizar un pefril 
export const validateUpdateProfile = [
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('El nombre no puede estar vacío')
    .isLength({ max: 25 })
    .withMessage('El nombre no puede tener más de 25 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage('El nombre solo puede contener letras y espacios'),

  body('surname')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('El apellido no puede estar vacío')
    .isLength({ max: 25 })
    .withMessage('El apellido no puede tener más de 25 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage('El apellido solo puede contener letras y espacios'),

  body('username')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('El nombre de usuario no puede estar vacío')
    .isLength({ max: 50 })
    .withMessage('El nombre de usuario no puede tener más de 50 caracteres'),

  body('phone')
    .optional()
    .matches(/^\d{8}$/)
    .withMessage('El número de teléfono debe tener exactamente 8 dígitos'),

  handleValidationErrors,
];

// validaciones para cambiar una contraseña
export const validateChangePassword = [
  body('currentPassword')
    .notEmpty()
    .withMessage('La contraseña actual es obligatoria'),

  body('newPassword')
    .notEmpty()
    .withMessage('La nueva contraseña es obligatoria')
    .isLength({ min: 8 })
    .withMessage('La nueva contraseña debe tener al menos 8 caracteres'),

  handleValidationErrors,
];

// validaciones para publicaciones
export const validatePublication = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('El título no puede estar vacío')
    .isLength({ max: 150 })
    .withMessage('El título no puede superar 150 caracteres'),

  body('category')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('La categoría no puede estar vacía'),

  body('content')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('El contenido no puede estar vacío'),

  handleValidationErrors,
];  

// validaciones para comentarios
export const validateComment = [
  body('content')
    .trim()
    .notEmpty().withMessage('El contenido del comentario es obligatorio.')
    .isLength({ max: 1000 }).withMessage('El comentario no puede superar 1000 caracteres.'),

  handleValidationErrors,
];