# ⚠️ FastAPI — Error Handling

> **Module 04** of the FastAPI learning series.

This module focuses on the error-handling implementation contained in the uploaded `04-error-handling` project. The documentation is based on the files actually present in the module.

---

## 🎯 Module Goal

The goal of this module is to understand how a FastAPI application can handle failures and return meaningful HTTP responses instead of allowing errors to become uncontrolled application failures.

The examples in this module demonstrate the error-handling mechanisms that are actually implemented in the source code.

---

## 📁 Project Structure

```text
04-error-handling/
├── 04-error-handling/main.py
├── 04-error-handling/schemas/item.py
```

---

## 🔎 Concepts Present in the Module

- 🚨 `HTTPException` — returning HTTP errors from API endpoints.
- 🧩 Custom exception handlers — intercepting specific exceptions at the application level.
- 🛠️ Custom exception classes — defining application-specific exceptions.
- 🧪 Validation-related exceptions — handling validation failures where implemented.

---

## 🧱 File-by-File Implementation

### 📄 `04-error-handling/main.py`

**Classes:** `ItemNotFoundException`

**Functions:** `validation_exception_handler`, `item_not_found_handler`, `get_item`, `create_item`

```python
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from schemas.item import Item
from fastapi.exceptions import RequestValidationError

app = FastAPI()

class ItemNotFoundException(Exception):
    pass

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    return JSONResponse(
        status_code=422,
        content={
            "success": False,
            "message": "Invalid request data",
            "errors": exc.errors()
        }
    )

@app.exception_handler(ItemNotFoundException)
async def item_not_found_handler(
    request: Request,
    exc: ItemNotFoundException
):
    return JSONResponse(
        status_code=404,
        content={
            "success": False,
            "error": "ITEM_NOT_FOUND",
            "message": "Item not found"
        }
    )

@app.get("/items/{item_id}")
def get_item(item_id: int):

    if item_id != 1:
        raise ItemNotFoundException()

    return {
        "id": 1,
        "name": "Laptop"
    }

@app.post("/items")
def create_item(item: Item):
    return item
```

### 📄 `04-error-handling/schemas/item.py`

**Classes:** `Item`

```python
from pydantic import BaseModel


class Item(BaseModel):
    name: str
    price: float
```

---

## 🔄 Error-Handling Mindset

A useful way to view the implementation is:

```text
Incoming Request
       ↓
   Route Logic
       ↓
   Something fails
       ↓
Exception / Error
       ↓
FastAPI Error Handling
       ↓
HTTP Response
       ↓
Client
```

The important distinction is between an error that should be returned deliberately as an HTTP response and an unexpected failure that should not be silently hidden.

---

## 🧠 Key Takeaways

- 🚨 Use HTTP errors deliberately when an API operation cannot be completed.
- 🚦 Return an appropriate HTTP status instead of treating every failure as a successful response.
- 🧩 Keep error-handling behavior centralized when the application requires reusable handling.
- 🛠️ Custom exceptions can represent application-specific failure conditions.
- 🧪 Validation failures are part of the API boundary and should be handled consistently.
- 🔍 Clear error responses make APIs easier to debug and consume.

---

## ▶️ Running the Module

From the module directory, start the FastAPI application using the entry point present in the project.

For a typical FastAPI entry point:

```bash
uvicorn main:app --reload
```

Then open the interactive API documentation at:

```text
/docs
```

Use the endpoints exposed by this module to observe the implemented success and error responses.

> 📌 The exact entry point and endpoints should be taken from the module's source files above rather than assuming a structure that is not present.

---

## 🧪 Testing Error Paths

When working through this module, test both:

```text
✅ Valid request
❌ Invalid / failing request
```

For each error path, verify:

1. The expected exception is triggered.
2. The HTTP status code is correct.
3. The returned error response matches the implementation.
4. The API continues to respond correctly to subsequent requests.

---

## 🏁 Module Status

**Module 04 — Error Handling** ✅

This module establishes the error-handling concepts used by the more structured FastAPI applications developed later in the series.

---

## 📚 Progress

```text
01 — Basics              ✅
02 — Project Structure   ✅
03 — Authentication      ✅
04 — Error Handling      ✅  ← Current
05 — ...
   ↓
17 — Full-Stack Backend  🚀
```
