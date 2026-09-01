
def test_create_and_get_user_integration(client):
    # Create a user through the API.
    create_response = client.post(
        "/users",
        params={"name": "Integration User"}
    )

    assert create_response.status_code == 200

    created_user = create_response.json()

    # Use the ID returned by the API.
    user_id = created_user["id"]

    # Fetch the same user through the API.
    get_response = client.get(
        f"/users/{user_id}"
    )

    assert get_response.status_code == 200

    assert get_response.json() == {
        "id": user_id,
        "name": "Integration User"
    }