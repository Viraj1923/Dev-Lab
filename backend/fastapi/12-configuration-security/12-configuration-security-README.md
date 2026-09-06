# 🔐 FastAPI — Configuration & Security

> **Module 12** of the FastAPI learning series.

This module focuses on managing application configuration through environment variables and `.env` files, validating settings with Pydantic Settings, and configuring CORS in FastAPI.

---

## 🎯 What This Module Teaches

```text
.env / Environment Variables
          ↓
   Configuration Loading
          ↓
    Pydantic Settings
          ↓
     Application Code
          ↓
      FastAPI / CORS
```

The module demonstrates:

- 🌱 Environment variables
- 📄 `.env` files
- 🔧 `python-dotenv`
- ⚙️ Pydantic Settings
- 🛡️ Configuration validation
- 🔑 JWT secret configuration
- 🌐 CORS configuration in FastAPI

---

# 📁 Project Structure

```text
12-configuration-security/
│
├── config.py
├── config_demo.py
├── cors_demo.py
└── settings_demo.py
```

### File responsibilities

| File | Focus |
|---|---|
| `config.py` | Central Pydantic Settings configuration |
| `config_demo.py` | Loading `.env` values with `python-dotenv` |
| `settings_demo.py` | Reading configuration through the `settings` object |
| `cors_demo.py` | FastAPI CORS middleware configuration |

---

# 1. 🌱 Environment Variables

Environment variables allow configuration values to exist outside the Python source code.

`config_demo.py` uses:

```python
import os
from dotenv import load_dotenv
```

and then:

```python
load_dotenv()
```

This loads variables from the `.env` file into the environment.

The application then reads them with:

```python
os.getenv("APP_NAME")
```

The module reads:

```text
APP_NAME
DEBUG
DATABASE_URL
JWT_SECRET
```

---

# 2. 📄 `.env` File

A `.env` file can contain application configuration such as:

```env
APP_NAME=My FastAPI App
APP_ENV=development
DEBUG=true
DATABASE_URL=...
JWT_SECRET=...
FRONTEND_ORIGIN=http://localhost:3000
```

The important idea is that configuration is kept separate from the Python code.

```text
Python source code
        +
Environment configuration
        ↓
      Application
```

### ⚠️ Security rule

Do **not** commit real secrets or credentials to Git.

Values such as:

```text
JWT_SECRET
DATABASE_URL
```

should be treated as sensitive when they contain real credentials.

A repository should contain an example/template configuration rather than real secrets.

---

# 3. 🔧 `python-dotenv`

The module demonstrates direct `.env` loading with:

```python
load_dotenv()
```

After loading the file, values can be accessed through:

```python
os.getenv(...)
```

For example:

```python
app_name = os.getenv("APP_NAME")
debug = os.getenv("DEBUG")
```

This is a straightforward way to introduce environment-based configuration.

---

# 4. ⚙️ Pydantic Settings

`config.py` introduces a more structured approach.

It imports:

```python
from pydantic_settings import BaseSettings, SettingsConfigDict
```

The configuration class is:

```python
class Settings(BaseSettings):
    app_name: str
    app_env: str
    debug: bool
    database_url: str
    jwt_secret: str = Field(min_length=1)
    frontend_origin: str
```

Instead of manually reading every environment variable with `os.getenv()`, Pydantic Settings maps environment values to typed fields.

---

# 5. 🧩 Typed Configuration

The settings class defines explicit types:

```python
app_name: str
app_env: str
debug: bool
database_url: str
jwt_secret: str
frontend_origin: str
```

This means configuration is not treated as an unstructured collection of strings.

For example:

```text
DEBUG=true
```

can be interpreted as:

```python
debug: bool
```

while:

```text
APP_NAME=DevBoard API
```

maps to:

```python
app_name: str
```

---

# 6. 🛡️ Required Configuration

The fields in `Settings` do not have default values:

```python
app_name: str
app_env: str
debug: bool
database_url: str
frontend_origin: str
```

Therefore, these settings are expected to be supplied through the environment or `.env` configuration.

If required configuration is missing or invalid, Pydantic Settings validation can prevent the application from starting with an invalid configuration.

This is safer than allowing missing values to silently propagate through the application.

---

# 7. 🔑 JWT Secret Validation

The JWT secret is defined as:

```python
jwt_secret: str = Field(min_length=1)
```

The `min_length=1` constraint prevents an empty value from being accepted.

Conceptually:

```text
JWT_SECRET
    ↓
Pydantic validation
    ↓
Must contain at least 1 character
```

The module therefore demonstrates that configuration validation can also be applied to security-sensitive settings.

---

# 8. ⚙️ `.env` Integration with Pydantic Settings

The settings class contains:

```python
model_config = SettingsConfigDict(
    env_file=".env"
)
```

This tells Pydantic Settings to read configuration from:

```text
.env
```

The module creates a settings instance:

```python
settings = Settings()
```

So application code can use:

```python
from config import settings
```

instead of repeatedly calling `os.getenv()`.

---

# 9. 🧠 Configuration Object

`settings_demo.py` demonstrates accessing the centralized settings object:

```python
from config import settings
```

It then reads:

```python
settings.app_name
settings.app_env
settings.debug
settings.database_url
settings.jwt_secret
```

The flow is:

```text
.env
 ↓
Settings()
 ↓
settings object
 ↓
Application code
```

This gives the application one structured configuration source.

---

# 10. 🔀 Direct Environment Loading vs Pydantic Settings

The module demonstrates two approaches.

