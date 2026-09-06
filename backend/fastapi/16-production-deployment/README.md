# 🚀 FastAPI — Production Deployment Basics

> **Module 16** of the FastAPI learning series.

This module focuses on the basic deployment setup for a FastAPI application using **Docker**, **Docker Compose**, **environment variables**, and **PostgreSQL**.

The project demonstrates how a FastAPI application and a PostgreSQL database can run as separate containers and communicate through the Docker Compose service name.

---

# 🎯 What This Module Teaches

```text
                    Docker Compose
                         │
              ┌──────────┴──────────┐
              │                     │
              ▼                     ▼
        ┌───────────┐         ┌────────────┐
        │  FastAPI  │         │ PostgreSQL │
        │    API    │────────►│     DB     │
        │   :8000   │         │   :5432    │
        └───────────┘         └────────────┘
              │
              ▼
          HTTP Client
```

The module demonstrates:

- 🐳 Creating a Docker image for FastAPI
- 📦 Installing Python dependencies inside the image
- 🌐 Exposing port `8000`
- ⚙️ Running Uvicorn inside a container
- 🧩 Running FastAPI and PostgreSQL with Docker Compose
- 🔐 Supplying configuration through environment variables
- 🗄️ Connecting the API container to PostgreSQL
- 💾 Persisting PostgreSQL data with a named Docker volume
- 🩺 Testing database connectivity through an API endpoint

---

# 📁 Project Structure

```text
16-production-deployment/
│
├── .dockerignore
├── Dockerfile
├── compose.yaml
├── main.py
└── requirements.txt
```

### File responsibilities

| File | Purpose |
|---|---|
| `.dockerignore` | Prevents unnecessary/local files and secrets from entering the Docker build context |
| `Dockerfile` | Defines how the FastAPI application image is built and started |
| `compose.yaml` | Defines the FastAPI and PostgreSQL services |
| `main.py` | Contains the FastAPI application and database test endpoint |
| `requirements.txt` | Lists the Python dependencies |

---

# 1. 🐳 Dockerfile

The `Dockerfile` defines the FastAPI application's container image.

It starts with:

```dockerfile
FROM python:3.12-slim
```

This uses a lightweight Python 3.12 base image.

The working directory is then set to:

```dockerfile
WORKDIR /app
```

Therefore, application commands inside the container run from:

```text
/app
```

---

# 2. 📦 Installing Dependencies

The Dockerfile first copies:

```dockerfile
COPY requirements.txt .
```

and then installs the dependencies:

```dockerfile
RUN pip install --no-cache-dir -r requirements.txt
```

The dependency installation is deliberately done before copying the rest of the application:

```text
COPY requirements.txt
        ↓
pip install
        ↓
COPY application source
```

This allows Docker to reuse the dependency layer when `requirements.txt` has not changed.

---

# 3. 📋 Python Dependencies

`requirements.txt` contains:

```text
fastapi
uvicorn
psycopg2-binary
```

These provide:

| Package | Role |
|---|---|
| `fastapi` | Web framework |
| `uvicorn` | ASGI server used to run the application |
| `psycopg2-binary` | PostgreSQL database driver |

---

# 4. 📂 Copying the Application

After dependencies are installed:

```dockerfile
COPY . .
```

copies the application files into the container's working directory.

The resulting structure is effectively:

```text
/app
├── main.py
├── requirements.txt
└── ...
```

---

# 5. 🌐 Port 8000

The Dockerfile documents the application's port:

```dockerfile
EXPOSE 8000
```

The FastAPI server is started with:

```dockerfile
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

The important parts are:

```text
main:app
```

and:

```text
--host 0.0.0.0
--port 8000
```

`main:app` means:

```text
main.py
   ↓
app object
```

The server listens on all container interfaces at port `8000`.

---

# 6. ⚙️ Docker Compose

`compose.yaml` defines two services:

```yaml
services:

  api:
    ...

  db:
    ...
```

The architecture is:

```text
compose.yaml
     │
     ├───────────────┐
     │               │
     ▼               ▼
   api              db
 FastAPI          PostgreSQL
```

The two services can communicate using the Compose service name:

```text
db
```

rather than using `localhost`.

---

# 7. 🚀 API Service

The FastAPI service is:

```yaml
api:
  build: .
```

This tells Docker Compose to build the API image using the `Dockerfile` in the current directory.

The application port is mapped with:

```yaml
ports:
  - "8000:8000"
```

This maps:

```text
Host port 8000
       ↓
Container port 8000
```

Therefore the API can be accessed from the host through port `8000`.

---

# 8. ⚙️ Environment Variables

The API service receives:

```yaml
environment:
  APP_NAME: ${APP_NAME}
  DATABASE_URL: postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}
```

The values are supplied using Docker Compose variable substitution.

The database URL has this structure:

```text
postgresql://
    USER:
    PASSWORD@
    db:
    5432/
    DATABASE
```

The important detail is:

```text
@db:5432
```

The hostname is `db` because `db` is the PostgreSQL **service name** in Compose.

---

# 9. 🗄️ PostgreSQL Service

The database service uses:

```yaml
db:
  image: postgres:16
