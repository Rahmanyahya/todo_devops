# Two-Tier Todo List Web App

A modern, full-stack todo application built with Node.js, Express, Prisma ORM, and PostgreSQL. Features a clean, responsive UI with gradient styling and smooth animations.

## Features

- ✅ **Create** new tasks with a simple form
- ✅ **Read** and view all tasks in a clean list
- ✅ **Update** task completion status with checkbox toggle
- ✅ **Delete** tasks with one click
- 📊 **Task statistics** showing total, completed, and pending tasks
- 🎨 **Modern UI** with gradient background and smooth animations
- 📱 **Responsive design** that works on all devices
- 🔄 **Real-time updates** with server-side rendering

## Tech Stack

- **Runtime**: Node.js
- **Backend Framework**: Express.js
- **ORM**: Prisma
- **Templating Engine**: EJS
- **Database**: PostgreSQL
- **Styling**: Modern CSS with gradients and animations

## Architecture

```
┌─────────────────────────────────────┐
│     Web Application (Tier 1)        │
│  ┌──────────────────────────────┐  │
│  │   Express.js Server           │  │
│  │   - Routes (CRUD endpoints)   │  │
│  │   - EJS Views                 │  │
│  │   - Prisma Client             │  │
│  └──────────────────────────────┘  │
└──────────────┬──────────────────────┘
               │
               │ Prisma ORM
               │
┌──────────────▼──────────────────────┐
│     Database (Tier 2)               │
│  ┌──────────────────────────────┐  │
│  │   PostgreSQL                  │  │
│  │   - todos table               │  │
│  └──────────────────────────────┘  │
└─────────────────────────────────────┘
```

## Prerequisites

Before running this application, ensure you have:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **PostgreSQL** (v12 or higher) - [Download here](https://www.postgresql.org/download/)
- **npm** or **yarn** package manager

## Installation

### 1. Clone or Download the Project

```bash
cd two-layer-web-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Copy the example environment file and configure your database:

```bash
copy .env.example .env
```

Edit `.env` and update the `DATABASE_URL` with your PostgreSQL credentials:

```env
DATABASE_URL="postgresql://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/tododb"
PORT=3000
```

### 4. Create the Database

Using PostgreSQL command line or pgAdmin:

```sql
CREATE DATABASE tododb;
```

### 5. Run Database Migrations

Generate Prisma client and create the todos table:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

## Running the Application

### Development Mode (with auto-reload)

```bash
npm run dev
```

The server will start on `http://localhost:3000` and automatically restart when you make changes.

### Production Mode

```bash
npm start
```

## Usage

1. **Open the application**: Navigate to `http://localhost:3000` in your browser

2. **Add a task**: Type your task in the input field and click "Add" or press Enter

3. **Complete a task**: Click the checkbox next to a task to mark it as completed

4. **Delete a task**: Click the ✕ button to remove a task

5. **View statistics**: See total, completed, and pending tasks at the bottom

## API Endpoints

### Web Interface

- `GET /` - Main todo list page

### JSON API

- `GET /api/todos` - Get all todos as JSON
- `POST /todos` - Create a new todo
- `POST /todos/:id/complete` - Toggle todo completion status
- `POST /todos/:id/delete` - Delete a todo

## Database Schema

```prisma
model Todo {
  id        Int      @id @default(autoincrement())
  task      String
  completed Boolean  @default(false)
  createdAt DateTime @default(now())
}
```

## Project Structure

```
two-layer-web-app/
├── prisma/
│   └── schema.prisma       # Database schema definition
├── public/
│   └── css/
│       └── style.css       # Modern styling
├── views/
│   └── index.ejs           # Main UI template
├── .env.example            # Environment variables template
├── package.json            # Dependencies and scripts
├── server.js               # Main application file
└── README.md               # This file
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with nodemon |
| `npm start` | Start production server |
| `npm run prisma:generate` | Generate Prisma client |
| `npm run prisma:migrate` | Run database migrations |
| `npm run prisma:studio` | Open Prisma Studio (GUI) |

## Troubleshooting

### Database Connection Issues

If you see "Can't reach database server", ensure:
- PostgreSQL is running
- DATABASE_URL in `.env` is correct
- Database `tododb` exists

### Port Already in Use

If port 3000 is busy, change the PORT in your `.env` file:

```env
PORT=4000
```

### Prisma Client Not Found

If Prisma client is missing, run:

```bash
npx prisma generate
```

## Verification Checklist

After setup, verify everything works:

- [ ] Server starts without errors (`npm run dev`)
- [ ] Database migration succeeds
- [ ] Homepage loads at `http://localhost:3000`
- [ ] Can create new todos
- [ ] Can mark todos as complete
- [ ] Can delete todos
- [ ] API returns JSON at `/api/todos`

## License

MIT

## Author

Created as a two-tier web application demonstration.
