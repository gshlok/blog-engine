import { Router } from 'express';
import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { authenticateToken } from '../middleware/auth'; // Correct import

const router = Router();

// Type for the authenticated request
interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

// ...rest of file unchanged...

// Create new tag (admin only)
router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Tag name is required' });
    }

    // Generate slug from name
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    
    // Check for duplicate slugs
    const existingTag = await prisma.tag.findUnique({
      where: { slug }
    });
    
    if (existingTag) {
      return res.status(400).json({ error: 'Tag with this name already exists' });
    }

    const tag = await prisma.tag.create({
      data: {
        name,
        slug
      }
    });

    res.status(201).json({ tag });
  } catch (error) {
    console.error('Error creating tag:', error);
    res.status(500).json({ error: 'Failed to create tag' });
  }
});

// Do similar replacement (`authenticateToken` for `authMiddleware`, and correct AuthRequest) in all other POST/PUT/DELETE routes in this file!

export default router;
