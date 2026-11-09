"""Tests HTTP ne necessitant pas de serveur MySQL externe."""
from fastapi.testclient import TestClient
from app.main import app
from app.schemas.user import User
from datetime import datetime

client = TestClient(app)


def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "active"


def test_private_danger_routes_require_authentication():
    assert client.get("/api/dangers").status_code == 401
    assert client.delete("/api/dangers/1").status_code == 401
    assert client.put("/api/dangers/1", data={}).status_code == 401
    assert client.put("/api/dangers/1/status?status=corrige").status_code == 401
    assert client.get("/api/statistiques").status_code == 401
    assert client.post("/api/auth/register", json={}).status_code == 401


def test_public_visitor_submission_is_validated():
    assert client.post("/api/dangers", data={}).status_code == 422


def test_public_login_validates_form():
    assert client.post("/api/auth/token", data={}).status_code == 422


def test_user_response_does_not_contain_password_hash():
    user = User(
        id=1,
        username="test",
        email="test@example.com",
        role="user",
        created_at=datetime(2026, 1, 1),
    )
    assert "hashed_password" not in user.model_dump()
