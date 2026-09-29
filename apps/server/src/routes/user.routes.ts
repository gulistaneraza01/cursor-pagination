import { Router } from 'express';
import { seedUsers, getUsers } from '../controller/user.controller';
import { paginationMiddleware } from '../middleware/pagination.middleware';

export const userRoutes = Router();

userRoutes.get('/', paginationMiddleware, getUsers);
userRoutes.post('/seed-users', seedUsers);
