# 🧩 FastAPI — Project Structure

> **Module 02** of the FastAPI learning series.

This module focuses on organizing a FastAPI application into a maintainable project structure. The examples are based on the files included in this module.

---

## 🎯 Module Goal

The purpose of this module is to move from a simple FastAPI application toward a structured application where responsibilities are separated across packages and modules.

The project structure in this module is the source of truth for the examples below.

---

## 📁 Project Structure

```text
02-project-structure/
├── 02-project-structure/database.py
├── 02-project-structure/init_db.py
├── 02-project-structure/main.py
├── 02-project-structure/models/user.py
├── 02-project-structure/routers/products.py
├── 02-project-structure/routers/users.py
├── 02-project-structure/schemas/user.py
```

> 📌 The exact files above are taken from the uploaded module archive.

📄 `02-project-structure/database.py`

**Functions:** `get_db`

**Classes:** `Base`

**Imports:** `sqlalchemy`, `sqlalchemy.orm`

```python
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker


DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/devlab"


engine = create_engine(DATABASE_URL)


SessionLocal = sessionmaker(bind=engine)


class Base(DeclarativeBase):
    pass

with engine.connect() as connection:
    print("Database connected successfully!")

def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()
```

📄 `02-project-structure/init_db.py`

**Imports:** `database`, `models.user`

```python
from database import Base, engine
from models.user import User

Base.metadata.create_all(bind=engine)

print("Tables created successfully!")
```

📄 `02-project-structure/main.py`

**Imports:** `fastapi`, `routers`

```python
from fastapi import FastAPI
from routers import users,products


app=FastAPI()
app.include_router(users.router)
app.include_router(products.router)
```

📄 `02-project-structure/models/user.py`

**Classes:** `User`

**Imports:** `database`, `sqlalchemy`, `sqlalchemy.orm`

```python
from sqlalchemy import String, Integer
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100))
    age: Mapped[int]
    email: Mapped[str] = mapped_column(String(150))
    password_hash: Mapped[str] = mapped_column(String(255))




# class User:
#     def __init__(self, id, name, age, email, password_hash):
#         self.id = id
#         self.name = name
#         self.age = age
#         self.email = email
#         self.password_hash = password_hash

# user = User(
#     1,
#     "Viraj",
#     22,
#     "viraj@example.com",
#     "hashed_password"
# )

# print(user.name)
# print(user.password_hash)
```

📄 `02-project-structure/routers/products.py`

**Functions:** `get_products`, `get_products`

**Imports:** `fastapi`

```python
from fastapi import APIRouter

router = APIRouter(
    prefix="/products",
    tags=["Products"]
)

@router.get("/")
def get_products():
    return{"Msg":"Got products"}

@router.get("/{product_id}")
def get_products(product_id:int):
    return{"product_id":product_id}
```

📄 `02-project-structure/routers/users.py`

**Functions:** `create_user`, `get_users`, `get_user`, `update_user`, `delete_user`

**Imports:** `database`, `fastapi`, `models.user`, `schemas.user`, `sqlalchemy.orm`

```python
from fastapi import APIRouter,Depends,HTTPException, status
from schemas.user import UserCreate, UserResponse, UserUpdate
from sqlalchemy.orm import Session
from models.user import User
from database import get_db


router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

@router.post("/",response_model=UserResponse)
def create_user(user: UserCreate,db: Session = Depends(get_db)):
    user_model = User(
        name=user.name,
        age=user.age,
        email=user.email,
        password_hash=user.password
    )

    db.add(user_model)
    db.commit()
    db.refresh(user_model)
    return user_model


# @router.get("/")
# def get_users():
#     return {"message": "Users Endpoint"}

@router.get("/", response_model=list[UserResponse])
def get_users(db: Session = Depends(get_db)):
    users=db.query(User).all()
    return users

@router.get("/{user_id}",response_model=UserResponse)
def get_user(user_id: int,db:Session=Depends(get_db)):
    user_data = db.query(User).filter(User.id == user_id).first()
    if not user_data:
            raise HTTPException(
                status_code=404, 
                detail="User Not Found"
        )
    return user_data

@router.put("/{user_id}",response_model=UserResponse)
def update_user(user_id:int,user:UserUpdate,db:Session=Depends(get_db)):
    user_data = db.query(User).filter(User.id == user_id).first()
    if not user_data:
                raise HTTPException(
                    status_code=404, 
                    detail="User Not Found"
        )
    update_data = user.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(user_data, key, value)

    db.commit()
    db.refresh(user_data)
    return user_data

@router.delete("/{user_id}")
def delete_user(user_id,db:Session=Depends(get_db)):
    user_data=db.query(User).filter(User.id==user_id).first()
    if not user_data:
                    raise HTTPException(
                        status_code=404, 
                        detail="User Not Found"
        )
    db.delete(user_data);
    db.commit()
    return {"message": "User deleted successfully"}
```

📄 `02-project-structure/schemas/user.py`

**Classes:** `UserCreate`, `UserResponse`, `UserUpdate`

**Imports:** `pydantic`

```python
from pydantic import BaseModel


class UserCreate(BaseModel):
    name: str
    age: int
    email: str
    password: str

class UserResponse(BaseModel):
    name: str
    age: int
    email: str

class UserUpdate(BaseModel):
    name: str | None = None
    age: int | None = None
    email: str | None = None
```

---

## 🧠 Key Takeaways

- 📦 Keep related code grouped into clear packages/modules.
- 🧱 Separate application responsibilities instead of putting everything into one file.
- 🔍 Use the project tree as a guide for locating functionality.
- 🔄 A structured layout makes the application easier to extend and test.
- 🛠️ Keep imports and module boundaries explicit and consistent.

---

## ▶️ Running the Module

From the module directory, use the commands appropriate to the files included in this module.

For a FastAPI application, the actual entry point should be determined from the included Python files rather than assumed from a generic template.

---

## 📚 What This Module Builds Toward

This project structure provides the foundation for the later FastAPI modules, where additional concerns can be introduced without turning the application into a single large file.

**Module 02 — Project Structure** 🧩
