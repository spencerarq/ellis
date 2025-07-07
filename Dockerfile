# Estágio 1: Build com dependências de compilação
# Usamos uma imagem baseada em Debian ('slim-bookworm') por sua ampla compatibilidade com
# pacotes Python pré-compilados (wheels), evitando problemas de compilação comuns no Alpine.
FROM python:3.12-slim-bookworm AS builder

# Instala as dependências do sistema necessárias para compilar pacotes como psycopg2.
RUN apt-get update && apt-get install -y build-essential libpq-dev && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copia apenas o arquivo de dependências para aproveitar o cache do Docker.
COPY requirements.txt .

# Cria um "wheelhouse" com as dependências compiladas.
# Isso acelera a instalação e mantém a imagem final pequena.
RUN pip wheel --no-cache-dir --wheel-dir /wheels -r requirements.txt

# Estágio 2: Imagem final de produção
# Usamos a mesma base slim, mas sem as ferramentas de build, para uma imagem final menor e mais segura.
FROM python:3.12-slim-bookworm

WORKDIR /app

# Instala o curl para ser usado no healthcheck e limpa o cache do apt.
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Copia as dependências pré-compiladas do estágio anterior e as instala.
COPY --from=builder /wheels /wheels
RUN pip install --no-cache-dir /wheels/*

# Copia APENAS o código da API para a imagem final, evitando incluir arquivos desnecessários.
COPY ./api /app

EXPOSE 8000

# O comando de inicialização. O FastAPI encontrará o objeto 'app' em 'main.py' no diretório de trabalho.
CMD ["uvicorn", "api.app:app", "--host", "0.0.0.0", "--port", "8000"]