from uuid import uuid4

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def _register_user(name: str = "Test User"):
    email = f"testuser_{uuid4().hex}@example.com"
    password = "test12345"
    response = client.post(
        "/auth/register",
        json={"name": name, "email": email, "password": password},
    )
    return email, password, response


def test_register_user_does_not_expose_password_hash():
    _, _, response = _register_user()

    assert response.status_code in [200, 201]
    data = response.json()
    assert data["name"] == "Test User"
    assert "id" in data
    assert "password_hash" not in data
    assert "password" not in data


def test_login_user():
    email, password, register_response = _register_user("Login Test User")
    assert register_response.status_code in [200, 201]

    login_response = client.post(
        "/auth/login", json={"email": email, "password": password}
    )
    assert login_response.status_code == 200
    data = login_response.json()
    assert data["access_token"]
    assert data["token_type"] == "bearer"


def test_login_rejects_wrong_password():
    email, _, register_response = _register_user("Wrong Password Test")
    assert register_response.status_code in [200, 201]

    response = client.post(
        "/auth/login", json={"email": email, "password": "incorrect-password"}
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid email or password"


def test_me_does_not_expose_password_hash():
    email, password, register_response = _register_user("Current User Test")
    assert register_response.status_code in [200, 201]

    login_response = client.post(
        "/auth/login", json={"email": email, "password": password}
    )
    assert login_response.status_code == 200
    token = login_response.json()["access_token"]

    response = client.get("/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == email
    assert "password_hash" not in data
    assert "password" not in data
