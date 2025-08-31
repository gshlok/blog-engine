// in /server/src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// We need to add a 'user' property to the Express Request type
// This allows us to attach the decoded token data to the request object
declare global {
  namespace Express {
    interface Request {
      user?: { userId: string; email: string };
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // 1. Get the token from the request header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided, authorization denied' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // 2. Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as { userId: string; email: string };
    
    // 3. If valid, attach the user's info to the request object
    req.user = decoded;
    
    // 4. Call 'next()' to pass the request to the next function (the actual route handler)
    next();
  } catch (error) {
    res.status(403).json({ error: 'Token is not valid' });
  }
};