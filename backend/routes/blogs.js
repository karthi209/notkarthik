import { Router } from 'express';
import pool from '../db.js';

const router = Router();

// Get all blogs with filtering and sorting
router.get('/', async (req, res) => {
  try {
    const { category, startDate, endDate, sortBy, order } = req.query;
    
    let query = 'SELECT * FROM blogs WHERE 1=1';
    const params = [];
    let paramCount = 0;

    // Apply filters
    if (category) {
      paramCount++;
      query += ` AND category = $${paramCount}`;
      params.push(category);
    }
    
    if (startDate) {
      paramCount++;
      query += ` AND date >= $${paramCount}`;
      params.push(new Date(startDate));
    }
    
    if (endDate) {
      paramCount++;
      query += ` AND date <= $${paramCount}`;
      params.push(new Date(endDate));
    }

    // Build sort clause
    const sortColumn = sortBy || 'date';
    const sortOrder = order === 'asc' ? 'ASC' : 'DESC';
    query += ` ORDER BY ${sortColumn} ${sortOrder}`;

    const result = await pool.query(query, params);
    // Map id to _id for frontend compatibility
    const blogs = result.rows.map(row => ({ ...row, _id: row.id }));
    res.json(blogs);
  } catch (err) {
    console.error('Error fetching blogs:', err);
    res.status(500).json({ message: err.message });
  }
});

// Get all unique categories
router.get('/categories', async (req, res) => {
  try {
    const result = await pool.query('SELECT DISTINCT category FROM blogs ORDER BY category');
    const categories = result.rows.map(row => row.category);
    res.json(categories);
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ message: err.message });
  }
});

// Get blogs by category
router.get('/category/:category', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM blogs WHERE category = $1 ORDER BY date DESC',
      [req.params.category]
    );
    const blogs = result.rows.map(row => ({ ...row, _id: row.id }));
    res.json(blogs);
  } catch (err) {
    console.error('Error fetching blogs by category:', err);
    res.status(500).json({ message: err.message });
  }
});

// Get blog archives (grouped by month and year)
router.get('/archives', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        EXTRACT(YEAR FROM date) as year,
        EXTRACT(MONTH FROM date) as month,
        COUNT(*) as count
      FROM blogs
      GROUP BY EXTRACT(YEAR FROM date), EXTRACT(MONTH FROM date)
      ORDER BY year DESC, month DESC
    `);
    
    const archives = result.rows.map(row => ({
      _id: {
        year: parseInt(row.year),
        month: parseInt(row.month)
      },
      count: parseInt(row.count)
    }));
    
    res.json(archives);
  } catch (err) {
    console.error('Error fetching archives:', err);
    res.status(500).json({ message: err.message });
  }
});

// Add new blog
router.post('/', async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;
    
    // Validate required fields
    if (!title || !content || !category) {
      return res.status(400).json({ 
        message: 'Title, content, and category are required' 
      });
    }

    // Convert tags array to PostgreSQL array format
    const tagsArray = tags && Array.isArray(tags) ? tags : 
                     tags && typeof tags === 'string' ? tags.split(',').map(t => t.trim()).filter(t => t) :
                     null;

    const result = await pool.query(
      `INSERT INTO blogs (title, content, category, tags, date)
       VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
       RETURNING *`,
      [title, content, category, tagsArray]
    );

    const blog = { ...result.rows[0], _id: result.rows[0].id };
    res.status(201).json(blog);
  } catch (err) {
    console.error('Error saving blog:', err);
    res.status(400).json({ message: err.message });
  }
});

// Get single blog
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid blog ID format' });
    }

    const result = await pool.query('SELECT * FROM blogs WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    const blog = { ...result.rows[0], _id: result.rows[0].id };
    res.json(blog);
  } catch (err) {
    console.error('Error fetching blog:', err);
    res.status(500).json({ message: err.message });
  }
});

// Update blog
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { title, content, category, tags } = req.body;
    
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid blog ID format' });
    }

    const result = await pool.query(
      `UPDATE blogs 
       SET title = $1, content = $2, category = $3, tags = $4, updated_at = CURRENT_TIMESTAMP
       WHERE id = $5
       RETURNING *`,
      [title, content, category, tags || null, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    const blog = { ...result.rows[0], _id: result.rows[0].id };
    res.json(blog);
  } catch (err) {
    console.error('Error updating blog:', err);
    res.status(400).json({ message: err.message });
  }
});

// Delete blog
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid blog ID format' });
    }

    const result = await pool.query('DELETE FROM blogs WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    res.json({ message: 'Blog post deleted successfully', blog: result.rows[0] });
  } catch (err) {
    console.error('Error deleting blog:', err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
