# ⚡ FastAPI — Async & Await

> **Module 11** of the FastAPI learning series.

This module introduces **asynchronous programming in Python** and applies it to FastAPI, HTTP clients, and SQLAlchemy.

The examples progress from basic `async`/`await` behavior to asynchronous database access and finally combine database operations with an external HTTP request.

---

## 🎯 Module Goal

The central idea of this module is understanding how asynchronous code behaves and why simply declaring a function with `async` does **not** automatically make every operation inside it non-blocking.

The module demonstrates:

```text
Python async/await
       ↓
asyncio
       ↓
Concurrent execution
       ↓
FastAPI async endpoints
       ↓
Async HTTP requests
       ↓
Async SQLAlchemy
       ↓
Combined async API
```

---

# 📁 Project Structure

```text
11-async/
│
├── main.py
├── async_demo.py
├── external_api.py
├── async_db.py
├── async_api.py
└── final_async_api.py
```

### File responsibilities

| File | Focus |
|---|---|
| `main.py` | Basic FastAPI sync/async endpoints and async HTTP request |
| `async_demo.py` | `asyncio`, sequential execution, `asyncio.gather()` |
| `external_api.py` | Asynchronous HTTP request with `httpx` |
| `async_db.py` | Async SQLAlchemy engine, session, insert, commit, and query |
| `async_api.py` | FastAPI + async SQLAlchemy CRUD-style endpoints |
| `final_async_api.py` | Combines async database access with an external API call |

---

# 1. 🧠 `async` and `await`

Python asynchronous functions are declared using:

```python
async def
```

For example:

```python
async def async_endpoint():
    await asyncio.sleep(2)

    return {"message": "Hello from async endpoint"}
```

The `await` expression pauses the current coroutine while allowing the event loop to work on other tasks.

The basic pattern is:

```text
async def
    ↓
coroutine
    ↓
await something
    ↓
event loop can run other work
```

---

# 2. ⏱️ `asyncio.sleep()` vs `time.sleep()`

This module intentionally demonstrates an important distinction.

## Non-blocking sleep

In `main.py`:

```python
await asyncio.sleep(2)
```

This is asynchronous.

While the coroutine is waiting, the event loop can handle other work.

Conceptually:

```text
Request A
   ↓
await asyncio.sleep()
   ↓
Event loop handles other work
   ↓
Request A resumes
```

---

# 3. 🚨 Blocking Code Inside `async def`

`async_demo.py` and `async_api.py` also demonstrate the opposite case.

The code uses:

```python
time.sleep(delay)
```

inside an `async def` function:

```python
async def task(name, delay):
    print(f"{name} started")

    time.sleep(delay)

    print(f"{name} finished")
```

This is **blocking**.

Even though the surrounding function is declared:

```python
async def
```

`time.sleep()` blocks the executing thread.

So:

```text
async def
   +
time.sleep()
   =
blocking operation
```

This is a key lesson of the module:

> **`async def` does not make blocking code asynchronous.**

---

# 4. 🔄 Sequential vs Concurrent Execution

`async_demo.py` compares two execution styles.

First:

```python
await task("A", 2)
await task("B", 2)
```

The tasks run sequentially.

Conceptually:

```text
A ────────── 2 sec ──────────┐
                             │
B                            └───────── 2 sec ──────────

Total ≈ 4 sec
```

The script prints the measured result:

```text
Sequential: ...
```

---

# 5. ⚡ `asyncio.gather()`

The same tasks are then started using:

```python
await asyncio.gather(
    task("A", 2),
    task("B", 2)
)
```

The intention is to run the two awaitable operations concurrently.

Conceptually:

```text
A ────────── 2 sec ──────────┐
                             │
B ────────── 2 sec ──────────┘

Total ≈ 2 sec
```

The script prints:

```text
Concurrent: ...
```

### But there is an important detail

The `task()` implementation uses:

```python
time.sleep(delay)
```

rather than:

```python
await asyncio.sleep(delay)
```

Therefore the tasks are still blocking the event loop.

This means the example is useful specifically for demonstrating **why blocking operations undermine async concurrency**.

---

# 6. 🌐 FastAPI Sync Endpoint

`main.py` contains:

```python
@app.get("/sync")
def sync_endpoint():
    return {"message": "Hello from sync endpoint"}
```

This is a normal synchronous FastAPI route.

```text
GET /sync
    ↓
def sync_endpoint()
    ↓
response
```

---

