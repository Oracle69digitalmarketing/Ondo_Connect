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

app.get('/health', (req, res) => res.json({ status: 'ok', service: "service" }));

// Register an artisan
app.post('/artisans', async (req, res) => {
  const { user_id, business_name, category, qr_code } = req.body;

  if (!user_id || !business_name || !category) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO artisans (user_id, business_name, category, qr_code) VALUES ($1, $2, $3, $4) RETURNING *',
      [user_id, business_name, category, qr_code]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get artisans by category
app.get('/artisans', async (req, res) => {
  const { category } = req.query;
  let query = 'SELECT a.*, u.name as artisan_name FROM artisans a JOIN users u ON a.user_id = u.id';
  let params = [];

  if (category) {
    query += ' WHERE a.category = $1';
    params.push(category);
  }

  try {
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create a booking
app.post('/bookings', async (req, res) => {
  const { artisan_id, customer_id, service_name, price, scheduled_at } = req.body;

  if (!artisan_id || !customer_id || !service_name || !price) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO bookings (artisan_id, customer_id, service_name, price, scheduled_at) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [artisan_id, customer_id, service_name, price, scheduled_at]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get user bookings
app.get('/bookings', async (req, res) => {
  const { user_id, role } = req.query; // role: 'customer' or 'artisan'

  if (!user_id || !role) {
    return res.status(400).json({ error: 'Missing user_id or role' });
  }

  let query = 'SELECT * FROM bookings';
  if (role === 'customer') {
    query += ' WHERE customer_id = $1';
  } else {
    query += ' WHERE artisan_id = $1';
  }
  query += ' ORDER BY created_at DESC';

  try {
    const result = await pool.query(query, [user_id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`service-module running on port ${PORT}`));
