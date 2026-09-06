# ⚡ FastAPI — Background Tasks & Application Lifespan

> **Module 13** of the FastAPI learning series.

This module focuses on two useful FastAPI concepts:

- 🔄 **Application lifecycle / lifespan** — running initialization code when the application starts and cleanup code when it shuts down.
- 📬 **Background tasks** — scheduling work to run after an HTTP response has been returned.

The examples progress from the older startup/shutdown event style to the `lifespan` context manager, then introduce `BackgroundTasks`, and finally combine both concepts.

---

# 🎯 What This Module Teaches

```text
FastAPI Application
       │
       ├── 🔄 Lifecycle
       │      ├── Startup
       │      └── Shutdown
       │
       └── 📬 Background Tasks
              └── Work after response
```

The module demonstrates:

- 🚀 Application startup
- 🛑 Application shutdown
- `@app.on_event("startup")`
- `@app.on_event("shutdown")`
- `@asynccontextmanager`
- FastAPI `lifespan`
- `app.state`
- Resource initialization
- Resource cleanup
- `BackgroundTasks`
- `background_tasks.add_task()`
- Passing initialized resources into background tasks
- Combining lifespan-managed resources with background work

---

# 📁 Project Structure

```text
13-background-tasks-lifespan/
│
├── background_demo.py
├── final_demo.py
├── lifecycle_demo.py
└── lifespan_demo.py
```

### File responsibilities

| File | Focus |
|---|---|
| `lifecycle_demo.py` | Basic startup and shutdown events |
| `lifespan_demo.py` | Lifespan context manager and application state |
| `background_demo.py` | FastAPI background task |
| `final_demo.py` | Combines lifespan resource management with background tasks |

---

# 1. 🔄 Application Lifecycle

A FastAPI application has a lifecycle.

Conceptually:

```text
Application starts
       ↓
   Startup work
       ↓
Application serves requests
       ↓
   Shutdown work
       ↓
Application stops
```

Lifecycle hooks are useful when something needs to be prepared before requests are handled and cleaned up when the application finishes.

---

# 2. 🚀 Startup Event

`lifecycle_demo.py` demonstrates the startup event:

```python
@app.on_event("startup")
async def startup():
    print("🚀 Application started")
```

The function runs when the FastAPI application starts.

The example simply prints:

```text
🚀 Application started
```

---

# 3. 🛑 Shutdown Event

The same file demonstrates the shutdown event:

```python
@app.on_event("shutdown")
async def shutdown():
    print("🛑 Application shutting down")
```

This runs when the application shuts down.

The complete lifecycle example is therefore:

```text
Start application
      ↓
startup()
      ↓
"Application started"
      ↓
Handle requests
      ↓
shutdown()
      ↓
"Application shutting down"
```

---

# 4. 🌐 Basic Lifecycle API

`lifecycle_demo.py` also defines:

```python
@app.get("/")
def home():
    return {"message": "Hello"}
```

The application is created with:

```python
app = FastAPI()
```

So this example combines:

```text
FastAPI application
+
startup event
+
shutdown event
+
basic GET endpoint
```

---

# 5. ⚡ Lifespan Context Manager

`lifespan_demo.py` introduces the lifespan pattern.

It imports:

```python
from contextlib import asynccontextmanager
```

and defines:

```python
@asynccontextmanager
async def lifespan(app: FastAPI):
    ...
    yield
    ...
```

The function has two sides:

```text
Before yield
     ↓
Startup / initialization

yield
     ↓
Application runs

After yield
     ↓
Shutdown / cleanup
```

This provides a single place to define startup and shutdown behavior.

---

# 6. 🚀 Lifespan Startup

Inside the lifespan function:

```python
print("🚀 Starting application")

app.state.message = "Resource initialized"
```

The resource is initialized before the application begins serving requests.

The example stores the value in:

```python
app.state.message
```

---

# 7. 🧠 `app.state`

FastAPI's application object can hold state.

The example does:

```python
app.state.message = "Resource initialized"
```

Later, the endpoint reads:

```python
app.state.message
```

So the flow is:

```text
lifespan startup
      ↓
app.state.message
      ↓
GET /
      ↓
read app.state.message
```

The example returns:

```json
{
  "message": "Resource initialized"
}
```

---

# 8. 🧹 Lifespan Cleanup

After:

```python
yield
```

the cleanup code runs:

```python
print("🧹 Cleaning up resource")
del app.state.message
```

This gives the complete structure:

```python
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    app.state.message = "Resource initialized"

    yield

    # Shutdown
    del app.state.message
```

The important boundary is `yield`.

```text
        lifespan()
           │
           ▼
      initialization
           │
           ▼
         yield
           │
           │  application running
           │
           ▼
        cleanup
```

---

# 9. 🔄 Lifespan vs Startup/Shutdown

The module contains both approaches.

### Event-based approach