# 7. ⚡ FastAPI Async Endpoint

The same application contains:

```python
@app.get("/async")
async def async_endpoint():
    await asyncio.sleep(2)

    return {"message": "Hello from async endpoint"}
```

This route is asynchronous.

It waits using:

```python
await asyncio.sleep(2)
```

rather than blocking with `time.sleep()`.

---

# 8. 👤 Async Route Parameter

The application also demonstrates an async route with a path parameter:

```python
@app.get("/async/{name}")
async def async_task(name: str):
    print(f"{name} started")

    await asyncio.sleep(5)

    print(f"{name} finished")

    return {"message": f"Hello {name}"}
```

For example:

```text
GET /async/Viraj
```

returns:

```json
{
  "message": "Hello Viraj"
}
```

The endpoint waits asynchronously for five seconds before returning.

This makes it useful for observing how multiple requests can interact with an async event loop.

---

# 9. 🌐 Async HTTP Requests with HTTPX

`main.py` and `final_async_api.py` use:

```python
httpx.AsyncClient
```

The basic pattern is:

```python
async with httpx.AsyncClient() as client:
    response = await client.get(
        "https://httpbin.org/get"
    )
```

There are two important async operations here:

```text
async with
    ↓
create/use async HTTP client

await client.get(...)
    ↓
wait for HTTP response asynchronously
```

---

# 10. 📡 External API Endpoint

`main.py` exposes:

```text
GET /external
```

It sends an asynchronous request to:

```text
https://httpbin.org/get
```

and returns:

```python
{
    "status_code": response.status_code,
    "data": response.json()
}
```

The API therefore acts as:

```text
Client
  ↓
FastAPI
  ↓
httpx.AsyncClient
  ↓
External HTTP API
  ↓
FastAPI
  ↓
Client
```

---

# 11. 🗄️ Async SQLAlchemy

`async_db.py` introduces asynchronous SQLAlchemy.

The database URL is:

```python
DATABASE_URL = "sqlite+aiosqlite:///./async_test.db"
```

Notice:

```text
sqlite://
```

has become:

```text
sqlite+aiosqlite://
```

This configures SQLite access through the `aiosqlite` async driver.

---

# 12. ⚙️ Async SQLAlchemy Engine

The engine is created with:

```python
engine = create_async_engine(
    DATABASE_URL,
    echo=True
)
```

The important difference from synchronous SQLAlchemy is:

```python
create_async_engine(...)
```

instead of:

```python
create_engine(...)
```

SQL statements can then be awaited through the async SQLAlchemy API.

---

# 13. 🔧 Async Session Factory

The module creates sessions using:

```python
SessionLocal = async_sessionmaker(
    bind=engine,
    expire_on_commit=False
)
```

This produces `AsyncSession` instances.

The setting:

```python
expire_on_commit=False
```

keeps ORM object attributes available after:

```python
await db.commit()
```

which is useful in the examples when returning the newly created user's fields.

---

# 14. 👤 Async Database Model

The `User` model is:

```python
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    name = Column(String)
```

It contains:

```text
users
├── id
└── name
```

---

# 15. 🔄 Async Database Lifecycle

`async_db.py` creates the tables using:

```python
async with engine.begin() as conn:
    await conn.run_sync(
        Base.metadata.create_all
    )
```

The database lifecycle is:

```text
Async engine
     ↓
engine.begin()
     ↓
run_sync(create_all)
     ↓
tables created
```

`run_sync()` is used here to execute the synchronous SQLAlchemy metadata operation through the asynchronous connection context.

---

# 16. ➕ Creating a User Asynchronously

The example creates:

```python
user = User(name="Viraj")
```

Then adds it:

```python
db.add(user)
```

and commits asynchronously:

```python
await db.commit()
```

After the commit:

```python
print(f"Created user with id: {user.id}")
```

The complete flow is:

```text
Create ORM object
      ↓
db.add()
      ↓
await db.commit()
      ↓
Database persists record
```

---

# 17. 🔍 Querying with Async SQLAlchemy

The module uses SQLAlchemy's `select()` construct:

```python
result = await db.execute(
    select(User)
)
```

Then retrieves ORM objects:

```python
users = result.scalars().all()
```

The pattern is:

```text
select(User)
     ↓
await db.execute()
     ↓
result
     ↓
result.scalars()
     ↓
User objects
```

This is the asynchronous equivalent of executing a SQLAlchemy query through an `AsyncSession`.

---

