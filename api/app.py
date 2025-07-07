from fastapi import FastAPI
from .database import engine, Base, get_db
from fastapi.middleware.cors import CORSMiddleware
from .routers.alunos import alunos_router
from .routers.cursos import cursos_router
from .routers.matriculas import matriculas_router



Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="API de Gestão Escolar", 
    description="""
        Esta API fornece endpoints para gerenciar alunos, cursos e turmas, em uma instituição de ensino.  
        
        Permite realizar diferentes operações em cada uma dessas entidades.
    """, 
    version="1.0.0",
)

origins = [
    # Acesso de um frontend rodando localmente (fora do Docker)
    # Para o caso de `npm start` que geralmente usa a porta 3000.
    "http://localhost:3000",
    # Endereço do frontend rodando no Webtop (React Dev Server)
    "http://localhost:3001",
    # Endereço para testes automatizados localmente (fora do Docker)
    "http://localhost:3002",
    # Endereço para um dev rodando Webtop (React Dev Server)
    "http://frontend",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos os métodos (GET, POST, etc.)
    allow_headers=["*"],  # Permite todos os cabeçalhos
)

app.include_router(alunos_router, tags=["alunos"])
app.include_router(cursos_router, tags=["cursos"])
app.include_router(matriculas_router, tags=["matriculas"])