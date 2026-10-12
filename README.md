# 🧪 Dev-Lab

> A hands-on software development workspace for learning, building, testing, and deploying full-stack applications — one concept and one project at a time.

Dev-Lab brings together frontend and backend learning paths, practical exercises, and projects built while progressing toward full-stack development. Rather than keeping tutorials isolated, the goal is to apply the concepts in working applications.

## 🚀 Featured Project: DevBoard

**DevBoard** is a full-stack project and task management application built with React and FastAPI.

- **Live application:** [devboard-frontend-kappa.vercel.app](https://devboard-frontend-kappa.vercel.app)
- **Backend API documentation:** [FastAPI Swagger UI](https://devboard-api-0wsh.onrender.com/docs)

### Architecture and hosting

| Layer | Technology | Hosting / runtime |
|---|---|---|
| Frontend | React, JavaScript, Vite, React Router, Tailwind CSS | Vercel |
| Backend API | Python, FastAPI, SQLAlchemy | Render (Docker) |
| Database | PostgreSQL | Neon |
| Local backend environment | Docker Compose | Local machine |

DevBoard includes registration and login, JWT-based authentication, protected frontend routes, project management, task management, dashboard statistics, and loading/error/empty states. The frontend communicates with the API; the backend validates authentication and handles application data.

**Deployment note:** The free Render service may take a little time to respond after periods of inactivity. The API's interactive documentation is available at the link above.

## 🗺️ Repository Roadmap

| Area | Location | Focus |
|---|---|---|
| JavaScript | [`frontend/javascript/`](frontend/javascript/) | JavaScript fundamentals and modern JavaScript practice |
| React | [`frontend/react.js/`](frontend/react.js/) | 11 progressive React modules and the DevBoard frontend |
| TypeScript | [`frontend/typescript/`](frontend/typescript/) | TypeScript learning and practice |
| React + TypeScript | [`frontend/react+typescript/`](frontend/react+typescript/) | React development with TypeScript |
| FastAPI | [`backend/fastapi/`](backend/fastapi/) | Python backend learning and the DevBoard API |

See each directory's README for its specific learning plan, setup instructions, and implementation details.

## 🧱 Technology Areas

- **Frontend:** JavaScript, React, Vite, React Router, TypeScript, Tailwind CSS
- **Backend:** Python, FastAPI, REST APIs, Pydantic, authentication, asynchronous features
- **Data:** PostgreSQL, SQLAlchemy, relational data modeling
- **Testing and delivery:** pytest, Docker, Docker Compose, Git, GitHub
- **Deployment:** Vercel, Render, Neon PostgreSQL

The technologies listed reflect the learning areas and projects in this repository; not every technology is used by every project.

## 📂 Repository Structure

```text
Dev-Lab/
├── frontend/
│   ├── javascript/             # JavaScript learning path
│   ├── react.js/               # React modules and DevBoard frontend
│   ├── typescript/             # TypeScript learning path
│   └── react+typescript/       # React + TypeScript learning path
│
├── backend/
│   └── fastapi/
│       ├── README.md           # FastAPI learning overview
│       └── 17-full-stack-backend/ # DevBoard backend project
│
└── README.md                   # Repository overview and entry point
```

Individual folders may evolve as the learning journey progresses. Their own READMEs are the source of truth for current setup steps and module details.

## 🛠️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Viraj1923/Dev-Lab.git
cd Dev-Lab
```

### 2. Choose a learning path

- For JavaScript practice, open `frontend/javascript/`.
- For React modules and the DevBoard UI, open `frontend/react.js/`.
- For TypeScript, open `frontend/typescript/` or `frontend/react+typescript/`.
- For backend learning, open `backend/fastapi/` and follow its README.

### 3. Run DevBoard locally

For the exact commands, environment variables, and dependencies, follow the project-specific instructions in:

- [`frontend/react.js/README.md`](frontend/react.js/README.md)
- [`backend/fastapi/README.md`](backend/fastapi/README.md)
- `backend/fastapi/17-full-stack-backend/README.md`

The frontend uses `VITE_API_URL` to select the backend API URL. For local development, the default is `http://localhost:8000`. Do not put database passwords, JWT signing secrets, or other private backend credentials in frontend variables or commit them to Git.

## 📈 Development Approach

Dev-Lab is organized around practical learning:

1. Learn a concept through a focused module.
2. Run the example and inspect how it works.
3. Modify the implementation and test edge cases.
4. Apply the concept in a larger project where appropriate.
5. Document the result and commit changes to Git.

## ✅ Current Highlights

- JavaScript learning materials and exercises
- An 11-module React learning path
- DevBoard frontend integrated with a FastAPI backend
- PostgreSQL persistence and JWT authentication for DevBoard
- Docker-based local backend setup
- Live frontend and backend API documentation
- Backend test suite previously verified locally: **15 tests passed**

Project scope and unfinished items are documented in the relevant project README rather than being treated as completed features here.

## 🔐 Security

- Keep `.env` files and credentials out of version control.
- Use strong, private secrets for deployed services.
- Only expose public configuration in frontend `VITE_*` variables because those values are bundled into client-side code.
- Treat frontend route protection as a user-experience feature; authorization must still be enforced by the backend.

## 👨‍💻 About

Dev-Lab is a continuing, hands-on development journey focused on building practical skills across frontend, backend, databases, testing, and deployment. It is designed to grow as new concepts are learned and applied to real projects.
