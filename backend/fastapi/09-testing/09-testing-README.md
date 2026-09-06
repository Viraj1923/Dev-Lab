# 🧪 FastAPI — Testing

> **Module 09** of the FastAPI learning series.

This module focuses on testing a FastAPI application with **pytest**, FastAPI's `TestClient`, dependency overrides, fixtures, parametrized tests, mocking, authentication tests, and integration tests.

The project uses a separate SQLite database for the test suite so that tests can run against isolated test data without using the application's normal database.

---

## 🎯 What This Module Teaches

```text
Application
    ↓
pytest
    ↓
Fixtures
    ↓
TestClient
    ↓
Dependency Override
    ↓
Isolated Test Database
    ↓
Assertions
    ↓
Unit + API + Integration + Mock Tests
```

### Topics covered

- 🧪 pytest basics
- 🚀 FastAPI `TestClient`
- 🔧 pytest fixtures
- 🗄️ Separate test database
- 🔄 Dependency overriding
- 🧹 Test isolation and cleanup
- 🔢 Parametrized tests
- ❌ Validation and error testing
- 🔐 Authentication testing
- 🎭 Mocking external services
- 📡 External-service failure testing
- 🔗 Integration testing
- 🧮 Simple unit testing

---

# 📁 Project Structure

```text
09-testing/
│
├── main.py
├── external_service.py
├── calculator.py
├── conftest.py
├── app.db
│
└── tests/
    ├── test_users.py
    ├── test_calculator.py
    ├── test_external.py
    ├── test_integration.py
    └── test_auth.py
```

### File responsibilities

| File | Responsibility |
|---|---|
| `main.py` | FastAPI application, SQLAlchemy model, CRUD endpoints, authentication, and external-service endpoints |
| `external_service.py` | Simulated external service |
| `calculator.py` | Simple `add()` function used for unit testing |
| `conftest.py` | Shared pytest fixtures and test database configuration |
| `tests/test_users.py` | CRUD, validation, database, and error tests |
| `tests/test_calculator.py` | Unit test for `add()` |
| `tests/test_external.py` | External-service and mocking tests |
| `tests/test_integration.py` | Create → retrieve integration flow |
| `tests/test_auth.py` | Protected endpoint authentication tests |
| `app.db` | SQLite database used by the application |

---

# 1. 🧪 pytest Basics

The module uses **pytest** as the testing framework.

A basic test looks like:

```python
def test_add():
    result = add(2, 3)

    assert result == 5
```

The test:

1. Calls the function.
2. Gets the result.
3. Uses `assert` to verify the expected behavior.

Run the complete test suite with:

```bash
pytest
```

A verbose run can be performed with:

```bash
pytest -v
```

---

# 2. 🚀 FastAPI TestClient

The API tests use:

```python
from fastapi.testclient import TestClient
```

The `client` fixture creates:

```python
TestClient(app)
```

This allows tests to make HTTP-style requests directly against the FastAPI application.

For example:

```python
response = client.post(
    "/users",
    params={"name": "Viraj"}
)
```

Then the test can inspect:

```python
response.status_code
response.json()
```

This lets the test suite verify API behavior without manually running an HTTP server.

---

# 3. 🔧 pytest Fixtures

Shared test setup is placed in:

```text
conftest.py
```

The module defines fixtures for:

- `db`
- `client`
- `user`
- `auth_headers`

Fixtures allow common setup to be reused across multiple tests.

For example:

```python
def test_get_user(client, user):
```

The test automatically receives:

```text
client → API test client
user   → reusable database user
```

This keeps individual tests focused on the behavior being verified.

---

# 4. 🗄️ Separate Test Database

The application uses:

```python
DATABASE_URL = "sqlite:///./app.db"
```

The tests use a different database:

```python
TEST_DATABASE_URL = "sqlite:///./test.db"
```

This is an important testing pattern.

```text
Application
    ↓
app.db

Tests
    ↓
test.db
```

