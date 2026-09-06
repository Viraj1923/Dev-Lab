# 🚀 FastAPI Backend Development

> A structured, hands-on FastAPI learning module covering the journey from API fundamentals to authentication, databases, testing, async programming, WebSockets, deployment, and a complete backend project.

---

## 📚 Overview

This directory contains **17 progressive FastAPI modules** built as practical exercises and examples.

The goal is not to memorize FastAPI syntax. Each module focuses on a specific backend concept and builds toward the final project:

```text
01 Basics
   ↓
02 Project Structure
   ↓
03 Authentication
   ↓
04 Error Handling
   ↓
05 Middleware
   ↓
06 Dependency Injection
   ↓
07 Pydantic & API Design
   ↓
08 SQLAlchemy Relationships
   ↓
09 Testing
   ↓
10 Transactions
   ↓
11 Async Programming
   ↓
12 Configuration & Security
   ↓
13 Background Tasks & Lifespan
   ↓
14 File Uploads & Forms
   ↓
15 WebSockets
   ↓
16 Production & Deployment
   ↓
17 Full-Stack Backend 🏁
```

---

# 🗂️ Module Structure

| # | Module | Focus |
|---|---|---|
| 01 | `01-basics` | FastAPI fundamentals and core API concepts |
| 02 | `02-project-structure` | Organizing a FastAPI application |
| 03 | `03-authentication` | Password hashing and JWT authentication |
| 04 | `04-error-handling` | HTTP errors and custom exception handling |
| 05 | `05-middleware` | Middleware and CORS |
| 06 | `06-dependency-injection` | FastAPI dependencies and resource cleanup |
| 07 | `07-pydantic-api-design` | Request/response models and API validation |
| 08 | `08-sqlalchemy-relationships` | SQLAlchemy relationships and loading strategies |
| 09 | `09-testing` | Unit, integration, authentication, and external-service testing |
| 10 | `10-transactions` | Database transactions and integrity |
| 11 | `11-async` | Async endpoints, async database access, and concurrent work |
| 12 | `12-configuration-security` | Settings, environment variables, and CORS configuration |
| 13 | `13-background-tasks-lifespan` | Background tasks and application lifecycle |
| 14 | `14-file-uploads-forms` | File uploads, forms, validation, and size restrictions |
| 15 | `15-websockets` | WebSocket connections and real-time communication |
| 16 | `16-production-deployment` | Docker, Docker Compose, and PostgreSQL deployment concepts |
| 17 | `17-full-stack-backend` | Complete project combining the backend concepts |

---

# 01 · 🟢 FastAPI Basics

**Directory:** `01-basics`

The starting point for learning FastAPI.

### Concepts covered

- Creating a FastAPI application
- Basic GET endpoints
- Path parameters
- Request bodies
- Pydantic validation
- Nested response data
- HTTP status codes
- Error responses
- Dependencies
- Async endpoints
- Middleware

The module contains progressively introduced examples rather than one large application.

---

# 02 · 🧱 Project Structure

**Directory:** `02-project-structure`

This module moves from small examples toward a more organized FastAPI application.

### Concepts covered

- Separating application concerns
- Database configuration
- SQLAlchemy models
- Pydantic schemas
- Routers
- User-related endpoints
- Product-related endpoints
- Database initialization

Example structure:

```text
02-project-structure/
├── database.py
├── init_db.py
├── main.py
├── models/
│   └── user.py
├── routers/
│   ├── products.py
│   └── users.py
└── schemas/
    └── user.py
```

---

# 03 · 🔐 Authentication

**Directory:** `03-authentication`

Authentication is introduced using password hashing and JWT tokens.

### Concepts covered

- User registration
- Password hashing
- Password verification
- Login
- JWT creation
- JWT decoding
- Authentication dependencies
- Protected routes
- Pydantic authentication schemas

Key components include:

```text
auth.py
password.py
jwt.py
routers/
schemas/
models/
```

The module demonstrates the foundation later used by the final backend project.

---

# 04 · ⚠️ Error Handling

**Directory:** `04-error-handling`

