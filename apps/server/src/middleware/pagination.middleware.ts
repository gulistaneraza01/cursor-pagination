import type { NextFunction, Request, Response } from 'express';

type SortOrder = 'asc' | 'desc';

declare global {
  namespace Express {
    interface Request {
      pagination: { cursor?: string; limit: number; sortBy: string; order: SortOrder };
    }
  }
}

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;
const DEFAULT_SORT_BY = 'create_at';
const DEFAULT_ORDER: SortOrder = 'desc';

export function paginationMiddleware(allowedSortFields: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const cursor = typeof req.query.cursor === 'string' ? req.query.cursor : undefined;
    const limitParam = Number(req.query.limit);
    const limit = Number.isFinite(limitParam) && limitParam > 0 ? Math.min(limitParam, MAX_LIMIT) : DEFAULT_LIMIT;

    const sortBy =
      typeof req.query.sortBy === 'string' && allowedSortFields.includes(req.query.sortBy)
        ? req.query.sortBy
        : DEFAULT_SORT_BY;
    const order = req.query.order === 'asc' || req.query.order === 'desc' ? req.query.order : DEFAULT_ORDER;

    req.pagination = { cursor, limit, sortBy, order };
    next();
  };
}
