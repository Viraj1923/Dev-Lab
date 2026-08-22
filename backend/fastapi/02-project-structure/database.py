from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker


DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/devlab"


engine = create_engine(DATABASE_URL)


SessionLocal = sessionmaker(bind=engine)


class Base(DeclarativeBase):
    pass

with engine.connect() as connection:
    print("Database connected successfully!")

def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()