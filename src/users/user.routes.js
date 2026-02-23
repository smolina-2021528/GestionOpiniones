import { Router } from 'express';
import { updateUserRole, getUserRoles, getUsersByRole } from './user.controller.js';
import { validateJWT } from '../../middlewares/validate-JWT.js';
import { validateAdmin } from '../../middlewares/validate-admin.js';

const router = Router();

// todas las rutas verificacn si el usuario actual tiene el rol de admin

// PUT /gestoropinion/v1/users/:userId/role  
router.put('/:userId/role', validateJWT, validateAdmin, updateUserRole);

// GET /gestoropinion/v1/users/:userId/roles 
router.get('/:userId/roles', validateJWT, getUserRoles);

// GET /gestoropinion/v1/users/by-role/:roleName 
router.get('/by-role/:roleName', validateJWT, validateAdmin, getUsersByRole);

export default router;