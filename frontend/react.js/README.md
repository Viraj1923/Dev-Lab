# ⚛️ React.js Frontend Development

> A structured, hands-on React.js learning journey covering JSX, components, state, forms, effects, routing, API integration, authentication, and frontend architecture — ending with **DevBoard**, a full-stack project connected to the FastAPI backend in Dev-Lab.

---

## 📚 Overview

This directory contains **11 progressive React modules** and the **DevBoard** capstone application.

The goal is not to memorize React syntax. Each module focuses on a specific frontend concept and builds toward the skills needed to create a complete application:

```text
01 Fundamentals & JSX
        ↓
02 Components & Props
        ↓
03 State & Events
        ↓
04 Conditional Rendering & Lists
        ↓
05 Forms & Controlled Components
        ↓
06 useEffect & Component Lifecycle
        ↓
07 Component Composition & Reusability
        ↓
08 Routing
        ↓
09 API Integration
        ↓
10 Authentication & Protected Routes
        ↓
11 State Management & Frontend Architecture
        ↓
DevBoard — Full-Stack Capstone 🚀
```

The learning modules live under `src/modules/`. DevBoard's application pages, shared components, authentication context, routing, and API request modules are kept separately so the practice examples do not get mixed with the capstone application.

---

# 🗂️ Module Structure

| # | Module | Focus |
|---|---|---|
| 01 | `01-Fundamentals-JSX` | JSX, JavaScript expressions, objects, arrays, conditional output, and lists |
| 02 | `02-Components-Props` | Reusable components, props, imports, and component composition |
| 03 | `03-State-Events` | `useState`, event handlers, adding/removing items, and immutable updates |
| 04 | `04-Conditional-Rendering-Lists` | Conditional UI, list rendering, search, and filtering |
| 05 | `05-Forms-Controlled-Components` | Controlled inputs, form state, validation, and feedback |
| 06 | `06-UseEffect-Component-Lifecycle` | Effects, data fetching, loading/error states, and cleanup |
| 07 | `07-Component-Composition-Reusability` | `children`, reusable UI pieces, and composition patterns |
| 08 | `08-Routing` | React Router, links, URL parameters, nested routes, and navigation |
| 09 | `09-API-Integration` | HTTP requests, data loading, search, and form submission |
| 10 | `10-Authentication-Protected-Routes` | Authentication context, login/logout, and protected routes |
| 11 | `11-State-Management-Frontend-Architecture` | `useReducer`, reducer actions, and organizing application state |

---

# 01 · 🟢 React Fundamentals & JSX

**Directory:** `01-Fundamentals-JSX`

The starting point for understanding how React describes and renders user interfaces.

### Concepts covered

- JSX syntax
- Embedding JavaScript expressions in JSX
- Rendering values, objects, and arrays appropriately
- Conditional rendering
- Rendering lists
- Understanding how data becomes UI

This module establishes the basic mental model used by the later component-based examples.

---

# 02 · 🧩 Components & Props

**Directory:** `02-Components-Props`

This module introduces the building blocks of a React interface: components and the data passed between them.

### Concepts covered

- Creating and importing components
- Reusing components across a page
- Passing data through props
- Separating UI into smaller pieces
- Composing a page from components

The examples include components such as `Header`, `ProfileCard`, and `Card`.

---

# 03 · 🔄 State & Events

**Directory:** `03-State-Events`

React state lets a component remember information and update its rendered output in response to user interaction.

### Concepts covered

- The `useState` Hook
- Event handlers
- Updating state in response to actions
- Adding and removing tasks
- Updating arrays immutably
- Connecting user interactions to UI changes

The focus is on understanding the relationship between a state update and a re-render.

---

# 04 · 🧮 Conditional Rendering & Lists

**Directory:** `04-Conditional-Rendering-Lists`

This module builds more dynamic interfaces by displaying different content based on data and user input.

### Concepts covered

- Conditional rendering
- Rendering collections with `map()`
- Using stable list keys
- Searching through items
- Filtering active items
- Combining data transformations with UI rendering

The examples demonstrate how a list can respond to search and filtering controls.

---

# 05 · 📝 Forms & Controlled Components

**Directory:** `05-Forms-Controlled-Components`

