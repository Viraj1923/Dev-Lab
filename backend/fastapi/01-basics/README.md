# 🚀 FastAPI Basics

> A practical introduction to FastAPI covering the core building blocks of API development through small, focused examples.

---

## 📌 Overview

This module is the starting point of the FastAPI section. Instead of building one large application immediately, the concepts are demonstrated through separate Python files, with each file focusing on a specific FastAPI feature.

The module progresses from simple routes to:

```text
Basic Routes
    ↓
Path & Query Parameters
    ↓
Request Bodies
    ↓
Pydantic Validation
    ↓
Nested Models & Responses
    ↓
Status Codes & Errors
    ↓
Dependencies
    ↓
Sync vs Async
    ↓
HTTP Middleware
```

---

## 🗂️ Module Structure

```text
01-basics/
│
├── main.py
├── 03_request_body.py
├── 04_pydantic_validation.py
├── 05_nested_response.py
├── 06_status_errors.py
├── 07_dependencies.py
├── 08_async.py
└── 09_middleware.py
```

Each file is a standalone FastAPI example.

> **Note:** The numbering begins at `03` because this module's files correspond to progressively introduced concepts in the overall learning sequence.

---

# 1. 🟢 Basic FastAPI Application

**File:** `main.py`

The `main.py` file introduces the basic structure of a FastAPI application.

```python
from fastapi import FastAPI

app = FastAPI()
```

The `FastAPI()` instance is the application object to which API routes are registered.

---

## 🏠 Root Endpoint

```python
@app.get("/")
def home():
    return {"message": "Hello World"}
```

A `GET` request to `/` returns:

```json
{
  "message": "Hello World"
}
```

---

## ℹ️ About Endpoint

```python
@app.get("/about")
def about():
    return {
        "name": "Viraj",
        "role": "Software Engineer"
    }
```

This demonstrates returning a Python dictionary directly from an endpoint. FastAPI converts the returned data into a JSON response.

---

## 👤 POST Endpoint

```python
@app.post("/users")
def create_user():
    return {"message": "User created"}
```

The `@app.post()` decorator creates an endpoint that accepts HTTP `POST` requests.

At this stage, the endpoint does not accept a request body; it simply returns a response.

---

# 2. 🔢 Path Parameters

**File:** `main.py`

FastAPI can extract values directly from the URL.

```python
@app.get("/products/{product_id}")
def get_product(product_id: int):
    return {"Product Id": product_id}
```

For:

```text
GET /products/25
```

FastAPI passes:

```python
product_id = 25
```

Because the parameter is declared as:

```python
product_id: int
```

FastAPI validates the path parameter as an integer.

### Example

```text
/products/10
```

Response:

```json
{
  "Product Id": 10
}
```

---

# 3. 🔎 Query Parameters

**File:** `main.py`

Query parameters can be declared directly in the endpoint function.

```python
@app.get("/products")
def get_products(limit: int = 10):
    return {"Limit": limit}
```

The default value is:

```text
limit = 10
```

So:

```text
GET /products
```

returns:

```json
{
  "Limit": 10
}
```

While:

```text
GET /products?limit=5
```

returns:

```json
{
  "Limit": 5
}
```

The type annotation:

```python
limit: int
```

tells FastAPI to parse and validate the query parameter as an integer.

---

# 4. 📦 Request Body

**File:** `03_request_body.py`

This example introduces request bodies using a Pydantic model.

```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()
```

A request model is defined:

```python
class User(BaseModel):
    name: str
    age: int
    role: str
```

The endpoint receives the model:

```python
@app.post("/users")
def create_user(user: User):
    return user
```

The client can send:

```json
{
  "name": "Viraj",
  "age": 22,
  "role": "Developer"
}
```

FastAPI uses the `User` model to parse the JSON request body and provide the endpoint with a validated `User` object.

---

## 🔄 Request Flow

```text
HTTP POST /users
       ↓
JSON Request Body
       ↓
Pydantic User Model
       ↓
Validation / Parsing
       ↓
create_user(user)
       ↓
JSON Response
```

---

# 5. 🧪 Pydantic Validation

**File:** `04_pydantic_validation.py`

This example adds constraints to request data.

```python
class User(BaseModel):
    name: str
    age: int = Field(ge=18, le=100)
    email: str | None = None
```

The `age` field has:

```python
Field(ge=18, le=100)
```

which means:

- `ge=18` → greater than or equal to 18
- `le=100` → less than or equal to 100

Therefore, valid ages are within:

```text
18 ≤ age ≤ 100
```

The `email` field is optional:

```python
email: str | None = None
```