### `config_demo.py`

```python
load_dotenv()

app_name = os.getenv("APP_NAME")
```

### `config.py`

```python
class Settings(BaseSettings):
    ...
```

and:

```python
settings = Settings()
```

The second approach provides typed configuration and validation through Pydantic Settings.

---

# 11. 🌐 CORS

`cors_demo.py` demonstrates Cross-Origin Resource Sharing (CORS) configuration.

It imports:

```python
from fastapi.middleware.cors import CORSMiddleware
```

and adds the middleware:

```python
app.add_middleware(
    CORSMiddleware,
    ...
)
```

This is necessary when a browser-based frontend and backend are served from different origins and the backend needs to permit the frontend to make requests.

---

# 12. 🎯 Configuring the Frontend Origin

The application uses:

```python
allow_origins=[settings.frontend_origin]
```

The frontend origin therefore comes from configuration rather than being hard-coded into the middleware.

Conceptually:

```text
FRONTEND_ORIGIN
       ↓
settings.frontend_origin
       ↓
allow_origins
       ↓
CORSMiddleware
```

This makes the allowed frontend origin configurable by environment.

---

# 13. 🔐 CORS Credentials

The configuration includes:

```python
allow_credentials=True
```

This enables credentials to be included in cross-origin requests when the browser's CORS rules permit it.

---

# 14. 🌍 Allowed Methods

The module uses:

```python
allow_methods=["*"]
```

This allows all HTTP methods through the CORS middleware configuration.

Examples include:

```text
GET
POST
PUT
PATCH
DELETE
```

---

# 15. 📦 Allowed Headers

The configuration also contains:

```python
allow_headers=["*"]
```

This allows all request headers through the CORS middleware configuration.

---

# 16. 🚀 FastAPI Application

The demo creates:

```python
app = FastAPI()
```

and adds CORS:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

The API exposes:

```text
GET /hello
```

which returns:

```json
{
  "message": "Hello from backend"
}
```

---

# 17. 🔄 Configuration + CORS Flow

The complete example connects configuration and FastAPI middleware:

```text
              .env
               │
               ▼
        Pydantic Settings
               │
               ▼
     settings.frontend_origin
               │
               ▼
       CORSMiddleware
               │
               ▼
           FastAPI
               │
               ▼
          GET /hello
```

---

# 🧪 Running the Examples

Run the examples from the module directory.

### 1️⃣ Environment variable demo

```bash
python config_demo.py
```

This loads the `.env` file and prints the configured values.

---

### 2️⃣ Pydantic Settings demo

```bash
python settings_demo.py
```

This reads the values through:

```python
settings
```

and prints:

```text
App
Environment
Debug
Database
JWT Secret
```

---

### 3️⃣ CORS demo

Start:

```bash
uvicorn cors_demo:app --reload
```

Then open:

```text
http://127.0.0.1:8000/docs
```

You can test:

```text
GET /hello
```

---

# 📊 Configuration Flow Comparison

### Manual environment access

```text
.env
 ↓
load_dotenv()
 ↓
os.getenv()
 ↓
variables
```

### Pydantic Settings

```text
.env
 ↓
BaseSettings
 ↓
type validation
 ↓
Settings object
 ↓
settings.field
```

The module demonstrates both approaches so the difference is clear.

---

# 🛡️ Security Practices Demonstrated

This module's security-related configuration is centered around **keeping sensitive configuration outside the application source code and validating it**.

### 🔑 Secrets

Sensitive values such as:

```text
JWT_SECRET
DATABASE_URL
```

should come from environment-based configuration rather than being hard-coded into Python source.

### 🧪 Validation

Pydantic validates the configuration before the application uses it.

For example:

```python
jwt_secret: str = Field(min_length=1)
```

rejects an empty JWT secret.

### 🌐 CORS

The allowed frontend origin is configurable:

```python
allow_origins=[settings.frontend_origin]
```

rather than being embedded directly in the middleware configuration.

---

# ⚠️ Important Production Considerations

The examples are intentionally simple.

For a production application, configuration values should be supplied through a secure deployment environment or secret-management mechanism.

Also, CORS should be configured according to the actual frontend/backend deployment architecture rather than blindly allowing every origin.

This module specifically demonstrates:

```python
allow_origins=[settings.frontend_origin]
```

which is already more targeted than:

```python
allow_origins=["*"]
```

---

# 🧠 Key Takeaways

### Configuration

- 🌱 Environment variables keep configuration outside source code.
- 📄 `python-dotenv` can load values from `.env`.
- ⚙️ `BaseSettings` provides structured configuration.
- 🧩 `SettingsConfigDict(env_file=".env")` connects Pydantic Settings to `.env`.
- 🛡️ Pydantic validates configuration values.

### Security

- 🔑 Secrets should not be hard-coded or committed to Git.
- 🧪 Security-sensitive configuration can have validation rules.
- 🌐 CORS controls which frontend origins can interact with the API.

### FastAPI

- 🚀 `CORSMiddleware` configures cross-origin request behavior.
- 🎯 `allow_origins` can be driven by application configuration.
- 🔐 Credentials, methods, and headers can be configured through the middleware.

---

# 🏁 Module Status

**Module 12 — Configuration & Security** ✅

This module establishes the configuration foundation needed for applications that separate code from environment-specific values and demonstrates basic CORS configuration in FastAPI.

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
12 — Configuration & Security  ✅  ← Current
13 — ...
    ↓
17 — Full-Stack Backend        🚀
```
