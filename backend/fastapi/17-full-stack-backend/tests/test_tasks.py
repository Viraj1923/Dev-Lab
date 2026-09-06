from uuid import uuid4

from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def get_auth_token():
    email = f"tasktest_{uuid4().hex}@example.com"
    password = "test12345"

    register_response = client.post(
        "/auth/register",
        json={
            "name": "Task Test User",
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


def create_test_project(token):
    response = client.post(
        "/projects/",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "name": "Task Test Project",
            "description": "Project created for task testing",
        },
    )

    assert response.status_code in [200, 201]

    return response.json()["id"]


def create_test_task(token, project_id):
    response = client.post(
        "/tasks/",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "title": "Test Task",
            "description": "Task created during automated testing",
            "project_id": project_id,
            "status": "todo",
        },
    )

    assert response.status_code in [200, 201]

    return response


def test_create_task():
    token = get_auth_token()
    project_id = create_test_project(token)

    response = create_test_task(token, project_id)

    data = response.json()

    assert "id" in data
    assert data["title"] == "Test Task"
    assert data["description"] == "Task created during automated testing"
    assert data["status"] == "todo"
    assert data["project_id"] == project_id


def test_get_task():
    token = get_auth_token()
    project_id = create_test_project(token)

    create_response = create_test_task(token, project_id)
    task_id = create_response.json()["id"]

    response = client.get(
        f"/tasks/{task_id}",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code == 200

    data = response.json()

    assert data["id"] == task_id
    assert data["title"] == "Test Task"
    assert data["project_id"] == project_id


def test_get_project_tasks():
    token = get_auth_token()
    project_id = create_test_project(token)

    create_test_task(token, project_id)

    response = client.get(
        f"/tasks/project/{project_id}",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code == 200

    data = response.json()

    assert isinstance(data, list)
    assert len(data) >= 1
    assert data[0]["project_id"] == project_id


def test_update_task():
    token = get_auth_token()
    project_id = create_test_project(token)

    create_response = create_test_task(token, project_id)
    task_id = create_response.json()["id"]

    response = client.put(
        f"/tasks/{task_id}",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "title": "Updated Task",
            "description": "Updated task description",
            "status": "in_progress",
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["id"] == task_id
    assert data["title"] == "Updated Task"
    assert data["description"] == "Updated task description"
    assert data["status"] == "in_progress"


def test_delete_task():
    token = get_auth_token()
    project_id = create_test_project(token)

    create_response = create_test_task(token, project_id)
    task_id = create_response.json()["id"]

    response = client.delete(
        f"/tasks/{task_id}",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code in [200, 204]

    # Confirm the task is no longer available
    get_response = client.get(
        f"/tasks/{task_id}",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert get_response.status_code == 404


def test_create_task_for_nonexistent_project():
    token = get_auth_token()

    response = client.post(
        "/tasks/",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "title": "Invalid Project Task",
            "description": "This task should not be created",
            "project_id": 999999999,
            "status": "todo",
        },
    )

    assert response.status_code == 404
