import type { Request, Response } from 'express';
import { seedUsersFromCsv, getUsersPaginated } from '../services/user.service';

export async function seedUsers(_req: Request, res: Response) {
  const inserted = await seedUsersFromCsv();
  res.json({ inserted });
}

export async function getUsers(req: Request, res: Response) {
  const { cursor, limit, sortBy, order } = req.pagination;

  const { data, nextCursor } = await getUsersPaginated(cursor, limit, sortBy, order);
  res.json({ data, nextCursor });
}
