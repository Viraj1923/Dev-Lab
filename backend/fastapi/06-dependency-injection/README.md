# 💉 FastAPI — Dependency Injection

> **Module 06** of the FastAPI learning series.

This module focuses on FastAPI's **Dependency Injection** mechanism using the code contained in the uploaded `06-dependency-injection.zip`.

---

## 🎯 Module Goal

FastAPI provides dependency injection through `Depends`.

Instead of manually creating or calling shared functionality inside every endpoint, a dependency can be declared and FastAPI can resolve it before calling the endpoint.

The module's implementation is documented below directly from its source files.

---

## 📁 Project Structure

```text
06-dependency-injection/
├── 06-dependency-injection/main.py
```

---

## 🔎 Core Concepts Present

- 💉 **`Depends`** — FastAPI's dependency injection mechanism is used in the module.
- 🧩 **Dependency functions:** `get_greeting`, `get_name`, `home`, `hello`, `get_resource`, `use_resource`.
- 🌐 **Route handlers:** 3 route decorator(s) are present.

---

## 🧱 File-by-File Implementation

The following source is included so the README accurately reflects the implementation rather than describing a generic dependency-injection example.

### 📄 `06-dependency-injection/main.py`

**Functions:** `get_greeting`, `get_name`, `home`, `hello`, `get_resource`, `use_resource`

```python
from fastapi import FastAPI, Depends

app = FastAPI()

def get_greeting():
    print("get_greeting() executed")
    return "Hello"


def get_name(greeting=Depends(get_greeting)):
    print("get_name() executed")
    return f"{greeting}, Viraj"


@app.get("/")
def home(name=Depends(get_name)):
    print("home() executed")
    return {"message": name}


@app.get("/hello")
def hello(name=Depends(get_name)):
    return {"message": f"Hello {name}"}

def get_resource():
    print("Resource created")

    try:
        yield "My Resource"
    finally:
        print("Resource cleaned up")

@app.get("/resource")
def use_resource(resource=Depends(get_resource)):
    print("Using resource")
    return {"resource": resource}
```

---

## 🔄 Dependency Injection Flow

The fundamental flow demonstrated by FastAPI dependencies is:

```text
Incoming Request
       ↓
FastAPI resolves dependency
       ↓
Dependency function
       ↓
Dependency result
       ↓
Endpoint receives injected value
       ↓
Endpoint executes
       ↓
HTTP Response
```

The exact dependency and endpoint behavior in this module is defined by the source code above.

---

## 🧠 Why Dependency Injection Matters

Dependency injection helps keep endpoint functions focused on their actual job.

Conceptually:

```text
Without DI

Endpoint
 ├── create shared object
 ├── perform shared logic
 ├── validate/access shared state
 └── perform endpoint operation


With DI

Dependency
 └── shared logic

Endpoint
 └── endpoint operation
```

FastAPI handles the dependency resolution when the dependency is declared with `Depends`.

---

## 🛠️ Important `Depends` Pattern

The central FastAPI pattern introduced in this module is:

```python
from fastapi import Depends
```

and then declaring a dependency in an endpoint:

```python
def endpoint(value=Depends(dependency)):
    ...
```

The dependency is resolved by FastAPI rather than the endpoint manually invoking it.

---

## 🧩 Dependency Injection and Application Design

Dependency injection becomes especially useful as an API grows because shared concerns can be moved out of individual route functions.

Typical architectural areas that can benefit from this pattern include:

```text
Routes
  │
  ├── Authentication dependencies
  ├── Database dependencies
  ├── Shared request dependencies
  └── Common application services
```

> 📌 The examples above describe the general architectural role of the mechanism. The concrete dependencies implemented in this module are shown in the file-by-file section.

---

## ▶️ Running the Module

Run the FastAPI application using the entry point contained in the module.

For a standard `main.py` entry point:

```bash
uvicorn main:app --reload
```

Then open:

```text
http://127.0.0.1:8000/docs
```

The Swagger UI can be used to exercise the routes implemented by this module.

> 📌 Use the actual entry point from the module when running it; the command above is only the standard FastAPI form.

---

## 🧪 What to Verify

When experimenting with this module:

1. Start the application.
2. Open `/docs`.
3. Execute an endpoint that uses a dependency.
4. Observe the value supplied to the endpoint by FastAPI.
5. Modify the dependency and observe how the endpoint behavior changes without manually calling the dependency.

---

## 🧠 Key Takeaways

- 💉 `Depends` is FastAPI's built-in dependency injection mechanism.
- 🧩 Dependencies allow reusable logic to be provided to route handlers.
- 🔄 FastAPI resolves declared dependencies as part of request processing.
- 🧱 Dependency injection helps separate shared logic from endpoint logic.
- 🚀 The pattern becomes increasingly valuable as the application grows.

---

## 🏁 Module Status

**Module 06 — Dependency Injection** ✅

This module establishes the dependency-injection pattern used to build cleaner and more maintainable FastAPI applications.

---

## 📚 Progress

```text
01 — Basics                 ✅
02 — Project Structure      ✅
03 — Authentication         ✅
04 — Error Handling         ✅
05 — Middleware             ✅
06 — Dependency Injection   ✅  ← Current
07 — ...
   ↓
17 — Full-Stack Backend     🚀
```