Forms are a core part of interactive applications. This module explores how React state can control form inputs and validation feedback.

### Concepts covered

- Controlled inputs
- Form state
- Handling form submission
- Working with text fields and checkboxes
- Basic validation
- Displaying feedback to the user

The emphasis is on keeping the form's displayed values and React state in sync.

---

# 06 · ⚡ useEffect & Component Lifecycle

**Directory:** `06-UseEffect-Component-Lifecycle`

This module introduces effects for synchronizing a component with external systems, along with the cleanup needed for ongoing work.

### Concepts covered

- The `useEffect` Hook
- Effect dependency arrays
- Fetching data from an API
- Loading and error states
- Cleanup functions
- Timer cleanup

The examples include fetching users from JSONPlaceholder and managing a timer's lifecycle.

---

# 07 · ♻️ Component Composition & Reusability

**Directory:** `07-Component-Composition-Reusability`

This module explores how to build interfaces from small, focused components instead of duplicating markup and behavior.

### Concepts covered

- Component composition
- The `children` prop
- Reusable UI patterns
- Passing data into presentation components
- Keeping components focused on a clear responsibility

Example components include `Card`, `StatusBadge`, and `TeamMemberCard`.

---

# 08 · 🧭 Routing

**Directory:** `08-Routing`

Client-side routing allows a React application to display different pages and navigate between them without treating every navigation as a completely separate application load.

### Concepts covered

- `BrowserRouter`
- `Routes` and `Route`
- `Link` and `NavLink`
- URL parameters with `useParams`
- Programmatic navigation with `useNavigate`
- Nested routes and `Outlet`
- Not-found routes

This module provides the foundation for navigation in the DevBoard application.

---

# 09 · 🌐 API Integration

**Directory:** `09-API-Integration`

This module connects a React interface to an HTTP API and handles the different states that can occur while a request is running.

### Concepts covered

- Making requests with the Fetch API
- Reading API responses
- Loading and error states
- Searching API-backed data
- Submitting form data
- Create/update-style workflows
- Displaying the result of an API operation

The goal is to understand the complete request-to-interface flow, including unsuccessful requests and empty results.

---

# 10 · 🔐 Authentication & Protected Routes

**Directory:** `10-Authentication-Protected-Routes`

This module introduces shared authentication state and route protection. Its learning example uses a mock login/logout flow to demonstrate the frontend concepts.

### Concepts covered

- Authentication context
- Sharing authentication state across components
- Login and logout behavior
- Protected routes
- Redirecting unauthenticated users
- Separating authentication concerns from page components

The mock learning example is distinct from DevBoard's real API-backed JWT authentication flow.

---

# 11 · 🧠 State Management & Frontend Architecture

**Directory:** `11-State-Management-Frontend-Architecture`

This module moves beyond basic component state and introduces a reducer-based approach for organizing related state transitions.

### Concepts covered

- The `useReducer` Hook
- Reducer functions and actions
- Keeping state transitions organized
- Breaking an interface into focused components
- Separating state logic from presentation

The task-manager example is organized around components such as `TaskInput`, `TaskList`, and `TaskStats`, alongside `taskReducer`. The module also includes a `useReducer` counter example.

---

# 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| ⚛️ React | Component-based user interfaces |
| 🟨 JavaScript (ES modules) | Application logic and module imports |
| ⚡ Vite | Development server and production build tooling |
| 🧭 React Router | Client-side routing and navigation |
| 🎨 Tailwind CSS v4 | Styling used by the DevBoard application |
| 🌐 Fetch API | HTTP communication with backend endpoints |
| 🚀 FastAPI | Backend API for DevBoard |
| 🐘 PostgreSQL | Persistent application data for DevBoard |
| 🐳 Docker Compose | Local backend and database environment |

The installed package versions and available npm scripts are defined in `package.json` and `package-lock.json`.

---

# 🏗️ Frontend Architecture

The directory separates the progressive learning modules from the integrated DevBoard application.

