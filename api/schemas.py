from pydantic import BaseModel, EmailStr, ConfigDict
from typing import List, Optional

class MatriculaBase(BaseModel):
    aluno_id: int
    curso_id: int

class MatriculaCreate(MatriculaBase):
    pass

class Matricula(MatriculaBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

Matriculas = List[Matricula]

class AlunoBase(BaseModel):
    nome: str
    email: EmailStr
    telefone: str

class AlunoCreate(AlunoBase):
    pass

class Aluno(AlunoBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

Alunos = List[Aluno]

class CursoBase(BaseModel):
    nome: str
    codigo: str
    carga_horaria: int

class CursoCreate(CursoBase):
    pass

class Curso(CursoBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class CursoUpdate(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    nome: Optional[str] = None
    codigo: Optional[str] = None
    carga_horaria: Optional[int] = None

Cursos = List[Curso]