import crypto from 'crypto';
import pool from '../db.js';

// Simple API key authentication middleware
export const authenticateApiKey = async (req, res, next) => {
  try {
    const apiKey = req.headers['x-api-key'] || req.query.api_key;
    
    if (!apiKey) {
      return res.status(401).json({ message: 'API key required' });
    }

    // Hash the provided key
    const keyHash = crypto.createHash('sha256').update(apiKey).digest('hex');
    
    // Check if key exists in database
    const result = await pool.query(
      'SELECT * FROM api_keys WHERE key_hash = $1',
      [keyHash]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid API key' });
    }

    // Update last used timestamp
    await pool.query(
      'UPDATE api_keys SET last_used_at = CURRENT_TIMESTAMP WHERE key_hash = $1',
      [keyHash]
    );

    req.apiKeyInfo = result.rows[0];
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ message: 'Authentication error' });
  }
};

// Generate a new API key
export const generateApiKey = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Create API key helper
export const createApiKey = async (name = 'Default Key') => {
  const apiKey = generateApiKey();
  const keyHash = crypto.createHash('sha256').update(apiKey).digest('hex');
  
  await pool.query(
    'INSERT INTO api_keys (key_hash, name) VALUES ($1, $2)',
    [keyHash, name]
  );
  
  // Return the plain key (only shown once)
  return apiKey;
};
