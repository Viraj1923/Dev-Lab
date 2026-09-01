from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy.exc import IntegrityError


# Create SQLite database.
engine = create_engine("sqlite:///unique_constraint.db")

Base = declarative_base()


# Define the User table.
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    email = Column(String, unique=True)


# Create the table.
Base.metadata.create_all(bind=engine)


# Create Session factory.
SessionLocal = sessionmaker(bind=engine)

db = SessionLocal()


# Create the first user.
user1 = User(
    name="Viraj",
    email="viraj@gmail.com"
)

db.add(user1)
db.commit()

print("First user created.")


try:
    # Try to create another user with the same email.
    user2 = User(
        name="Rahul",
        email="viraj@gmail.com"
    )

    db.add(user2)
    db.commit()

except IntegrityError:
    print("Unique constraint violated.")

    # The transaction failed, so rollback is required.
    db.rollback()

    print("Rollback completed.")


# Verify that the Session can still be used.
users = db.query(User).all()

print("Users in database:", len(users))

db.close()