import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// No Theme model exists in your Prisma schema – these stubs prevent build failure.

router.get('/', authenticateToken, (req, res) => {
  res.status(501).json({ error: 'Themes endpoint not implemented: No Theme model found in Prisma schema.' });
});

router.post('/:id/activate', authenticateToken, (req, res) => {
  res.status(501).json({ error: 'Themes endpoint not implemented: No Theme model found in Prisma schema.' });
});

export default router;
