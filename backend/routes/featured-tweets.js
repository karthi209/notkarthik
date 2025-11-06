import { Router } from 'express';
import pool from '../db.js';
import { authenticateApiKey } from '../middleware/auth.js';

const router = Router();

// Public: get featured tweets (ordered)
router.get('/', async (_req, res) => {
  try {
    const result = await pool.query(
      'SELECT position, url FROM featured_tweets ORDER BY position ASC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching featured tweets:', err);
    res.status(500).json({ message: 'Error fetching featured tweets' });
  }
});

// Admin: replace featured tweets list with up to 5 URLs
router.put('/', authenticateApiKey, async (req, res) => {
  try {
    const { urls } = req.body;
    if (!Array.isArray(urls) || urls.length === 0) {
      return res.status(400).json({ message: 'urls array is required' });
    }

    const limited = urls.slice(0, 5).map((u) => String(u));

    await pool.query('BEGIN');
    await pool.query('DELETE FROM featured_tweets');
    for (let i = 0; i < limited.length; i++) {
      await pool.query(
        `INSERT INTO featured_tweets (position, url, updated_at)
         VALUES ($1, $2, CURRENT_TIMESTAMP)`,
        [i + 1, limited[i]]
      );
    }
    await pool.query('COMMIT');

    res.json({ success: true, count: limited.length });
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error('Error updating featured tweets:', err);
    res.status(500).json({ message: 'Error updating featured tweets' });
  }
});

export default router;


