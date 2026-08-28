from fastapi import FastAPI
from sqlalchemy.orm import Session, selectinload

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

@app.get("/test-course-users")
def test_course_users():
    db: Session = SessionLocal()

    course = db.query(Course).filter(Course.name == "FastAPI").first()

    result = {
        "course_id": course.id,
        "course": course.name,
        "users": [
            {
                "id": user.id,
                "name": user.name
            }
            for user in course.users
        ]
    }

    db.close()

    return result


@app.get("/test-lazy/{user_id}")
def test_lazy(user_id: int):
    db: Session = SessionLocal()

    print("1. Querying user")

    user = db.query(User).filter(User.id == user_id).first()

    print("2. User loaded")

    print("3. Accessing posts")

    posts = user.posts

    print("4. Posts loaded")

    result = {
        "user": user.name,
        "posts": [
            {
                "id": post.id,
                "title": post.title
            }
            for post in posts
        ]
    }

    db.close()

    return result

@app.get("/test-n-plus-one-fixed")
def test_n_plus_one():
    db: Session = SessionLocal()

    users = (
        db.query(User)
        .options(selectinload(User.posts))
        .all()
    )

    result = []

    for user in users:
        result.append({
            "user": user.name,
            "posts": [
                post.title
                for post in user.posts
            ]
        })

    db.close()

    return result