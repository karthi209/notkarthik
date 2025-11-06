import { Router } from 'express';
import pool from '../db.js';
import { authenticateApiKey } from '../middleware/auth.js';

const router = Router();

// Get all logs
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM logs ORDER BY date DESC');
    const logs = result.rows.map(row => ({ ...row, _id: row.id }));
    res.json(logs);
  } catch (err) {
    console.error('Error fetching logs:', err);
    res.status(500).json({ message: err.message });
  }
});

// Get logs by type
router.get('/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const validTypes = ['games', 'movies', 'series', 'books'];
    
    if (!validTypes.includes(type)) {
      return res.status(400).json({ message: 'Invalid log type' });
    }

    const result = await pool.query(
      'SELECT * FROM logs WHERE type = $1 ORDER BY date DESC',
      [type]
    );
    const logs = result.rows.map(row => ({ ...row, _id: row.id }));
    res.json(logs);
  } catch (err) {
    console.error('Error fetching logs by type:', err);
    res.status(500).json({ message: err.message });
  }
});

// Add new log
router.post('/', authenticateApiKey, async (req, res) => {
  try {
    const { title, type, content, rating, status, completion, author } = req.body;
    
    // Validate required fields
    if (!title || !type) {
      return res.status(400).json({ 
        message: 'Title and type are required' 
      });
    }

    const validTypes = ['games', 'movies', 'series', 'books'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ message: 'Invalid log type' });
    }

    const result = await pool.query(
      `INSERT INTO logs (title, type, content, rating, status, completion, author, date)
       VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP)
       RETURNING *`,
      [title, type, content || null, rating || null, status || null, completion || null, author || null]
    );

    const log = { ...result.rows[0], _id: result.rows[0].id };
    res.status(201).json(log);
  } catch (err) {
    console.error('Error saving log:', err);
    res.status(400).json({ message: err.message });
  }
});

// Update log
router.put('/:id', authenticateApiKey, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { title, type, content, rating, status, completion, author } = req.body;
    
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid log ID format' });
    }

    const result = await pool.query(
      `UPDATE logs 
       SET title = $1, type = $2, content = $3, rating = $4, status = $5, 
           completion = $6, author = $7, updated_at = CURRENT_TIMESTAMP
       WHERE id = $8
       RETURNING *`,
      [title, type, content || null, rating || null, status || null, completion || null, author || null, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Log not found' });
    }

    const log = { ...result.rows[0], _id: result.rows[0].id };
    res.json(log);
  } catch (err) {
    console.error('Error updating log:', err);
    res.status(400).json({ message: err.message });
  }
});

// Delete log
router.delete('/:id', authenticateApiKey, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid log ID format' });
    }

    const result = await pool.query('DELETE FROM logs WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Log not found' });
    }

    res.json({ message: 'Log deleted successfully', log: result.rows[0] });
  } catch (err) {
    console.error('Error deleting log:', err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
