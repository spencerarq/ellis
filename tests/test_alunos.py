from fastapi.testclient import TestClient
import pytest

@pytest.mark.unit
def test_read_alunos_com_banco_vazio(client: TestClient):
    response = client.get("/alunos")
    assert response.status_code == 200
    assert response.json() == []

@pytest.mark.unit
def test_read_alunos_com_banco_populado(client: TestClient, populated_db_session):
    response = client.get("/alunos")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 3
    assert data[0]["nome"] == "João Silva"
    assert data[1]["nome"] == "Maria Silva"

@pytest.mark.unit
def test_read_aluno_existente(client: TestClient, populated_db_session):
    response = client.get("/alunos/1")
    assert response.status_code == 200
    data = response.json()
    assert data["nome"] == "João Silva"
    assert data["email"] == "joao.silva@example.com"

@pytest.mark.unit
def test_read_aluno_inexistente(client: TestClient):
    response = client.get("/alunos/999")
    assert response.status_code == 404
    assert response.json() == {"detail": "Aluno não encontrado"}

@pytest.mark.unit
def test_create_aluno(client: TestClient):
    aluno_data = {"nome": "Carlos Souza", "email": "carlos.souza@example.com", "telefone": "444444444"}
    response = client.post("/alunos", json=aluno_data)
    assert response.status_code == 200 
    data = response.json()
    aluno_id = data["id"]
    assert data["nome"] == "Carlos Souza"
    
    get_response = client.get(f"/alunos/{aluno_id}")
    assert get_response.status_code == 200
    assert get_response.json()["nome"] == "Carlos Souza"

@pytest.mark.unit
def test_update_aluno_existente(client: TestClient, populated_db_session):
    update_data = {"nome": "João Silva Atualizado", "email": "joao.silva.new@example.com", "telefone": "111111111"}
    response = client.put("/alunos/1", json=update_data)
    assert response.status_code == 200
    data = response.json()
    assert data["nome"] == "João Silva Atualizado"
    assert data["email"] == "joao.silva.new@example.com"

    get_response = client.get("/alunos/1")
    assert get_response.json()["nome"] == "João Silva Atualizado"

@pytest.mark.unit
def test_update_aluno_inexistente(client: TestClient):
    update_data = {"nome": "Fantasma", "email": "fantasma@example.com", "telefone": "000000000"}
    response = client.put("/alunos/999", json=update_data)
    assert response.status_code == 404
    assert response.json() == {"detail": "Aluno não encontrado"}

@pytest.mark.unit
def test_delete_aluno_existente(client: TestClient, populated_db_session):
    response = client.delete("/alunos/1")
    assert response.status_code == 200
    data = response.json()
    assert data["nome"] == "João Silva"

    get_response = client.get("/alunos/1")
    assert get_response.status_code == 404

@pytest.mark.unit
def test_delete_aluno_inexistente(client: TestClient):
    response = client.delete("/alunos/999")
    assert response.status_code == 404
    assert response.json() == {"detail": "Aluno não encontrado"}

@pytest.mark.unit
def test_read_aluno_por_nome_match_unico(client: TestClient, populated_db_session):
    response = client.get("/alunos/nome/João")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 1
    assert data[0]["nome"] == "João Silva"

@pytest.mark.unit
def test_read_aluno_por_nome_matches_multiplos(client: TestClient, populated_db_session):
    response = client.get("/alunos/nome/Silva")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 2
    assert data[0]["nome"] == "João Silva"
    assert data[1]["nome"] == "Maria Silva"

@pytest.mark.unit
def test_read_aluno_por_nome_sem_match(client: TestClient, populated_db_session):
    response = client.get("/alunos/nome/Inexistente")
    assert response.status_code == 404
    assert response.json() == {"detail": "Nenhum aluno encontrado com esse nome"}

@pytest.mark.unit
def test_read_aluno_por_email_existente(client: TestClient, populated_db_session):
    response = client.get("/alunos/email/maria.silva@example.com")
    assert response.status_code == 200
    data = response.json()
    assert data["nome"] == "Maria Silva"
    assert data["email"] == "maria.silva@example.com"

@pytest.mark.unit
def test_read_aluno_por_email_inexistente(client: TestClient, populated_db_session):
    response = client.get("/alunos/email/inexistente@example.com")
    assert response.status_code == 404
    assert response.json() == {"detail": "Nenhum aluno encontrado com esse email"}