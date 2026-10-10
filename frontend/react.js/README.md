# React.js Learning Journey

A hands-on React.js learning workspace inside **Dev-Lab**. This folder contains 11 practical React modules, progressing from JSX and component fundamentals to routing, API integration, authentication, and frontend architecture. It also contains **DevBoard**, the full-stack capstone application built using React and the FastAPI backend in this repository.

The goal is to learn React by building and modifying working examples—not by collecting theory alone.

---

## Learning Roadmap

| Module | Topic | Main focus |
|---|---|---|
| 01 | Fundamentals & JSX | JSX syntax, JavaScript expressions, rendering objects and arrays, conditional output, rendering lists |
| 02 | Components & Props | Reusable components, passing data through props, composing components |
| 03 | State & Events | `useState`, event handlers, adding and removing tasks, updating state immutably |
| 04 | Conditional Rendering & Lists | Conditional UI, list rendering, search, filtering, stable keys |
| 05 | Forms & Controlled Components | Controlled inputs, form state, handling checkboxes, validation and feedback |
| 06 | `useEffect` & Component Lifecycle | Effects, fetching data, loading and error states, cleanup, dependency arrays |
| 07 | Component Composition & Reusability | `children`, reusable cards, small components, composing UI from parts |
| 08 | Routing | React Router, routes and links, URL parameters, navigation, nested routes and not-found UI |
| 09 | API Integration | Fetching data, loading/error states, search, form submission, create/update workflows |
| 10 | Authentication & Protected Routes | Authentication context, login/logout, protected pages and redirects |
| 11 | State Management & Frontend Architecture | `useReducer`, reducer actions, splitting UI into components, keeping state updates organized |

Each module has its own folder under `src/modules/`. The module-specific README files will document the implementation and learning outcomes as the documentation work progresses.

## Tech Stack

- **React** — component-based user interfaces
- **JavaScript (ES modules)** — application logic
- **Vite** — development server and production build
- **React Router** — client-side routing
- **Tailwind CSS v4** — styling for the DevBoard application
- **Fetch API** — HTTP requests to APIs
- **FastAPI + PostgreSQL** — backend and persistence used by the DevBoard capstone
- **Docker Compose** — local backend/database environment

Versions and scripts are defined in `package.json` and `package-lock.json`.

---

## Folder Structure

```text
react.js/
├── public/                         # Static public assets
├── src/
│   ├── api/                        # API request modules used by DevBoard
│   │   ├── auth.js
│   │   ├── projects.js
│   │   └── tasks.js
│   ├── app/
│   │   └── router.jsx              # Application route configuration
│   ├── components/
│   │   ├── auth/                   # Protected-route components
│   │   └── layout/                 # Shared application layout
│   ├── context/
│   │   └── AuthContext.jsx         # DevBoard authentication state
│   ├── modules/
│   │   ├── 01-Fundamentals-JSX/
│   │   ├── 02-Components-Props/
│   │   ├── 03-State-Events/
│   │   ├── 04-Conditional-Rendering-Lists/
│   │   ├── 05-Forms-Controlled-Components/
│   │   ├── 06-UseEffect-Component-Lifecycle/
│   │   ├── 07-Component-Composition-Reusability/
│   │   ├── 08-Routing/
│   │   ├── 09-API-Integration/
│   │   ├── 10-Authentication-Protected-Routes/
│   │   └── 11-State-Management-Frontend-Architecture/
│   ├── pages/                      # DevBoard pages
│   ├── App.jsx                     # Application entry component
│   ├── index.css                   # Global styles and Tailwind import
│   └── main.jsx                    # React entry point
├── index.html
├── package.json
├── package-lock.json
└── README.md
```

> The learning modules are practice examples. DevBoard's production-style pages and shared API/authentication code live separately in `src/pages/`, `src/api/`, `src/context/`, and the application routing/layout folders.

---

## Getting Started

### Prerequisites

Install the following:

- Node.js and npm
- Git
- Docker Desktop, if you want to run the DevBoard backend locally

### 1. Install frontend dependencies

Open Windows CMD and navigate to this folder:

```bat
cd /d D:\SDE\Development\Dev-Lab\frontend\react.js
npm install
```

### 2. Configure the API URL

The frontend defaults to `http://localhost:8000`. For the standard local setup, no frontend environment file is required.

To override the API URL, create a local `.env` file in this directory:

```env
VITE_API_URL=http://localhost:8000
```

Only place public frontend configuration in `VITE_*` variables. Never put passwords, JWT signing secrets, or other server secrets in frontend environment variables.

### 3. Start the backend for DevBoard

In a separate CMD terminal:

```bat
cd /d D:\SDE\Development\Dev-Lab\backend\fastapi\17-full-stack-backend
docker compose up -d --build
```

The API is expected at `http://localhost:8000`. Swagger UI is available at `http://localhost:8000/docs` when the backend is running. Follow the backend module's README for its environment setup and troubleshooting.

### 4. Start the frontend

From `frontend/react.js/`:

```bat
npm run dev
```

Open the local address printed by Vite, usually `http://localhost:5173`.

### 5. Build and lint

```bat
npm run build
npm run lint
```

- `npm run dev` starts the Vite development server.
- `npm run build` creates the production build in `dist/`.
- `npm run preview` serves the production build locally for review.
- `npm run lint` runs Oxlint.

---

## DevBoard Capstone

DevBoard is the integrated application used to apply the React concepts in a larger frontend.

### Features

- User registration and login
- JWT-based authentication with protected routes
- Session restoration and logout
- Project creation, listing, editing, and deletion
- Task creation, listing, status updates, and deletion
- Dashboard statistics derived from project and task API data
- Loading, error, success, and empty states
- Responsive application layout

### Architecture at a glance

- **Pages** render the dashboard, project, task, login, and registration screens.
- **API modules** centralize requests to the authentication, projects, and tasks endpoints.
- **Auth context** exposes the current user, loading state, authentication status, login, and logout.
- **Protected routes** prevent unauthenticated users from accessing application pages.
- **FastAPI** handles authentication and project/task operations; **PostgreSQL** stores application data.

The task API lists tasks by project rather than exposing a global list-all-tasks endpoint. The dashboard therefore retrieves projects and aggregates their tasks.

### Known MVP limitations

- Password reset is not implemented.
- The “Project workspace” link may not yet be connected to a working destination.
- Task statuses are `todo`, `in_progress`, and `completed`; the backend task schema does not include a priority field.

These are known scope limitations, not advertised as completed functionality.

---

## Suggested Study Workflow

For each module:

1. Read the module-specific README when available.
2. Inspect the component and trace where its data comes from.
3. Run the example and interact with it.
4. Change the implementation yourself and observe the result.
5. Review edge cases and commit the completed work.

The emphasis is on understanding the behavior of each concept and being able to implement it independently.

## Repository Context

This directory is part of the larger **Dev-Lab** repository. The repository root README describes the overall learning repository, while the backend's own README documents the FastAPI learning journey and backend capstone. This README focuses specifically on the React.js learning workspace and its DevBoard frontend.

## License

No license is specified here. Refer to the repository root for project-wide licensing information, if added.
