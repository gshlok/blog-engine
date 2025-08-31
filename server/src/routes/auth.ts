// in /server/src/routes/auth.ts
import { Router } from 'express';
import prisma from '../lib/prisma'; // Our database client
import bcrypt from 'bcrypt';         // For hashing passwords
import jwt from 'jsonwebtoken';      // For creating digital passports (tokens)

const router = Router();

// Endpoint 1: Register a new user
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Hash the password for security before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user in the database
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json({ message: 'User created successfully', userId: user.id });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong during registration' });
  }
});

// Endpoint 2: Log in a user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by their email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare the submitted password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // If password is valid, create a JWT (the digital passport)
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-default-secret-key', // IMPORTANT: Use an environment variable for your secret!
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    res.json({ message: 'Logged in successfully', token });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong during login' });
  }
});

export default router;