# Sistema de Gestão Escolar - Ellis

Este projeto é uma API desenvolvida com FastAPI para gerenciar alunos, cursos e matrículas em uma instituição de ensino.

## Começando

### Pré-requisitos

- [Python 3.10 ou superior instalado](https://www.python.org/downloads/)
- [Git](https://git-scm.com/downloads)
- [Docker](https://www.docker.com/get-started/)

### Instalação e Execução (Recomendado)

A maneira mais simples e recomendada de executar o projeto é usando Docker Compose, que orquestra todos os contêineres (API, Frontend, Bancos de Dados, Monitoramento).

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
  - Métricas: `http://localhost:8000/metrics`

- **Webtop (Ambiente de Teste Visual)**:
  - URL: `http://localhost:3000`
  - Descrição: Um ambiente de desktop completo rodando no seu navegador. É a principal forma de interagir visualmente com o frontend em um ambiente isolado.

- **Frontend (dentro do Webtop)**:
  - URL: `http://localhost:3001`
  - **Como usar**: Acesse o desktop do Webtop, abra o navegador Chromium que já vem instalado e navegue para `http://frontend`.

- **Monitoramento**:
  - **Prometheus**: `http://localhost:9090`
  - **Grafana**: `http://localhost:3003/login`
    - Usuário: `admin`
    - Senha: `admin`

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

## Monitoramento e Observabilidade

O projeto inclui um stack completo de monitoramento usando Prometheus e Grafana:

### Métricas Coletadas

- **HTTP Requests**: Total de requisições por endpoint e status
- **Response Time**: Tempo de resposta das requisições
- **Active Connections**: Conexões ativas no banco de dados
- **Database Operations**: Operações de banco de dados por tipo
- **Application Health**: Status geral da aplicação

### Configuração do Grafana

1. Acesse `http://localhost:3003/login`
2. Faça login com `admin/admin`
3. Adicione Prometheus como datasource: `http://prometheus:9090`
4. Importe dashboards personalizados ou crie os seus próprios

### Alertas

Configure alertas no Grafana para monitorar:

- Alta latência nas requisições
- Erros 5xx frequentes
- Uso excessivo de CPU/memória
- Falhas de conexão com o banco de dados

---

## Estrutura do Projeto

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
├── prometheus.yml         # Configuração do Prometheus
└── readme.md              # Este arquivo

## Troubleshooting

### Problemas Comuns

- **Porta já em uso**: Verifique se as portas 8000, 3000, 3001, 3003 e 9090 estão disponíveis
- **Grafana não carrega**: Aguarde alguns segundos para o serviço inicializar completamente
- **Métricas não aparecem**: Certifique-se de que a API está recebendo requisições

### Logs dos Serviços

Para visualizar logs específicos:

```sh
docker-compose logs -f [nome_do_serviço]
```

Serviços disponíveis: `api`, `frontend`, `db`, `prometheus`, `grafana`, `webtop`
