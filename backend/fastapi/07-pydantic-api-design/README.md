# 🧩 FastAPI — Pydantic + API Design

> **Module 07** of the FastAPI learning series.

This module focuses on using **Pydantic models for request/response design** and building cleaner API parameters with FastAPI's `Path()` and `Query()` helpers.

The implementation in this module is intentionally small, but it covers several patterns that are important when designing real FastAPI APIs.

---

## 🎯 What This Module Teaches

```text
Pydantic Models
      ↓
Request Validation
      ↓
Nested Request Bodies
      ↓
Response Models
      ↓
Path / Query Validation
      ↓
Filtering
      ↓
Search
      ↓
Sorting
      ↓
Pagination
```

### Topics covered

- 📦 Pydantic `BaseModel`
- 🧱 Nested Pydantic models
- 📋 Lists of nested models
- 🔒 Request vs response schemas
- 🚫 Preventing sensitive fields from appearing in responses
- ✏️ Optional fields for update models
- 🛣️ Path parameter validation with `Path()`
- 🔎 Query parameter validation with `Query()`
- 🔍 Search
- 🏷️ Filtering
- ↕️ Sorting
- 📄 Pagination
- 🔗 Combining filtering, search, sorting, and pagination

---

## 📁 Project Structure

```text
07-pydantic-api-design/
└── main.py
```

The module is deliberately focused on the API-design concepts being practiced.

---

# 1. 📦 Pydantic Models

The module uses `BaseModel` to define the expected structure of incoming data.

```python
from pydantic import BaseModel, Field
```

For example:

```python
class Address(BaseModel):
    city: str
    state: str
    pincode: int
```

This defines an address with:

```text
city    → string
state   → string
pincode → integer
```

FastAPI uses the model to parse and validate request data.

---

# 2. 🧩 Nested Pydantic Models

Pydantic models can contain other Pydantic models.

This module defines:

```python
class User(BaseModel):
    name: str
    age: int
    address: Address
```

So the request structure becomes:

```json
{
  "name": "Viraj",
  "age": 22,
  "address": {
    "city": "Pune",
    "state": "Maharashtra",
    "pincode": 411001
  }
}
```

Conceptually:

```text
User
 ├── name
 ├── age
 └── address
       ├── city
       ├── state
       └── pincode
```

This is one of the important reasons Pydantic models are useful: complex request bodies can be represented as structured Python types.

---

# 3. 📋 Lists of Nested Models

The module also demonstrates a nested list structure through orders.

```python
class Item(BaseModel):
    name: str
    quantity: int
    price: float


class Order(BaseModel):
    customer_name: str
    items: List[Item]
```

An order can therefore contain multiple items:

```json
{
  "customer_name": "Viraj",
  "items": [
    {
      "name": "Laptop",
      "quantity": 1,
      "price": 75000
    },
    {
      "name": "Mouse",
      "quantity": 2,
      "price": 1200
    }
  ]
}
```

The structure is:

```text
Order
 ├── customer_name
 └── items[]
       ├── Item
       │    ├── name
       │    ├── quantity
       │    └── price
       │
       └── Item
            ├── name
            ├── quantity
            └── price
```

---

# 4. 🔄 Request Schema vs Response Schema

One of the most important API-design patterns in this module is separating what the API **accepts** from what it **returns**.

### Request model

```python
class UserCreate(BaseModel):
    name: str
    email: str
    password: str
```

The request can contain a password.

### Response model

```python
class UserResponse(BaseModel):
    id: int
    name: str
    email: str
```

The response model deliberately does **not** contain `password`.

The endpoint uses:

```python
@app.post("/users", response_model=UserResponse)
```

and returns:

```python
{
    "id": 1,
    "name": user.name,
    "email": user.email,
    "password": user.password
}
```

FastAPI validates the returned data against `UserResponse`, so the response is shaped according to the declared response schema rather than exposing the password field.

### 🔐 Why this matters

