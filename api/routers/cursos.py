from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..schemas import Curso, CursoCreate, CursoUpdate
from ..models import Curso as ModelCurso
from ..database import get_db

cursos_router = APIRouter()

@cursos_router.get("/cursos", response_model=List[Curso])
def read_cursos(db: Session = Depends(get_db)):
    cursos = db.query(ModelCurso).all()
    return [Curso.model_validate(curso) for curso in cursos]

@cursos_router.post("/cursos", response_model=Curso)
def create_curso(curso: CursoCreate, db: Session = Depends(get_db)):
    db_curso = ModelCurso(**curso.model_dump())
    db.add(db_curso)
    db.commit()
    db.refresh(db_curso)
    return Curso.model_validate(db_curso)

@cursos_router.put("/cursos/{codigo_curso}", response_model=Curso)
def update_curso(codigo_curso: str, curso: CursoUpdate, db: Session = Depends(get_db)):
    db_curso = db.query(ModelCurso).filter(ModelCurso.codigo == codigo_curso).first()
    if db_curso is None:
        raise HTTPException(status_code=404, detail="Curso não encontrado")

    for key, value in curso.model_dump(exclude_unset=True).items():
        setattr(db_curso, key, value)

    db.commit()
    db.refresh(db_curso)
    return Curso.model_validate(db_curso)

@cursos_router.get("/cursos/{codigo_curso}", response_model=Curso)
def read_curso_por_codigo(codigo_curso: str, db: Session = Depends(get_db)):
    db_curso = db.query(ModelCurso).filter(ModelCurso.codigo == codigo_curso).first()
    if db_curso is None:
        raise HTTPException(status_code=404, detail="Nenhum curso encontrado com esse código")
    return Curso.model_validate(db_curso)


# Não buscar um curso pelo ID nem deletar em nenhuma hipótese

# @cursos_router.get("/cursos/{curso_id}", response_model=Curso)
# def read_curso(curso_id: int, db: Session = Depends(get_db)):
#     db_curso = db.query(ModelCurso).filter(ModelCurso.id == curso_id).first()
#     if db_curso is None:
#         raise HTTPException(status_code=404, detail="Curso não encontrado")
#     return Curso.from_orm(db_curso)


# @cursos_router.delete("/cursos/{curso_id}", response_model=Curso)
# def delete_curso(curso_id: int, db: Session = Depends(get_db)):
#     db_curso = db.query(ModelCurso).filter(ModelCurso.id == curso_id).first()
#     if db_curso is None:
#         raise HTTPException(status_code=404, detail="Curso não encontrado")

#     curso_deletado = Curso.from_orm(db_curso)

#     db.delete(db_curso)
#     db.commit()
#     return curso_deletado