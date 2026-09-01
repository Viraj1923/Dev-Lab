from unittest.mock import patch

def test_external(client):
    response = client.get(
        "/external",
        params={
            "name": "Viraj",
            "language": "English"
        }
    )

    assert response.status_code == 200
    assert response.json() == {
        "first": "Real response for Viraj English",
        "second":"Real response for Viraj English"
    }


def test_external_with_mock(client):
    with patch(
        "main.get_external_message",
        side_effect=[
            "First mocked response",
            "Second mocked response"
        ]
    ) as mock_message:
        response = client.get(
            "/external",
            params={
                "name": "Viraj",
                "language": "English"
            }
        )

    assert response.status_code == 200

    assert response.json() == {
        "first": "First mocked response",
        "second": "Second mocked response"
    }

    assert mock_message.call_count == 2

def test_external_service_failure(client):
    with patch(
        "main.get_external_message",
        side_effect=Exception("Service failed")
    ) as mock_message:
        response = client.get(
            "/external-failure",
            params={
                "name": "Viraj",
                "language": "English"
            }
        )

    assert response.status_code == 503
    assert response.json() == {
        "detail": "External service unavailable"
    }

    mock_message.assert_called_once_with(
        "Viraj",
        "English"
    )