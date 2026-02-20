'use strict';

import { DataTypes } from 'sequelize';
import { sequelize } from '../../configs/db.js';
import { generateUserId } from '../../helpers/uuid-generator.js';
import { User } from '../users/user.model.js';
import { ALLOWED_ROLES } from '../../helpers/role-constants.js';

export const RoleUpgradeRequest = sequelize.define(
  'RoleUpgradeRequest',
  {
    Id: {
      type: DataTypes.STRING(16),
      primaryKey: true,
      field: 'id',
      defaultValue: () => generateUserId(),
    },
    UserId: {
      type: DataTypes.STRING(16),
      allowNull: false,
      field: 'user_id',
    },
    RequestedRole: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'requested_role',
      validate: {
        isIn: {
          args: [ALLOWED_ROLES],
          msg: 'Rol solicitado no permitido.',
        },
      },
    },
    Status: {
      type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED'),
      defaultValue: 'PENDING',
      field: 'status',
    },
    ReviewedBy: {
      type: DataTypes.STRING(16),
      allowNull: true,
      field: 'reviewed_by',
    },
  },
  {
    tableName: 'role_upgrade_requests',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

// Relaciones
RoleUpgradeRequest.belongsTo(User, { foreignKey: 'user_id', as: 'User' });
User.hasMany(RoleUpgradeRequest, { foreignKey: 'user_id', as: 'RoleUpgradeRequests' });