```text
Client Request
      ↓
   UserCreate
      ↓
    API Logic
      ↓
 UserResponse
      ↓
Client Response
```

The input and output models serve different purposes.

This is a much better design than simply returning the database/request object directly.

---

# 5. ✏️ Optional Fields for Updates

The module defines:

```python
class UserUpdate(BaseModel):
    name: str | None = None
    age: int | None = None
```

Both fields are optional.

That allows an update payload to contain only the values that should change:

```json
{
  "name": "Viraj"
}
```

or:

```json
{
  "age": 23
}
```

This is the basic pattern used for **partial updates**.

> 📌 `UserUpdate` is defined in this module as part of the schema-design examples; the current `main.py` does not expose a dedicated update endpoint using it.

---

# 6. 🛣️ Path Parameter Validation

The module uses FastAPI's `Path()`:

```python
@app.get("/users/{user_id}")
def get_user(
    user_id: int = Path(gt=0),
    limit: int = Query(default=10, ge=1, le=100)
):
```

The important part is:

```python
Path(gt=0)
```

This means:

```text
user_id > 0
```

is required.

For example:

```text
/users/10
```

is valid.

But:

```text
/users/0
```

does not satisfy the declared constraint.

This moves validation into the API parameter definition instead of requiring manual checks inside the function.

---

# 7. 🔎 Query Parameter Validation

The same endpoint defines:

```python
limit: int = Query(default=10, ge=1, le=100)
```

This gives the parameter:

- Default value → `10`
- Minimum → `1`
- Maximum → `100`

So:

```text
/users/10?limit=20
```

is valid.

But values outside the declared range are rejected by FastAPI's validation layer.

---

# 8. 🛒 Product API

The module contains an in-memory product collection:

```python
products = [
    {"id": 1, "name": "Laptop", "category": "electronics"},
    {"id": 2, "name": "Laptop Stand", "category": "electronics"},
    {"id": 3, "name": "Gaming Laptop", "category": "electronics"},
    {"id": 4, "name": "Mouse", "category": "electronics"},
    {"id": 5, "name": "Office Chair", "category": "furniture"},
]
```

The `/products` endpoint demonstrates several API-design techniques together.

```python
@app.get("/products")
def get_products(
    q: str | None = Query(default=None),
    category: str | None = Query(default=None),
    sort: str | None = Query(default=None),
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=10, ge=1, le=100)
):
```

---

# 9. 🏷️ Filtering

Filtering is performed using the `category` parameter.

Example:

```text
/products?category=electronics
```

The implementation keeps products whose category matches the requested category.

```text
All products
     ↓
category filter
     ↓
Matching products
```

---

# 10. 🔍 Search

The `q` parameter performs a case-insensitive search against the product name.

Example:

```text
/products?q=laptop
```

The implementation checks:

```python
q.lower() in product["name"].lower()
```

Therefore:

```text
Laptop
Laptop Stand
Gaming Laptop
```

can match a search for:

```text
laptop
```

---

# 11. ↕️ Sorting

The endpoint supports sorting by product name.

### Ascending

```text
/products?sort=name
```

### Descending

```text
/products?sort=-name
```

The implementation uses Python's list sorting:

```python
filtered_products.sort(
    key=lambda product: product["name"]
)
```

and:

```python
filtered_products.sort(
    key=lambda product: product["name"],
    reverse=True
)
```

---

# 12. 📄 Pagination

Pagination uses:

```python
page
limit
```

The endpoint calculates:

```python
skip = (page - 1) * limit
```

and then selects:

```python
filtered_products[skip:skip + limit]
```

Example:

```text
/products?page=2&limit=2
```

Conceptually:

```text
All results
    ↓
Page size = 2
    ↓
Page 1 → items 1–2
Page 2 → items 3–4
Page 3 → item 5
```

The API also calculates:

```python
total_pages = (total + limit - 1) // limit
```

so the response contains useful pagination metadata.

---

# 13. 🔗 Combining API Features

The `/products` endpoint doesn't treat these features as isolated examples.

