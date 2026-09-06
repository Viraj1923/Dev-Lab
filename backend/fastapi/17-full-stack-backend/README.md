# 🚀 DevBoard API

> A Dockerized REST API built with **FastAPI**, **PostgreSQL**, **SQLAlchemy**, and **JWT authentication** for managing users, projects, and tasks.

---

## 📌 Overview

**DevBoard API** is a backend project designed around a simple project-management workflow:

```text
👤 User
  │
  ├── 🔐 Register / Login
  │
  └── 📁 Projects
        │
        └── ✅ Tasks
```

The API provides:

- 🔐 User registration and JWT-based login
- 👤 Authenticated user information
- 📁 Project CRUD operations
- ✅ Task CRUD operations
- 🔒 Ownership-based authorization for projects and tasks
- 🗄️ PostgreSQL persistence
- 🐳 Docker and Docker Compose support
- 🧪 Automated API tests with pytest
- 📚 Interactive Swagger UI documentation

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **Python 3.10** | Application runtime |
| **FastAPI** | REST API framework |
| **Pydantic** | Request/response validation |
| **SQLAlchemy** | ORM and database access |
| **PostgreSQL 16** | Relational database |
| **python-jose** | JWT creation and decoding |
| **Passlib + bcrypt** | Password hashing and verification |
| **Uvicorn** | ASGI server |
| **pytest** | Automated testing |
| **Docker** | Application containerization |
| **Docker Compose** | Local API + PostgreSQL orchestration |

---

# ✨ Features

## 🔐 Authentication

### Register

```http
POST /auth/register
```

Creates a new user after validating the request and hashing the password.

### Login

```http
POST /auth/login
```

Validates the user's credentials and returns a JWT access token.

Example response:

```json
{
  "access_token": "<JWT_TOKEN>",
  "token_type": "bearer"
}
```

### Current User

```http
GET /auth/me
```

Returns the authenticated user's information.

Protected endpoints require:

```http
Authorization: Bearer <access_token>
```

---

## 📁 Project Management

All project endpoints require authentication.

### Create a project

```http
POST /projects/
```

### Get all projects

```http
GET /projects/all_projects
```

Returns projects owned by the authenticated user.

### Get a project

```http
GET /projects/{project_id}
```

### Update a project

```http
PUT /projects/{project_id}
```

### Delete a project

```http
DELETE /projects/{project_id}
```

Projects are associated with their owner through `owner_id`.

---

## ✅ Task Management

Tasks belong to projects and are also protected by authentication and ownership checks.

### Create a task

```http
POST /tasks/
```

A task requires a valid project owned by the authenticated user.

### Get a task

```http
GET /tasks/{task_id}
```

### Get all tasks for a project

```http
GET /tasks/project/{project_id}
```

### Update a task

```http
PUT /tasks/{task_id}
```

### Delete a task

```http
DELETE /tasks/{task_id}
```

### Task statuses

Tasks support three statuses:

```text
📝 todo
🔄 in_progress
✅ completed
```

---

# 🔒 Authorization Model

Authentication and authorization are separate responsibilities in the API.

### Authentication

JWT tokens identify the authenticated user.

### Authorization

Project and task operations verify that the authenticated user owns the relevant project.

For example:

```text
User A
 └── Project 1
       └── Task 1

User B
 └── Project 2
       └── Task 2
```

User B cannot modify or delete User A's project or its tasks.

Unauthorized access is rejected with an appropriate HTTP error.

---

# 🗄️ Database

The project uses **PostgreSQL 16** with SQLAlchemy.

The database contains three main entities:

```text
users
  │
  └── projects
        │
        └── tasks
```

### User

- `id`
- `name`
- `email`
- `password_hash`

### Project

- `id`
- `name`
- `description`
- `owner_id`

### Task

- `id`
- `title`
- `description`
- `status`
- `project_id`

Foreign-key relationships connect users → projects and projects → tasks.

---

# ⚙️ Configuration

Configuration is handled through **Pydantic Settings** and environment variables.

Create a local `.env` file:

```env
app_name=DevBoard API
database_url=postgresql://<username>:<password>@<host>:<port>/<database>
secret_key=<your-secret-key>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

For Docker Compose, the PostgreSQL service expects:

```env
POSTGRES_USER=<your-postgres-username>
POSTGRES_PASSWORD=<your-postgres-password>
POSTGRES_DB=<your-database-name>

