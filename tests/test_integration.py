import pytest
from fastapi.testclient import TestClient

@pytest.mark.integration
def test_full_student_and_course_lifecycle(client: TestClient):
    """
    Testa um fluxo completo: criar curso, criar aluno, matricular,
    verificar, atualizar, deletar e verificar a limpeza dos dados.
    """
    curso_data = {"codigo": "ADS01", "nome": "Análise e Des. de Sistemas", "carga_horaria": 2800}
    response = client.post("/cursos", json=curso_data)
    
    assert response.status_code == 200
    curso = response.json()
    curso_id = curso["id"]
    assert curso["nome"] == "Análise e Des. de Sistemas"

    aluno_data = {"nome": "Ana Turing", "email": "ana.turing@example.com", "telefone": "555555555"}
    response = client.post("/alunos", json=aluno_data)
    assert response.status_code == 200
    aluno = response.json()
    aluno_id = aluno["id"]
    assert aluno["nome"] == "Ana Turing"

    matricula_data = {"aluno_id": aluno_id, "curso_id": curso_id}
    response = client.post("/matriculas", json=matricula_data)
    assert response.status_code == 201
    matricula = response.json()
    assert matricula["aluno_id"] == aluno_id
    assert matricula["curso_id"] == curso_id

    response = client.get(f"/matriculas/curso/{curso['codigo']}")
    assert response.status_code == 200
    matriculas_curso = response.json()
    assert matriculas_curso["curso"] == "Análise e Des. de Sistemas"
    assert "Ana Turing" in matriculas_curso["alunos"]

    response = client.delete(f"/alunos/{aluno_id}")
    assert response.status_code == 200
    assert response.json()["nome"] == "Ana Turing"

    response = client.get(f"/alunos/{aluno_id}")
    assert response.status_code == 404

    response = client.get(f"/matriculas/curso/{curso['codigo']}")
    assert response.status_code == 200
    matriculas_curso_depois_delete = response.json()
    assert "Ana Turing" not in matriculas_curso_depois_delete["alunos"]