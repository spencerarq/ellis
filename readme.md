# Imersão DevOps - Alura Google Cloud

Este projeto é uma API desenvolvida com FastAPI para gerenciar alunos, cursos e matrículas em uma instituição de ensino.

## Pré-requisitos

- [Python 3.10 ou superior instalado](https://www.python.org/downloads/)
- [Git](https://git-scm.com/downloads)
- [Docker](https://www.docker.com/get-started/)

## Passos para subir o projeto

### Localmente

1. **Clone ou faça o download do repositório:**
   [Clique aqui para realizar o download](https://github.com/guilhermeonrails/imersao-devops/archive/refs/heads/main.zip)

2. **Crie um ambiente virtual:**

   ```sh
   python3 -m venv ./venv
   ```

3. **Ative o ambiente virtual:**
   - No Linux/Mac:

     ```sh
     source venv/bin/activate
     ```

   - No Windows, abra um terminal no modo administrador e execute o comando:

   ```sh
   Set-ExecutionPolicy RemoteSigned
   ```

     ```sh
     venv\Scripts\activate
     ```

4. **Instale as dependências:**

   ```sh
   pip install -r requirements.txt
   ```

5. **Execute a aplicação:**

   ```sh
   uvicorn api.app:app --reload
   ```

6. **Acesse a aplicação:**

   - **Frontend Simples:**
   Abra o navegador e acesse a página principal para ver uma lista dos endpoints disponíveis:  
   <http://127.0.0.1:8000/>

   Aqui você pode testar todos os endpoints da API de forma interativa.

### Com Docker Compose

A maneira mais simples e recomendada de executar o projeto é usando Docker Compose, que orquestra os contêineres da aplicação e dos testes.

1. **Construa e suba a aplicação:**

   ```sh
   docker-compose up --build
   ```

   O comando acima irá construir a imagem Docker (se ainda não existir) e iniciar o contêiner da aplicação. A flag `--build` garante que a imagem seja reconstruída caso haja alterações no `Dockerfile` ou nos arquivos de dependência.

2. **Acesse a aplicação:**
   A API estará disponível em <http://12.0.0.1:8000/>.

---

## Executando os Testes

Para garantir a qualidade e a integridade do código, o projeto inclui uma suíte de testes unitários.

### Executando Localmente

1. **Instale as dependências de teste:**

   ```sh
   pip install -r requirements.txt
   ```

   (As dependências de teste como `pytest` e `pytest-cov` já estão no arquivo).

2. **Execute os testes:**
   A partir do diretório raiz do projeto, execute o seguinte comando para rodar os testes e ver o relatório de cobertura:

   ```sh
   pytest --cov=api --cov-report term-missing
   ```

   Para gerar um relatório no formato JUnit XML (útil para integração com ferramentas de CI/CD), use:

   ```sh
   pytest --cov=api --cov-report term-missing --junitxml=report.xml
   ```

### Executando com Docker Compose

É uma boa prática rodar os testes em um ambiente isolado para garantir consistência. O `docker-compose.yml` já define um serviço para isso.

1. **Execute os testes no container:**

   ```sh
   docker-compose run --rm tests
   ```

   Este comando irá construir a imagem de teste (se necessário), iniciar um contêiner, executar os testes com `pytest` e, em seguida, remover o contêiner (`--rm`). O relatório de cobertura será exibido no terminal.

---

## Estrutura do Projeto

- `app.py`: Arquivo principal da aplicação FastAPI.
- `models.py`: Modelos do banco de dados (SQLAlchemy).
- `schemas.py`: Schemas de validação (Pydantic).
- `database.py`: Configuração do banco de dados SQLite.
- `routers/`: Diretório com os arquivos de rotas (alunos, cursos, matrículas).
- `requirements.txt`: Lista de dependências do projeto.
- `tests/`: Diretório com os arquivos de testes.

---

- O banco de dados SQLite será criado automaticamente como `escola.db` na primeira execução.
- Para reiniciar o banco, basta apagar o arquivo `escola.db` (isso apagará todos os dados).

---
