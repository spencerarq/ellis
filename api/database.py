from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
import os

# A URL do banco de dados é lida da variável de ambiente 'DATABASE_URL'.
# Para garantir a paridade entre ambientes, a aplicação agora espera que esta variável seja sempre definida.
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise EnvironmentError(
        "A variável de ambiente DATABASE_URL é obrigatória. "
        "Para desenvolvimento, use o docker-compose ou defina a URL do seu banco de dados PostgreSQL."
    )

# Como agora sempre usamos PostgreSQL, a lógica condicional para SQLite foi removida.
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db(): # pragma: no cover
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
