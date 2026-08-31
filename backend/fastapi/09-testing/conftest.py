import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from main import Base, app, get_db,User


# Separate SQLite database used only by the test suite.
TEST_DATABASE_URL = "sqlite:///./test.db"

test_engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False}
)

TestingSessionLocal = sessionmaker(
    bind=test_engine,
    autoflush=False,
    autocommit=False
)


@pytest.fixture
def db():
    # Create tables before each test.
    Base.metadata.create_all(bind=test_engine)

    # Give the test a session connected to test.db.
    db = TestingSessionLocal()

    yield db

    # Clean up after each test so tests stay isolated.
    db.close()
    Base.metadata.drop_all(bind=test_engine)


@pytest.fixture
def client(db):
    # Replace the application's get_db dependency with the test session.
    def override_get_db():
        yield db

    app.dependency_overrides[get_db] = override_get_db

    # Provide a client that uses the overridden dependency.
    yield TestClient(app)

    # Remove the override after the test.
    app.dependency_overrides.clear()

@pytest.fixture
def user(db):
    # Create reusable test data.
    user = User(name="Viraj")

    db.add(user)
    db.commit()
    db.refresh(user)

    return user

@pytest.fixture
def auth_headers():
    # Reusable headers for an authenticated request.
    return {
        "Authorization": "Bearer test-token"
    }