They are applied as a pipeline:

```text
Products
   ↓
Filtering
   ↓
Search
   ↓
Sorting
   ↓
Pagination
   ↓
Response
```

For example:

```text
/products
    ?category=electronics
    &q=laptop
    &sort=-name
    &page=1
    &limit=2
```

The implementation processes those options in this order:

1. 🏷️ Filter by category
2. 🔍 Search by name
3. ↕️ Sort by name
4. 📄 Paginate the result
5. 📦 Return metadata + items

This is a useful pattern for understanding how real-world list APIs are designed.

---

# 🌐 API Endpoints

The module exposes these routes:

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/orders` | Accept and return an `Order` request model |
| `GET` | `/users/{user_id}` | Demonstrate validated path/query parameters |
| `POST` | `/users` | Demonstrate request and response models |
| `GET` | `/products` | Filtering, search, sorting, and pagination |

---

## 📡 Example Requests

### Create an order

```http
POST /orders
```

```json
{
  "customer_name": "Viraj",
  "items": [
    {
      "name": "Laptop",
      "quantity": 1,
      "price": 75000
    }
  ]
}
```

### Get a user

```http
GET /users/10?limit=20
```

Example response:

```json
{
  "user_id": 10,
  "limit": 20
}
```

### Create a user

```http
POST /users
```

```json
{
  "name": "Viraj",
  "email": "viraj@example.com",
  "password": "secret"
}
```

The declared `UserResponse` schema controls the response shape.

### Search products

```http
GET /products?q=laptop
```

### Filter products

```http
GET /products?category=electronics
```

### Sort products

```http
GET /products?sort=name
```

### Paginate products

```http
GET /products?page=1&limit=2
```

### Combine everything

```http
GET /products?category=electronics&q=laptop&sort=-name&page=1&limit=2
```

---

# 🧠 Key Takeaways

### Pydantic

- 📦 `BaseModel` defines structured request data.
- 🧪 Types provide automatic validation.
- 🧩 Models can be nested.
- 📋 Models can contain lists of other models.

### API Design

- 🔄 Request and response schemas should not automatically be the same.
- 🔐 Sensitive input fields should not be returned unnecessarily.
- 🛣️ `Path()` provides validation for path parameters.
- 🔎 `Query()` provides validation and defaults for query parameters.
- 🧱 Separate schemas make APIs easier to evolve.

### List APIs

A practical list endpoint commonly needs:

```text
Filtering
   +
Search
   +
Sorting
   +
Pagination
```

This module puts all four together in `/products`.

---

# ▶️ Running the Module

From the module directory:

```bash
uvicorn main:app --reload
```

Then open the interactive Swagger UI:

```text
http://127.0.0.1:8000/docs
```

You can use Swagger UI to test each endpoint and experiment with invalid parameter values.

---

# 🧪 What to Experiment With

Try changing the API inputs and observe FastAPI's validation.

### Path validation

```text
/users/10
/users/0
/users/-1
```

### Query validation

```text
/users/10?limit=10
/users/10?limit=100
/users/10?limit=0
/users/10?limit=101
```

### Product API

Try combinations such as:

```text
/products
/products?q=laptop
/products?category=electronics
/products?sort=name
/products?sort=-name
/products?page=2&limit=2
/products?category=electronics&q=laptop&sort=-name&page=1&limit=2
```

The point is not just to see successful responses — deliberately send invalid values and understand what FastAPI/Pydantic does with them.

---

# 🏁 Module Status

**Module 07 — Pydantic + API Design** ✅

This module establishes the schema-design and query-parameter patterns that become important when building larger FastAPI applications.

---

## 📚 FastAPI Progress

```text
01 — Basics                 ✅
02 — Project Structure      ✅
03 — Authentication         ✅
04 — Error Handling         ✅
05 — Middleware             ✅
06 — Dependency Injection   ✅
07 — Pydantic + API Design  ✅  ← Current
08 — ...
   ↓
17 — Full-Stack Backend     🚀
```
