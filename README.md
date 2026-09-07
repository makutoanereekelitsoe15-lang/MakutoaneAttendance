# Student Attendance Management System

A simple full-stack app for managing student attendance, built with **React** (frontend), **Express** (backend/API), and **SQLite** (database).

## Project structure

```
attendance-app/
├── backend/
│   ├── server.js        # Express API + database setup
│   ├── package.json
│   └── attendance.db    # created automatically the first time you run the server
└── frontend/
    ├── src/
    │   ├── App.jsx       # form + table (insert, retrieve, update)
    │   ├── App.css
    │   └── main.jsx
    └── package.json
```

## How to run it

### 1. Start the backend
```
cd backend
npm install
npm start
```
This starts the API on `http://localhost:5000` and creates `attendance.db`, seeded with the starting students.

### 2. Start the frontend (in a new terminal)
```
cd frontend
npm install
npm run dev
```
This starts the React app, usually at `http://localhost:5173`.

## API endpoints

| Method | Endpoint             | Purpose                        |
|--------|----------------------|---------------------------------|
| GET    | /api/students        | Retrieve all students           |
| POST   | /api/students        | Insert a new student            |
| PUT    | /api/students/:id    | Update a student's status       |
