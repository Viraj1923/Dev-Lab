from sqlalchemy import create_engine, Column, Integer, String, ForeignKey
from sqlalchemy.orm import declarative_base, sessionmaker, selectinload,relationship


# echo=True makes SQLAlchemy print SQL queries to the terminal.
engine = create_engine(
    "sqlite:///n_plus_one.db",
    echo=True
)

Base = declarative_base()


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    name = Column(String)

    # One user can have many posts.
    posts = relationship("Post", back_populates="user")


class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True)
    title = Column(String)

    user_id = Column(Integer, ForeignKey("users.id"))

    user = relationship("User", back_populates="posts")


Base.metadata.create_all(bind=engine)

SessionLocal = sessionmaker(bind=engine)
db = SessionLocal()


# Create users.
viraj = User(name="Viraj")
rahul = User(name="Rahul")
alex = User(name="Alex")

db.add_all([viraj, rahul, alex])
db.commit()


# Create posts.
db.add_all([
    Post(title="Viraj Post 1", user=viraj),
    Post(title="Viraj Post 2", user=viraj),
    Post(title="Rahul Post 1", user=rahul),
    Post(title="Alex Post 1", user=alex),
])

db.commit()


# Get all users.
users = (
    db.query(User)
    .options(selectinload(User.posts))
    .all()
)

print("\n--- USERS ---")

for user in users:
    print(user.name)

    # Accessing user.posts may trigger another SQL query.
    for post in user.posts:
        print("  ", post.title)


db.close()