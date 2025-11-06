import { Router } from 'express';
import { createApiKey, authenticateApiKey } from '../middleware/auth.js';
import pool from '../db.js';

const router = Router();

// Generate a new API key (no auth required for setup, but you should restrict this in production)
router.post('/api-keys', async (req, res) => {
  try {
    const { name } = req.body;
    const apiKey = await createApiKey(name || 'API Key');
    
    res.status(201).json({
      api_key: apiKey,
      message: 'Save this key securely. It will not be shown again.',
      warning: 'This is your only chance to see this key!'
    });
  } catch (error) {
    console.error('Error creating API key:', error);
    res.status(500).json({ message: 'Error creating API key' });
  }
});

// List all API keys (hashed)
router.get('/api-keys', authenticateApiKey, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, created_at, last_used_at FROM api_keys ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching API keys:', error);
    res.status(500).json({ message: 'Error fetching API keys' });
  }
});

// Delete API key
router.delete('/api-keys/:id', authenticateApiKey, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const result = await pool.query('DELETE FROM api_keys WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'API key not found' });
    }
    
    res.json({ message: 'API key deleted successfully' });
  } catch (error) {
    console.error('Error deleting API key:', error);
    res.status(500).json({ message: 'Error deleting API key' });
  }
});

export default router;

