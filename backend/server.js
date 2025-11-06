import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { initDatabase } from './db.js';
import blogRoutes from './routes/blogs.js';
import blogApiRoutes from './routes/blogs-api.js';
import logRoutes from './routes/logs.js';
import adminRoutes from './routes/admin.js';
import featuredTweetsRoutes from './routes/featured-tweets.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Allow larger payloads for markdown files

// Initialize PostgreSQL database
initDatabase()
  .then(() => {
    console.log('Database initialization completed');
  })
  .catch(err => {
    console.error('Database initialization error:', err);
    process.exit(1);
  });

// Routes
app.use('/api/blogs', blogRoutes);
app.use('/api/blogs', blogApiRoutes); // API routes with authentication
app.use('/api/logs', logRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/featured-tweets', featuredTweetsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 