This module focuses on handling errors cleanly instead of allowing application failures to leak directly to clients.

### Concepts covered

- `HTTPException`
- HTTP status codes
- Validation errors
- Custom exceptions
- Custom exception handlers
- Structured error responses

Example application behavior includes custom handling for invalid request data and missing resources.

---

# 05 · 🧩 Middleware

**Directory:** `05-middleware`

Middleware runs around incoming HTTP requests and outgoing responses.

### Concepts covered

- FastAPI HTTP middleware
- Request logging
- Request processing time
- Response headers
- CORS configuration

The example middleware records:

```text
Request → processing → response
```

and exposes processing time through a response header.

---

# 06 · 💉 Dependency Injection

**Directory:** `06-dependency-injection`

FastAPI's dependency system is explored through simple and nested dependencies.

### Concepts covered

- `Depends`
- Dependency functions
- Nested dependencies
- Shared logic
- Yield-based dependencies
- Resource creation and cleanup

The module demonstrates how dependencies can prepare resources before an endpoint runs and clean them up afterward.

---

# 07 · 🧪 Pydantic & API Design

**Directory:** `07-pydantic-api-design`

This module focuses on designing API contracts using Pydantic models.

### Concepts covered

- Request models
- Response models
- Nested models
- Optional fields
- Lists of models
- Field validation
- Path parameters
- Query parameters
- Structured API data

Examples include models such as:

```text
Address
Item
Order
User
UserCreate
UserUpdate
```

The emphasis is on defining clear, validated request and response structures.

---

# 08 · 🔗 SQLAlchemy Relationships

**Directory:** `08-sqlalchemy-relationships`

This module goes deeper into SQLAlchemy ORM relationships.

### Concepts covered

- One-to-one relationships
- One-to-many relationships
- Foreign keys
- SQLAlchemy `relationship()`
- `back_populates`
- Lazy loading
- Joined loading
- `selectinload`
- JOIN queries
- Relationship filtering
- N+1 query problems
- Counting related records

The examples use multiple related models such as:

```text
User
 ├── Profile
 ├── Posts
 └── Courses

Course
 └── Users
```

This module focuses heavily on understanding how related data is loaded from the database.

---

# 09 · 🧪 Testing

**Directory:** `09-testing`

Automated testing is introduced with pytest and FastAPI's testing utilities.

### Concepts covered

- `pytest`
- FastAPI `TestClient`
- Test fixtures
- Unit tests
- Integration tests
- Authentication tests
- Protected endpoints
- External service testing
- External service failure testing

The module contains:

```text
tests/
├── test_auth.py
├── test_calculator.py
├── test_external.py
├── test_integration.py
└── test_users.py
```

This provides the foundation for automated verification of backend behavior.

---

# 10 · 💾 Transactions

**Directory:** `10-transactions`

This module explores database consistency and transactional behavior.

### Concepts covered

- Database transactions
- `commit()`
- `rollback()`
- SQLAlchemy transactions
- Refreshing database objects
- Foreign-key constraints
- Unique constraints
- Integrity errors
- N+1 query considerations

The examples demonstrate how database operations behave when multiple changes need to succeed or fail together.

---

# 11 · ⚡ Async Programming

**Directory:** `11-async`

Async programming is explored from Python fundamentals through FastAPI and SQLAlchemy.

### Concepts covered

- `async` / `await`
- `asyncio`
- Sequential vs concurrent execution
- `asyncio.gather()`
- Async HTTP requests
- `httpx.AsyncClient`
- Async SQLAlchemy engine
- `AsyncSession`
- Async database queries

The module also contains a final async API example combining:

```text
FastAPI
    +
Async SQLAlchemy
    +
Async HTTP client
```

---

# 12 · ⚙️ Configuration & Security

**Directory:** `12-configuration-security`

This module introduces centralized application configuration.

### Concepts covered

- Environment variables
- `.env` files
- `python-dotenv`
- Pydantic Settings
- Configuration models
- Secret configuration
- Database configuration
- CORS configuration

The examples demonstrate moving configuration away from hard-coded application values.

