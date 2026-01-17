from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_read_main():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {
        "message": "Bienvenue sur l'API de Gestion des Dangers",
        "version": "1.0.0",
        "status": "active"
    }

def test_create_danger():
    danger_test = {
        "type_danger": "Test Danger",
        "lieu": "Lieu Test",
        "description": "Description Test",
        "niveau_urgence": "Moyen"
    }
    response = client.post("/api/dangers/", json=danger_test)
    assert response.status_code == 200
    data = response.json()
    assert data["type_danger"] == danger_test["type_danger"]
