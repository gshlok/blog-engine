import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Add 'user' property type to Express Request
declare global {
  namespace Express {
    interface Request {
      user?: { userId: string; email: string };
    }
  }
}
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided, authorization denied' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as { userId: string; email: string };
    req.user = {
      userId: decoded.userId,
      email: decoded.email
    };
    next();
  } catch (error) {
    res.status(403).json({ error: 'Token is not valid' });
  }
};
