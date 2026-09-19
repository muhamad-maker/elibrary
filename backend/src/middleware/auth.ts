import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey_elibrary_2026';

export interface AuthenticatedRequest extends Request {
  user?: { id: string; role: string; name: string };
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    res.status(401).json({ error: 'Autentikasi diperlukan' });
    return;
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET) as AuthenticatedRequest['user'];
    next();
  } catch {
    res.status(401).json({ error: 'Token tidak valid atau sudah kedaluwarsa' });
  }
}

export function requireStaff(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  if (req.user?.role !== 'ADMIN' && req.user?.role !== 'LIBRARIAN') {
    res.status(403).json({ error: 'Akses khusus admin atau pustakawan' });
    return;
  }

  next();
}

export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  if (req.user?.role !== 'ADMIN') {
    res.status(403).json({ error: 'Akses khusus administrator' });
    return;
  }

  next();
}