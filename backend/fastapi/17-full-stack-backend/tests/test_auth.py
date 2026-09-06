from uuid import uuid4

from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_register_user():
    email = f"testuser_{uuid4().hex}@example.com"

    response = client.post(
        "/auth/register",
        json={
            "name": "Test User",
            "email": email,
            "password": "test12345",
        },
    )

    assert response.status_code in [200, 201]

    data = response.json()

    assert data["name"] == "Test User"
    assert data["email"] == email
    assert "id" in data


def test_login_user():
    email = f"loginuser_{uuid4().hex}@example.com"
    password = "test12345"

    register_response = client.post(
        "/auth/register",
        json={
            "name": "Login Test User",
            "email": email,
            "password": password,
        },
    )

    assert register_response.status_code in [200, 201]

    login_response = client.post(
        "/auth/login",
        json={
            "email": email,
            "password": password,
        },
    )

    assert login_response.status_code == 200

    data = login_response.json()

    assert "access_token" in data
    assert data["token_type"] == "bearer"