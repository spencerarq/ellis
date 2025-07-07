from sqlalchemy import Column, Integer, String, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from .database import Base

class Aluno(Base):
    __tablename__ = "alunos"
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    telefone = Column(String)
    # Relacionamento: Um aluno pode ter várias matrículas
    matriculas = relationship("Matricula", back_populates="aluno")

class Curso(Base):
    __tablename__ = "cursos"
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, index=True)
    codigo = Column(String, unique=True, index=True)
    carga_horaria = Column(Integer)
    # Relacionamento: Um curso pode ter várias matrículas
    matriculas = relationship("Matricula", back_populates="curso")

class Matricula(Base):
    __tablename__ = "matriculas"
    id = Column(Integer, primary_key=True, index=True)
    aluno_id = Column(Integer, ForeignKey("alunos.id"))
    curso_id = Column(Integer, ForeignKey("cursos.id"))
    aluno = relationship("Aluno", back_populates="matriculas")
    curso = relationship("Curso", back_populates="matriculas")
    __table_args__ = (UniqueConstraint('aluno_id', 'curso_id', name='uq_aluno_curso'),)