```python
@app.on_event("startup")
async def startup():
    ...
```

```python
@app.on_event("shutdown")
async def shutdown():
    ...
```

### Lifespan approach

```python
@asynccontextmanager
async def lifespan(app: FastAPI):
    # startup

    yield

    # shutdown
```

and:

```python
app = FastAPI(lifespan=lifespan)
```

The module therefore lets you see the two styles directly.

---

# 10. 📬 Background Tasks

`background_demo.py` introduces:

```python
from fastapi import FastAPI, BackgroundTasks
```

A background task is work that FastAPI schedules to run after the response is returned.

The example defines:

```python
def slow_task():
    print("Background task started")

    time.sleep(5)

    print("Background task finished")
```

---

# 11. ➕ Adding a Background Task

The `/hello` endpoint receives:

```python
background_tasks: BackgroundTasks
```

and schedules the task:

```python
background_tasks.add_task(slow_task)
```

The endpoint then immediately returns:

```python
return {"message": "Hello"}
```

The flow is:

```text
GET /hello
    │
    ▼
Schedule slow_task()
    │
    ▼
Return HTTP response
    │
    ▼
Background task executes
    │
    ▼
5-second sleep
    │
    ▼
Task finishes
```

---

# 12. ⏱️ Slow Background Task

The example deliberately uses:

```python
time.sleep(5)
```

inside:

```python
slow_task()
```

The purpose is to make the background behavior observable.

The terminal prints:

```text
Background task started
```

then waits five seconds, and finally prints:

```text
Background task finished
```

Meanwhile, the endpoint has already returned:

```json
{
  "message": "Hello"
}
```

---

# 13. 🧠 What Makes It a Background Task?

The important code is:

```python
background_tasks.add_task(slow_task)
```

FastAPI receives the task and schedules it as background work for the response lifecycle.

This differs from directly calling:

```python
slow_task()
```

inside the endpoint.

If the endpoint directly called the function:

```python
def hello():
    slow_task()
    return {"message": "Hello"}
```

the function would have to finish before the response could be returned.

With:

```python
background_tasks.add_task(slow_task)
```

the task is registered separately and the endpoint returns its response first.

---

# 14. 🔗 Passing Arguments to Background Tasks

The final example defines:

```python
def send_email(resource: str):
    print(f"📧 Background task using {resource}")
    print("📧 Email sent successfully")
```

The endpoint obtains the resource:

```python
resource = app.state.resource
```

and passes it to the background task:

```python
background_tasks.add_task(
    send_email,
    resource
)
```

So `BackgroundTasks` can receive both:

```text
Function
+
Arguments
```

---

# 15. 🔐 Lifespan-Managed Resource

`final_demo.py` initializes a resource during application startup:

```python
app.state.resource = "Email Service"
```

The application is created with:

```python
app = FastAPI(lifespan=lifespan)
```

The resource therefore exists while the application is running.

```text
Application startup
       ↓
"Email Service" initialized
       ↓
app.state.resource
       ↓
Requests can use it
```

---

# 16. 📧 Combining Lifespan + BackgroundTasks

The `/send` endpoint in `final_demo.py` combines both concepts:

```python
@app.get("/send")
def send(background_tasks: BackgroundTasks):
    resource = app.state.resource

    background_tasks.add_task(send_email, resource)

    return {
        "message": "Email request accepted",
        "resource": resource
    }
```

The complete flow is:

```text
Application starts
       ↓
Lifespan initializes
"Email Service"
       ↓
GET /send
       ↓
Read app.state.resource
       ↓
Schedule send_email(resource)
       ↓
Return response
       ↓
Background task uses resource
       ↓
"Email sent successfully"
       ↓
Application shuts down
       ↓
Lifespan cleanup
```

---

# 17. 🧩 Final Example Architecture

The final example connects the two major concepts:

```text
                 FastAPI
                    │
             ┌──────┴──────┐
             │             │
          Lifespan      Request
             │             │
       Initialize          ▼
        resource       /send endpoint
             │             │
             │        app.state.resource
             │             │
             │             ▼
             │       BackgroundTasks
             │             │
             │             ▼
             │        send_email()
             │
             ▼
       Shutdown cleanup
```

This is the most complete example in the module.

---

# 18. 🔄 Lifecycle Timeline

A simplified timeline for `final_demo.py` looks like:

```text
┌──────────────────────────────────────────────────┐
│                 APPLICATION                      │
│                                                  │
│  START                                           │
│   │                                              │
│   ▼                                              │
│  Initialize "Email Service"                      │
│   │                                              │
│   ▼                                              │
│  ───────────── APPLICATION RUNNING ────────────  │
│   │                                              │
│   ├── GET /send                                  │
│   │     │                                        │
│   │     ├── Schedule background task             │
│   │     │                                        │
│   │     └── Return response                      │
│   │                                              │
│   ├── Background task executes                   │
│   │                                              │
│   ▼                                              │
│  SHUTDOWN                                         │
│   │                                              │
│   ▼                                              │
│  Cleanup resource                                 │
│                                                  │
└──────────────────────────────────────────────────┘
```

