// in /server/src/index.ts
import express from 'express';
import cors from 'cors'; // 1. IMPORT CORS
import authRoutes from './routes/auth'; // We will create this next
import postRoutes from './routes/posts';

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(cors()); // 2. USE CORS (place it before your routes)
app.use(express.json());

// Use the authentication routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

app.listen(port, () => {
  console.log(`🚀 Server is running at http://localhost:${port}`);
});