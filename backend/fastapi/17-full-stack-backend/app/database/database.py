from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Import our application settings.
# The database URL will come from the .env file through Settings.
from app.core.config import settings


# Create the SQLAlchemy engine.
# The engine is responsible for managing the connection to our database.
engine = create_engine(
    settings.database_url,
    echo=True
)


# Create a session factory.
# We will use SessionLocal later whenever we need to interact with the database.
SessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False
)


# Base class for all our SQLAlchemy database models.
# Our User, Project, and Task models will inherit from this Base.
Base = declarative_base()

def get_db():
    db=SessionLocal()

    try:
        yield db
    finally:
        db.close()