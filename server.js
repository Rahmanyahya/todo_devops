require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

// PostgreSQL connection pool
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Set EJS as templating engine
app.set('view engine', 'ejs');

// Routes
app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM todos ORDER BY created_at DESC');
    res.render('index', { todos: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).send('Database error');
  }
});

app.post('/add', async (req, res) => {
  const { task } = req.body;
  try {
    await pool.query('INSERT INTO todos (task, completed) VALUES ($1, $2)', [task, false]);
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error adding todo');
  }
});

app.post('/complete/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('UPDATE todos SET completed = NOT completed WHERE id = $1', [id]);
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating todo');
  }
});

app.post('/delete/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM todos WHERE id = $1', [id]);
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting todo');
  }
});

app.post('/update/:id', async (req, res) => {
  const { id } = req.params;
  const { task } = req.body;
  try {
    await pool.query('UPDATE todos SET task = $1 WHERE id = $2', [task, id]);
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating todo');
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await pool.end();
  process.exit(0);
});
