from fastapi import FastAPI
from sqlalchemy.orm import Session, selectinload, joinedload

from database import Base, engine, SessionLocal
from models.user import User
from models.post import Post
from models.profile import Profile
from models.course import Course
from schemas import (
    UserResponse,
    UserWithPostsResponse,
    PostWithUserResponse,
    CourseWithUsersResponse,
)

app = FastAPI()

Base.metadata.create_all(bind=engine)


@app.get("/users/{user_id}", response_model=UserResponse)
def get_user(user_id: int):
    db: Session = SessionLocal()

    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    db.close()

    return user


@app.get(
    "/users/{user_id}/posts",
    response_model=UserWithPostsResponse,
)
def get_user_posts(user_id: int):
    db: Session = SessionLocal()

    user = (
        db.query(User)
        .options(selectinload(User.posts))
        .filter(User.id == user_id)
        .first()
    )

    db.close()

    return user


@app.get(
    "/posts/{post_id}",
    response_model=PostWithUserResponse,
)
def get_post(post_id: int):
    db: Session = SessionLocal()

    post = (
        db.query(Post)
        .options(joinedload(Post.user))
        .filter(Post.id == post_id)
        .first()
    )

    db.close()

    return post


@app.get(
    "/courses/{course_id}/users",
    response_model=CourseWithUsersResponse,
)
def get_course_users(course_id: int):
    db: Session = SessionLocal()

    course = (
        db.query(Course)
        .options(selectinload(Course.users))
        .filter(Course.id == course_id)
        .first()
    )

    db.close()

    return course
