import { getUserRoleNames } from '../helpers/role-db.js';
import { ADMIN_ROLE } from '../helpers/role-constants.js';

// middleware que revisa si tengo el rol de admin antes de una acción
export const validateAdmin = async (req, res, next) => {
  try {
    const userId = req.userId;

    const roles =
      req.user?.UserRoles?.map((ur) => ur.Role?.Name).filter(Boolean) ??
      (await getUserRoleNames(userId));

    if (!roles.includes(ADMIN_ROLE)) {
      return res.status(403).json({
        success: false,
        message: 'Acceso denegado. Se requiere rol de administrador.',
      });
    }

    next();
  } catch (error) {
    console.error('Error en validateAdmin:', error);
    return res.status(500).json({ success: false, message: 'Error interno del servidor.' });
  }
};