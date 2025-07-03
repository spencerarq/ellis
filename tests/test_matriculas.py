from fastapi.testclient import TestClient
import pytest


@pytest.mark.unit
def test_create_matricula_sucesso(client: TestClient, populated_db_session):
    
    matricula_data = {"aluno_id": 3, "curso_id": 2}
    response = client.post("/matriculas", json=matricula_data)
    assert response.status_code == 201
    data = response.json()
    assert data["aluno_id"] == 3
    assert data["curso_id"] == 2
    assert "id" in data

@pytest.mark.unit
def test_create_matricula_aluno_invalido(client: TestClient, populated_db_session):
    matricula_data = {"aluno_id": 999, "curso_id": 1}
    response = client.post("/matriculas", json=matricula_data)
    assert response.status_code == 404
    assert response.json() == {"detail": "Aluno ou Curso não encontrado"}

@pytest.mark.unit
def test_create_matricula_curso_invalido(client: TestClient, populated_db_session):
    matricula_data = {"aluno_id": 1, "curso_id": 999}
    response = client.post("/matriculas", json=matricula_data)
    assert response.status_code == 404
    assert response.json() == {"detail": "Aluno ou Curso não encontrado"}

@pytest.mark.unit
def test_read_matriculas_por_nome_aluno_com_matriculas(client: TestClient, populated_db_session):
    response = client.get("/matriculas/aluno/João")
    assert response.status_code == 200
    data = response.json()
    assert data["aluno"] == "João Silva"
    assert data["cursos"] == ["Ciência da Computação"]

@pytest.mark.unit
def test_read_matriculas_por_nome_aluno_sem_matriculas(client: TestClient, populated_db_session):
    
    response = client.get("/matriculas/aluno/Pedro")
    assert response.status_code == 200
    data = response.json()
    assert data["aluno"] == "Pedro Santos"
    assert data["cursos"] == []

@pytest.mark.unit
def test_read_matriculas_por_nome_aluno_inexistente(client: TestClient):
    response = client.get("/matriculas/aluno/Fantasma")
    assert response.status_code == 404
    assert response.json() == {"detail": "Aluno não encontrado"}

@pytest.mark.unit
def test_read_alunos_por_codigo_curso_com_alunos(client: TestClient, populated_db_session):
    response = client.get("/matriculas/curso/CS101")
    assert response.status_code == 200
    data = response.json()
    assert data["curso"] == "Ciência da Computação"
    assert sorted(data["alunos"]) == sorted(["João Silva", "Maria Silva"])

@pytest.mark.unit
def test_read_alunos_por_codigo_curso_sem_alunos(client: TestClient, populated_db_session):
    
    response = client.get("/matriculas/curso/EE101")
    assert response.status_code == 200
    data = response.json()
    assert data["curso"] == "Engenharia Elétrica"
    assert data["alunos"] == []

@pytest.mark.unit
def test_read_alunos_por_codigo_curso_inexistente(client: TestClient):
    response = client.get("/matriculas/curso/XX999")
    assert response.status_code == 404
    assert response.json() == {"detail": "Curso não encontrado"}