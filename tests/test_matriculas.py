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
    assert response.json() == {"detail": "Aluno não encontrado"}

@pytest.mark.unit
def test_create_matricula_curso_invalido(client: TestClient, populated_db_session):
    matricula_data = {"aluno_id": 1, "curso_id": 999}
    response = client.post("/matriculas", json=matricula_data)
    assert response.status_code == 404
    assert response.json() == {"detail": "Curso não encontrado"}

@pytest.mark.unit
def test_create_matricula_duplicada(client: TestClient, populated_db_session):
    # A matrícula do aluno 1 no curso 1 já existe na fixture
    matricula_data = {"aluno_id": 1, "curso_id": 1}
    response = client.post("/matriculas", json=matricula_data)

    # Deve retornar erro 400 (Bad Request)
    assert response.status_code == 400
    assert response.json() == {"detail": "Aluno já matriculado neste curso"}

@pytest.mark.unit
def test_read_all_matriculas(client: TestClient, populated_db_session):
    response = client.get("/matriculas")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 2 # Da fixture
    assert data[0]["aluno"]["nome"] == "João Silva"
    assert data[0]["curso"]["nome"] == "Ciência da Computação"

@pytest.mark.unit
def test_update_matricula_sucesso(client: TestClient, populated_db_session):
    # Matrícula 1 é Aluno 1 no Curso 1. Vamos mudar para Aluno 1 no Curso 2.
    update_data = {"aluno_id": 1, "curso_id": 2}
    response = client.put("/matriculas/1", json=update_data)
    assert response.status_code == 200
    data = response.json()
    assert data["aluno_id"] == 1
    assert data["curso_id"] == 2

@pytest.mark.unit
def test_update_matricula_inexistente(client: TestClient, populated_db_session):
    update_data = {"aluno_id": 1, "curso_id": 2}
    response = client.put("/matriculas/999", json=update_data)
    assert response.status_code == 404
    assert response.json() == {"detail": "Matrícula não encontrada"}

@pytest.mark.unit
def test_update_matricula_aluno_invalido(client: TestClient, populated_db_session):
    # Tenta atualizar a matrícula 1 para um aluno que não existe (ID 999)
    update_data = {"aluno_id": 999, "curso_id": 1}
    response = client.put("/matriculas/1", json=update_data)
    assert response.status_code == 404
    assert response.json() == {"detail": "Aluno não encontrado"}

@pytest.mark.unit
def test_update_matricula_curso_invalido(client: TestClient, populated_db_session):
    # Tenta atualizar a matrícula 1 para um curso que não existe (ID 999)
    update_data = {"aluno_id": 1, "curso_id": 999}
    response = client.put("/matriculas/1", json=update_data)
    assert response.status_code == 404
    assert response.json() == {"detail": "Curso não encontrado"}

@pytest.mark.unit
def test_update_matricula_para_combinacao_duplicada(client: TestClient, populated_db_session):
    # A matrícula (aluno_id=1, curso_id=1) já existe (matrícula ID 1).
    # A matrícula (aluno_id=2, curso_id=1) também existe (matrícula ID 2).
    # Tenta-se atualizar a matrícula 2 para ter a mesma combinação da matrícula 1.
    update_data = {"aluno_id": 1, "curso_id": 1}
    response = client.put("/matriculas/2", json=update_data)
    assert response.status_code == 400
    assert response.json() == {"detail": "Este aluno já está matriculado neste curso"}

@pytest.mark.unit
def test_delete_matricula_sucesso(client: TestClient, populated_db_session):
    # Matrícula com ID 1 existe
    response = client.delete("/matriculas/1")
    assert response.status_code == 204
    assert response.content == b""

@pytest.mark.unit
def test_delete_matricula_inexistente(client: TestClient):
    response = client.delete("/matriculas/999")
    assert response.status_code == 404
    assert response.json() == {"detail": "Matrícula não encontrada"}

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