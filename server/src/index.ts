import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import postRoutes from './routes/posts';
import userRoutes from './routes/user';
import categoryRoutes from './routes/categories';
import tagRoutes from './routes/tags';
import searchRoutes from './routes/search';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// V V V ADD THIS NEW CODE BLOCK V V V
// This middleware will log every incoming request
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] Received ${req.method} request for ${req.url}`);
  next(); // Pass the request to the next handler
});
// ^ ^ ^ END OF NEW CODE BLOCK ^ ^ ^

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/user', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/search', searchRoutes);

app.get('/', (req, res) => {
  res.json({ 
    message: 'API is alive and running!',
    timestamp: new Date().toISOString() 
  });
});

app.listen(port, () => {
  console.log(`🚀 Server is running at http://localhost:${port}`);
});