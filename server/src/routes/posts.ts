import { Router } from 'express';
import prisma from '../lib/prisma';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// --- PUBLIC ROUTES ---

router.get('/', async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: { nickname: true },
        },
      },
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve posts' });
  }
});

router.get('/:slug', authMiddleware, async (req, res) => {
  const { slug } = req.params;
  try {
    const post = await prisma.post.findUnique({
      where: { slug },
      include: { author: { select: { nickname: true } } },
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

router.get('/id/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.userId;
  try {
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post || post.authorId !== userId) {
      return res.status(403).json({ error: 'Forbidden: You cannot access this post' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve post for editing' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, content } = req.body;
    const authorId = req.user?.userId;
    if (!authorId) {
      return res.status(403).json({ error: 'User not authenticated properly' });
    }
    const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '') + '-' + Date.now();
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