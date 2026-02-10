# Simple Todo App

A basic todo application built with Express.js, EJS, and PostgreSQL using raw SQL queries.

## Prerequisites

- Node.js installed
- PostgreSQL installed and running

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up the database:**
   ```bash
   # Login to PostgreSQL
   psql -U postgres

   # Run the init-db.sql commands or execute:
   createdb todo_db
   psql -U postgres -d todo_db -f init-db.sql
   ```

3. **Configure environment variables:**
   ```bash
   # Copy the example file
   cp .env.example .env

   # Edit .env with your database credentials
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=todo_db
   DB_USER=your_username
   DB_PASSWORD=your_password
   PORT=3000
   ```

4. **Run the application:**
   ```bash
   # For development (with auto-reload)
   npm run dev

   # For production
   npm start
   ```

5. **Open your browser:**
   Navigate to `http://localhost:3000`

## Features

- Add new todos
- Mark todos as complete/incomplete
- Delete todos
- Simple, clean interface
- Raw PostgreSQL queries (no ORM)

## Database Schema

```sql
CREATE TABLE todos (
  id SERIAL PRIMARY KEY,
  task VARCHAR(255) NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | / | Display all todos |
| POST | /add | Add a new todo |
| POST | /complete/:id | Toggle todo completion |
| POST | /delete/:id | Delete a todo |
