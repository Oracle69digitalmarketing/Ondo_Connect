const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.get('/health', (req, res) => res.json({ status: 'ok', service: "market" }));

// Get all listings with optional filtering
app.get('/listings', async (req, res) => {
  const { type, category, lga } = req.query;
  let query = 'SELECT * FROM listings WHERE status = $1';
  let params = ['active'];

  if (type) {
    params.push(type);
    query += ` AND type = $${params.length}`;
  }
  if (category) {
    params.push(category);
    query += ` AND category = $${params.length}`;
  }
  if (lga) {
    params.push(lga);
    query += ` AND lga = $${params.length}`;
  }

  query += ' ORDER BY created_at DESC';

  try {
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create a new listing
app.post('/listings', async (req, res) => {
  const { seller_id, type, category, title, description, price, unit, lga } = req.body;

  if (!seller_id || !type || !title || !price) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO listings (seller_id, type, category, title, description, price, unit, lga) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [seller_id, type, category, title, description, price, unit, lga]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get a single listing
app.get('/listings/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM listings WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`market-service running on port ${PORT}`));
