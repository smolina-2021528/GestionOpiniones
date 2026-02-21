import { DataTypes } from 'sequelize';
import { sequelize } from '../../configs/db.js';
import { User } from '../users/user.model.js';
import { generateUserId } from '../../helpers/uuid-generator.js';

export const Publication = sequelize.define(
  'Publication',
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
      references: { model: User, key: 'id' },
    },
    Title: {
      type: DataTypes.STRING(150),
      allowNull: false,
      field: 'title',
      validate: {
        notEmpty: { msg: 'El título es obligatorio.' },
        len: { args: [1, 150], msg: 'El título no puede superar 150 caracteres.' },
      },
    },
    Category: {
      type: DataTypes.STRING(80),
      allowNull: false,
      field: 'category',
      validate: {
        notEmpty: { msg: 'La categoría es obligatoria.' },
      },
    },
    Content: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'content',
      validate: {
        notEmpty: { msg: 'El contenido es obligatorio.' },
      },
    },
    CreatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'created_at',
    },
    UpdatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'updated_at',
    },
  },
  {
    tableName: 'publications',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

// Relaciones
User.hasMany(Publication, { foreignKey: 'user_id', as: 'Publications' });
Publication.belongsTo(User, { foreignKey: 'user_id', as: 'Author' });