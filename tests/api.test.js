const request = require('supertest');
const express = require('express');
const { PrismaClient } = require('@prisma/client');

// Import app setup from server.js
const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', require('path').join(__dirname, '../views'));

// Routes from server.js
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
    "health": "ok"
  });
});

describe('Todo API Tests', () => {
  describe('GET /health', () => {
    it('should return health check status', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('health', 'ok');
    });
  });

  describe('GET /', () => {
    it('should render index page with empty todos', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toMatch(/html/);
    });

    it('should render index page with todos', async () => {
      // Create a test todo
      await prisma.todo.create({
        data: { task: 'Test todo item' }
      });

      const response = await request(app).get('/');
      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toMatch(/html/);
    });
  });

  describe('POST /todos', () => {
    it('should create a new todo', async () => {
      const response = await request(app)
        .post('/todos')
        .send({ task: 'New test todo' })
        .redirects(0);

      expect(response.status).toBe(302);

      // Verify todo was created
      const todos = await prisma.todo.findMany();
      expect(todos).toHaveLength(1);
      expect(todos[0].task).toBe('New test todo');
      expect(todos[0].completed).toBe(false);
    });

    it('should not create todo with empty task', async () => {
      const response = await request(app)
        .post('/todos')
        .send({ task: '' })
        .redirects(0);

      expect(response.status).toBe(302);

      // Verify no todo was created
      const todos = await prisma.todo.findMany();
      expect(todos).toHaveLength(0);
    });

    it('should not create todo with whitespace only', async () => {
      const response = await request(app)
        .post('/todos')
        .send({ task: '   ' })
        .redirects(0);

      expect(response.status).toBe(302);

      const todos = await prisma.todo.findMany();
      expect(todos).toHaveLength(0);
    });

    it('should trim task text', async () => {
      await request(app)
        .post('/todos')
        .send({ task: '  Trimmed todo  ' })
        .redirects(0);

      const todos = await prisma.todo.findMany();
      expect(todos[0].task).toBe('Trimmed todo');
    });
  });

  describe('POST /todos/:id/complete', () => {
    it('should toggle todo completion status from false to true', async () => {
      const todo = await prisma.todo.create({
        data: { task: 'Test todo', completed: false }
      });

      const response = await request(app)
        .post(`/todos/${todo.id}/complete`)
        .redirects(0);

      expect(response.status).toBe(302);

      const updatedTodo = await prisma.todo.findUnique({
        where: { id: todo.id }
      });
      expect(updatedTodo.completed).toBe(true);
    });

    it('should toggle todo completion status from true to false', async () => {
      const todo = await prisma.todo.create({
        data: { task: 'Test todo', completed: true }
      });

      await request(app)
        .post(`/todos/${todo.id}/complete`)
        .redirects(0);

      const updatedTodo = await prisma.todo.findUnique({
        where: { id: todo.id }
      });
      expect(updatedTodo.completed).toBe(false);
    });

    it('should handle non-existent todo id gracefully', async () => {
      const response = await request(app)
        .post('/todos/99999/complete')
        .redirects(0);

      expect(response.status).toBe(302);
    });
  });

  describe('POST /todos/:id/delete', () => {
    it('should delete a todo', async () => {
      const todo = await prisma.todo.create({
        data: { task: 'Todo to delete' }
      });

      const response = await request(app)
        .post(`/todos/${todo.id}/delete`)
        .redirects(0);

      expect(response.status).toBe(302);

      const deletedTodo = await prisma.todo.findUnique({
        where: { id: todo.id }
      });
      expect(deletedTodo).toBeNull();
    });

    it('should handle deleting non-existent todo', async () => {
      const response = await request(app)
        .post('/todos/99999/delete')
        .redirects(0);

      expect(response.status).toBe(302);
    });
  });

  describe('GET /api/todos', () => {
    it('should return empty array when no todos exist', async () => {
      const response = await request(app).get('/api/todos');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should return all todos as JSON', async () => {
      await prisma.todo.create({
        data: { task: 'First todo' }
      });
      await prisma.todo.create({
        data: { task: 'Second todo', completed: true }
      });

      const response = await request(app).get('/api/todos');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('task');
      expect(response.body[0]).toHaveProperty('completed');
      expect(response.body[0]).toHaveProperty('createdAt');
    });

    it('should return todos ordered by createdAt desc', async () => {
      const firstTodo = await prisma.todo.create({
        data: { task: 'First todo' }
      });

      // Wait a bit to ensure different timestamps
      await new Promise(resolve => setTimeout(resolve, 10));

      const secondTodo = await prisma.todo.create({
        data: { task: 'Second todo' }
      });

      const response = await request(app).get('/api/todos');

      expect(response.status).toBe(200);
      expect(response.body[0].id).toBe(secondTodo.id);
      expect(response.body[0].task).toBe('Second todo');
      expect(response.body[1].id).toBe(firstTodo.id);
      expect(response.body[1].task).toBe('First todo');
    });
  });
});

describe('Todo Model Tests', () => {
  describe('Todo CRUD operations', () => {
    it('should create a todo with all fields', async () => {
      const todo = await prisma.todo.create({
        data: {
          task: 'Complete test suite',
          completed: false
        }
      });

      expect(todo).toHaveProperty('id');
      expect(todo.task).toBe('Complete test suite');
      expect(todo.completed).toBe(false);
      expect(todo).toHaveProperty('createdAt');
    });

    it('should read a todo by id', async () => {
      const created = await prisma.todo.create({
        data: { task: 'Read test' }
      });

      const found = await prisma.todo.findUnique({
        where: { id: created.id }
      });

      expect(found).not.toBeNull();
      expect(found.task).toBe('Read test');
    });

    it('should update a todo', async () => {
      const todo = await prisma.todo.create({
        data: { task: 'Original task' }
      });

      const updated = await prisma.todo.update({
        where: { id: todo.id },
        data: { completed: true, task: 'Updated task' }
      });

      expect(updated.completed).toBe(true);
      expect(updated.task).toBe('Updated task');
    });

    it('should delete a todo', async () => {
      const todo = await prisma.todo.create({
        data: { task: 'Delete me' }
      });

      await prisma.todo.delete({
        where: { id: todo.id }
      });

      const found = await prisma.todo.findUnique({
        where: { id: todo.id }
      });

      expect(found).toBeNull();
    });

    it('should find many todos with ordering', async () => {
      await prisma.todo.create({ data: { task: 'Todo 1' } });
      await prisma.todo.create({ data: { task: 'Todo 2' } });
      await prisma.todo.create({ data: { task: 'Todo 3' } });

      const todos = await prisma.todo.findMany({
        orderBy: { createdAt: 'desc' }
      });

      expect(todos).toHaveLength(3);
      expect(todos[0].task).toBe('Todo 3');
    });
  });

  describe('Todo validations', () => {
    it('should have default completed value as false', async () => {
      const todo = await prisma.todo.create({
        data: { task: 'Default values test' }
      });

      expect(todo.completed).toBe(false);
    });

    it('should have auto-incremented id', async () => {
      const todo1 = await prisma.todo.create({ data: { task: 'First' } });
      const todo2 = await prisma.todo.create({ data: { task: 'Second' } });

      expect(todo2.id).toBeGreaterThan(todo1.id);
    });
  });
});
