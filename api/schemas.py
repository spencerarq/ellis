from pydantic import BaseModel, ConfigDict
from typing import Optional

# --- Aluno Schemas ---
class AlunoBase(BaseModel):
    nome: str
    email: str
    telefone: Optional[str] = None

class AlunoCreate(AlunoBase):
    pass

class Aluno(AlunoBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

# --- Curso Schemas ---
class CursoBase(BaseModel):
    nome: str
    codigo: str
    carga_horaria: int

class CursoCreate(CursoBase):
    pass

class CursoUpdate(BaseModel):
    nome: Optional[str] = None
    codigo: Optional[str] = None
    carga_horaria: Optional[int] = None

class Curso(CursoBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

# --- Matricula Schemas ---
class MatriculaBase(BaseModel):
    aluno_id: int
    curso_id: int

class MatriculaCreate(MatriculaBase):
    pass

class Matricula(MatriculaBase):
    id: int
    aluno: Aluno  # Schema aninhado para a resposta da API
    curso: Curso  # Schema aninhado para a resposta da API
    model_config = ConfigDict(from_attributes=True)