# 18. 🌐 FastAPI + Async Database

`async_api.py` combines FastAPI with asynchronous SQLAlchemy.

The database dependency is:

```python
async def get_db():
    async with SessionLocal() as db:
        yield db
```

This gives each request an async database session.

The route receives it through:

```python
db: AsyncSession = Depends(get_db)
```

The architecture is:

```text
HTTP Request
     ↓
FastAPI
     ↓
Depends(get_db)
     ↓
AsyncSession
     ↓
SQLAlchemy
     ↓
SQLite
```

---

# 19. 👤 Async User Creation Endpoint

`async_api.py` contains:

```text
POST /users
```

The request schema is:

```python
class UserCreate(BaseModel):
    name: str
```

The endpoint creates:

```python
user = User(name=user_data.name)
```

then:

```python
db.add(user)

await db.commit()

await db.refresh(user)
```

Finally it returns:

```python
{
    "id": user.id,
    "name": user.name
}
```

---

# 20. 📋 Async User List Endpoint

The application also contains:

```text
GET /users
```

The query is:

```python
result = await db.execute(
    select(User)
)
```

and:

```python
users = result.scalars().all()
```

The endpoint converts the ORM objects into dictionaries:

```python
return [
    {
        "id": user.id,
        "name": user.name
    }
    for user in users
]
```

---

# 21. 🚨 Blocking Example in FastAPI

`async_api.py` intentionally contains:

```python
@app.get("/bad-async")
async def bad_async():
    print("Bad request started")

    time.sleep(5)

    print("Bad request finished")

    return {"message": "Done"}
```

The function is asynchronous:

```python
async def
```

but the operation is not:

```python
time.sleep(5)
```

This blocks the event loop for five seconds.

The example exists to make the distinction clear:

```text
async def
   ≠
everything inside is non-blocking
```

The blocking operation itself must be replaced with an asynchronous alternative when appropriate.

---

# 22. ⚡ Instant Endpoint

`async_api.py` also contains:

```text
GET /instant
```

which immediately returns:

```python
{"message": "Instant"}
```

This endpoint is useful when observing the effect of the blocking `/bad-async` route.

The conceptual comparison is:

```text
/bad-async
    ↓
blocking operation
    ↓
5 seconds


/instant
    ↓
immediate response
```

The example helps illustrate why blocking work inside an async application can affect unrelated requests.

---

# 23. 🧩 Final Async API

`final_async_api.py` combines the two major async concepts covered in the module:

```text
Async Database
      +
Async External HTTP
```

The application uses:

```python
AsyncSession
```

for the database and:

```python
httpx.AsyncClient
```

for the external request.

---

# 24. 📊 Dashboard Endpoint

The final application contains:

```text
GET /dashboard
```

Inside the endpoint:

```python
async with httpx.AsyncClient() as client:
    response = await client.get(
        "https://httpbin.org/get"
    )
```

Then the database is queried:

```python
result = await db.execute(
    select(User)
)
```

The response combines both results:

```python
return {
    "users": [...],
    "external_api_status": response.status_code
}
```

Conceptually:

```text
                 /dashboard
                     │
          ┌──────────┴──────────┐
          ↓                     ↓
   External HTTP            Database
          ↓                     ↓
   status_code              users
          │                     │
          └──────────┬──────────┘
                     ↓
              Combined JSON
```

---

# 25. 🔗 `async with`

The module uses:

```python
async with httpx.AsyncClient() as client:
```

and:

```python
async with SessionLocal() as db:
```

`async with` manages an asynchronous resource's lifecycle.

The important point demonstrated by the code is that:

```text
async with
```

creates a context manager scope for the resource; it is not a new function scope.

---

# 26. 🧠 Async Architecture

The progression across the module is:

```text
                 Python
                   │
                   ▼
             async / await
                   │
                   ▼
                asyncio
                   │
          ┌────────┴────────┐
          ▼                 ▼
      Async HTTP       Async Database
       (httpx)          (SQLAlchemy)
          │                 │
          └────────┬────────┘
                   ▼
                FastAPI
                   │
                   ▼
              Async API
```

---

# 27. 📊 Sync vs Async

| Area | Synchronous | Asynchronous |
|---|---|---|
| Function | `def` | `async def` |
| Wait | Blocking operation | `await` |
| Sleep | `time.sleep()` | `await asyncio.sleep()` |
| HTTP client | Regular/sync client | `httpx.AsyncClient` |
| SQLAlchemy | `Session` | `AsyncSession` |
| Engine | `create_engine()` | `create_async_engine()` |
| Session factory | `sessionmaker()` | `async_sessionmaker()` |

