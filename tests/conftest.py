import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import StaticPool

from api.app import app
from api.database import Base, get_db
from api.models import Aluno as ModelAluno, Curso as ModelCurso, Matricula as ModelMatricula

SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,  
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(scope="function")
def db_session() -> Session:
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

@pytest.fixture(scope="function")
def client(db_session: Session) -> TestClient:
    yield TestClient(app)

@pytest.fixture(scope="function")
def populated_db_session(db_session: Session):
    
    aluno1 = ModelAluno(id=1, nome="João Silva", email="joao.silva@example.com", telefone="111111111")
    aluno2 = ModelAluno(id=2, nome="Maria Silva", email="maria.silva@example.com", telefone="222222222")
    aluno3 = ModelAluno(id=3, nome="Pedro Santos", email="pedro.santos@example.com", telefone="333333333")

    curso1 = ModelCurso(id=1, codigo="CS101", nome="Ciência da Computação", carga_horaria=3600)
    curso2 = ModelCurso(id=2, codigo="EE101", nome="Engenharia Elétrica", carga_horaria=4000)

    matricula1 = ModelMatricula(aluno_id=aluno1.id, curso_id=curso1.id)
    matricula2 = ModelMatricula(aluno_id=aluno2.id, curso_id=curso1.id)

    db_session.add_all([aluno1, aluno2, aluno3, curso1, curso2, matricula1, matricula2])
    db_session.commit()
    return db_session