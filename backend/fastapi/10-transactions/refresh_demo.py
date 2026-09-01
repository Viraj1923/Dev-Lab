from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import declarative_base, sessionmaker


engine = create_engine("sqlite:///refresh_demo.db")

Base = declarative_base()


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    name = Column(String)


Base.metadata.create_all(bind=engine)

SessionLocal = sessionmaker(bind=engine)
db = SessionLocal()


user = User(name="Viraj")

db.add(user)

print("Before commit:", user.id)

db.commit()

print("After commit:", user.id)

db.refresh(user)

print("After refresh:", user.id)

db.close()


# Open a completely new Session.
db2 = SessionLocal()

# Query the database using the new Session.
saved_user = db2.query(User).first()

print("User from new session:", saved_user.name)

db2.close()