import { Router } from 'express';
import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Type for the authenticated request
interface AuthRequest extends Request {
  user?: {
    userId: string;
  };
}

// Get all tags (public)
router.get('/', async (req: Request, res: Response) => {
  try {
    const tags = await prisma.tag.findMany({
      include: {
        _count: {
          select: {
            posts: {
              where: {
                status: 'PUBLISHED'
              }
            }
          }
        }
      },
      orderBy: { name: 'asc' }
    });
    
    res.json({ tags });
  } catch (error) {
    console.error('Error fetching tags:', error);
    res.status(500).json({ error: 'Failed to retrieve tags' });
  }
});

// Get tag by slug with posts
router.get('/:slug', async (req: Request, res: Response) => {
  const { slug } = req.params;
  const { page = '1', limit = '10' } = req.query;
  
  try {
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const tag = await prisma.tag.findUnique({
      where: { slug },
      include: {
        posts: {
          where: { status: 'PUBLISHED' },
          orderBy: { publishedAt: 'desc' },
          skip,
          take: limitNum,
          include: {
            author: { select: { email: true } },
            category: true,
            _count: { select: { comments: true } }
          }
        },
        _count: {
          select: {
            posts: {
              where: { status: 'PUBLISHED' }
            }
          }
        }
      }
    });

    if (!tag) {
      return res.status(404).json({ error: 'Tag not found' });
    }

    const totalPosts = tag._count.posts;
    const totalPages = Math.ceil(totalPosts / limitNum);

    res.json({
      tag,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalPosts,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1
      }
    });
  } catch (error) {
    console.error('Error fetching tag:', error);
    res.status(500).json({ error: 'Failed to retrieve tag' });
  }
});

// Create new tag (admin only)
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
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

// Update tag (admin only)
router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    
    const tag = await prisma.tag.findUnique({ where: { id } });
    if (!tag) {
      return res.status(404).json({ error: 'Tag not found' });
    }

    let slug = tag.slug;
    if (name && name !== tag.name) {
      slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
      
      // Check for duplicate slugs
      const existingTag = await prisma.tag.findUnique({
        where: { slug, NOT: { id } }
      });
      
      if (existingTag) {
        return res.status(400).json({ error: 'Tag with this name already exists' });
      }
    }

    const updatedTag = await prisma.tag.update({
      where: { id },
      data: {
        name: name || tag.name,
        slug
      }
    });

    res.json({ tag: updatedTag });
  } catch (error) {
    console.error('Error updating tag:', error);
    res.status(500).json({ error: 'Failed to update tag' });
  }
});

// Delete tag (admin only)
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    // Check if tag has posts
    const postsCount = await prisma.post.count({
      where: {
        tags: {
          some: { id }
        }
      }
    });
    
    if (postsCount > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete tag with existing posts. Please remove tag from posts first.' 
      });
    }

    await prisma.tag.delete({ where: { id } });
    res.json({ message: 'Tag deleted successfully' });
  } catch (error) {
    console.error('Error deleting tag:', error);
    res.status(500).json({ error: 'Failed to delete tag' });
  }
});

export default router;
