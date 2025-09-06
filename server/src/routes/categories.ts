import { Router } from 'express';
import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { authenticateToken } from '../middleware/auth';


const router = Router();

// Type for the authenticated request
interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

// Get all categories (public)
router.get('/', async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
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
    
    res.json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to retrieve categories' });
  }
});

// Get category by slug with posts
router.get('/:slug', async (req: Request, res: Response) => {
  const { slug } = req.params;
  const { page = '1', limit = '10' } = req.query;
  
  try {
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        posts: {
          where: { status: 'PUBLISHED' },
          orderBy: { publishedAt: 'desc' },
          skip,
          take: limitNum,
          include: {
            author: { select: { email: true } },
            tags: true,
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

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const totalPosts = category._count.posts;
    const totalPages = Math.ceil(totalPosts / limitNum);

    res.json({
      category,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalPosts,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1
      }
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ error: 'Failed to retrieve category' });
  }
});

// Create new category (admin only)
router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, color } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Category name is required' });
    }

    // Generate slug from name
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    
    // Check for duplicate slugs
    const existingCategory = await prisma.category.findUnique({
      where: { slug }
    });
    
    if (existingCategory) {
      return res.status(400).json({ error: 'Category with this name already exists' });
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        color
      }
    });

    res.status(201).json({ category });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ error: 'Failed to create category' });
  }
});

// Update category (admin only)
router.put('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, color } = req.body;
    
    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    let slug = category.slug;
    if (name && name !== category.name) {
      slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
      
      // Check for duplicate slugs
      const existingCategory = await prisma.category.findUnique({
        where: { slug, NOT: { id } }
      });
      
      if (existingCategory) {
        return res.status(400).json({ error: 'Category with this name already exists' });
      }
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        name: name || category.name,
        slug,
        description,
        color
      }
    });

    res.json({ category: updatedCategory });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ error: 'Failed to update category' });
  }
});

// Delete category (admin only)
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    // Check if category has posts
    const postsCount = await prisma.post.count({
      where: { categoryId: id }
    });
    
    if (postsCount > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete category with existing posts. Please reassign or delete posts first.' 
      });
    }

    await prisma.category.delete({ where: { id } });
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

export default router;