The test suite therefore does not need to modify the application's normal database.

---

# 5. 🔄 Dependency Override

The application provides database sessions through:

```python
def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()
```

The tests replace this dependency.

Inside the `client` fixture:

```python
def override_get_db():
    yield db

app.dependency_overrides[get_db] = override_get_db
```

This means that when the API executes:

```python
db: Session = Depends(get_db)
```

during a test, it receives the test database session instead.

The flow becomes:

```text
Normal Application
      ↓
get_db()
      ↓
app.db


Test
      ↓
override_get_db()
      ↓
test.db
```

After the test:

```python
app.dependency_overrides.clear()
```

removes the override.

---

# 6. 🧹 Test Isolation

The `db` fixture creates tables before each test:

```python
Base.metadata.create_all(bind=test_engine)
```

Then provides a database session:

```python
db = TestingSessionLocal()

yield db
```

After the test finishes:

```python
db.close()
Base.metadata.drop_all(bind=test_engine)
```

So each test starts with a clean database.

Conceptually:

```text
Before test
    ↓
Create tables
    ↓
Run test
    ↓
Close session
    ↓
Drop tables
    ↓
Clean state
```

This prevents data created by one test from leaking into another test.

---

# 7. 👤 Reusable User Fixture

The `user` fixture creates a reusable database record:

```python
user = User(name="Viraj")

db.add(user)
db.commit()
db.refresh(user)
```

Tests can then simply request:

```python
def test_get_user(client, user):
```

instead of repeating the database setup.

For example:

```python
response = client.get(f"/users/{user.id}")
```

This is a practical use of pytest fixtures for shared test data.

---

# 8. 🔐 Authentication Fixture

The module also defines:

```python
@pytest.fixture
def auth_headers():
    return {
        "Authorization": "Bearer test-token"
    }
```

Tests can reuse these headers:

```python
def test_protected_with_valid_token(client, auth_headers):
```

and send:

```python
headers=auth_headers
```

This keeps authentication setup out of individual tests.

---

# 9. 🔢 Parametrized Testing

`test_users.py` demonstrates pytest parametrization.

```python
@pytest.mark.parametrize("name", [
    "Viraj",
    "Rahul",
    "Alex",
])
def test_create_user_with_different_names(client, db, name):
```

Instead of writing three separate tests, pytest executes the same test with:

```text
Viraj
Rahul
Alex
```

Conceptually:

```text
One test function
       ↓
 ┌─────┼─────┐
 ↓     ↓     ↓
Viraj Rahul Alex
```

This is useful when the same behavior should be verified for multiple inputs.

---

# 10. ❌ Testing Validation Errors

The tests verify invalid request data.

For example:

```python
response = client.post("/users", json={})

assert response.status_code == 422
```

The endpoint requires `name` as a query parameter:

```python
@app.post("/users")
def create_user(name: str, db: Session = Depends(get_db)):
```

Therefore, sending an invalid request results in FastAPI validation failure.

The tests also use parametrization to check multiple invalid payloads:

```python
@pytest.mark.parametrize("payload", [
    {},
    {"wrong_field": "Viraj"},
])
```

This demonstrates that tests should verify not only successful requests, but also how the API behaves when clients send invalid data.

---

# 11. 👤 Testing CRUD Operations

`tests/test_users.py` covers the complete CRUD flow.

### Create

```text
POST /users
```

The test verifies:

- HTTP status
- returned name
- generated ID
- database persistence

### Read

```text
GET /users/{user_id}
```

The test verifies the returned user.

### Update

```text
PUT /users/{user_id}
```

The test verifies both:

```text
API response
     +
database state
```

### Delete

```text
DELETE /users/{user_id}
```

The test verifies that:

```text
API → 200
Database → record removed
```

---

# 12. 🚫 Testing 404 Errors

The tests deliberately request a user that does not exist:

```python
response = client.get("/users/999")
```

The expected response is:

```python
assert response.status_code == 404
assert response.json() == {
    "detail": "User not found"
}
```

