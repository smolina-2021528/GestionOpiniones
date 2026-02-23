import { asyncHandler } from '../../middlewares/server-genericError-handler.js';
import { findUserById } from '../../helpers/user-db.js';
import {
  getUserRoleNames,
  getUsersByRole as repoGetUsersByRole,
  setUserSingleRole,
} from '../../helpers/role-db.js';
import { ALLOWED_ROLES } from '../../helpers/role-constants.js';
import { buildUserResponse } from '../../utils/user-helpers.js';
import { sequelize } from '../../configs/db.js';

// PUT /gestoropinion/v1/users/:userId/role
export const updateUserRole = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { roleName } = req.body || {};

  const normalized = (roleName || '').trim().toUpperCase();
  if (!ALLOWED_ROLES.includes(normalized)) {
    return res.status(400).json({
      success: false,
      message: `Rol no permitido. Valores válidos: ${ALLOWED_ROLES.join(', ')}`,
    });
  }

  const user = await findUserById(userId);
  if (!user) {
    return res.status(404).json({ success: false, message: 'Usuario no encontrado.' });
  }

  const { updatedUser } = await setUserSingleRole(user, normalized, sequelize);

  return res.status(200).json({
    success: true,
    message: `Rol actualizado a ${normalized} exitosamente.`,
    data: buildUserResponse(updatedUser),
  });
});

// GET /gestoropinion/v1/users/:userId/roles
export const getUserRoles = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await findUserById(userId);
  if (!user) {
    return res.status(404).json({ success: false, message: 'Usuario no encontrado.' });
  }

  const roles = await getUserRoleNames(userId);
  return res.status(200).json({ success: true, data: roles });
});

// GET /gestoropinion/v1/users/by-role/:roleName
export const getUsersByRole = asyncHandler(async (req, res) => {
  const { roleName } = req.params;
  const normalized = (roleName || '').trim().toUpperCase();

  if (!ALLOWED_ROLES.includes(normalized)) {
    return res.status(400).json({
      success: false,
      message: `Rol no permitido. Valores válidos: ${ALLOWED_ROLES.join(', ')}`,
    });
  }

  const users = await repoGetUsersByRole(normalized);
  return res.status(200).json({
    success: true,
    data: users.map(buildUserResponse),
  });
});