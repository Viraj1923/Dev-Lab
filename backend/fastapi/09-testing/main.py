from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from fastapi import Header
from external_service import get_external_message


app = FastAPI()


# Application database. Tests use a separate database through pytest fixtures.
DATABASE_URL = "sqlite:///./app.db"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False
)

Base = declarative_base()


class User(Base):
    # Simple model used for CRUD testing examples.
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    name = Column(String)


# Create the application table when the module is loaded.
Base.metadata.create_all(bind=engine)


def get_db():
    # Provide a database session to each FastAPI request.
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@app.post("/users")
def create_user(name: str, db: Session = Depends(get_db)):
    # Create and persist a new user.
    user = User(name=name)

    db.add(user)
    db.commit()
    db.refresh(user)

    return {"id": user.id, "name": user.name}


@app.get("/users/{user_id}")
def get_user(user_id: int, db: Session = Depends(get_db)):
    # Look up a user by primary key.
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {"id": user.id, "name": user.name}


@app.put("/users/{user_id}")
def update_user(user_id: int, name: str, db: Session = Depends(get_db)):
    # Find the user that should be updated.
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Update and persist the existing record.
    user.name = name

    db.commit()
    db.refresh(user)

    return {"id": user.id, "name": user.name}


@app.delete("/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    # Find the user that should be deleted.
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Delete and persist the change.
    db.delete(user)
    db.commit()

    return {"message": "User deleted"}

def verify_token(authorization: str | None = Header(default=None)):
    if authorization != "Bearer test-token":
        raise HTTPException(
            status_code=401,
            detail="Invalid or missing token"
        )

    return True

@app.get("/protected")
def protected_route(
    authenticated: bool = Depends(verify_token)
):
    return {
        "message": "You are authenticated"
    }

@app.get("/external")
def external():
    message = get_external_message()

    return {
        "message": message
    }