```text
frontend/react.js/
│
├── public/                         # Static public assets
│
├── src/
│   ├── api/                        # DevBoard API request modules
│   │   ├── auth.js
│   │   ├── projects.js
│   │   └── tasks.js
│   │
│   ├── app/
│   │   └── router.jsx              # Application route configuration
│   │
│   ├── components/
│   │   ├── auth/                   # Protected-route components
│   │   └── layout/                 # Shared application layout
│   │
│   ├── context/
│   │   └── AuthContext.jsx         # DevBoard authentication state
│   │
│   ├── modules/                    # 11 hands-on learning modules
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
│   │
│   ├── pages/                      # DevBoard application pages
│   ├── App.jsx                     # Application component
│   ├── index.css                   # Global styles and Tailwind import
│   └── main.jsx                    # React entry point
│
├── index.html
├── package.json
├── package-lock.json
└── README.md
```

### 🔀 How the pieces fit together

```text
User interaction
       ↓
React page / component
       ↓
Context, component state, or reducer
       ↓
API request module (when backend data is needed)
       ↓
FastAPI REST API
       ↓
PostgreSQL database
       ↓
API response → React state → updated UI
```

The learning modules are practice examples. DevBoard's pages and shared authentication, routing, and API code live in their respective application folders.

---

# 🚀 DevBoard — Full-Stack Capstone

DevBoard brings the frontend concepts together in an application that communicates with the FastAPI backend in this repository.

## ✨ Features

- 👤 User registration and login
- 🔐 JWT-based authentication and protected routes
- 🔄 Session restoration and logout
- 📁 Project creation, listing, editing, and deletion
- ✅ Task creation, listing, status updates, and deletion
- 📊 Dashboard statistics derived from project and task API data
- ⏳ Loading states
- ⚠️ Error and success feedback
- 📭 Empty states
- 📱 Responsive application layout

## 🧩 Frontend responsibilities

- **Pages** render the dashboard, project/task views, login, and registration screens.
- **API modules** centralize requests for authentication, projects, and tasks.
- **Authentication context** shares the current user and authentication state across the application.
- **Protected routes** restrict application pages to authenticated users.
- **React Router** manages page navigation.
- **FastAPI** handles authentication and project/task operations.
- **PostgreSQL** stores the backend's persistent application data.

## 🔐 Authentication flow

```text
Register / Login
       ↓
Frontend sends credentials to FastAPI
       ↓
Backend validates credentials
       ↓
JWT access token returned
       ↓
Frontend stores the token for the session
       ↓
Token included in protected API requests
       ↓
Auth context restores and shares user state
       ↓
Protected pages become available 🔓
```

The backend remains responsible for validating tokens and enforcing authorization. Frontend route protection improves the user experience; it does not replace backend security checks.

## 👤 → 📁 → ✅ Data relationship

```text
User
 │
 └── Projects
       │
       └── Tasks
```

A project belongs to a user, and a task belongs to a project. The dashboard retrieves the projects available to the user and aggregates their tasks because the backend exposes task listing by project rather than a global list-all-tasks endpoint.

## 🔌 API integration overview

| Area | Endpoint | Purpose |
|---|---|---|
| 🔐 Auth | `POST /auth/register` | Register a user |
| 🔐 Auth | `POST /auth/login` | Log in and obtain an access token |
| 👤 Auth | `GET /auth/me` | Retrieve the authenticated user |
| 📁 Projects | `POST /projects/` | Create a project |
| 📁 Projects | `GET /projects/all_projects` | List the user's projects |
| 📁 Projects | `GET /projects/{id}` | Retrieve a project |
| 📁 Projects | `PUT /projects/{id}` | Update a project |
| 📁 Projects | `DELETE /projects/{id}` | Delete a project |
| ✅ Tasks | `POST /tasks/` | Create a task |
| ✅ Tasks | `GET /tasks/{id}` | Retrieve a task |
| ✅ Tasks | `GET /tasks/project/{project_id}` | List tasks for a project |
| ✅ Tasks | `PUT /tasks/{id}` | Update a task |
| ✅ Tasks | `DELETE /tasks/{id}` | Delete a task |

The exact API behavior and backend setup are documented in `backend/fastapi/17-full-stack-backend/README.md`.

## 📌 Current scope and known limitations