### 🔒 Security principle

Secrets should be supplied through environment variables or a secret-management system rather than committed directly to source control.

---

# 13 · ⏳ Background Tasks & Lifespan

**Directory:** `13-background-tasks-lifespan`

This module covers work that happens outside the main request-response operation and application lifecycle management.

### Concepts covered

- FastAPI `BackgroundTasks`
- Background task execution
- Startup behavior
- Shutdown behavior
- Application lifecycle
- Lifespan context managers
- Resource initialization
- Resource cleanup

The final example combines application lifespan management with background work.

---

# 14 · 📁 File Uploads & Forms

**Directory:** `14-file-uploads-forms`

This module introduces handling files and multipart form data.

### Concepts covered

- `UploadFile`
- `File`
- `Form`
- Multipart form requests
- File type validation
- File size restrictions
- Saving uploaded files
- Combining form fields with uploaded files

The examples include PDF upload validation and an application-style form workflow.

---

# 15 · 🔌 WebSockets

**Directory:** `15-websockets`

WebSockets introduce persistent, bidirectional communication.

### Concepts covered

- WebSocket endpoints
- WebSocket handshake
- Persistent connections
- Sending and receiving messages
- Disconnect handling
- Connection management
- Broadcasting messages
- Multiple WebSocket clients

The chat example uses a connection manager to keep track of active clients.

Conceptually:

```text
Client 1 ─────┐
              │
Client 2 ─────┼──→ FastAPI WebSocket Server
              │
Client 3 ─────┘
```

---

# 16 · 🐳 Production & Deployment

**Directory:** `16-production-deployment`

This module introduces containerization and deployment-oriented application setup.

### Concepts covered

- Dockerfile
- Docker image creation
- Docker containers
- Docker Compose
- PostgreSQL container
- Environment-based configuration
- Database connectivity
- Health checks

The module includes:

```text
16-production-deployment/
├── .dockerignore
├── Dockerfile
├── compose.yaml
├── main.py
└── requirements.txt
```

The database is provided through PostgreSQL and the API is containerized separately.

---

# 17 · 🚀 Full-Stack Backend

**Directory:** `17-full-stack-backend`

The final module brings the backend concepts together into one complete REST API.

### 🏗️ Stack

```text
FastAPI
   ↓
Pydantic
   ↓
SQLAlchemy
   ↓
PostgreSQL
   ↓
JWT Authentication
   ↓
Docker / Docker Compose
   ↓
Pytest
```

### Features

- 👤 User registration
- 🔐 User login
- 🎟️ JWT access tokens
- 👨‍💻 Current-user authentication
- 📁 Project CRUD
- ✅ Task CRUD
- 🔗 User → Project → Task relationships
- 🛡️ Owner-based authorization
- ⚠️ Custom exception handling
- ⚙️ Environment-based configuration
- 🐳 Dockerized API
- 🐘 PostgreSQL database
- 🧪 Automated API tests
- 📖 Swagger UI / OpenAPI documentation

### Project structure

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
└── requirements.txt
```

---

## 🔐 Authentication Flow

The final backend uses JWT-based authentication.

```text
Register
   ↓
Password is hashed
   ↓
User stored in PostgreSQL
   ↓
Login
   ↓
Credentials verified
   ↓
JWT access token generated
   ↓
Bearer token sent with protected requests
   ↓
Token decoded
   ↓
Current user identified
```

Protected project and task operations use the authenticated user's ID.

---

## 👤 → 📁 → ✅ Data Model

The final application follows a simple ownership hierarchy:

```text
User
 │
 └── Projects
       │
       └── Tasks
