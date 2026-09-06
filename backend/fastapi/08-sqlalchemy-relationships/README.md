# 🔗 FastAPI + SQLAlchemy — Relationships

> **Module 08** of the FastAPI learning series.

This module demonstrates how to model and work with **SQLAlchemy relationships** inside a FastAPI application.

The implementation uses SQLite and covers:

- 👤 One-to-Many — `User → Posts`
- 👤 One-to-One — `User ↔ Profile`
- 👥 Many-to-Many — `User ↔ Courses`
- 💤 Lazy loading
- 🚀 `selectinload`
- ⚡ `joinedload`
- 🔍 SQL joins
- 🎯 Filtering through relationships
- 📊 Aggregation with `COUNT`
- 📦 Pydantic response models for related data

---

## 🎯 Module Goal

The main purpose of this module is to understand how database tables become connected through SQLAlchemy relationships and how those relationships can be loaded efficiently when returning API responses.

The central model is `User`, which is connected to:

```text
                 ┌──────────────┐
                 │     User     │
                 └──────┬───────┘
                        │
          ┌─────────────┼─────────────┐
          │             │             │
          ▼             ▼             ▼
       Posts          Profile       Courses
    One-to-Many      One-to-One    Many-to-Many
```

---

# 📁 Project Structure

```text
08-sqlalchemy-relationships/
│
├── database.py
├── main.py
├── main1.py
├── schemas.py
│
├── models/
│   ├── user.py
│   ├── post.py
│   ├── profile.py
│   └── course.py
│
└── test.db
```

### File responsibilities

| File | Responsibility |
|---|---|
| `database.py` | SQLite engine, session factory, and SQLAlchemy `Base` |
| `models/user.py` | `User` model and its relationships |
| `models/post.py` | `Post` model and User → Posts relationship |
| `models/profile.py` | `Profile` model and User ↔ Profile relationship |
| `models/course.py` | `Course` model and many-to-many association table |
| `schemas.py` | Pydantic response schemas |
| `main.py` | Relationship creation, querying, loading, joins, filtering, and aggregation examples |
| `main1.py` | Focused read/query examples using relationship loading |
| `test.db` | SQLite database used by the module |

---

# 🗄️ Database Configuration

`database.py` uses SQLite:

```python
DATABASE_URL = "sqlite:///./test.db"
```

The SQLAlchemy engine is created with:

```python
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
    echo=True
)
```

`check_same_thread=False` allows the SQLite connection to be used in the FastAPI context.

The session factory is:

```python
SessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False
)
```

And all models inherit from:

```python
Base = declarative_base()
```

The application creates the database tables with:

```python
Base.metadata.create_all(bind=engine)
```

---

# 1. 👤 One-to-Many Relationship

The first relationship is:

```text
User
 │
 ├── Post
 ├── Post
 └── Post
```

One user can have many posts.

## `User` model

```python
posts = relationship(
    "Post",
    back_populates="user"
)
```

## `Post` model

Each post contains:

```python
user_id = Column(Integer, ForeignKey("users.id"))
```

and:

```python
user = relationship("User", back_populates="posts")
```

This gives us both directions:

```text
User.posts
    ↓
multiple Post objects

Post.user
    ↓
single User object
```

### Relationship mapping

```text
users.id
   │
   │  Foreign Key
   ▼
posts.user_id
```

---

# 2. 👤 Creating a User with Posts

`main.py` demonstrates creating related objects:

```python
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
```

The important part is:

```python
user.posts.append(post1)
user.posts.append(post2)
```

The relationship is used to connect the posts to the user.

After:

```python
db.add(user)
db.commit()
```

SQLAlchemy persists the related objects.

The `/test-relationship` endpoint returns the user's posts.

---

# 3. 👤 One-to-One Relationship

The second relationship is:

```text
User
  │
  └── Profile
```

A user has one profile.

## `Profile` model

```python
user_id = Column(
    Integer,
    ForeignKey("users.id"),
    unique=True
)
```

The `unique=True` constraint ensures that a single user ID cannot appear multiple times in the profile table.

The relationship is:

```python
user = relationship(
    "User",
    back_populates="profile"
)
```

## `User` model

The corresponding relationship is:

```python
profile = relationship(
    "Profile",
    back_populates="user",
    uselist=False
)
```

### Why `uselist=False`?

For a normal one-to-many relationship, SQLAlchemy exposes a collection:

```text
user.posts → [Post, Post, Post]
```

For the profile relationship, we want one object:

```text
user.profile → Profile
```

Therefore:

```python
uselist=False
```

is used.

---

# 4. 👤 Creating a User with a Profile

The `/test-profile` endpoint demonstrates:

```python
user = User(name="Viraj")

profile = Profile(
    bio="Backend Developer",
    avatar="viraj.jpg"
)

user.profile = profile
```

The relationship is assigned directly:

```python
user.profile = profile
```

Then the user is persisted:

```python
db.add(user)
db.commit()
```

The resulting structure is conceptually:

```text
User
├── id
├── name
└── profile
      ├── id
      ├── bio
      └── avatar
```

---

# 5. 👥 Many-to-Many Relationship

The third relationship is:

```text
User ─────── Course
  ╲           ╱
   ╲         ╱
    ╲       ╱
     StudentCourses
```

A user can enroll in multiple courses.

A course can contain multiple users.

Therefore:

```text
User  ↔  Course
```

is a **many-to-many** relationship.

---

# 6. 🔗 Association Table

The many-to-many relationship uses:

```python
student_courses = Table(
    "student_courses",
    Base.metadata,
    Column(
        "student_id",
        Integer,
        ForeignKey("users.id")
    ),
    Column(
        "course_id",
        Integer,
        ForeignKey("courses.id")
    )
)
```

The association table connects the two entities:

```text
student_courses
────────────────────────
student_id | course_id
────────────────────────
     1     |     1
     1     |     2
     2     |     1
```

This allows the database to represent multiple users taking multiple courses.

---

# 7. 📚 User ↔ Course Relationship

The `User` model defines:

```python
courses = relationship(
    "Course",
    secondary="student_courses",
    back_populates="users"
)
```

The `Course` model defines:

```python
users = relationship(
    "User",
    secondary=student_courses,
    back_populates="courses"
)
```

The `secondary` argument tells SQLAlchemy which association table connects the two models.

This gives us:

```text
user.courses
      ↓
[Course, Course, ...]

course.users
      ↓
[User, User, ...]
```

---

# 8. 📚 Creating Courses for a User

The `/test-courses` endpoint creates:

```python
python = Course(name="Python")
fastapi = Course(name="FastAPI")
```

and connects them to the user:

```python
user.courses.append(python)
user.courses.append(fastapi)
```

So the relationship becomes:

```text
Viraj
 ├── Python
 └── FastAPI
```

The association table stores the connections.

---

# 9. 🔍 Finding Users for a Course

The `/test-course-users` endpoint queries:

```python
course = db.query(Course).filter(
    Course.name == "FastAPI"
).first()
```

Then accesses:

```python
course.users
```

This demonstrates the reverse side of the many-to-many relationship.

```text
Course: FastAPI
      ↓
course.users
      ↓
Users enrolled in FastAPI
```

---

# 10. 💤 Lazy Loading

The `/test-lazy/{user_id}` endpoint demonstrates lazy relationship loading.

First:

```python
user = db.query(User).filter(
    User.id == user_id
).first()
```

At this point, the code then accesses:

```python
posts = user.posts
```

The important concept is that the related `posts` collection is accessed separately from the initial user query.

The module prints:

```text
1. Querying user
2. User loaded
3. Accessing posts
4. Posts loaded
```

Because SQLAlchemy is configured with `echo=True`, the SQL generated by these operations can also be observed in the terminal.

---

# 11. 🚨 The N+1 Query Problem

Consider loading multiple users and then accessing:

```python
user.posts
```

for every user.

Conceptually, this can result in:

```text
1 query → load all users

+ 1 query → posts for user 1
+ 1 query → posts for user 2
+ 1 query → posts for user 3
+ ...
```

This pattern is known as the **N+1 query problem**.

It becomes increasingly inefficient as the number of users grows.

This module demonstrates two eager-loading approaches to address that problem.

---

# 12. 🚀 `selectinload`

The `/test-n-plus-one-fixed` endpoint uses:

```python
users = (
    db.query(User)
    .options(selectinload(User.posts))
    .all()
)
```

`selectinload()` tells SQLAlchemy to load the related posts efficiently using an additional query for the related collection rather than loading the posts one user at a time.

Conceptually:

```text
Query 1
Users
  ↓

Query 2
Posts belonging to those users
```

Instead of:

```text
Users
  ↓
Post query
Post query
Post query
Post query
...
```

This is particularly useful when loading a collection relationship such as:

```text
User → Posts
```

---

# 13. ⚡ `joinedload`

The `/test-joined-load` endpoint uses:

```python
users = (
    db.query(User)
    .options(joinedload(User.posts))
    .all()
)
```

