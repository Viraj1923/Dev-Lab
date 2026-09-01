from sqlalchemy import (
    create_engine,
    Column,
    Integer,
    String,
    ForeignKey,
    event
)
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy.exc import IntegrityError


# Create SQLite database.
engine = create_engine("sqlite:///foreign_key.db")


# Enable foreign-key enforcement for every SQLite connection.
@event.listens_for(engine, "connect")
def enable_foreign_keys(dbapi_connection, connection_record):
    cursor = dbapi_connection.cursor()
    cursor.execute("PRAGMA foreign_keys=ON")
    cursor.close()


Base = declarative_base()


# Parent table.
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    name = Column(String)


# Child table.
class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True)
    title = Column(String)
    user_id = Column(Integer, ForeignKey("users.id"))


# Create tables.
Base.metadata.create_all(bind=engine)


SessionLocal = sessionmaker(bind=engine)
db = SessionLocal()


# Create a valid user.
user = User(name="Viraj")

db.add(user)
db.commit()

print("User created with ID:", user.id)


try:
    # Try to create a post for a user that does not exist.
    post = Post(
        title="Invalid Post",
        user_id=999
    )

    db.add(post)
    db.commit()

except IntegrityError:
    print("Foreign-key constraint violated.")

    # Recover the failed Session.
    db.rollback()

    print("Rollback completed.")


# Verify the Session still works.
posts = db.query(Post).all()

print("Posts in database:", len(posts))

db.close()