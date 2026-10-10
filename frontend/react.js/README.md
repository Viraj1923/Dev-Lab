# Dev-Lab

A hands-on development repository for learning and building full-stack applications. The repository includes backend learning modules and **DevBoard**, a full-stack project-management application built with React, FastAPI, and PostgreSQL.

## DevBoard

DevBoard lets users register and sign in, manage their projects and tasks, and view an overview of their workspace.

### Features

- User registration and login with JWT authentication
- Protected application routes and session restoration
- Project CRUD (create, read, update, delete)
- Task CRUD with `todo`, `in_progress`, and `completed` statuses
- Dashboard statistics calculated from project/task API data
- Ownership checks on protected project and task operations
- PostgreSQL persistence
- Docker Compose for the API and database
- Responsive React UI with loading, error, and empty states
- Interactive API documentation through Swagger UI

### Tech stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite, React Router, Tailwind CSS |
| Backend | Python, FastAPI, Pydantic, SQLAlchemy |
| Database | PostgreSQL 16 |
| Authentication | JWT bearer tokens, password hashing |
| Local infrastructure | Docker, Docker Compose |
| Backend tests | pytest |

## Repository structure

```text
Dev-Lab/
├── backend/
│   └── fastapi/
│       ├── 01-basics/
│       ├── 02-project-structure/
│       ├── ...
│       └── 17-full-stack-backend/
│           ├── app/
│           │   ├── core/
│           │   ├── database/
│           │   ├── dependencies/
│           │   ├── routers/
│           │   ├── schemas/
│           │   └── main.py
│           ├── tests/
│           ├── Dockerfile
│           ├── docker-compose.yml
│           └── README.md
├── frontend/
│   └── react.js/
│       ├── src/
│       │   ├── api/
│       │   ├── app/
│       │   ├── components/
│       │   ├── context/
│       │   └── pages/
│       ├── package.json
│       └── README.md
└── README.md
```

## Run DevBoard locally

### Prerequisites

Install and start:

- Git
- Docker Desktop
- Node.js with npm

The backend uses Docker Compose to run the API and PostgreSQL. The frontend runs with the Vite development server.

### 1. Configure the backend environment

Open a Windows CMD terminal in the repository root:

```bat
cd /d D:\SDE\Development\Dev-Lab\backend\fastapi\17-full-stack-backend
```

Create a local `.env` file in this directory. Do not commit this file. Set the variables expected by the backend and Docker Compose:

```env
POSTGRES_USER=devboard_user
POSTGRES_PASSWORD=replace_with_a_strong_local_password
POSTGRES_DB=devboard
app_name=DevBoard API
secret_key=replace_with_a_long_random_secret
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

Use values appropriate for your local environment. The Compose configuration supplies the container database URL to the API; the PostgreSQL service is exposed on host port `5433`.

### 2. Start the backend and database

Make sure Docker Desktop is running, then execute:

```bat
docker compose up -d --build
```

Useful commands:

```bat
docker compose ps
docker compose logs -f api
docker compose down
```

The API is available at `http://localhost:8000`.

Interactive API documentation:

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

PostgreSQL is exposed to the host at `localhost:5433`; the API connects to the database service inside Docker Compose.

### 3. Start the frontend

Open a **second** CMD terminal from the repository root:

```bat
cd /d D:\SDE\Development\Dev-Lab\frontend\react.js
npm install
```

Create a local `.env` file in `frontend/react.js/` only if you need to override the API URL:

```env
VITE_API_URL=http://localhost:8000
```

The frontend defaults to `http://localhost:8000`, so this variable is optional for the standard local setup.

Start Vite:

```bat
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

### 4. Build and lint the frontend

From `frontend/react.js/`:

```bat
npm run build
npm run lint
```

### 5. Run backend tests

From `backend/fastapi/17-full-stack-backend/`, with the required Python dependencies available in your environment:

```bat
pytest tests -v
```

## API overview

All project and task operations require a bearer token. Register or log in to obtain a token.

| Area | Method | Endpoint | Purpose |
|---|---|---|---|
| Auth | `POST` | `/auth/register` | Register a user |
| Auth | `POST` | `/auth/login` | Log in and obtain a JWT |
| Auth | `GET` | `/auth/me` | Get the current user |
| Projects | `POST` | `/projects/` | Create a project |
| Projects | `GET` | `/projects/all_projects` | List the current user's projects |
| Projects | `GET` | `/projects/{project_id}` | Get a project |
| Projects | `PUT` | `/projects/{project_id}` | Update a project |
| Projects | `DELETE` | `/projects/{project_id}` | Delete a project |
| Tasks | `POST` | `/tasks/` | Create a task |
| Tasks | `GET` | `/tasks/{task_id}` | Get a task |
| Tasks | `GET` | `/tasks/project/{project_id}` | List tasks for a project |
| Tasks | `PUT` | `/tasks/{task_id}` | Update a task |
| Tasks | `DELETE` | `/tasks/{task_id}` | Delete a task |

Task statuses are `todo`, `in_progress`, and `completed`. See `/docs` for the exact request and response schemas.

## Authentication and data access

The frontend stores the access token in browser local storage and sends it as a bearer token for protected API requests. The backend authenticates requests and checks ownership for project/task operations. Logging out removes the locally stored token.

This is a learning/MVP implementation. Before public production deployment, review token storage and expiration behavior, HTTPS, CORS origins, secret management, database backups/migrations, rate limiting, and deployment-specific configuration.

## Configuration and security

- Never commit `.env` files, real passwords, JWT secrets, or production credentials.
- The repository `.gitignore` excludes `.env` files, `node_modules`, build output, and common Python artifacts.
- For deployment, configure `VITE_API_URL` to point to the deployed API and configure backend CORS to allow the deployed frontend origin.
- Do not put server secrets in `VITE_*` variables; Vite exposes those values to client-side code.
- The local CORS setup may be configured for `http://localhost:5173`; update it intentionally for any additional frontend origin.

## Scope and known limitations

- Password reset is not implemented in the current MVP.
- The “Project workspace” UI link may not have a destination wired up yet.
- Tasks are listed by project; the API does not provide a global list-all-tasks endpoint, so the dashboard aggregates tasks from the user's projects.
- The root README documents the current repository layout; backend-specific implementation details are documented in `backend/fastapi/17-full-stack-backend/README.md`.

## Project status

DevBoard's primary frontend/backend flows have been manually tested locally, including authentication, project and task operations, dashboard statistics, session restoration, mobile layout, and behavior when the backend is unavailable. The frontend production build has also been reported as passing.

## License

No license is specified in this repository yet. Add a license file if you intend to publish or distribute the project under specific terms.
