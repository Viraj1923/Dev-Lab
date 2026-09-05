# Import Base and engine from our database configuration.
from app.database.database import Base, engine

# Import models so SQLAlchemy registers their tables with Base.metadata.
from app.database.models import User, Project, Task


# Create all tables that are registered with Base.
Base.metadata.create_all(bind=engine)