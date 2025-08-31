import { Router } from 'express';
import prisma from '../lib/prisma';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// --- PUBLIC ROUTES ---

/**
 * @route GET /api/posts
 * @desc Get all published posts
 * @access Public
 */
router.get('/', async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      include: { author: { select: { email: true } } },
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve posts' });
  }
});

/**
 * @route GET /api/posts/:slug
 * @desc Get a single post by its unique slug
 * @access Public
 */
router.get('/:slug', async (req, res) => {
  const { slug } = req.params;
  try {
    const post = await prisma.post.findUnique({
      where: { slug },
      include: { author: { select: { email: true } } },
    });
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve post' });
  }
});


// --- PROTECTED ROUTES ---

/**
 * @route GET /api/posts/admin/all
 * @desc Get ALL posts for the logged-in admin
 * @access Private
 */
router.get('/admin/all', authMiddleware, async (req, res) => {
  const userId = req.user?.userId;

  try {
    const posts = await prisma.post.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: 'desc' },
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve admin posts' });
  }
});

/**
 * @route POST /api/posts
 * @desc Create a new post
 * @access Private (Requires Auth)
 */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, content } = req.body;
    const authorId = req.user?.userId;

    if (!authorId) {
      return res.status(403).json({ error: 'User not authenticated properly' });
    }

    const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

    const newPost = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        authorId,
        published: true,
      },
    });
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create post' });
  }
});

/**
 * @route PUT /api/posts/:id
 * @desc Update an existing post
 * @access Private (Requires Auth & Ownership)
 */
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const userId = req.user?.userId;

    const post = await prisma.post.findUnique({ where: { id } });

    if (!post || post.authorId !== userId) {
      return res.status(403).json({ error: 'Forbidden: You cannot edit this post' });
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: { title, content },
    });
    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update post' });
  }
});

/**
 * @route DELETE /api/posts/:id
 * @desc Delete a post
 * @access Private (Requires Auth & Ownership)
 */
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const post = await prisma.post.findUnique({ where: { id } });

    if (!post || post.authorId !== userId) {
      return res.status(403).json({ error: 'Forbidden: You cannot delete this post' });
    }

    await prisma.post.delete({ where: { id } });
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

export default router;