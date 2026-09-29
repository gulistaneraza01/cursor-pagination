import { Router } from 'express';
import { seedUsers, getUsers } from '../controller/user.controller';
import { paginationMiddleware } from '../middleware/pagination.middleware';

export const userRoutes = Router();

userRoutes.get('/', paginationMiddleware(['id', 'name', 'email', 'create_at', 'modified_at']), getUsers);
userRoutes.post('/seed-users', seedUsers);
