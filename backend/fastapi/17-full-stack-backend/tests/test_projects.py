from uuid import uuid4

from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def get_auth_token():
    email = f"projecttest_{uuid4().hex}@example.com"
    password = "test12345"

    register_response = client.post(
        "/auth/register",
        json={
            "name": "Project Test User",
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

    return login_response.json()["access_token"]


def test_create_project():
    token = get_auth_token()

    response = client.post(
        "/projects/",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "name": "Test Project",
            "description": "Project created during automated testing",
        },
    )

    assert response.status_code in [200, 201]

    data = response.json()

    assert "id" in data
    assert data["name"] == "Test Project"
    assert data["description"] == "Project created during automated testing"
    assert "owner_id" in data


def test_get_all_projects():
    token = get_auth_token()

    # Create a project for this authenticated user first
    create_response = client.post(
        "/projects/",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "name": "All Projects Test",
            "description": "Testing get all projects",
        },
    )

    assert create_response.status_code in [200, 201]

    # Now fetch all projects
    response = client.get(
        "/projects/all_projects",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code == 200

    data = response.json()

    assert isinstance(data, list)
    assert len(data) >= 1


def test_get_project():
    token = get_auth_token()

    create_response = client.post(
        "/projects/",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "name": "Get Project Test",
            "description": "Testing GET project",
        },
    )

    assert create_response.status_code in [200, 201]

    project_id = create_response.json()["id"]

    response = client.get(
        f"/projects/{project_id}",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code == 200

    data = response.json()

    assert data["id"] == project_id
    assert data["name"] == "Get Project Test"


def test_update_project():
    token = get_auth_token()

    create_response = client.post(
        "/projects/",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "name": "Before Update",
            "description": "Old description",
        },
    )

    assert create_response.status_code in [200, 201]

    project_id = create_response.json()["id"]

    response = client.put(
        f"/projects/{project_id}",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "name": "After Update",
            "description": "New description",
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["id"] == project_id
    assert data["name"] == "After Update"
    assert data["description"] == "New description"


def test_delete_project():
    token = get_auth_token()

    create_response = client.post(
        "/projects/",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "name": "Delete Project Test",
            "description": "Project to delete",
        },
    )

    assert create_response.status_code in [200, 201]

    project_id = create_response.json()["id"]

    response = client.delete(
        f"/projects/{project_id}",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code in [200, 204]