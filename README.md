# Task Manager - MERN Stack Application

[Live Demo](https://vaishali-task-manager-app.netlify.app)

## Features
- User Authentication (Register / Login) with JWT
- Dashboard with Tasks Table & Modals
- CRUD Operations for Tasks
- Analytics Charts using Chart.js
- Responsive Design with Mobile Drawer
- Dark Mode Support
- Pagination & Search Filters

## API Endpoints
- `POST /api/auth/register` – Register a new user
- `POST /api/auth/login` – Login and get JWT
- `GET /api/tasks` – List tasks with filters & pagination
- `POST /api/tasks` – Create a task
- `PUT /api/tasks/:id` – Update a task
- `DELETE /api/tasks/:id` – Delete a task
- `GET /api/analytics` – Fetch charts data

## Tech Stack
- Frontend: React + Vite, Tailwind CSS, DaisyUI
- Backend: Node.js, Express
- Database: MongoDB Atlas
- Charts: Chart.js, React-ChartJS-2
- Authentication: JWT



## Installation
```bash
git clone https://github.com/vaishali0312/task-manager.git
cd frontend
npm install
npm run dev
