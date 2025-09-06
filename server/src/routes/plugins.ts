import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Plugins API — Not implemented, since no 'plugin' model exists in your Prisma schema

// GET /api/plugins — Not implemented
router.get('/', authenticateToken, async (req, res) => {
  res.status(501).json({ error: 'Plugins endpoint not implemented: No plugin model found in Prisma schema.' });
});

// PATCH /api/plugins/:id/toggle — Not implemented
router.patch('/:id/toggle', authenticateToken, async (req, res) => {
  res.status(501).json({ error: 'Plugins endpoint not implemented: No plugin model found in Prisma schema.' });
});

export default router;