A valid request can therefore be:

```json
{
  "name": "Viraj",
  "age": 22,
  "email": "viraj@example.com"
}
```

or:

```json
{
  "name": "Viraj",
  "age": 22
}
```

---

## ❌ Invalid Input

For example:

```json
{
  "name": "Viraj",
  "age": 15
}
```

The request violates the `age >= 18` constraint, so FastAPI/Pydantic rejects the request instead of passing invalid data to the endpoint.

---

# 6. 🧩 Nested Models & Response Models

**File:** `05_nested_response.py`

This example introduces nested Pydantic models and explicit response schemas.

---

## 🏠 Address Model

```python
class Address(BaseModel):
    city: str
    pincode: int
```

---

## 👤 User Creation Model

```python
class UserCreate(BaseModel):
    name: str
    age: int
    address: Address
```

The `address` field itself is another Pydantic model.

This allows a nested JSON structure such as:

```json
{
  "name": "Viraj",
  "age": 22,
  "address": {
    "city": "Pune",
    "pincode": 411001
  }
}
```

---

## 📤 Response Model

A separate response model is defined:

```python
class UserResponse(BaseModel):
    name: str
    age: int
    address: Address
```

The endpoint declares it with:

```python
@app.post("/users", response_model=UserResponse)
def create_user(user: UserCreate):
    return user
```

This introduces an important API-design concept:

```text
Request Schema
    ↓
UserCreate

Response Schema
    ↓
UserResponse
```

The request and response contracts can therefore be explicitly defined instead of relying on an unstructured dictionary.

---

# 7. 🚦 Status Codes & HTTP Errors

**File:** `06_status_errors.py`

This example introduces HTTP status codes and `HTTPException`.

---

## ✅ Custom Success Status

```python
@app.post("/users", status_code=status.HTTP_201_CREATED)
def create():
    return {"message": "User Created"}
```

A successful user creation returns:

```text
201 Created
```

instead of the default success status.

Using:

```python
status.HTTP_201_CREATED
```

is clearer than writing the numeric value directly.

---

## ⚠️ HTTPException

The module also demonstrates handling a missing user:

```python
@app.get("/users/{user_id}")
def get_user(user_id: int):

    if user_id not in [1, 2]:
        raise HTTPException(
            status_code=404,
            detail="User Not Found"
        )

    return {"user_id": user_id}
```

If the requested ID is `1` or `2`, the endpoint returns the user ID.

For another ID, the endpoint raises:

```text
404 Not Found
```

with:

```text
User Not Found
```

### Request flow

```text
GET /users/5
      ↓
Is 5 in [1, 2]?
      ↓
     No
      ↓
HTTPException
      ↓
404 Not Found
```

---

# 8. 💉 Dependency Injection

**File:** `07_dependencies.py`

FastAPI provides dependency injection through `Depends`.

A dependency function is defined:

```python
def common_parameter():
    return {
        "name": "Viraj",
        "role": "Developer"
    }
```

The endpoint uses it:

```python
@app.get("/profile")
def show_profile(data=Depends(common_parameter)):
    return data
```

Here:

```python
Depends(common_parameter)
```

tells FastAPI to execute `common_parameter()` and provide its result to the endpoint.

---

## 🔄 Dependency Flow

```text
GET /profile
      ↓
FastAPI sees Depends(...)
      ↓
common_parameter()
      ↓
data receives dependency result
      ↓
show_profile(data)
      ↓
JSON Response
```

The endpoint does not have to manually call the dependency.

This pattern becomes much more useful in larger applications for things such as authentication, database sessions, and shared request logic.

---

# 9. ⚡ Sync vs Async

**File:** `08_async.py`

This example compares synchronous and asynchronous endpoint functions.

---

## 🐌 Synchronous Endpoint

```python
@app.get("/sync")
def send_msg():
    time.sleep(2)
    return {"msg": "Hello There sync"}
```

The endpoint uses:

```python
time.sleep(2)
```

which blocks the executing thread during the sleep.

---

## ⚡ Asynchronous Endpoint

```python
@app.get("/async")
async def send_sms():
    await asyncio.sleep(2)
    return {"msg": "Hello There async"}
```

The endpoint is declared with:

```python
async def
```

and uses:

```python
await asyncio.sleep(2)
```

The sleep is asynchronous.

---

## 🆚 Core Difference

```text
SYNC
request
  ↓
time.sleep(2)
  ↓
blocked execution
  ↓
response


ASYNC
request
  ↓
await asyncio.sleep(2)
  ↓
other async work can proceed
  ↓
response
```

