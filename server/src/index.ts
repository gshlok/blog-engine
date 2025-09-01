import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import postRoutes from './routes/posts';
import userRoutes from './routes/user';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Request logger middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] Received ${req.method} request for ${req.url}`);
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/user', userRoutes);

app.get('/', (req, res) => {
  res.json({ 
    message: 'API is alive and running!',
    timestamp: new Date().toISOString() 
  });
});

app.listen(port, () => {
  console.log(`🚀 Server is running at http://localhost:${port}`);
});