# Task Management System

A full-stack MERN application for managing tasks with priority management and user authentication.

## Features

- ✅ User Authentication (Register/Login)
- ✅ Task CRUD Operations
- ✅ Priority Management (Drag & Drop)
- ✅ Color-coded Priority System
- ✅ Task Status Updates
- ✅ Pagination
- ✅ Responsive Design
- ✅ AJAX-based Updates

## Tech Stack

- **Frontend**: React, React Router, Axios, Context API
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Authentication**: JWT, bcryptjs
- **Styling**: Custom CSS

## Installation

### Backend
1. Navigate to backend directory
2. Run `npm install`
3. Create `.env` file with:
``bash
MONGODB_URI=mongodb://localhost:27017/taskmanagement
JWT_SECRET=your_jwt_secret
PORT=500
``

4. Run `npm start`

## API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/tasks` - Get tasks (with pagination)
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `PATCH /api/tasks/:id/status` - Update status
- `PATCH /api/tasks/:id/priority` - Update priority