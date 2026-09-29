import type { NextFunction, Request, Response } from 'express';

declare global {
  namespace Express {
    interface Request {
      pagination: { cursor?: string; limit: number };
    }
  }
}

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

export function paginationMiddleware(req: Request, _res: Response, next: NextFunction) {
  const cursor = typeof req.query.cursor === 'string' ? req.query.cursor : undefined;
  const limitParam = Number(req.query.limit);
  const limit = Number.isFinite(limitParam) && limitParam > 0 ? Math.min(limitParam, MAX_LIMIT) : DEFAULT_LIMIT;

  req.pagination = { cursor, limit };
  next();
}
