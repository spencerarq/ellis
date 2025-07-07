# Sistema de Gestão Escolar - Ellis

Este projeto é uma API desenvolvida com FastAPI para gerenciar alunos, cursos e matrículas em uma instituição de ensino.

## Começando

### Pré-requisitos

- [Python 3.10 ou superior instalado](https://www.python.org/downloads/)
- [Git](https://git-scm.com/downloads)
- [Docker](https://www.docker.com/get-started/)

### Instalação e Execução (Recomendado)

A maneira mais simples e recomendada de executar o projeto é usando Docker Compose, que orquestra todos os contêineres (API, Frontend, Bancos de Dados).

A partir da raiz do projeto, execute:

```sh
docker-compose up --build -d
```

Este comando irá construir as imagens e iniciar todos os serviços em segundo plano.

#### Acessando os Serviços

Após iniciar os contêineres, os seguintes serviços estarão disponíveis:

- **API (Backend)**:
  - URL: `http://localhost:8000`
  - Docs Interativos (Swagger): `http://localhost:8000/docs`

- **Webtop (Ambiente de Teste Visual)**:
  - URL: `http://localhost:3000`
  - Descrição: Um ambiente de desktop completo rodando no seu navegador. É a principal forma de interagir visualmente com o frontend em um ambiente isolado.

- **Frontend (dentro do Webtop)**:
  - URL: `http://localhost:3001`
  - **Como usar**: Acesse o desktop do Webtop, abra o navegador Chromium que já vem instalado e navegue para `http://frontend`.

### Desenvolvimento Local da API (com Hot-Reload)

Esta abordagem é ideal se você deseja modificar o código da API e ver as alterações instantaneamente (hot-reload), enquanto se conecta ao banco de dados que está rodando no Docker.

1. **Inicie o serviço do banco de dados:**

   ```sh
   docker-compose up -d db
   ```

2. **Prepare o ambiente Python (na raiz do projeto):**
    - Crie e ative um ambiente virtual:

        ```sh
        python3 -m venv venv
        source venv/bin/activate  # Linux/macOS
        # venv\Scripts\activate    # Windows
        ```

    - Instale as dependências:

        ```sh
        pip install -r requirements.txt
        ```

3. **Configure a variável de ambiente do banco de dados:**
    - **Linux/macOS**:

        ```sh
        export DATABASE_URL="postgresql+psycopg2://ellis_user:ellis_pass@localhost:5432/ellis_db"
        ```

    - **Windows (PowerShell)**:

        ```powershell
        $env:DATABASE_URL="postgresql+psycopg2://ellis_user:ellis_pass@localhost:5432/ellis_db"
        ```

4. **Execute a aplicação com Uvicorn:**

    ```sh
    uvicorn api.app:app --reload
    ```

   A API estará disponível em `http://localhost:8000`.

---

## Executando os Testes

Para garantir a qualidade e a integridade do código, o projeto inclui uma suíte de testes unitários e de integração.

### Testes de Backend (Unitários e Integração)

Para executar os testes da API em um ambiente isolado que se conecta ao banco de dados de teste (`db_test`):

   ```sh
   docker-compose run --rm tests
   ```

### Testes de Frontend (End-to-End com Playwright)

Para executar os testes E2E que simulam a interação do usuário com o frontend:

   ```sh
   docker-compose run --rm e2e-tests
   ```

---

## Estrutura do Projeto

```
ellis/
├── api/                   # Contém toda a lógica do backend (FastAPI)
│   ├── routers/           # Módulos de rotas (alunos, cursos, etc.)
│   ├── app.py             # Ponto de entrada da aplicação FastAPI
│   ├── database.py        # Configuração da conexão com o banco de dados
│   ├── models.py          # Modelos de dados (SQLAlchemy ORM)
│   └── schemas.py         # Schemas de validação de dados (Pydantic)
├── frontend/              # Contém toda a lógica do frontend (React)
│   ├── src/
│   └── Dockerfile         # Define como construir a imagem de produção do frontend
├── tests/                 # Testes unitários e de integração do backend (Pytest)
├── e2e-tests/             # Testes de ponta a ponta (Playwright)
├── docker-compose.yml     # Orquestra todos os serviços da aplicação
├── Dockerfile             # Define a imagem da API
└── readme.md              # Este arquivo
```
