from fastapi import FastAPI
from sqlalchemy.orm import Session

from database import Base, engine, SessionLocal
from models.user import User
from models.post import Post
from models.profile import Profile
from models.course import Course

app = FastAPI()

Base.metadata.create_all(bind=engine)


@app.post("/test-relationship")
def test_relationship():
    db: Session = SessionLocal()

    user = User(name="Viraj")

    post1 = Post(
        title="FastAPI",
        content="Learning FastAPI"
    )

    post2 = Post(
        title="SQLAlchemy",
        content="Learning SQLAlchemy"
    )

    user.posts.append(post1)
    user.posts.append(post2)

    db.add(user)
    db.commit()
    db.refresh(user)

    result = {
        "user_id": user.id,
        "name": user.name,
        "posts": [
            {
                "id": post.id,
                "title": post.title
            }
            for post in user.posts
        ]
    }

    db.close()

    return result

@app.post("/test-profile")
def test_profile():
    db: Session = SessionLocal()

    user = User(name="Viraj")

    profile = Profile(
        bio="Backend Developer",
        avatar="viraj.jpg"
    )

    user.profile = profile

    db.add(user)
    db.commit()
    db.refresh(user)

    result = {
        "user_id": user.id,
        "name": user.name,
        "profile": {
            "id": user.profile.id,
            "bio": user.profile.bio,
            "avatar": user.profile.avatar
        }
    }

    db.close()

    return result


@app.post("/test-courses")
def test_courses():
    db: Session = SessionLocal()

    user = User(name="Viraj")

    python = Course(name="Python")
    fastapi = Course(name="FastAPI")

    user.courses.append(python)
    user.courses.append(fastapi)

    db.add(user)
    db.commit()
    db.refresh(user)

    result = {
        "user_id": user.id,
        "name": user.name,
        "courses": [
            {
                "id": course.id,
                "name": course.name
            }
            for course in user.courses
        ]
    }

    db.close()

    return result