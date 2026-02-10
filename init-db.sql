-- Create database
CREATE DATABASE todo_db;

-- Connect to todo_db and create todos table
\c todo_db;

CREATE TABLE todos (
  id SERIAL PRIMARY KEY,
  task VARCHAR(255) NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
