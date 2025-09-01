import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get all available themes
router.get('/', authenticateToken, async (req, res) => {
  try {
    const themes = await prisma.theme.findMany();
    res.json(themes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch themes' });
  }
});

// Set active theme
router.post('/:id/activate', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    // First, deactivate all themes
    await prisma.theme.updateMany({
      data: { isActive: false },
    });

    // Then activate the selected theme
    const theme = await prisma.theme.update({
      where: { id },
      data: { isActive: true },
    });

    res.json(theme);
  } catch (error) {
    res.status(500).json({ error: 'Failed to activate theme' });
  }
});

export default router;
