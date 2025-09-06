import { Router } from 'express';
import prisma from '../lib/prisma';
import { authenticateToken } from '../middleware/auth'; // <-- Correct import

const router = Router();

/**
 * @route DELETE /api/user/me
 * @desc Delete the authenticated user's account
 * @access Private
 */
router.delete('/me', authenticateToken, async (req, res) => {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(403).json({ error: 'User not authenticated properly' });
  }

  try {
    await prisma.$transaction([
      prisma.post.deleteMany({ where: { authorId: userId } }),
      prisma.user.delete({ where: { id: userId } }),
    ]);
    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete account' });
  }
});

export default router;