```

⚠️ **Never commit real secrets or production database credentials to GitHub.**

For production, use your hosting provider's environment-variable/secret management instead of storing secrets in source control.

---

# 🐳 Running with Docker

Make sure Docker Desktop is running.

From the project directory:

```bash
docker compose up -d --build
```

Check the running containers:

```bash
docker ps
```

The services are:

```text
devboard-api
devboard-db
```

The API is exposed on:

```text
http://localhost:8000
```

PostgreSQL is exposed locally on:

```text
localhost:5433
```

To stop the services:

```bash
docker compose down
```

The PostgreSQL data is stored in the named Docker volume:

```text
postgres_data
```

---

# 📚 Swagger API Documentation

FastAPI automatically provides interactive API documentation.

Open:

```text
http://localhost:8000/docs
```

Swagger UI can be used to:

1. 🔐 Register a user
2. 🔑 Login and obtain a JWT
3. 🛡️ Authenticate protected requests
4. 📁 Create and manage projects
5. ✅ Create and manage tasks
6. 🧪 Manually test API responses

Alternative documentation is available at:

```text
http://localhost:8000/redoc
```

---

# 🧪 Automated Testing

The project contains automated tests for authentication, projects, and tasks.

Run the complete test suite:

```bash
pytest tests -v
```

Current test coverage includes:

### Authentication

- User registration
- User login

### Projects

- Create project
- Get all projects
- Get project
- Update project
- Delete project

### Tasks

- Create task
- Get task
- Get project tasks
- Update task
- Delete task
- Reject task creation for a nonexistent project

The complete suite currently passes:

```text
13 passed
```

---

# 📂 Project Structure

```text
17-full-stack-backend/
│
├── app/
│   ├── core/
│   │   ├── config.py
│   │   ├── dependencies.py
│   │   ├── exceptions.py
│   │   ├── jwt.py
│   │   └── security.py
│   │
│   ├── database/
│   │   ├── database.py
│   │   ├── init_db.py
│   │   └── models.py
│   │
│   ├── dependencies/
│   │   └── auth.py
│   │
│   ├── routers/
│   │   ├── auth.py
│   │   ├── projects.py
│   │   └── tasks.py
│   │
│   ├── schemas/
│   │   ├── project.py
│   │   ├── task.py
│   │   └── user.py
│   │
│   └── main.py
│
├── tests/
│   ├── test_auth.py
│   ├── test_projects.py
│   └── test_tasks.py
│
├── .dockerignore
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
└── README.md
```

---

# 🔄 Request Flow

A typical authenticated request follows this flow:

```text
Client
  │
  │  Bearer JWT
  ▼
FastAPI Router
  │
  ▼
Authentication Dependency
  │
  ├── ❌ Invalid token → 401
  │
  └── ✅ User ID
          │
          ▼
     Authorization Check
          │
          ├── ❌ Not owner → 403
          │
          └── ✅ Continue
                  │
                  ▼
             SQLAlchemy
                  │
                  ▼
              PostgreSQL
```

---

# 🧩 API Summary

| Area | Endpoint | Method | Auth |
|---|---|---:|:---:|
| Authentication | `/auth/register` | POST | ❌ |
| Authentication | `/auth/login` | POST | ❌ |
| Authentication | `/auth/me` | GET | ✅ |
| Projects | `/projects/` | POST | ✅ |
| Projects | `/projects/all_projects` | GET | ✅ |
| Projects | `/projects/{project_id}` | GET | ✅ |
| Projects | `/projects/{project_id}` | PUT | ✅ |
| Projects | `/projects/{project_id}` | DELETE | ✅ |
| Tasks | `/tasks/` | POST | ✅ |
| Tasks | `/tasks/{task_id}` | GET | ✅ |
| Tasks | `/tasks/project/{project_id}` | GET | ✅ |
| Tasks | `/tasks/{task_id}` | PUT | ✅ |
| Tasks | `/tasks/{task_id}` | DELETE | ✅ |

---

# 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd 17-full-stack-backend
```

### 2. Configure environment variables

Create `.env` using the configuration shown above.

### 3. Start the application

```bash
docker compose up -d --build
```

### 4. Open Swagger UI

```text
http://localhost:8000/docs
```

### 5. Run tests

```bash
pytest tests -v
```

---

# 🎯 Project Goals

DevBoard was built to practice and demonstrate core backend engineering concepts:

- REST API design
- Authentication and JWT
- Authorization and ownership checks
- Password security
- Request/response validation
- Relational database modeling
- ORM-based database operations
- Dependency injection
- Exception handling
- Automated API testing
- Containerization
- Environment-based configuration

---

# 📌 Current Scope

The current project is a **backend-focused application**.

There is no frontend client included. The API can be interacted with directly through:

- 📚 Swagger UI
- 🔗 REST API clients
- 🧪 Automated tests

Database migration tooling such as **Alembic is not included in the current implementation**; the project currently contains `init_db.py` for creating the SQLAlchemy-defined tables.

---

# 🏁 Status

**DevBoard Backend — Completed ✅**

```text
Authentication       ✅
Authorization       ✅
PostgreSQL          ✅
Project CRUD        ✅
Task CRUD           ✅
Docker              ✅
Swagger UI          ✅
Automated Tests     ✅
Production Cleanup  ✅
```

---

## 👨‍💻 Built With

**FastAPI • PostgreSQL • SQLAlchemy • JWT • Docker • pytest**

> Built as a full-stack-backend learning project with a focus on practical API development and backend engineering fundamentals.