---

# 19. 🧪 Running the Examples

Run each example individually from the module directory.

---

## 1️⃣ Lifecycle Demo

Start:

```bash
uvicorn lifecycle_demo:app --reload
```

Open:

```text
http://127.0.0.1:8000/
```

You should receive:

```json
{
  "message": "Hello"
}
```

Watch the terminal when the server starts and stops to observe the lifecycle messages.

---

## 2️⃣ Lifespan Demo

Start:

```bash
uvicorn lifespan_demo:app --reload
```

Open:

```text
http://127.0.0.1:8000/
```

The endpoint returns:

```json
{
  "message": "Resource initialized"
}
```

Watch the terminal for:

```text
🚀 Starting application
```

and, when the application shuts down:

```text
🧹 Cleaning up resource
```

---

## 3️⃣ Background Task Demo

Start:

```bash
uvicorn background_demo:app --reload
```

Then open:

```text
http://127.0.0.1:8000/hello
```

The HTTP response is:

```json
{
  "message": "Hello"
}
```

The terminal shows:

```text
Background task started
```

followed by:

```text
Background task finished
```

after the five-second delay.

---

## 4️⃣ Final Demo

Start:

```bash
uvicorn final_demo:app --reload
```

Then open:

```text
http://127.0.0.1:8000/send
```

The response contains:

```json
{
  "message": "Email request accepted",
  "resource": "Email Service"
}
```

The terminal shows the background task using the lifespan-initialized resource:

```text
📧 Background task using Email Service
📧 Email sent successfully
```

---

# 📊 Concept Comparison

| Concept | Purpose | Demonstrated in |
|---|---|---|
| Startup event | Run code when app starts | `lifecycle_demo.py` |
| Shutdown event | Run code when app stops | `lifecycle_demo.py` |
| Lifespan | Group startup + shutdown logic | `lifespan_demo.py` |
| `yield` | Separates startup from cleanup | `lifespan_demo.py` |
| `app.state` | Store application-level state | `lifespan_demo.py`, `final_demo.py` |
| `BackgroundTasks` | Schedule post-response work | `background_demo.py`, `final_demo.py` |
| `add_task()` | Register a background function | `background_demo.py`, `final_demo.py` |
| Resource + task | Use initialized state in background work | `final_demo.py` |

---

# 🧠 Key Takeaways

### 🔄 Application Lifecycle

- 🚀 Startup logic runs when the application starts.
- 🛑 Shutdown logic runs when the application shuts down.
- `@app.on_event()` demonstrates explicit startup/shutdown handlers.
- `lifespan` groups initialization and cleanup into one context manager.
- `yield` separates the startup portion from the shutdown portion.

### 🗃️ Application State

- `app.state` can hold application-level values.
- A value initialized during lifespan startup can be accessed by request handlers.
- The final example stores `"Email Service"` in `app.state.resource`.

### 📬 Background Tasks

- `BackgroundTasks` lets a route register work to execute after the response.
- `background_tasks.add_task()` accepts a function and its arguments.
- The module demonstrates a slow task using `time.sleep(5)`.
- The final example passes a lifespan-managed resource into a background task.

### 🔗 Combining the Concepts

The final example demonstrates a useful pattern:

```text
Lifespan
   ↓
Initialize resource
   ↓
app.state
   ↓
Request handler
   ↓
BackgroundTasks
   ↓
Use resource
   ↓
Cleanup during shutdown
```

---

# ⚠️ Important Boundary

This module demonstrates **FastAPI background tasks**, not a full distributed task queue.

The examples use:

```python
BackgroundTasks
```

directly inside FastAPI.

For the code in this module, the purpose is to understand:

```text
request handling
+
post-response work
```

and how that interacts with application lifecycle state.

Do not confuse this mechanism with a separate worker system or distributed job-processing architecture; those are outside the scope of the examples in this module.

---

# 🏁 Module Status

**Module 13 — Background Tasks & Lifespan** ✅

This module establishes the fundamentals of FastAPI application lifecycle management, resource initialization and cleanup with `lifespan`, and background task execution with `BackgroundTasks`.

---

## 📚 FastAPI Progress

```text
01 — Basics                    ✅
02 — Project Structure         ✅
03 — Authentication            ✅
04 — Error Handling            ✅
05 — Middleware                ✅
06 — Dependency Injection      ✅
07 — Pydantic + API Design     ✅
08 — SQLAlchemy Relationships  ✅
09 — Testing                   ✅
10 — Transactions              ✅
11 — Async & Await             ✅
12 — Configuration & Security  ✅
13 — Background Tasks & Lifespan ✅  ← Current
14 — ...
    ↓
17 — Full-Stack Backend        🚀
```
