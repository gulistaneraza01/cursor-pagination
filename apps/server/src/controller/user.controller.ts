import type { Request, Response } from 'express';
import { seedUsersFromCsv } from '../services/user.service';

export async function seedUsers(_req: Request, res: Response) {
  const inserted = await seedUsersFromCsv();
  res.json({ inserted });
}

export async function getUsers(req: Request, res: Response) {}
