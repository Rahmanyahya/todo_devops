require('dotenv').config();
const express = require('express');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes

// GET / - Render todo list
app.get('/', async (req, res) => {
  try {
    const todos = await prisma.todo.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.render('index', { todos });
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.render('index', { todos: [], error: 'Failed to load todos' });
  }
});

// POST /todos - Create todo
app.post('/todos', async (req, res) => {
  try {
    const { task } = req.body;
    if (!task || task.trim() === '') {
      return res.redirect('/');
    }
    await prisma.todo.create({
      data: { task: task.trim() }
    });
    res.redirect('/');
  } catch (error) {
    console.error('Error creating todo:', error);
    res.redirect('/');
  }
});

// POST /todos/:id/complete - Toggle completed status
app.post('/todos/:id/complete', async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await prisma.todo.findUnique({
      where: { id: parseInt(id) }
    });

    if (todo) {
      await prisma.todo.update({
        where: { id: parseInt(id) },
        data: { completed: !todo.completed }
      });
    }
    res.redirect('/');
  } catch (error) {
    console.error('Error updating todo:', error);
    res.redirect('/');
  }
});

// POST /todos/:id/delete - Delete todo
app.post('/todos/:id/delete', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.todo.delete({
      where: { id: parseInt(id) }
    });
    res.redirect('/');
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.redirect('/');
  }
});

// GET /api/todos - JSON API endpoint
app.get('/api/todos', async (req, res) => {
  try {
    const todos = await prisma.todo.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(todos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

app.get('/health', async (req, res) => {
    return res.status(200).json({
        "helath": "ok"
    })
})

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});
