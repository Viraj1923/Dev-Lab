from main import app

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