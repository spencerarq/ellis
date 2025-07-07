from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import List, Dict, Union
from .. import models, schemas
from ..database import get_db

matriculas_router = APIRouter()

@matriculas_router.post("/matriculas", response_model=schemas.Matricula, status_code=201)
def create_matricula(matricula: schemas.MatriculaCreate, db: Session = Depends(get_db)):
    """
    Cria uma nova matrícula associando um aluno a um curso.
    """
    # Verifica se o aluno e o curso existem
    db_aluno = db.query(models.Aluno).filter(models.Aluno.id == matricula.aluno_id).first()
    if not db_aluno:
        raise HTTPException(status_code=404, detail="Aluno não encontrado")
    
    db_curso = db.query(models.Curso).filter(models.Curso.id == matricula.curso_id).first()
    if not db_curso:
        raise HTTPException(status_code=404, detail="Curso não encontrado")

    # Verifica se a matrícula já existe para evitar duplicatas
    db_matricula_existente = db.query(models.Matricula).filter(
        models.Matricula.aluno_id == matricula.aluno_id,
        models.Matricula.curso_id == matricula.curso_id
    ).first()
    if db_matricula_existente:
        raise HTTPException(status_code=400, detail="Aluno já matriculado neste curso")

    db_matricula = models.Matricula(**matricula.model_dump())
    db.add(db_matricula)
    db.commit()
    db.refresh(db_matricula)
    return db_matricula

@matriculas_router.put("/matriculas/{matricula_id}", response_model=schemas.Matricula)
def update_matricula(matricula_id: int, matricula: schemas.MatriculaCreate, db: Session = Depends(get_db)):
    """
    Atualiza uma matrícula existente.
    """
    db_matricula = db.query(models.Matricula).filter(models.Matricula.id == matricula_id).first()
    if not db_matricula:
        raise HTTPException(status_code=404, detail="Matrícula não encontrada")

    # Verifica se o novo aluno e curso existem
    db_aluno = db.query(models.Aluno).filter(models.Aluno.id == matricula.aluno_id).first()
    if not db_aluno:
        raise HTTPException(status_code=404, detail="Aluno não encontrado")
    
    db_curso = db.query(models.Curso).filter(models.Curso.id == matricula.curso_id).first()
    if not db_curso:
        raise HTTPException(status_code=404, detail="Curso não encontrado")

    # Verifica se a nova combinação de matrícula já existe para outro registro
    db_matricula_existente = db.query(models.Matricula).filter(
        models.Matricula.aluno_id == matricula.aluno_id,
        models.Matricula.curso_id == matricula.curso_id,
        models.Matricula.id != matricula_id
    ).first()
    if db_matricula_existente:
        raise HTTPException(status_code=400, detail="Este aluno já está matriculado neste curso")

    db_matricula.aluno_id = matricula.aluno_id
    db_matricula.curso_id = matricula.curso_id
    
    db.commit()
    db.refresh(db_matricula)
    return db_matricula

@matriculas_router.get("/matriculas", response_model=List[schemas.Matricula])
def read_matriculas(db: Session = Depends(get_db)):
    """
    Retorna uma lista de todas as matrículas com os dados do aluno e do curso.
    """
    # Usa joinedload para carregar os dados relacionados de forma eficiente (evita N+1 queries)
    matriculas = db.query(models.Matricula).options(joinedload(models.Matricula.aluno), joinedload(models.Matricula.curso)).all()
    return matriculas

@matriculas_router.get("/matriculas/aluno/{nome_aluno}", response_model=Dict[str, Union[str, List[str]]])
def read_matriculas_por_nome_aluno(nome_aluno: str, db: Session = Depends(get_db)):
    """Retorna os cursos em que um aluno está matriculado."""
    db_aluno = db.query(models.Aluno).filter(models.Aluno.nome.ilike(f"%{nome_aluno}%")).first()

    if not db_aluno:
        raise HTTPException(status_code=404, detail="Aluno não encontrado")

    cursos_matriculados = [matricula.curso.nome for matricula in db_aluno.matriculas if matricula.curso]

    return {"aluno": db_aluno.nome, "cursos": cursos_matriculados}

@matriculas_router.get("/matriculas/curso/{codigo_curso}", response_model=Dict[str, Union[str, List[str]]])
def read_alunos_matriculados_por_codigo_curso(codigo_curso: str, db: Session = Depends(get_db)):
    """Retorna o nome do curso e uma lista com os nomes dos alunos matriculados."""
    db_curso = db.query(models.Curso).filter(models.Curso.codigo == codigo_curso).first()

    if not db_curso:
        raise HTTPException(status_code=404, detail="Curso não encontrado")

    alunos_matriculados = [matricula.aluno.nome for matricula in db_curso.matriculas if matricula.aluno]

    return {"curso": db_curso.nome, "alunos": alunos_matriculados}

@matriculas_router.delete("/matriculas/{matricula_id}", status_code=204)
def delete_matricula(matricula_id: int, db: Session = Depends(get_db)):
    """
    Apaga uma matrícula existente com base no seu ID.
    Retorna 204 No Content em caso de sucesso.
    """
    db_matricula = db.query(models.Matricula).filter(models.Matricula.id == matricula_id).first()
    if not db_matricula:
        raise HTTPException(status_code=404, detail="Matrícula não encontrada")

    db.delete(db_matricula)
    db.commit()
    # Nenhum corpo de resposta é enviado para um status 204
    return None