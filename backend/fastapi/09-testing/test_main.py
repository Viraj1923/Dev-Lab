from main import User
import pytest
from unittest.mock import patch

@pytest.mark.parametrize("name", [
    "Viraj",
    "Rahul",
    "Alex",
])
def test_create_user_with_different_names(client, db, name):
    response = client.post(
        "/users",
        params={"name": name}
    )

    assert response.status_code == 200

    data = response.json()

    assert data["name"] == name


@pytest.mark.parametrize("payload", [
    {},
    {"wrong_field": "Viraj"},
])
def test_create_user_invalid_payload(client, payload):
    response = client.post(
        "/users",
        json=payload
    )

    assert response.status_code == 422

# ---------------------------------------------------------------

def test_create_user_invalid(client):
    # Missing required "name" parameter should fail validation.
    response = client.post("/users", json={})

    assert response.status_code == 422


def test_create_user(client, db):
    # Create a user through the API.
    response = client.post("/users", params={"name": "Viraj"})

    assert response.status_code == 200

    data = response.json()

    # Verify the API response.
    assert data["name"] == "Viraj"
    assert "id" in data

    # Verify that the user was actually saved in test.db.
    user = db.query(User).filter(User.id == data["id"]).first()

    assert user is not None
    assert user.name == "Viraj"


def test_database_starts_empty(client, db):
    # Each test should start with an empty test database.
    users = db.query(User).all()

    assert len(users) == 0


def test_get_user(client, user):
    response = client.get(f"/users/{user.id}")

    # Assert: verify the API response.
    assert response.status_code == 200
    assert response.json() == {"id": user.id, "name": "Viraj"}


def test_get_user_not_found(client):
    # Request a user ID that does not exist.
    response = client.get("/users/999")

    assert response.status_code == 404
    assert response.json() == {"detail": "User not found"}


def test_update_user(client, db):
    # Arrange: create a user that can be updated.
    user = User(name="Viraj")

    db.add(user)
    db.commit()
    db.refresh(user)

    # Act: update the user through the API.
    response = client.put(
        f"/users/{user.id}",
        params={"name": "Viraj Updated"}
    )

    assert response.status_code == 200

    data = response.json()

    assert data["id"] == user.id
    assert data["name"] == "Viraj Updated"

    # Verify that the change was persisted.
    db.refresh(user)
    assert user.name == "Viraj Updated"


def test_update_user_not_found(client):
    # Try to update a user that does not exist.
    response = client.put(
        "/users/999",
        params={"name": "Viraj Updated"}
    )

    assert response.status_code == 404
    assert response.json() == {"detail": "User not found"}


def test_delete_user(client, db):
    # Arrange: create a user that can be deleted.
    user = User(name="Viraj")

    db.add(user)
    db.commit()
    db.refresh(user)

    # Act: delete the user through the API.
    response = client.delete(f"/users/{user.id}")

    assert response.status_code == 200
    assert response.json() == {"message": "User deleted"}

    # Verify that the record was actually removed.
    deleted_user = db.query(User).filter(User.id == user.id).first()
    assert deleted_user is None


def test_delete_user_not_found(client):
    # Try to delete a user that does not exist.
    response = client.delete("/users/999")

    assert response.status_code == 404
    assert response.json() == {"detail": "User not found"}

def test_protected_without_token(client):
    response = client.get("/protected")

    assert response.status_code == 401
    assert response.json() == {
        "detail": "Invalid or missing token"
    }

def test_protected_with_wrong_token(client):
    response = client.get(
        "/protected",
        headers={
            "Authorization": "Bearer wrong-token"
        }
    )

    assert response.status_code == 401
    assert response.json() == {
        "detail": "Invalid or missing token"
    }

def test_protected_with_valid_token(client, auth_headers):
    response = client.get(
        "/protected",
        headers=auth_headers
    )

    assert response.status_code == 200
    assert response.json() == {
        "message": "You are authenticated"
    }

def test_external(client):
    response = client.get("/external")

    assert response.status_code == 200
    assert response.json() == {
        "message": "Real external response"
    }


def test_external_with_mock(client):
    with patch(
        "main.get_external_message",
        return_value="Mocked response"
    ) as mock_message:
        response = client.get("/external")

    assert response.status_code == 200
    assert response.json() == {
        "message": "Mocked response"
    }

    mock_message.assert_called_once_with()