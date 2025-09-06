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

// --- PUBLIC ROUTES ---

// Get all published posts with pagination
router.get('/', async (req: Request, res: Response) => {
  try {
    const { page = '1', limit = '10', category, tags, featured, sort = 'newest' } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build where clause
    const where: any = { 
      OR: [
        { status: 'PUBLISHED' },
        { published: true }
      ]
    };

    // Add filters
    if (category) {
      where.category = { slug: category as string };
    }

    if (tags) {
      const tagArray = (tags as string).split(',').map(t => t.trim());
      where.tags = {
        some: {
          slug: { in: tagArray }
        }
      };
    }

    if (featured !== undefined) {
      where.featured = featured === 'true';
    }

    // Build order by clause
    let orderBy: any = {};
    switch (sort) {
      case 'oldest':
        orderBy.publishedAt = 'asc';
        break;
      case 'title':
        orderBy.title = 'asc';
        break;
      case 'views':
        orderBy.views = 'desc';
        break;
      case 'likes':
        orderBy.likes = 'desc';
        break;
      case 'newest':
      default:
        orderBy.publishedAt = 'desc';
        break;
    }

    const [posts, totalPosts] = await Promise.all([
      prisma.post.findMany({
        where,
        orderBy,
        skip,
        take: limitNum,
        include: { 
          author: { 
            select: { 
              email: true 
            } 
          },
          category: {
            select: {
              name: true,
              slug: true,
              color: true
            }
          },
          tags: {
            select: {
              name: true,
              slug: true
            }
          },
          _count: {
            select: {
              comments: true
            }
          }
        },
      }),
      prisma.post.count({ where })
    ]);

    const totalPages = Math.ceil(totalPosts / limitNum);

    console.log(`Found ${posts.length} published posts`);
    res.json({ 
      posts,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalPosts,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1
      }
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to retrieve posts' });
  }
});

// Get featured posts
router.get('/featured', async (req: Request, res: Response) => {
  try {
    const posts = await prisma.post.findMany({
      where: { 
        featured: true,
        OR: [
          { status: 'PUBLISHED' },
          { published: true }
        ]
      },
      orderBy: { publishedAt: 'desc' },
      take: 5,
      include: { 
        author: { select: { email: true } },
        category: { select: { name: true, slug: true, color: true } },
        tags: { select: { name: true, slug: true } },
        _count: { select: { comments: true } }
      },
    });
    
    res.json({ posts });
  } catch (error) {
    console.error('Error fetching featured posts:', error);
    res.status(500).json({ error: 'Failed to retrieve featured posts' });
  }
});

router.get('/admin/all', authenticateToken, async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  const { status, featured, search, category, tags, page = '1', limit = '20' } = req.query;
  
  try {
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = { authorId: userId };
    
    // Add status filter
    if (status) {
      where.status = status;
    }
    
    // Add featured filter
    if (featured === 'true') {
      where.featured = true;
    } else if (featured === 'false') {
      where.featured = false;
    }
    
    // Add search filter
    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { content: { contains: search as string, mode: 'insensitive' } },
        { excerpt: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    // Add category filter
    if (category) {
      where.category = { slug: category as string };
    }

    // Add tags filter
    if (tags) {
      const tagArray = (tags as string).split(',').map(t => t.trim());
      where.tags = {
        some: {
          slug: { in: tagArray }
        }
      };
    }

    const [posts, totalPosts] = await Promise.all([
      prisma.post.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
        include: {
          author: { select: { email: true } },
          category: { select: { name: true, slug: true, color: true } },
          tags: { select: { name: true, slug: true } },
          _count: { select: { comments: true } }
        }
      }),
      prisma.post.count({ where })
    ]);

    const totalPages = Math.ceil(totalPosts / limitNum);
    
    res.json({ 
      posts,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalPosts,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1
      }
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to retrieve admin posts' });
  }
});

router.get('/:slug', async (req: Request, res: Response) => {
  const { slug } = req.params;
  try {
    const post = await prisma.post.findUnique({
      where: { slug },
      include: { 
        author: { select: { email: true } },
        category: { select: { name: true, slug: true, color: true } },
        tags: { select: { name: true, slug: true } }
      },
    });
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Increment view count
    await prisma.post.update({
      where: { id: post.id },
      data: { views: { increment: 1 } }
    });

    // Track view for analytics
    await prisma.postView.create({
      data: {
        postId: post.id,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      }
    });

    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve post' });
  }
});

router.get('/id/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.userId;
  try {
    const post = await prisma.post.findUnique({ 
      where: { id },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        tags: { select: { id: true, name: true, slug: true } }
      }
    });
    if (!post || post.authorId !== userId) {
      return res.status(403).json({ error: 'Forbidden: You cannot access this post' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve post for editing' });
  }
});

router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    console.log('Creating new post with data:', req.body);
    const { 
      title, 
      content, 
      excerpt,
      status = 'DRAFT', 
      featured = false,
      categoryId,
      tagIds = [],
      scheduledAt,
      metaTitle,
      metaDescription,
      keywords
    } = req.body;
    const authorId = req.user?.userId;
    
    if (!authorId) {
      return res.status(403).json({ error: 'User not authenticated properly' });
    }
    
    // Generate slug from title
    const baseSlug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    
    // Check for duplicate slugs
    const slugCount = await prisma.post.count({
      where: {
        slug: {
          startsWith: baseSlug
        }
      }
    });
    
    // If duplicates exist, append a number
    const slug = slugCount > 0 ? `${baseSlug}-${slugCount + 1}` : baseSlug;
    
    const newPost = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        excerpt,
        authorId,
        status,
        featured,
        published: status === 'PUBLISHED',
        publishedAt: status === 'PUBLISHED' ? new Date() : null,
        scheduledAt: status === 'SCHEDULED' ? new Date(scheduledAt) : null,
        categoryId: categoryId || null,
        tags: tagIds.length > 0 ? {
          connect: tagIds.map((id: string) => ({ id }))
        } : undefined,
        metaTitle,
        metaDescription,
        keywords
      },
      include: {
        author: { select: { email: true } },
        category: { select: { name: true, slug: true, color: true } },
        tags: { select: { name: true, slug: true } }
      }
    });
    
    console.log('Post created successfully:', newPost);
    res.status(201).json({ post: newPost });
  } catch (error) {
    console.error('Error creating post:', error);
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to create post' });
    }
  }
});

router.put('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { 
      title, 
      content, 
      excerpt,
      status, 
      featured,
      categoryId,
      tagIds = [],
      scheduledAt,
      metaTitle,
      metaDescription,
      keywords
    } = req.body;
    const userId = req.user?.userId;
    
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post || post.authorId !== userId) {
      return res.status(403).json({ error: 'Forbidden: You cannot edit this post' });
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        title,
        content,
        excerpt,
        status,
        featured,
        publishedAt: status === 'PUBLISHED' && !post.publishedAt ? new Date() : post.publishedAt,
        scheduledAt: status === 'SCHEDULED' ? new Date(scheduledAt) : null,
        categoryId: categoryId || null,
        tags: {
          set: [], // Clear existing tags
          connect: tagIds.map((id: string) => ({ id }))
        },
        metaTitle,
        metaDescription,
        keywords
      },
      include: {
        author: { select: { email: true } },
        category: { select: { name: true, slug: true, color: true } },
        tags: { select: { name: true, slug: true } }
      }
    });
    res.json(updatedPost);
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ error: 'Failed to update post' });
  }
});

router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post || post.authorId !== userId) {
      return res.status(403).json({ error: 'Forbidden: You cannot delete this post' });
    }

    await prisma.post.delete({ where: { id } });
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

export default router;
