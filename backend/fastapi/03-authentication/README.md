# 🔐 FastAPI Authentication

> **Module 03** of the FastAPI learning series.

This module covers the authentication implementation contained in this directory. The documentation below is grounded in the actual files from the uploaded module archive.

---

## 🎯 Module Goal

The module demonstrates how authentication is implemented in a FastAPI application, including the authentication-related application code and supporting security utilities present in this module.

---

## 📁 Project Structure

```text
03-authentication/
├── 03-authentication/auth.py
├── 03-authentication/database.py
├── 03-authentication/init_db.py
├── 03-authentication/jwt.py
├── 03-authentication/main.py
├── 03-authentication/models/user.py
├── 03-authentication/password.py
├── 03-authentication/requirements.txt
├── 03-authentication/routers/auth.py
├── 03-authentication/schemas/auth.py
```

---

## 🔎 What Is Implemented

The archive contains the following authentication-related concepts/features:

- ✅ **JWT**
- ✅ **password hashing**
- ✅ **Bearer**
- ✅ **HTTPException**
- ✅ **Pydantic**

---

## 🧱 File-by-File Implementation

### 📄 `03-authentication/auth.py`

**Functions:** `get_current_user`

```python
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from database import get_db
from jwt import decode_access_token
from models.user import User
from jose import JWTError

security = HTTPBearer()

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    token = credentials.credentials

    try:
        payload = decode_access_token(token)
    except JWTError:
        raise HTTPException(
        status_code=401,
        detail="Invalid or expired token"
        )

    user_id = payload.get("sub")

    if user_id is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

    user_data = db.query(User).filter(
        User.id == int(user_id)
    ).first()

    if user_data is None:
        raise HTTPException(
            status_code=401,
            detail="User not found"
        )

    return user_data
```

### 📄 `03-authentication/database.py`

**Classes:** `Base`

**Functions:** `get_db`

```python
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/devlab_auth"

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(bind=engine)


class Base(DeclarativeBase):
    pass


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()
```

### 📄 `03-authentication/init_db.py`

```python
from database import Base, engine
from models.user import User

Base.metadata.create_all(bind=engine)

print("Authentication database initialized!")
```

### 📄 `03-authentication/jwt.py`

**Functions:** `create_access_token`, `decode_access_token`

```python
from jose import jwt
from datetime import datetime, timedelta, timezone
import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"


def create_access_token(data: dict):
    to_encode = data.copy()

    expire = datetime.now(timezone.utc) + timedelta(minutes=30)

    to_encode.update({
        "exp": expire
    })

    return jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

def decode_access_token(token: str):
    return jwt.decode(
        token,
        SECRET_KEY,
        algorithms=[ALGORITHM]
    )

token = create_access_token({
    "sub": "1"
})

print(token)
print(decode_access_token(token))
```

### 📄 `03-authentication/main.py`

```python
from fastapi import FastAPI
from routers.auth import router as auth_router

app = FastAPI()

app.include_router(auth_router)
```

### 📄 `03-authentication/models/user.py`

**Classes:** `User`

```python
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100))
    age: Mapped[int]
    email: Mapped[str] = mapped_column(String(150), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255))
```

### 📄 `03-authentication/password.py`

**Functions:** `hash_password`, `verify_password`

```python
from passlib.context import CryptContext

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)

hashed = hash_password("secret123")

print("Hash:", hashed)

print(
    "Correct:",
    verify_password("secret123", hashed)
)

print(
    "Wrong:",
    verify_password("wrongpassword", hashed)
)
```

### 📄 `03-authentication/routers/auth.py`

**Functions:** `get_me`, `register_user`, `login_user`, `get_user`

```python
from fastapi import APIRouter, Depends,HTTPException
from sqlalchemy.orm import Session

from jwt import create_access_token
from auth import get_current_user

from database import get_db
from schemas.auth import UserRegister,UserLogin,UserResponse
from models.user import User
from password import hash_password,verify_password

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.post("/register")
def register_user(user:UserRegister,db:Session=Depends(get_db)):
    user_data=db.query(User).filter(User.email==user.email).first()
    if user_data: raise HTTPException(
                    status_code=400,
                    detail="Email already registered"
                )

    hashed_pass=hash_password(user.password)
    new_user=User(
        name=user.name,
        age=user.age,
        email=user.email,
        password_hash=hashed_pass
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return{"Msg":"User Created Successfully!"}

@router.post("/login")
def login_user(user:UserLogin,db:Session=Depends(get_db)):
    user_data=db.query(User).filter(User.email==user.email).first()
    if not user_data:raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not verify_password(
        user.password,
        user_data.password_hash
    ):raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )
    access_token = create_access_token(
    {"sub": str(user_data.id)}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.get("/users/{user_id}", response_model=UserResponse)
def get_user(
    user_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.id != user_id:
        raise HTTPException(
            status_code=403,
            detail="You are not allowed to access this user"
        )

    user_data = db.query(User).filter(User.id == user_id).first()

    if not user_data:
        raise HTTPException(
            status_code=404,
            detail="User Not Found"
        )

    return user_data
```

### 📄 `03-authentication/schemas/auth.py`

**Classes:** `UserRegister`, `UserLogin`, `UserResponse`, `Config`

```python
from pydantic import BaseModel

class UserRegister(BaseModel):
    name:str
    age:int
    email:str
    password:str

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    age: int
    email: str

    class Config:
        from_attributes = True
```

---

## 🔄 Authentication Flow

The exact authentication flow should be understood from the functions and dependencies implemented in the source files above.

At a high level, the module separates authentication concerns into reusable components rather than keeping all security logic inside a single route handler.

---

## 🧠 Key Takeaways

- 🔐 Authentication logic should be isolated from unrelated application functionality.
- 🧩 Security utilities should be reusable by the API routes that require them.
- 🪪 Token creation and token validation are separate responsibilities.
- 🔑 Password handling belongs in dedicated security/authentication code.
- 🧱 Keeping authentication modular makes the later project structure easier to extend.

---

## 🏁 Module Status

**Module 03 — Authentication** ✅

The documentation is based on the uploaded module contents. No authentication feature has been documented here unless it is represented by the module's actual files/code.
