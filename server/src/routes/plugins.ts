import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get all installed plugins
router.get('/', authenticateToken, async (req, res) => {
  try {
    const plugins = await prisma.plugin.findMany();
    res.json(plugins);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch plugins' });
  }
});

// Toggle plugin status
router.patch('/:id/toggle', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const plugin = await prisma.plugin.findUnique({ where: { id } });
    if (!plugin) {
      return res.status(404).json({ error: 'Plugin not found' });
    }

    const updatedPlugin = await prisma.plugin.update({
      where: { id },
      data: { isActive: !plugin.isActive },
    });

    res.json(updatedPlugin);
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle plugin' });
  }
});

export default router;