```

So PostgreSQL runs in its own container using the PostgreSQL 16 image.

Its configuration is supplied through:

```yaml
environment:
  POSTGRES_USER: ${POSTGRES_USER}
  POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
  POSTGRES_DB: ${POSTGRES_DB}
```

These values come from the environment used by Docker Compose.

---

# 10. 💾 Persistent PostgreSQL Data

The database service mounts:

```yaml
volumes:
  - postgres_data:/var/lib/postgresql/data
```

A named volume is declared at the bottom:

```yaml
volumes:
  postgres_data:
```

The architecture is:

```text
PostgreSQL container
        │
        ▼
/var/lib/postgresql/data
        │
        ▼
postgres_data
        │
        ▼
Docker-managed persistent storage
```

This keeps PostgreSQL data outside the container's writable layer.

---

# 11. 🔗 API → PostgreSQL Connection

Inside `main.py`, the database URL is read from the environment:

```python
DATABASE_URL = os.getenv("DATABASE_URL")
```

Docker Compose provides this value to the API container.

The application then connects using:

```python
connection = psycopg2.connect(DATABASE_URL)
```

The connection therefore follows:

```text
FastAPI container
      │
      │ DATABASE_URL
      ▼
psycopg2
      │
      │ PostgreSQL connection
      ▼
db:5432
      │
      ▼
PostgreSQL container
```

---

# 12. 🧪 Basic FastAPI Endpoint

The root endpoint is:

```python
@app.get("/")
def home():
    return {
        "message": "FastAPI + PostgreSQL"
    }
```

A request to:

```text
GET /
```

returns:

```json
{
  "message": "FastAPI + PostgreSQL"
}
```

This provides a simple way to verify that the API container is responding.

---

# 13. 🩺 Database Test Endpoint

The module also provides:

```python
@app.get("/db-test")
def database_test():
```

This endpoint explicitly tests the PostgreSQL connection.

It connects using:

```python
connection = psycopg2.connect(DATABASE_URL)
```

then creates a cursor:

```python
cursor = connection.cursor()
```

and executes:

```python
cursor.execute("SELECT version()")
```

This asks PostgreSQL for its current version.

---

# 14. 🔍 Reading the Database Result

The result is retrieved with:

```python
result = cursor.fetchone()
```

The response then returns:

```python
return {
    "database": result[0]
}
```

So `/db-test` provides direct evidence that the application successfully communicated with PostgreSQL.

The flow is:

```text
GET /db-test
     ↓
Read DATABASE_URL
     ↓
Connect using psycopg2
     ↓
Create cursor
     ↓
SELECT version()
     ↓
fetchone()
     ↓
Return database version
```

---

# 15. 🧹 Closing Database Resources

After executing the query, the example explicitly closes:

```python
cursor.close()
connection.close()
```

This demonstrates the basic lifecycle:

```text
Open connection
      ↓
Create cursor
      ↓
Execute query
      ↓
Read result
      ↓
Close cursor
      ↓
Close connection
```

---

# 16. 🔐 `.dockerignore`

The `.dockerignore` file prevents several local files/directories from being included in the Docker build context.

It excludes:

```text
.venv/
__pycache__/
*.pyc
.git/
.gitignore
.env
```

Notably:

```text
.env
```

is excluded.

This is important because environment files can contain configuration and secrets that should not be copied into the image.

---

# 17. 🧩 Why `.env` Is Used

The Compose file references variables such as:

```yaml
${POSTGRES_USER}
${POSTGRES_PASSWORD}
${POSTGRES_DB}
${APP_NAME}
```

The intended configuration model is:

```text
.env
 │
 ├── APP_NAME
 ├── POSTGRES_USER
 ├── POSTGRES_PASSWORD
 └── POSTGRES_DB
        │
        ▼
   Docker Compose
        │
        ├──► API environment
        │
        └──► PostgreSQL environment
```

The actual `.env` file is not included in the module files.

---

# 18. ▶️ Start the Application

From the module directory, run:

```bash
docker compose up -d
```

Docker Compose builds the API image and starts both services.

The expected architecture is:

```text
docker compose up -d
          │
          ├─────────────► API container
          │
          └─────────────► PostgreSQL container
