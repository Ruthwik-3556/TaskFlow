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

Database Design

TaskFlow uses PostgreSQL as its relational database.

The main tables are:

    users
      |
      +-- projects
      |
      +-- tasks
            |
            +-- comments
            |
            +-- attachments

Users

Stores registered user accounts.

Main fields:

-   id
-   name
-   email
-   password
-   created_at

Passwords are never stored as plain text. They are hashed using bcrypt.

Projects

Stores projects created by users.

Main fields:

-   id
-   name
-   description
-   user_id
-   created_at

Tasks

Stores tasks belonging to users and optionally associated with projects.

Main fields:

-   id
-   title
-   description
-   completed
-   priority
-   due_date
-   project_id
-   user_id

Comments

Stores comments associated with tasks.

Main fields:

-   id
-   content
-   user_id
-   task_id
-   created_at

Attachments

Stores information about files uploaded to tasks.

Main fields:

-   id
-   filename
-   filepath
-   task_id
-   user_id
-   uploaded_at

Authentication Flow

TaskFlow uses JWT for authentication.

The authentication process works as follows:

    User
     |
     | Register
     v
    Backend
     |
     | Hash password using bcrypt
     v
    PostgreSQL
     |
     | Store user
     v
    User
     |
     | Login
     v
    Backend
     |
     | Verify password
     v
    JWT Token
     |
     | Store token
     v
    Frontend
     |
     | Send token with API requests
     v
    Protected Backend Routes

Protected requests include the JWT token in the Authorization header.

Example:

    Authorization: Bearer <JWT_TOKEN>

API Overview

Authentication

    POST /auth/register
    POST /auth/login

Tasks

    GET    /tasks
    POST   /tasks
    PUT    /tasks/:id
    DELETE /tasks/:id

Projects

    GET    /projects
    POST   /projects
    DELETE /projects/:id

Comments

    GET  /comments/:taskId
    POST /comments/:taskId

Attachments

    GET  /attachments/:taskId
    POST /attachments/:taskId

The API uses parameterized SQL queries when communicating with
PostgreSQL.

Task Management

Each task can contain:

-   Title
-   Description
-   Priority
-   Due date
-   Completion status
-   Project association
-   Comments
-   File attachments

Tasks can be searched and filtered based on their properties.

Users can also mark tasks as completed and undo the completion.

Search and Filtering

The dashboard provides task search and filtering functionality.

Users can:

-   Search tasks by text
-   Filter by priority
-   Filter by completion status
-   Navigate through multiple pages of tasks

This keeps the interface usable when the number of tasks increases.

File Uploads

TaskFlow supports uploading files to individual tasks.

Uploaded files are associated with:

-   The task
-   The user
-   The stored filename
-   The file path
-   Upload timestamp

Security

The project implements several basic security practices:

-   Password hashing with bcrypt
-   JWT authentication
-   Protected backend routes
-   User-specific resource access
-   Parameterized PostgreSQL queries
-   Environment variables for database credentials
-   Environment variables for JWT secrets
-   .env excluded from Git using .gitignore

Sensitive configuration values are not stored directly in the source
code.

Environment Variables

The backend uses environment variables for database and authentication
configuration.

Example:

    DB_USER=your_database_user
    DB_HOST=your_database_host
    DB_NAME=your_database_name
    DB_PASSWORD=your_database_password
    DB_PORT=5432
    JWT_SECRET=your_jwt_secret

The actual credentials should never be committed to GitHub.

For the frontend, the backend API URL is configured using:

    VITE_API_URL=your_backend_url

Running the Project Locally

1. Clone the repository

    git clone https://github.com/Ruthwik-3556/TaskFlow.git
    cd TaskFlow

2. Start the backend

    cd backend
    npm install
    node server.js

The backend runs on:

    http://localhost:5000

3. Start the frontend

Open another terminal:

    cd frontend
    npm install
    npm run dev

The frontend will be available at the local Vite development URL shown
in the terminal.

PostgreSQL Setup

Create a PostgreSQL database and configure the backend environment
variables.

Create the required tables:

    CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE projects (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE tasks (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        completed BOOLEAN DEFAULT FALSE,
        priority VARCHAR(20) DEFAULT 'medium',
        due_date DATE,
        project_id INTEGER REFERENCES projects(id) ON DELETE SET NULL,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE comments (
        id SERIAL PRIMARY KEY,
        content TEXT NOT NULL,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        task_id INTEGER NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE attachments (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) NOT NULL,
        filepath TEXT NOT NULL,
        task_id INTEGER NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

Deployment

The application is deployed using Render.

Deployment architecture:

                      +----------------------+
                      |      User Browser    |
                      +----------+-----------+
                                 |
                                 v
                      +----------------------+
                      |   React Frontend     |
                      |       Render         |
                      +----------+-----------+
                                 |
                             REST API
                                 |
                                 v
                      +----------------------+
                      | Node.js + Express    |
                      |       Render         |
                      +----------+-----------+
                                 |
                                 v
                      +----------------------+
                      | PostgreSQL Database  |
                      |       Render         |
                      +----------------------+

The frontend and backend are deployed as separate Render services, while
PostgreSQL is hosted using Render PostgreSQL.

Git and Version Control

Git and GitHub are used for source code management.

The repository contains separate frontend and backend applications:

    https://github.com/Ruthwik-3556/TaskFlow

Environment files and other sensitive configuration are excluded using
.gitignore.

What I Learned

This project helped me understand:

-   Full-stack application development
-   React frontend development
-   Node.js and Express backend development
-   REST API design
-   PostgreSQL database design
-   SQL queries and relational database relationships
-   JWT authentication
-   Password hashing with bcrypt
-   Middleware in Express
-   File uploads
-   API communication using Axios
-   Search and pagination
-   Git and GitHub
-   Environment variables
-   Production deployment
-   Connecting a deployed backend to a production database
-   Deploying a React application

Future Improvements

Possible future improvements include:

-   Task editing
-   Team member invitations
-   Role-based project permissions
-   Email notifications
-   Real-time task updates
-   Drag-and-drop task boards
-   Activity history
-   Advanced project analytics

Author

Ruthwik Chetan Naik

B.Tech Computer Science and Engineering Indian Institute of Technology
Dharwad

GitHub: https://github.com/Ruthwik-3556

License

This project is created for educational and portfolio purposes.