The same behavior is tested for update and delete operations.

This is important because API testing should verify expected failure behavior, not only successful operations.

---

# 13. 🧮 Unit Testing

The module contains a very small standalone unit test.

`calculator.py`:

```python
def add(a, b):
    return a + b
```

Test:

```python
from calculator import add


def test_add():
    result = add(2, 3)

    assert result == 5
```

This is a pure unit test:

```text
Input
  ↓
add(2, 3)
  ↓
5
  ↓
assert 5 == 5
```

There is no FastAPI application, database, or HTTP request involved.

---

# 14. 📡 External Service

`external_service.py` simulates a third-party service:

```python
def get_external_message(name, language):
    return f"Real response for {name} {language}"
```

The `/external` endpoint calls it twice:

```python
first_message = get_external_message(name, language)
second_message = get_external_message(name, language)
```

and returns:

```json
{
  "first": "...",
  "second": "..."
}
```

This gives the testing module a realistic dependency that can be replaced with a mock.

---

# 15. 🎭 Mocking an External Service

`test_external.py` uses:

```python
from unittest.mock import patch
```

The external function is replaced during the test:

```python
with patch(
    "main.get_external_message",
    side_effect=[
        "First mocked response",
        "Second mocked response"
    ]
) as mock_message:
```

The API still calls:

```python
get_external_message(...)
```

but the real function is not executed.

Instead, the mock returns controlled values.

The test verifies:

```python
assert response.json() == {
    "first": "First mocked response",
    "second": "Second mocked response"
}
```

and:

```python
assert mock_message.call_count == 2
```

This is useful when testing code that depends on an external system.

---

# 16. 🎯 Why Mocking Matters

Without mocking:

```text
Test
 ↓
FastAPI
 ↓
External Service
 ↓
Response
```

The test becomes dependent on the external service.

With mocking:

```text
Test
 ↓
FastAPI
 ↓
Mock
 ↓
Controlled Response
```

The test can therefore verify application behavior without depending on the real external service.

It also allows the test to simulate conditions that may be difficult to reproduce with the real service.

---

# 17. 💥 Testing External-Service Failure

The module contains:

```text
GET /external-failure
```

which catches an exception from the external service and returns:

```text
503 Service Unavailable
```

The test forces the dependency to fail:

```python
with patch(
    "main.get_external_message",
    side_effect=Exception("Service failed")
):
```

Then it verifies:

```python
assert response.status_code == 503
```

and:

```python
assert response.json() == {
    "detail": "External service unavailable"
}
```

It also verifies the dependency call:

```python
mock_message.assert_called_once_with(
    "Viraj",
    "English"
)
```

So the test checks both:

```text
Failure handling
      +
Dependency interaction
```

---

# 18. 🔐 Testing Protected Endpoints

The `/protected` endpoint depends on:

```python
verify_token
```

The dependency checks:

```python
authorization == "Bearer test-token"
```

Three authentication cases are tested.

### No token

```text
GET /protected
```

Expected:

```text
401
Invalid or missing token
```

### Wrong token

```text
Authorization: Bearer wrong-token
```

Expected:

```text
401
Invalid or missing token
```

### Correct token

```text
Authorization: Bearer test-token
```

Expected:

```text
200
You are authenticated
```

This creates a basic authentication test matrix:

```text
                Token
                  │
        ┌─────────┼─────────┐
        ↓         ↓         ↓
      None      Wrong     Correct
        │         │         │
       401       401       200
```

---

# 19. 🔗 Integration Testing

`tests/test_integration.py` demonstrates a multi-step API workflow.

First:

```python
POST /users
```

Then the test extracts the returned ID:

```python
user_id = created_user["id"]
```

Then it uses that ID to perform:

```python
GET /users/{user_id}
```

The test verifies that the second request retrieves the user created by the first request.

The flow is:

```text
Create User
    ↓
Receive User ID
    ↓
Get User using ID
    ↓
Verify Same User
```