```

---

# 19. 🔎 Check Running Containers

Use:

```bash
docker compose ps
```

or:

```bash
docker ps
```

You should see the API and database containers running.

The API is exposed through:

```text
localhost:8000
```

---

# 20. 🧪 Test the API

Open:

```text
http://localhost:8000/
```

The expected response is:

```json
{
  "message": "FastAPI + PostgreSQL"
}
```

You can also open:

```text
http://localhost:8000/docs
```

to use FastAPI's Swagger UI.

---

# 21. 🩺 Test PostgreSQL Through FastAPI

Open:

```text
http://localhost:8000/db-test
```

If the API successfully connects to PostgreSQL and executes:

```sql
SELECT version()
```

the response contains the PostgreSQL version:

```json
{
  "database": "PostgreSQL ..."
}
```

This endpoint is therefore the module's database connectivity check.

---

# 22. 🛑 Stop the Services

To stop the running Compose services:

```bash
docker compose down
```

This removes the containers created by Compose.

The named volume:

```text
postgres_data
```

is declared separately and is not removed by the basic `docker compose down` command.

---

# 23. 🏗️ Complete Deployment Flow

The complete module can be understood as:

```text
                    Developer
                        │
                        ▼
                  Dockerfile
                        │
                        ▼
                  Build API image
                        │
                        ▼
                Docker Compose
                   │         │
                   ▼         ▼
                FastAPI   PostgreSQL
                 :8000       :5432
                   │           │
                   └─────┬─────┘
                         │
                  DATABASE_URL
                         │
                         ▼
                    API connects
                    to PostgreSQL
                         │
                         ▼
                    /db-test
                         │
                         ▼
                 SELECT version()
```

---

# 📊 Container Responsibilities

| Component | Technology | Responsibility |
|---|---|---|
| API | FastAPI + Uvicorn | Serves HTTP endpoints |
| Database | PostgreSQL 16 | Stores database data |
| Database driver | psycopg2 | Connects Python application to PostgreSQL |
| Container build | Docker | Packages the API application |
| Orchestration | Docker Compose | Runs API + PostgreSQL together |
| Persistence | Docker named volume | Stores PostgreSQL data |

---

# 🧠 Key Takeaways

### 🐳 Docker

- A `Dockerfile` describes how the FastAPI image is built.
- Dependencies are installed inside the image.
- Uvicorn starts the FastAPI application.
- Port `8000` is exposed by the application container.

### 🧩 Docker Compose

- `compose.yaml` defines the API and database services.
- The API is built locally from the `Dockerfile`.
- PostgreSQL runs from the `postgres:16` image.
- The services communicate through the Compose network.

### 🔐 Configuration

- Configuration is supplied through environment variables.
- `DATABASE_URL` is constructed from PostgreSQL environment variables.
- `.env` is excluded from the Docker build context.

### 🗄️ PostgreSQL

- PostgreSQL runs as a separate container.
- Database storage uses the `postgres_data` named volume.
- The API connects to PostgreSQL using `psycopg2`.

### 🩺 Verification

The module provides two endpoints:

```text
GET /
GET /db-test
```

The first verifies the API is responding.

The second verifies that the API can connect to PostgreSQL and execute a query.

---

# ⚠️ Scope of This Module

This module demonstrates the **deployment fundamentals implemented in the project**:

```text
FastAPI
   +
Docker
   +
Docker Compose
   +
PostgreSQL
   +
Environment configuration
```

It is intentionally a compact deployment example rather than a complete cloud deployment architecture.

The project does not contain additional infrastructure beyond the files shown in this module.

---

# 🧪 Suggested Experiments

### Experiment 1 — Build the API

Run:

```bash
docker compose build
```

Observe the Docker build steps defined in the `Dockerfile`.

### Experiment 2 — Start both services

Run:

```bash
docker compose up -d
```

Then inspect:

```bash
docker compose ps
```

### Experiment 3 — Test the root endpoint

Open:

```text
http://localhost:8000/
```

### Experiment 4 — Test database connectivity

Open:

```text
http://localhost:8000/db-test
```

### Experiment 5 — Inspect the containers

Run:

```bash
docker ps
```

and identify:

```text
FastAPI API container
PostgreSQL database container
```

### Experiment 6 — Stop and restart

Run:

```bash
docker compose down
docker compose up -d
```

Then test `/db-test` again.

This demonstrates the separation between the containers and the persistent PostgreSQL named volume.

---

# 🏁 Module Status

**Module 16 — Production Deployment Basics** ✅

This module establishes the Docker-based deployment foundation used to package a FastAPI application, run PostgreSQL alongside it with Docker Compose, pass configuration through environment variables, persist database data with a named volume, and verify API-to-database connectivity.

---

## 📚 FastAPI Progress

```text
01 — Basics                      ✅
02 — Project Structure           ✅
03 — Authentication              ✅
04 — Error Handling              ✅
05 — Middleware                  ✅
06 — Dependency Injection        ✅
07 — Pydantic + API Design       ✅
08 — SQLAlchemy Relationships    ✅
09 — Testing                     ✅
10 — Transactions                ✅
11 — Async & Await               ✅
12 — Configuration & Security    ✅
13 — Background Tasks & Lifespan  ✅
14 — File Uploads & Forms        ✅
15 — WebSockets                  ✅
16 — Production Deployment       ✅  ← Current
     ↓
17 — Full-Stack Backend          🚀
```

---

# 🚀 Final Module Roadmap

```text
Module 01
   ↓
Module 02
   ↓
...
   ↓
Module 15 — WebSockets
   ↓
Module 16 — Production Deployment
   ↓
Module 17 — Full-Stack Backend
             🚀
```

**16 modules documented. One final full-stack backend project brings the complete FastAPI learning path together.**
