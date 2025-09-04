import { Router } from 'express';
import prisma from '../lib/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = Router();

router.post('/register', async (req, res) => {
  try {
    const { email, password, nickname } = req.body;
    if (!email || !password || !nickname) {
      return res.status(400).json({ error: 'Email, password, and nickname are required.' });
    }
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { nickname }] },
    });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email or nickname already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        nickname,
        password: hashedPassword,
      },
    });
    res.status(201).json({ message: 'User created successfully', userId: user.id });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ error: 'Failed to register user.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-default-secret-key',
      { expiresIn: '1h' }
    );
    res.json({ message: 'Logged in successfully', token });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: 'Something went wrong during login' });
  }
});

export default router;