`joinedload()` tells SQLAlchemy to load the relationship using a SQL join strategy.

Conceptually:

```text
Users
  +
Posts
  ↓
Joined result
```

The key distinction demonstrated by the module is:

| Loading strategy | Main idea |
|---|---|
| Lazy loading | Load relationship when it is accessed |
| `selectinload()` | Load related collections using a separate SELECT |
| `joinedload()` | Load relationship through a JOIN |

---

# 14. 🔍 SQL JOIN

The `/test-join` endpoint explicitly uses:

```python
db.query(Post)
    .join(User)
    .filter(User.name == "Viraj")
```

This is different from simply accessing:

```python
user.posts
```

Here, the query explicitly joins `Post` with `User` and filters using the user's name.

Conceptually:

```text
User
 │
 │ JOIN
 ▼
Post
 │
 ▼
WHERE User.name = "Viraj"
```

This returns posts belonging to the matching user.

---

# 15. 🎯 Filtering Through a Relationship

The `/test-relationship-filter` endpoint uses:

```python
users = (
    db.query(User)
    .join(User.posts)
    .filter(Post.title == "FastAPI")
    .distinct()
    .all()
)
```

This allows the query to answer:

> Which users have a post titled `"FastAPI"`?

The query flow is:

```text
Users
  ↓
JOIN Posts
  ↓
Post.title == "FastAPI"
  ↓
Matching Users
```

`distinct()` prevents duplicate users from appearing if multiple matching rows could produce repeated results.

---

# 16. 📊 Aggregation with `COUNT`

The `/test-post-count` endpoint demonstrates SQL aggregation:

```python
db.query(
    User.name,
    func.count(Post.id).label("post_count")
)
.join(Post)
.group_by(User.id, User.name)
.all()
```

The result answers:

> How many posts does each user have?

Conceptually:

```text
User       Posts
──────────────────
Viraj        2
Alice        5
Bob          3
```

The important SQL concepts are:

```text
JOIN
  +
COUNT()
  +
GROUP BY
```

This is a useful example of moving aggregation work into the database rather than loading everything into Python first.

---

# 17. 📦 Pydantic Response Models

`schemas.py` defines response models for related data.

## Basic Post Response

```python
class PostResponse(BaseModel):
    id: int
    title: str
    content: str
```

## Basic User Response

```python
class UserResponse(BaseModel):
    id: int
    name: str
```

## User with Posts

```python
class UserWithPostsResponse(BaseModel):
    id: int
    name: str
    posts: list[PostResponse]
```

The resulting structure is:

```text
User
├── id
├── name
└── posts[]
      ├── id
      ├── title
      └── content
```

---

# 18. 👤 Post with User

The module also defines:

```python
class PostWithUserResponse(BaseModel):
    id: int
    title: str
    content: str
    user: UserResponse
```

This allows an API response to represent:

```text
Post
├── id
├── title
├── content
└── user
      ├── id
      └── name
```

The `/posts/{post_id}` endpoint uses:

```python
.options(joinedload(Post.user))
```

to load the related user.

---

# 19. 📚 Course with Users

The many-to-many response is:

```python
class CourseWithUsersResponse(BaseModel):
    id: int
    name: str
    users: list[UserResponse]
```

The `/courses/{course_id}/users` endpoint uses:

```python
.options(selectinload(Course.users))
```

to load the users belonging to the course.

The response structure is:

```text
Course
├── id
├── name
└── users[]
      ├── id
      └── name
```

---

# 🌐 API Endpoints

The module contains the following endpoints.

### Relationship creation / demonstrations

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/test-relationship` | Create a user with posts |
| `POST` | `/test-profile` | Create a user with a profile |
| `POST` | `/test-courses` | Create a user with courses |

### Relationship queries

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/test-course-users` | Get users belonging to the `FastAPI` course |
| `GET` | `/test-lazy/{user_id}` | Demonstrate lazy loading |
| `GET` | `/test-n-plus-one-fixed` | Demonstrate `selectinload()` |
| `GET` | `/test-joined-load` | Demonstrate `joinedload()` |
| `GET` | `/test-join` | Query posts using an explicit join |
| `GET` | `/test-relationship-filter` | Filter users through posts |
| `GET` | `/test-post-count` | Count posts per user |

### Response-model examples

| Method | Endpoint | Response model |
|---|---|---|
| `GET` | `/users/{user_id}` | `UserResponse` |
| `GET` | `/users/{user_id}/posts` | `UserWithPostsResponse` |
| `GET` | `/posts/{post_id}` | `PostWithUserResponse` |
| `GET` | `/courses/{course_id}/users` | `CourseWithUsersResponse` |

