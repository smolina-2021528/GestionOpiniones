import { DataTypes } from 'sequelize';
import { sequelize } from '../../configs/db.js';
import { User } from '../users/user.model.js';
import { Publication } from '../publications/publication.model.js';
import { generateUserId } from '../../helpers/uuid-generator.js';

export const Comment = sequelize.define(
  'Comment',
  {
    Id: {
      type: DataTypes.STRING(16),
      primaryKey: true,
      field: 'id',
      defaultValue: () => generateUserId(),
    },
    PublicationId: {
      type: DataTypes.STRING(16),
      allowNull: false,
      field: 'publication_id',
      references: { model: Publication, key: 'id' },
    },
    UserId: {
      type: DataTypes.STRING(16),
      allowNull: false,
      field: 'user_id',
      references: { model: User, key: 'id' },
    },
    Content: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'content',
      validate: {
        notEmpty: { msg: 'El contenido del comentario es obligatorio.' },
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
    tableName: 'comments',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

Publication.hasMany(Comment, { foreignKey: 'publication_id', as: 'Comments' });
Comment.belongsTo(Publication, { foreignKey: 'publication_id', as: 'Publication' });

User.hasMany(Comment, { foreignKey: 'user_id', as: 'Comments' });
Comment.belongsTo(User, { foreignKey: 'user_id', as: 'Author' });