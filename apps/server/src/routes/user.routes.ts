import { Router } from 'express';
import { seedUsers, getUsers } from '../controller/user.controller';

export const userRoutes = Router();

userRoutes.get('/users', getUsers);
userRoutes.post('/seed-users', seedUsers);