---

# 🔄 Relationship Summary

The complete relationship design is:

```text
                    ┌──────────────┐
                    │     User     │
                    └──────┬───────┘
                           │
             ┌─────────────┼─────────────┐
             │             │             │
             │             │             │
             ▼             ▼             ▼
          ┌───────┐     ┌─────────┐   ┌─────────┐
          │ Posts │     │ Profile │   │ Courses │
          └───────┘     └─────────┘   └─────────┘
             │              │             │
       One-to-Many       One-to-One   Many-to-Many
                                           │
                                           ▼
                                  student_courses
```

---

# 🧠 Lazy vs Eager Loading

This module is particularly important because relationship mapping alone is not enough.

You also need to understand **when related records are loaded**.

```text
Lazy Loading
────────────
Load User
   ↓
Access user.posts
   ↓
Load Posts


selectinload()
──────────────
Load Users
   ↓
Load related Posts separately
   ↓
Associate them in SQLAlchemy


joinedload()
────────────
Load Users + related Posts
   ↓
JOIN-based loading
```

### Practical rule

```text
Need related data?
      ↓
Think about loading strategy.
      ↓
Don't blindly access relationships inside loops.
```

The N+1 example in this module makes that distinction concrete.

---

# ▶️ Running the Module

From the module directory:

```bash
uvicorn main:app --reload
```

Then open:

```text
http://127.0.0.1:8000/docs
```

Swagger UI can be used to execute the available endpoints.

Because the application uses:

```python
echo=True
```

SQLAlchemy SQL statements are also printed in the terminal.

This is useful for observing the difference between:

- Lazy loading
- `selectinload()`
- `joinedload()`
- Explicit joins

---

# 🧪 Suggested Experiment Order

Run the relationship examples in this order:

### 1️⃣ Create relationship data

```text
POST /test-relationship
POST /test-profile
POST /test-courses
```

### 2️⃣ Query relationships

```text
GET /test-course-users
GET /test-lazy/{user_id}
```

### 3️⃣ Compare loading strategies

```text
GET /test-n-plus-one-fixed
GET /test-joined-load
```

Watch the SQLAlchemy output in the terminal.

### 4️⃣ Practice SQL querying

```text
GET /test-join
GET /test-relationship-filter
GET /test-post-count
```

### 5️⃣ Test response schemas

```text
GET /users/{user_id}
GET /users/{user_id}/posts
GET /posts/{post_id}
GET /courses/{course_id}/users
```

---

# ⚠️ Important Implementation Note

The archive contains both:

```text
main.py
main1.py
```

Both create a FastAPI application and call:

```python
Base.metadata.create_all(bind=engine)
```

`main.py` contains the broader relationship demonstrations, while `main1.py` contains a smaller set of relationship-reading endpoints.

Use the file you intend to run as the application entry point.

---

# 🧠 Key Takeaways

### SQLAlchemy Relationships

- 🔗 `relationship()` connects ORM models.
- 👤 One-to-many is represented by a foreign key on the "many" side.
- 👤 One-to-one uses a unique foreign key together with `uselist=False`.
- 👥 Many-to-many uses an association table.

### Loading

- 💤 Lazy loading loads a relationship when accessed.
- 🚀 `selectinload()` loads related collections efficiently using additional SELECT statements.
- ⚡ `joinedload()` uses a JOIN-based loading strategy.
- 🚨 Blindly loading relationships inside loops can lead to N+1 queries.

### Querying

- 🔍 `.join()` allows explicit joins.
- 🎯 Relationships can be used in filtering.
- 📊 `func.count()` + `group_by()` provides database-side aggregation.

### API Design

- 📦 Pydantic response models define the shape of nested API responses.
- 🔄 ORM relationships can be represented as nested response objects.
- 🧱 Database modeling and API response design are separate concerns.

---

# 🏁 Module Status

**Module 08 — SQLAlchemy Relationships** ✅

This module establishes the relationship and loading concepts needed to work with connected database entities in FastAPI applications.

---

## 📚 FastAPI Progress

```text
01 — Basics                  ✅
02 — Project Structure       ✅
03 — Authentication          ✅
04 — Error Handling          ✅
05 — Middleware              ✅
06 — Dependency Injection    ✅
07 — Pydantic + API Design   ✅
08 — SQLAlchemy Relationships ✅  ← Current
09 — ...
   ↓
17 — Full-Stack Backend      🚀
```