This is different from testing each endpoint in isolation because the second operation depends on the result of the first.

---

# 🧪 Test Coverage by File

## `tests/test_users.py`

Covers:

```text
Create users
Parametrized creation
Invalid requests
Database persistence
Get user
404 handling
Database starts empty
Update user
Update 404
Delete user
Delete 404
```

## `tests/test_calculator.py`

Covers:

```text
add(2, 3) → 5
```

## `tests/test_external.py`

Covers:

```text
Real external response
Mocked external response
Mock call count
External service failure
Mock call arguments
503 error handling
```

## `tests/test_integration.py`

Covers:

```text
Create user
    ↓
Get created user
```

## `tests/test_auth.py`

Covers:

```text
No token
Wrong token
Valid token
```

---

# 🔄 Overall Testing Architecture

The complete test setup can be visualized as:

```text
                         pytest
                           │
             ┌─────────────┼─────────────┐
             │             │             │
             ▼             ▼             ▼
          Unit Tests    API Tests   Integration
             │             │             │
             │             ▼             │
             │        TestClient          │
             │             │             │
             │             ▼             │
             │     Dependency Override    │
             │             │             │
             │             ▼             │
             │       test.db              │
             │                           │
             └─────────────┬─────────────┘
                           │
                           ▼
                        Assertions
```

---

# ▶️ Running the Tests

From the module directory:

```bash
pytest
```

For verbose output:

```bash
pytest -v
```

Run a specific test file:

```bash
pytest tests/test_users.py -v
```

Run the authentication tests:

```bash
pytest tests/test_auth.py -v
```

Run the external-service tests:

```bash
pytest tests/test_external.py -v
```

Run the integration test:

```bash
pytest tests/test_integration.py -v
```

Run the calculator unit test:

```bash
pytest tests/test_calculator.py -v
```

---

# 🔍 Understanding the Test Result

A successful pytest run will report each test as:

```text
PASSED
```

The useful habit is to run:

```bash
pytest -v
```

because verbose mode shows which individual test cases passed or failed.

For parametrized tests, pytest reports the individual parameter combinations as separate test cases.

---

# 🧠 Key Takeaways

### pytest

- 🧪 Tests are normal Python functions beginning with `test_`.
- ✅ `assert` verifies expected behavior.
- 🔢 `@pytest.mark.parametrize` allows one test to run with multiple inputs.
- 🔧 Fixtures provide reusable setup and teardown.

### FastAPI testing

- 🚀 `TestClient` allows direct HTTP-style API testing.
- 🔄 `app.dependency_overrides` can replace application dependencies during tests.
- 🗄️ A separate test database keeps test data isolated.

### Mocking

- 🎭 `unittest.mock.patch` replaces dependencies temporarily.
- 🎯 Mocks allow controlled responses.
- 💥 Mocks can simulate failures.
- 📞 Mock assertions can verify how a dependency was called.

### Integration

- 🔗 Integration tests verify multiple operations working together.
- Example:

```text
POST → receive ID → GET → verify
```

### What good tests verify

A useful API test often checks more than the status code:

```text
HTTP Status
     +
Response Body
     +
Database State
     +
Dependency Interaction
```

---

# 🧪 Testing Mindset

The goal of testing is not simply:

```text
"Does the happy path work?"
```

A stronger test suite asks:

```text
Does valid input work?
        +
Does invalid input fail correctly?
        +
Does missing data return the right error?
        +
Does authentication behave correctly?
        +
Does database state change correctly?
        +
Does external-service failure get handled?
        +
Do multiple API operations work together?
```

That is the core mindset demonstrated by this module.

---

# 🏁 Module Status

**Module 09 — Testing** ✅

This module establishes the foundation for testing FastAPI applications with pytest, including isolated database tests, dependency overrides, API assertions, parametrization, mocking, authentication tests, and integration workflows.

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
09 — Testing                   ✅  ← Current
10 — ...
    ↓
17 — Full-Stack Backend        🚀
```
