from fastapi import FastAPI, Depends
from sqlalchemy import (
    create_engine,
    Column,
    Integer,
    String,
    ForeignKey
)
from sqlalchemy.orm import (
    declarative_base,
    sessionmaker,
    Session,
    relationship
)


# Create the database engine.
engine = create_engine(
    "sqlite:///transaction_api.db"
)

Base = declarative_base()


# User table.
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    name = Column(String)

    posts = relationship(
        "Post",
        back_populates="user"
    )


# Post table.
class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True)
    title = Column(String)

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    user = relationship(
        "User",
        back_populates="posts"
    )


# Create database tables.
Base.metadata.create_all(bind=engine)


# Create Session factory.
SessionLocal = sessionmaker(bind=engine)


# FastAPI application.
app = FastAPI()


# Database dependency.
def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@app.post("/users-with-post")
def create_user_with_post(
    user_name: str,
    post_title: str,
    db: Session = Depends(get_db)
):
    try:
        # Create the user.
        user = User(name=user_name)

        db.add(user)

        # Flush so the user gets an ID.
        db.flush()

        # Create the post using the new user's ID.
        post = Post(
            title=post_title,
            user_id=user.id
        )

        db.add(post)

        # Commit both operations together.
        db.commit()

        # Refresh objects with database state.
        db.refresh(user)
        db.refresh(post)

        return {
            "user_id": user.id,
            "user_name": user.name,
            "post_id": post.id,
            "post_title": post.title
        }

    except Exception:
        # Something failed → undo the transaction.
        db.rollback()

        raise