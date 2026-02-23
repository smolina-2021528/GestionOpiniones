'use strict';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { dbConnection } from './db.js';

import '../src/users/user.model.js';
import '../src/auth/role.model.js';
import '../src/auth/RoleUpgradeRequest.js';
import '../src/publications/publication.model.js';
import '../src/comments/comment.model.js';

import { requestLimit } from '../middlewares/request-limit.js';
import { corsOptions } from './cors-configuration.js';
import { helmetConfiguration } from './helmet-configuration.js';
import {
  errorHandler,
  notFound,
} from '../middlewares/server-genericError-handler.js';

import authRoutes from '../src/auth/auth.routes.js';
import userRoutes from '../src/users/user.routes.js';
import profileRoutes from '../src/profiles/profile.routes.js';
import publicationRoutes from '../src/publications/publication.routes.js';
import commentRoutes from '../src/comments/comment.routes.js';

const BASE_PATH = '/gestoropinion/v1';

const middlewares = (app) => {
  app.use(express.urlencoded({ extended: false, limit: '10mb' }));
  app.use(express.json({ limit: '10mb' }));
  app.use(cors(corsOptions));
  app.use(helmet(helmetConfiguration));
  app.use(requestLimit);
  app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));
};

const routes = (app) => {
  app.use(`${BASE_PATH}/auth`, authRoutes);
  app.use(`${BASE_PATH}/users`, userRoutes);
  app.use(`${BASE_PATH}/profile`, profileRoutes);
  app.use(`${BASE_PATH}/publications`, publicationRoutes);
  app.use(`${BASE_PATH}/publications/:publicationId/comments`, commentRoutes);

  app.get(`${BASE_PATH}/health`, (_req, res) => {
    res.status(200).json({
      status: 'Healthy',
      timestamp: new Date().toISOString(),
      service: 'Gestor de Opiniones API',
    });
  });

  app.use(notFound);
};

export const initServer = async () => {
  const app = express();
  const PORT = process.env.PORT;
  app.set('trust proxy', 1);

  try {
    await dbConnection();

    const { seedRoles } = await import('../helpers/role-seed.js');
    await seedRoles();

    middlewares(app);
    routes(app);
    app.use(errorHandler);

    app.listen(PORT, () => {
      console.log(`\nGestor de Opiniones API corriendo en puerto ${PORT}`);
      console.log(`Health: http://localhost:${PORT}${BASE_PATH}/health\n`);
    });
  } catch (err) {
    console.error(`Error iniciando servidor: ${err.message}`);
    process.exit(1);
  }
};