- Password reset is not implemented.
- The **Project workspace** link may not yet lead to a connected destination.
- Task statuses are `todo`, `in_progress`, and `completed`.
- The backend task schema does not include a task-priority field.
- The backend does not expose a global task-list endpoint; tasks are retrieved per project.

These are documented scope limitations, not features claimed as complete.

---

# ⚙️ Configuration

The frontend uses `VITE_API_URL` to configure the API base URL. The standard local setup defaults to `http://localhost:8000`, so a frontend environment file is optional for that setup.

To override the default, create a `.env` file in `frontend/react.js/`:

```env
VITE_API_URL=http://localhost:8000
```

### 🔒 Security notes

- Only put values intended to be public in `VITE_*` variables; frontend variables are included in the client-side build.
- Never place database credentials, JWT signing secrets, or backend-only secrets in frontend environment variables.
- Do not commit real credentials or local secret files to Git.

---

# 🧰 Getting Started

## 📋 Prerequisites

Install the following before starting:

- 🟢 Node.js and npm
- 🧰 Git
- 🐳 Docker Desktop, if you want to run the DevBoard backend locally

## 1 · 📦 Install frontend dependencies

Open Windows CMD and navigate to the React directory:

```bat
cd /d D:\SDE\Development\Dev-Lab\frontend\react.js
npm install
```

## 2 · 🐳 Start the backend

In a **separate CMD terminal**, start the DevBoard backend and database:

```bat
cd /d D:\SDE\Development\Dev-Lab\backend\fastapi\17-full-stack-backend
docker compose up -d --build
```

When the backend is running, the API is expected at `http://localhost:8000`. Swagger UI is available at `http://localhost:8000/docs`.

For backend environment variables, database configuration, tests, and troubleshooting, follow the backend module's own README.

## 3 · ⚡ Start the React development server

Return to the frontend terminal:

```bat
cd /d D:\SDE\Development\Dev-Lab\frontend\react.js
npm run dev
```

Open the local URL printed by Vite, usually:

```text
http://localhost:5173
```

## 4 · 🏗️ Build and lint

```bat
npm run build
npm run lint
```

### 📜 Available scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create the production build in `dist/` |
| `npm run lint` | Run Oxlint |
| `npm run preview` | Serve the production build locally for review |

---

# 🧭 Recommended Learning Workflow

For each module, follow the same hands-on process:

1. 📖 Read the module's explanation or README, when available.
2. 🔍 Inspect the component and trace where its data comes from.
3. ▶️ Run the example and interact with the UI.
4. 🧑‍💻 Change the implementation yourself and observe what changes.
5. 🧪 Check edge cases, loading states, and unexpected input where relevant.
6. ✅ Review the result and commit the completed work.

The emphasis is on understanding the behavior of each concept and being able to implement it independently — not just copying a finished component.

---

# 🎯 What This Journey Covers

The 11 modules progress from the fundamentals of rendering UI to organizing and integrating a frontend application:

```text
JSX & Rendering
       ↓
Components & Props
       ↓
State & Events
       ↓
Conditional UI & Lists
       ↓
Forms & Validation
       ↓
Effects & Cleanup
       ↓
Composition & Reusability
       ↓
Routing
       ↓
API Integration
       ↓
Authentication & Protected Routes
       ↓
Reducer-Based State Management
       ↓
DevBoard Full-Stack Frontend 🚀
```

## 🧰 Technologies used

- ⚛️ React
- 🟨 JavaScript and ES modules
- ⚡ Vite
- 🧭 React Router
- 🎨 Tailwind CSS v4
- 🌐 Fetch API
- 🔐 JWT-based authentication flow
- 🚀 FastAPI
- 🐘 PostgreSQL
- 🐳 Docker Compose

---

## 🏁 Status

**React.js learning path: Modules 01 → 11 documented in this overview ✅**

**Capstone: DevBoard frontend integrated with the FastAPI backend 🚀**

This directory contains both the individual React practice modules and the DevBoard application that applies those concepts in a larger frontend. The module list describes the learning path; it does not imply that every possible React topic or production feature is covered.

---

### 👨‍💻 Dev-Lab

Part of the broader **Dev-Lab development journey** — built through progressive, hands-on implementation, from learning individual frontend concepts to integrating a full-stack application.
