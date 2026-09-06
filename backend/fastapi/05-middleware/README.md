# 🧩 FastAPI — Middleware

> **Module 05** of the FastAPI learning series.

This module focuses on HTTP middleware in FastAPI. The documentation is generated from the actual contents of the uploaded `05-middleware.zip`.

---

## 🎯 Module Goal

Middleware sits around the normal request/response processing flow.

Instead of putting cross-cutting behavior inside every endpoint, middleware can execute logic:

```text
Incoming Request
       ↓
   Middleware
       ↓
   Endpoint
       ↓
   Middleware
       ↓
Outgoing Response
```

This module demonstrates the middleware behavior implemented in its source files.

---

## 📁 Project Structure

```text
05-middleware/
├── 05-middleware/main.py
```

---

## 🔎 Middleware Concepts Present

- 🌐 **HTTP middleware** using the FastAPI request/response middleware mechanism.
- 🧩 **Middleware function(s):** `my_middleware`.
- ⏱️ **Request timing measurement** using a time measurement function.
- 📝 **Request/response logging** implemented in the module.
- 📬 **Response header handling** is present in the implementation.

---

## 🧱 File-by-File Implementation

### 📄 `05-middleware/main.py`

**Functions:** `my_middleware`, `home`

```python
from fastapi import FastAPI, Request
import time
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def my_middleware(request: Request, call_next):

    start_time = time.time()

    print(f"Request: {request.method} {request.url.path}")

    response = await call_next(request)

    process_time = time.time() - start_time

    response.headers["X-Process-Time"] = str(process_time)

    print(f"Response status: {response.status_code}")
    print(f"Request took {process_time:.4f} seconds")

    return response

@app.get("/")
def home():
    print("Inside endpoint")
    return {"message": "Hello"}
```

---

## 🔄 Request/Response Lifecycle

The core idea demonstrated by middleware is that the middleware function wraps the endpoint execution:

```text
Client
  │
  │ HTTP Request
  ▼
┌─────────────────┐
│    Middleware   │
│  Before logic   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    FastAPI      │
│    Endpoint     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Middleware   │
│  After logic    │
└────────┬────────┘
         │
         ▼
      Response
         │
         ▼
       Client
```

The module's actual middleware implementation above determines what happens before and after the endpoint.

---

## 🧠 Key Takeaways

- 🔄 Middleware can surround normal endpoint execution.
- 🧩 It is useful for behavior that applies across multiple routes.
- 🌐 HTTP middleware receives the request and can continue processing through the next application layer.
- 📤 The middleware can inspect or modify the resulting response when the implementation requires it.
- 🧱 Keeping cross-cutting behavior in middleware prevents duplicating the same logic across individual endpoints.

---

## ▶️ Running the Module

Run the FastAPI application using the entry point present in the module.

For a FastAPI application whose entry point is `main.py`:

```bash
uvicorn main:app --reload
```

Then open:

```text
http://127.0.0.1:8000/docs
```

Use the exposed endpoints and observe the middleware behavior in the application output/response.

> 📌 The exact command should match the entry point contained in the module.

---

## 🧪 What to Verify

When experimenting with the middleware:

1. Start the FastAPI application.
2. Send a request to one of the available endpoints.
3. Observe the middleware's behavior before the endpoint runs.
4. Observe the behavior after the endpoint returns.
5. Check the resulting HTTP response.

This makes the middleware lifecycle much easier to understand than looking at the decorator alone.

---

## 🏁 Module Status

**Module 05 — Middleware** ✅

This module establishes the middleware layer that can later be used for application-wide request/response behavior.

---

## 📚 Progress

```text
01 — Basics              ✅
02 — Project Structure   ✅
03 — Authentication      ✅
04 — Error Handling      ✅
05 — Middleware          ✅  ← Current
06 — ...
   ↓
17 — Full-Stack Backend  🚀
```
