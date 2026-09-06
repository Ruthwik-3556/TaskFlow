# TaskFlow - Full-Stack Task Management and Collaboration Platform

TaskFlow is a full-stack task management and collaboration platform that allows authenticated users to create projects, manage tasks, track progress, add comments, and upload task attachments.

The application is built using React, Node.js, Express.js, and PostgreSQL, with JWT-based authentication and a RESTful backend API.

## Live Demo

Frontend:
https://taskflow-frontend-mqli.onrender.com

Backend:
https://taskflow-backend-8sc7.onrender.com

## Features

- User registration and login
- JWT-based authentication
- Secure password hashing using bcrypt
- Protected API routes
- User-specific tasks and projects
- Create and manage projects
- Create tasks with descriptions
- Task priorities
- Task due dates
- Mark tasks as completed
- Undo completed tasks
- Search tasks
- Filter tasks by priority
- Filter tasks by status
- Pagination
- Add comments to tasks
- Upload file attachments to tasks
- PostgreSQL relational database
- RESTful API architecture
- Responsive web interface
- Frontend and backend deployed separately

## Screenshots

### Login

<!-- Upload your login screenshot to the repository and replace the path below -->

![Login Screenshot](screenshots/login.png)


### Register

<!-- Upload your register screenshot to the repository and replace the path below -->

![Register Screenshot](screenshots/register.png)


### Dashboard

<!-- Upload your dashboard screenshot to the repository and replace the path below -->

![Dashboard Screenshot](screenshots/dashboard.png)


### Project Tasks

<!-- Upload your project/task screenshot to the repository and replace the path below -->

![Project Tasks Screenshot](screenshots/project-tasks.png)


### Comments and Attachments

<!-- Upload your comments and attachments screenshot to the repository and replace the path below -->

![Comments and Attachments Screenshot](screenshots/comments-attachments.png)

## Technology Stack

### Frontend

- React
- Vite
- Axios
- JavaScript
- HTML
- CSS

### Backend

- Node.js
- Express.js
- REST APIs
- JWT
- bcrypt
- Multer

### Database

- PostgreSQL

### Deployment

- Render
- GitHub

## Project Architecture

The project is divided into two main parts:

```text
TaskFlow/
|
+-- backend/
|   |
|   +-- middleware/
|   |   +-- authMiddleware.js
|   |
|   +-- routes/
|   |   +-- auth.js
|   |   +-- tasks.js
|   |   +-- projects.js
|   |   +-- comments.js
|   |   +-- attachments.js
|   |
|   +-- uploads/
|   +-- db.js
|   +-- server.js
|   +-- package.json
|
+-- frontend/
    |
    +-- src/
    |   |
    |   +-- components/
    |   |   +-- Navbar.jsx
    |   |
    |   +-- pages/
    |   |   +-- Dashboard.jsx
    |   |   +-- Login.jsx
    |   |   +-- Register.jsx
    |   |
    |   +-- services/
    |       +-- api.js
    |
    +-- package.json
