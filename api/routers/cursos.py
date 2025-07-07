from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..schemas import Curso, CursoCreate, CursoUpdate
from ..database import get_db
from .. import models # Importa o módulo de modelos

cursos_router = APIRouter()

@cursos_router.get("/cursos", response_model=List[Curso])
def read_cursos(db: Session = Depends(get_db)):
    cursos = db.query(models.Curso).all()
    return [Curso.model_validate(curso) for curso in cursos]

@cursos_router.post("/cursos", response_model=Curso)
def create_curso(curso: CursoCreate, db: Session = Depends(get_db)):
    db_curso = models.Curso(**curso.model_dump())
    db.add(db_curso)
    db.commit()
    db.refresh(db_curso)
    return Curso.model_validate(db_curso)

@cursos_router.put("/cursos/{codigo_curso}", response_model=Curso)
def update_curso(codigo_curso: str, curso: CursoUpdate, db: Session = Depends(get_db)):
    db_curso = db.query(models.Curso).filter(models.Curso.codigo == codigo_curso).first()
    if db_curso is None:
        raise HTTPException(status_code=404, detail="Curso não encontrado")

    for key, value in curso.model_dump(exclude_unset=True).items():
        setattr(db_curso, key, value)

    db.commit()
    db.refresh(db_curso)
    return Curso.model_validate(db_curso)

@cursos_router.get("/cursos/{codigo_curso}", response_model=Curso)
def read_curso_por_codigo(codigo_curso: str, db: Session = Depends(get_db)):
    db_curso = db.query(models.Curso).filter(models.Curso.codigo == codigo_curso).first()
    if db_curso is None:
        raise HTTPException(status_code=404, detail="Nenhum curso encontrado com esse código")
    return Curso.model_validate(db_curso)


# O endpoint de deleção foi reativado para permitir a exclusão de cursos pelo frontend.

# @cursos_router.get("/cursos/{curso_id}", response_model=Curso)
# def read_curso(curso_id: int, db: Session = Depends(get_db)):
#     db_curso = db.query(models.Curso).filter(models.Curso.id == curso_id).first()
#     if db_curso is None:
#         raise HTTPException(status_code=404, detail="Curso não encontrado")
#     return Curso.model_validate(db_curso)


@cursos_router.delete("/cursos/{curso_id}", response_model=Curso)
def delete_curso(curso_id: int, db: Session = Depends(get_db)):
    db_curso = db.query(models.Curso).filter(models.Curso.id == curso_id).first()
    if db_curso is None:
        raise HTTPException(status_code=404, detail="Curso não encontrado")

    # Apaga as matrículas associadas antes de apagar o curso.
    db.query(models.Matricula).filter(models.Matricula.curso_id == curso_id).delete(synchronize_session=False)

    curso_deletado = Curso.model_validate(db_curso)

    db.delete(db_curso)
    db.commit()
    return curso_deletado