The important distinction demonstrated here is **blocking vs non-blocking waiting**.

> Async does not automatically make every operation faster. Its value comes when the application performs I/O-bound work that can be awaited.

---

# 10. 🧩 HTTP Middleware

**File:** `09_middleware.py`

Middleware allows logic to run around the request processing lifecycle.

The example defines HTTP middleware:

```python
@app.middleware("http")
async def log_requests(request: Request, call_next):

    print(f"Request: {request.method} {request.url.path}")

    response = await call_next(request)

    print(f"Response: {response.status_code}")

    return response
```

---

## 🔄 Middleware Flow

```text
Incoming Request
       ↓
Middleware
       ↓
Log Request
       ↓
call_next(request)
       ↓
FastAPI Endpoint
       ↓
Response
       ↓
Log Status Code
       ↓
Client
```

For example, requesting:

```text
GET /
```

causes the middleware to print information about the request and then the resulting response status.

---

# 🧠 Concepts Introduced

This module establishes the following FastAPI fundamentals:

| Concept | Example |
|---|---|
| Application creation | `FastAPI()` |
| GET route | `@app.get()` |
| POST route | `@app.post()` |
| Path parameter | `/products/{product_id}` |
| Query parameter | `limit: int = 10` |
| Request body | `user: User` |
| Pydantic model | `BaseModel` |
| Field validation | `Field(ge=18, le=100)` |
| Nested models | `address: Address` |
| Response validation | `response_model=...` |
| Status codes | `status.HTTP_201_CREATED` |
| HTTP errors | `HTTPException` |
| Dependencies | `Depends(...)` |
| Async endpoints | `async def` / `await` |
| Middleware | `@app.middleware("http")` |

---

# ▶️ Running the Examples

Because each Python file creates its own `FastAPI()` application, run the specific file you want to explore.

For example:

```bash
uvicorn main:app --reload
```

For another example file, specify its module name:

```bash
uvicorn 03_request_body:app --reload
```

However, Python module names beginning with numbers are not valid in normal `import` statements. If running these numbered files directly with Uvicorn causes module-name issues, rename/copy the example to a valid Python module name or run it through an appropriate module-loading approach.

The examples themselves are the source of truth for what each application exposes.

---

# 📖 FastAPI Interactive Documentation

When an example is running, FastAPI automatically provides OpenAPI-based documentation.

By default:

```text
/docs
```

provides Swagger UI.

And:

```text
/redoc
```

provides ReDoc.

These interfaces allow the API endpoints to be explored interactively.

---

# 🏗️ Module Learning Progression

The examples intentionally become more advanced as the module progresses:

```text
01 main.py
│
├── Basic application
├── Routes
├── Path parameters
└── Query parameters
        ↓
03_request_body.py
│
└── Request bodies + Pydantic
        ↓
04_pydantic_validation.py
│
└── Field validation
        ↓
05_nested_response.py
│
└── Nested models + response models
        ↓
06_status_errors.py
│
└── Status codes + HTTPException
        ↓
07_dependencies.py
│
└── Dependency injection
        ↓
08_async.py
│
└── Sync vs async execution
        ↓
09_middleware.py
│
└── HTTP middleware
```

---

# 🧪 Practical Takeaways

After this module, the core FastAPI request lifecycle should look like:

```text
Client
  │
  ▼
HTTP Request
  │
  ▼
Middleware
  │
  ▼
Route Matching
  │
  ├── Path Parameters
  ├── Query Parameters
  └── Request Body
          │
          ▼
      Validation
          │
          ▼
      Dependencies
          │
          ▼
       Endpoint
          │
          ▼
       Response
          │
          ▼
      HTTP Client
```

The later FastAPI modules build on these foundations rather than replacing them.

---

# 🏁 Module Status

**Module 01 — FastAPI Basics: ✅ Complete**

This module establishes the foundational FastAPI concepts required for the more advanced modules that follow.

### Next

```text
01 Basics
   ↓
02 Project Structure
   ↓
03 Authentication
   ↓
...
17 Full-Stack Backend 🚀
```

---

## 🧰 Technologies Used in This Module

- 🐍 Python
- ⚡ FastAPI
- 🧪 Pydantic
- 🔄 asyncio
- 🌐 HTTP middleware

---

## 🎯 Purpose of the Module

The purpose of `01-basics` is to build a working understanding of FastAPI's fundamental mechanisms through small, isolated examples.

Rather than hiding the framework behind abstractions, the module keeps the examples intentionally simple so the relationship between **HTTP requests, FastAPI routes, Pydantic models, dependencies, async functions, and middleware** is easy to see.