```

### User

```text
id
name
email
password_hash
```

### Project

```text
id
name
description
owner_id
```

### Task

```text
id
title
description
status
project_id
```

A project belongs to a user, and a task belongs to a project.

---

## 🧪 Final Test Coverage

The final project contains automated tests for:

### Authentication

- User registration
- User login

### Projects

- Create project
- Get all projects
- Get a project
- Update project
- Delete project

### Tasks

- Create task
- Get task
- Get all tasks for a project
- Update task
- Delete task
- Creating a task for a nonexistent project

Run the complete suite with:

```bash
pytest tests -v
```

---

## 🐳 Running the Final Backend

From:

```text
17-full-stack-backend/
```

start the services:

```bash
docker compose up -d
```

Check running containers:

```bash
docker ps
```

The application exposes:

```text
http://localhost:8000
```

Swagger UI:

```text
http://localhost:8000/docs
```

OpenAPI schema:

```text
http://localhost:8000/openapi.json
```

Stop the services:

```bash
docker compose down
```

---

## ⚙️ Local Configuration

The final backend reads configuration from environment variables.

Create a local `.env` file with the required configuration:

```env
app_name=DevBoard API
database_url=postgresql://postgres:postgres@127.0.0.1:5433/appdb
secret_key=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

For Docker Compose, the API uses the database service hostname:

```text
postgresql://postgres:postgres@db:5432/appdb
```

### ⚠️ Important

Never commit real secrets, production database credentials, or other sensitive values to GitHub.

Use environment variables or your deployment platform's secret-management system for production.

---

# 🧭 Learning Path

The modules are intentionally arranged from simpler concepts to more complete backend development.

### Phase 1 — Fundamentals

```text
01 Basics
02 Project Structure
03 Authentication
04 Error Handling
```

Build the basic mental model of a FastAPI application.

### Phase 2 — Application Architecture

```text
05 Middleware
06 Dependency Injection
07 Pydantic & API Design
08 SQLAlchemy Relationships
```

Learn how real applications are structured and how API, validation, and database layers interact.

### Phase 3 — Reliability & Database Engineering

```text
09 Testing
10 Transactions
```

Learn to verify application behavior and maintain database consistency.

### Phase 4 — Advanced FastAPI

```text
11 Async
12 Configuration & Security
13 Background Tasks & Lifespan
14 File Uploads & Forms
15 WebSockets
```

Move beyond standard CRUD APIs into asynchronous work, lifecycle management, file handling, and real-time communication.

### Phase 5 — Deployment

```text
16 Production & Deployment
```

Learn how the application moves from local development toward a containerized environment.

### Phase 6 — Capstone

```text
17 Full-Stack Backend 🚀
```

Combine the core backend concepts into a complete FastAPI + PostgreSQL application.

---

# 🧰 Technologies Used

- 🐍 Python
- ⚡ FastAPI
- 📦 Pydantic
- 🗄️ SQLAlchemy
- 🐘 PostgreSQL
- 🔐 JWT
- 🔑 Passlib / bcrypt
- 🧪 Pytest
- 🌐 HTTPX
- ⚙️ Pydantic Settings
- 🐳 Docker
- 🧩 Docker Compose
- 🔌 WebSockets

---

# 🎯 What This Module Covers

By completing these 17 modules, the backend journey progresses through:

```text
API Fundamentals
      ↓
Application Structure
      ↓
Authentication
      ↓
Validation & Error Handling
      ↓
Middleware & Dependencies
      ↓
Database Relationships
      ↓
Testing
      ↓
Transactions
      ↓
Async Programming
      ↓
Configuration & Security
      ↓
Background Work & Lifespan
      ↓
File Handling
      ↓
Real-Time Communication
      ↓
Containerization & Deployment
      ↓
Complete Backend Application 🚀
```

---

## 🏁 Final Outcome

**Module 17 is the capstone of this FastAPI section.**

The earlier modules build the individual concepts; the final project demonstrates how those concepts fit together in a structured backend application.

```text
17 modules
   +
FastAPI
   +
PostgreSQL
   +
SQLAlchemy
   +
JWT
   +
Pytest
   +
Docker
   =
Complete Backend Foundation 🚀
```

---

## 📌 Status

**FastAPI Module: 01 → 17 ✅ Complete**

The repository now contains both the individual learning modules and a complete capstone backend demonstrating the concepts learned throughout the section.

---

### 👨‍💻 Dev-Lab

Part of the broader **Dev-Lab backend development journey** — built through progressive, hands-on implementation rather than theory alone.
