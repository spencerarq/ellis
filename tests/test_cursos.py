from fastapi.testclient import TestClient
import pytest

@pytest.mark.unit
def test_read_cursos_com_banco_vazio(client: TestClient):
    response = client.get("/cursos")
    assert response.status_code == 200
    assert response.json() == []

@pytest.mark.unit
def test_read_cursos_com_banco_populado(client: TestClient, populated_db_session):
    response = client.get("/cursos")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert data[0]["codigo"] == "CS101"
    assert data[1]["nome"] == "Engenharia Elétrica"

@pytest.mark.unit
def test_create_curso(client: TestClient):
    curso_data = {"codigo": "PHY202", "nome": "Física Quântica", "carga_horaria": 120}
    response = client.post("/cursos", json=curso_data)
    assert response.status_code == 200
    data = response.json()
    assert data["nome"] == "Física Quântica"
    assert "id" in data

    get_response = client.get(f"/cursos/{curso_data['codigo']}")
    assert get_response.status_code == 200
    assert get_response.json()["nome"] == "Física Quântica"

@pytest.mark.unit
def test_read_curso_por_codigo_existente(client: TestClient, populated_db_session):
    response = client.get("/cursos/CS101")
    assert response.status_code == 200
    data = response.json()
    assert data["nome"] == "Ciência da Computação"

@pytest.mark.unit
def test_read_curso_por_codigo_inexistente(client: TestClient):
    response = client.get("/cursos/XX999")
    assert response.status_code == 404
    assert response.json() == {"detail": "Nenhum curso encontrado com esse código"}

@pytest.mark.unit
def test_update_curso_existente(client: TestClient, populated_db_session):
    update_data = {"nome": "Ciência da Computação Avançada", "carga_horaria": 4000}
    response = client.put("/cursos/CS101", json=update_data)
    assert response.status_code == 200
    data = response.json()
    assert data["nome"] == "Ciência da Computação Avançada"
    assert data["carga_horaria"] == 4000

    get_response = client.get("/cursos/CS101")
    assert get_response.json()["nome"] == "Ciência da Computação Avançada"

@pytest.mark.unit
def test_update_curso_inexistente(client: TestClient):
    update_data = {"nome": "Curso Fantasma"}
    response = client.put("/cursos/XX999", json=update_data)
    assert response.status_code == 404
    assert response.json() == {"detail": "Curso não encontrado"}