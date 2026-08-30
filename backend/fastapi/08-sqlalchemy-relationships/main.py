from fastapi import FastAPI
from sqlalchemy.orm import Session, selectinload,joinedload
from sqlalchemy import func

from database import Base, engine, SessionLocal
from models.user import User
from models.post import Post
from models.profile import Profile
from models.course import Course
from schemas import UserResponse,PostResponse,UserWithPostsResponse,PostWithUserResponse,CourseWithUsersResponse

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

@app.get("/test-joined-load")
def test_joined_load():
    db: Session = SessionLocal()

    users = (
        db.query(User)
        .options(joinedload(User.posts))
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


@app.get("/test-join")
def test_join():
    db: Session = SessionLocal()

    results = (
        db.query(Post)
        .join(User)
        .filter(User.name == "Viraj")
        .all()
    )

    result = [
        {
            "id": post.id,
            "title": post.title
        }
        for post in results
    ]

    db.close()

    return result

@app.get("/test-relationship-filter")
def test_relationship_filter():
    db: Session = SessionLocal()

    users = (
        db.query(User)
        .join(User.posts)
        .filter(Post.title == "FastAPI")
        .distinct()
        .all()
    )

    result = [
        {
            "id": user.id,
            "name": user.name
        }
        for user in users
    ]

    db.close()

    return result


@app.get("/test-post-count")
def test_post_count():
    db: Session = SessionLocal()

    results = (
        db.query(
            User.name,
            func.count(Post.id).label("post_count")
        )
        .join(Post)
        .group_by(User.id, User.name)
        .all()
    )

    result = [
        {
            "user": name,
            "post_count": post_count
        }
        for name, post_count in results
    ]

    db.close()

    return result


# --------------------------------------------------------------------------------------------
# --------------------------------------------------------------------------------------------

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
    response_model=UserWithPostsResponse
)
def get_user_posts(user_id: int):
    db: Session = SessionLocal()

    user = (
        db.query(User)
        .options(selectinload(User.posts))
        .filter(User.id == user_id)
        .first()
    )
    result = {
        "id": user.id,
        "name": user.name,
        "posts": user.posts
    }

    db.close()

    return user

@app.get(
    "/posts/{post_id}",
    response_model=PostWithUserResponse
)
def get_post(post_id: int):
    db: Session = SessionLocal()

    post = (
        db.query(Post)
        .options(joinedload(Post.user))
        .filter(Post.id == post_id)
        .first()
    )

    result = {
        "id": post.id,
        "title": post.title,
        "content": post.content,
        "user": post.user
    }

    db.close()

    return result

@app.get(
    "/courses/{course_id}/users",
    response_model=CourseWithUsersResponse
)
def get_course_users(course_id: int):
    db: Session = SessionLocal()

    course = (
        db.query(Course)
        .options(selectinload(Course.users))
        .filter(Course.id == course_id)
        .first()
    )

    result = {
        "id": course.id,
        "name": course.name,
        "users": course.users
    }

    db.close()

    return result