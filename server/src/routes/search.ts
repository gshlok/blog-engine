import { Router } from 'express';
import { Request, Response } from 'express';
import prisma from '../lib/prisma';

const router = Router();

// Advanced search with filters
router.get('/', async (req: Request, res: Response) => {
  const { 
    q, // search query
    category, 
    tags, 
    author, 
    status = 'PUBLISHED',
    featured,
    sort = 'newest',
    page = '1',
    limit = '10',
    dateFrom,
    dateTo
  } = req.query;

  try {
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build where clause
    const where: any = {
      status: status === 'all' ? undefined : status,
      published: status === 'PUBLISHED' ? true : undefined
    };

    // Search query
    if (q) {
      where.OR = [
        { title: { contains: q as string, mode: 'insensitive' } },
        { content: { contains: q as string, mode: 'insensitive' } },
        { excerpt: { contains: q as string, mode: 'insensitive' } }
      ];
    }

    // Category filter
    if (category) {
      where.category = {
        slug: category as string
      };
    }

    // Tags filter
    if (tags) {
      const tagArray = (tags as string).split(',').map(t => t.trim());
      where.tags = {
        some: {
          slug: { in: tagArray }
        }
      };
    }

    // Author filter
    if (author) {
      where.author = {
        email: { contains: author as string, mode: 'insensitive' }
      };
    }

    // Featured filter
    if (featured !== undefined) {
      where.featured = featured === 'true';
    }

    // Date range filter
    if (dateFrom || dateTo) {
      where.publishedAt = {};
      if (dateFrom) {
        where.publishedAt.gte = new Date(dateFrom as string);
      }
      if (dateTo) {
        where.publishedAt.lte = new Date(dateTo as string);
      }
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

    // Execute search
    const [posts, totalPosts] = await Promise.all([
      prisma.post.findMany({
        where,
        orderBy,
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

    // Get search suggestions for autocomplete
    let suggestions: string[] = [];
    if (q && q.length > 2) {
      const titleSuggestions = await prisma.post.findMany({
        where: {
          title: { contains: q as string, mode: 'insensitive' },
          status: 'PUBLISHED'
        },
        select: { title: true },
        take: 5
      });
      
      const tagSuggestions = await prisma.tag.findMany({
        where: {
          name: { contains: q as string, mode: 'insensitive' }
        },
        select: { name: true },
        take: 5
      });

      suggestions = [
        ...titleSuggestions.map(p => p.title),
        ...tagSuggestions.map(t => t.name)
      ].slice(0, 8);
    }

    res.json({
      posts,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalPosts,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1
      },
      filters: {
        query: q,
        category,
        tags: tags ? (tags as string).split(',').map(t => t.trim()) : [],
        author,
        status,
        featured,
        sort,
        dateFrom,
        dateTo
      },
      suggestions
    });

  } catch (error) {
    console.error('Error searching posts:', error);
    res.status(500).json({ error: 'Failed to search posts' });
  }
});

// Get search suggestions for autocomplete
router.get('/suggestions', async (req: Request, res: Response) => {
  const { q } = req.query;

  if (!q || (q as string).length < 2) {
    return res.json({ suggestions: [] });
  }

  try {
    const [posts, tags, categories] = await Promise.all([
      prisma.post.findMany({
        where: {
          title: { contains: q as string, mode: 'insensitive' },
          status: 'PUBLISHED'
        },
        select: { title: true, slug: true },
        take: 5
      }),
      prisma.tag.findMany({
        where: {
          name: { contains: q as string, mode: 'insensitive' }
        },
        select: { name: true, slug: true },
        take: 5
      }),
      prisma.category.findMany({
        where: {
          name: { contains: q as string, mode: 'insensitive' }
        },
        select: { name: true, slug: true },
        take: 3
      })
    ]);

    const suggestions = [
      ...posts.map(p => ({ type: 'post', text: p.title, slug: p.slug })),
      ...tags.map(t => ({ type: 'tag', text: t.name, slug: t.slug })),
      ...categories.map(c => ({ type: 'category', text: c.name, slug: c.slug }))
    ].slice(0, 10);

    res.json({ suggestions });

  } catch (error) {
    console.error('Error getting search suggestions:', error);
    res.status(500).json({ error: 'Failed to get suggestions' });
  }
});

// Get popular search terms
router.get('/popular', async (req: Request, res: Response) => {
  try {
    // This would typically come from a search analytics table
    // For now, we'll return popular tags and categories
    const [popularTags, popularCategories] = await Promise.all([
      prisma.tag.findMany({
        include: {
          _count: {
            select: {
              posts: {
                where: { status: 'PUBLISHED' }
              }
            }
          }
        },
        orderBy: {
          posts: {
            _count: 'desc'
          }
        },
        take: 10
      }),
      prisma.category.findMany({
        include: {
          _count: {
            select: {
              posts: {
                where: { status: 'PUBLISHED' }
              }
            }
          }
        },
        orderBy: {
          posts: {
            _count: 'desc'
          }
        },
        take: 5
      })
    ]);

    res.json({
      popularTags: popularTags.map(t => ({
        name: t.name,
        slug: t.slug,
        count: t._count.posts
      })),
      popularCategories: popularCategories.map(c => ({
        name: c.name,
        slug: c.slug,
        count: c._count.posts
      }))
    });

  } catch (error) {
    console.error('Error getting popular searches:', error);
    res.status(500).json({ error: 'Failed to get popular searches' });
  }
});

export default router;
