import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import postRoutes from './routes/posts';
import userRoutes from './routes/user';
import categoryRoutes from './routes/categories';
import tagRoutes from './routes/tags';
import searchRoutes from './routes/search';

const app = express();

// Use environment variable PORT assigned by Render, fallback to 3000 for local
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] Received ${req.method} request for ${req.url}`);
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/user', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/search', searchRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'API is alive and running!',
    timestamp: new Date().toISOString(),
  });
});

// Listen on all interfaces by default for Render; do not specify 'localhost'
app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});