The module demonstrates both styles so that the difference can be observed rather than treated as just syntax.

---

# 28. 🚨 The Most Important Lesson

This module is **not simply about adding `async` everywhere**.

Consider:

```python
async def task():
    time.sleep(5)
```

That function is syntactically asynchronous but contains a blocking operation.

Compare it with:

```python
async def task():
    await asyncio.sleep(5)
```

The second version yields control while waiting.

Therefore:

```text
async def
    +
awaitable / non-blocking operation
    =
useful async code
```

while:

```text
async def
    +
blocking operation
    =
event-loop blocking
```

Understanding this distinction is more important than memorizing async syntax.

---

# 🧪 Suggested Experiment Order

Run the examples individually.

### 1️⃣ Basic FastAPI async behavior

Start:

```bash
uvicorn main:app --reload
```

Open:

```text
http://127.0.0.1:8000/docs
```

Try:

```text
GET /sync
GET /async
GET /async/{name}
GET /external
```

---

### 2️⃣ Compare sequential and concurrent code

Run:

```bash
python async_demo.py
```

Observe:

```text
Sequential: ...
Concurrent: ...
```

Then inspect `task()` carefully.

It uses:

```python
time.sleep()
```

which is intentionally blocking.

---

### 3️⃣ Async database

Run:

```bash
python async_db.py
```

Observe:

```text
Created user with id: ...
```

and the SQL generated by SQLAlchemy.

---

### 4️⃣ Async FastAPI + database

Start:

```bash
uvicorn async_api:app --reload
```

Open:

```text
http://127.0.0.1:8000/docs
```

Test:

```text
POST /users
GET /users
GET /bad-async
GET /instant
```

---

### 5️⃣ Final combined API

Start:

```bash
uvicorn final_async_api:app --reload
```

Open:

```text
http://127.0.0.1:8000/docs
```

Test:

```text
POST /users
GET /dashboard
```

The dashboard combines:

```text
Database users
+
External API status
```

---

# 📌 Important Implementation Detail

`external_api.py` contains a separate example of an async HTTP request. The file currently has its earlier `asyncio.gather()` example commented out and an active `main()` implementation.

The active implementation contains:

```python
results=await asyncio(fetch_data(...))
```

This is the code as provided in the module and is not the same API as `asyncio.gather()` demonstrated in `async_demo.py`.

For the learning flow, the important async HTTP pattern elsewhere in the module is:

```python
async with httpx.AsyncClient() as client:
    response = await client.get(...)
```

---

# 🧠 Key Takeaways

### Python Async

- ⚡ `async def` defines a coroutine.
- ⏸️ `await` waits for an awaitable without using a blocking sleep.
- 🔄 `asyncio.gather()` can coordinate multiple awaitables.
- 🚨 Blocking functions such as `time.sleep()` can block the event loop even when called from `async def`.

### FastAPI

- 🚀 FastAPI supports `async def` route handlers.
- 🌐 Async routes are useful when the route performs asynchronous I/O.
- ⛔ Blocking operations inside async routes can hurt concurrency.

### HTTPX

- 📡 `httpx.AsyncClient` provides asynchronous HTTP requests.
- `await client.get(...)` waits asynchronously for the HTTP response.
- `async with` manages the client lifecycle.

### SQLAlchemy

- 🗄️ `create_async_engine()` creates an async SQLAlchemy engine.
- 🔧 `async_sessionmaker()` creates async sessions.
- `AsyncSession` is used for database operations.
- Database execution uses `await db.execute(...)`.
- Transactions use `await db.commit()`.
- ORM objects can be refreshed with `await db.refresh(...)`.

### Architecture

The final example demonstrates how an async FastAPI endpoint can work with:

```text
FastAPI
  │
  ├── Async SQLAlchemy
  │       ↓
  │    Database
  │
  └── HTTPX AsyncClient
          ↓
      External API
```

---

# 🏁 Module Status

**Module 11 — Async & Await** ✅

This module establishes the foundation for asynchronous Python programming and demonstrates how `async`/`await` is applied to FastAPI endpoints, HTTP requests, SQLAlchemy database operations, and combined API workflows.

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
11 — Async & Await             ✅  ← Current
12 — ...
    ↓
17 — Full-Stack Backend        🚀
```
