import { NextFunction, Request, Response } from 'express';

export function isAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user_role) {
    return res.status(401).json({ error: 'User role not found' });
  }

  if (req.user_role !== 'ADMIN') {
    return res
      .status(403)
      .json({ error: 'Access denied. Admin role required.' });
  }

  return next();
}
