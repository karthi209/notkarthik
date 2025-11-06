import pg from 'pg';
import 'dotenv/config';

const { Pool } = pg;

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'portfolio_db',
  password: process.env.DB_PASSWORD || '',
  port: process.env.DB_PORT || 5432,
});

// Test connection
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Initialize database tables
export const initDatabase = async () => {
  try {
    // Create blogs table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS blogs (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        category VARCHAR(100) NOT NULL,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        tags TEXT[],
        is_draft BOOLEAN DEFAULT FALSE,
        published_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create logs table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS logs (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL CHECK (type IN ('games', 'movies', 'series', 'books')),
        content TEXT,
        rating VARCHAR(50),
        status VARCHAR(100),
        completion VARCHAR(100),
        author VARCHAR(255),
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create API keys table for authentication
    await pool.query(`
      CREATE TABLE IF NOT EXISTS api_keys (
        id SERIAL PRIMARY KEY,
        key_hash VARCHAR(255) NOT NULL UNIQUE,
        name VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_used_at TIMESTAMP
      )
    `);

    // Featured tweets (admin-curated)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS featured_tweets (
        id SERIAL PRIMARY KEY,
        position SMALLINT NOT NULL,
        url TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await pool.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_featured_tweets_position ON featured_tweets(position);
    `);

    // Create indexes for better performance
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_blogs_category ON blogs(category);
      CREATE INDEX IF NOT EXISTS idx_blogs_date ON blogs(date DESC);
      CREATE INDEX IF NOT EXISTS idx_logs_type ON logs(type);
      CREATE INDEX IF NOT EXISTS idx_logs_date ON logs(date DESC);
      CREATE INDEX IF NOT EXISTS idx_api_keys_hash ON api_keys(key_hash);
    `);

    console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

export default pool;

