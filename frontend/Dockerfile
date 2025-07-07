# Estágio 1: Build
# Usamos uma imagem Node para instalar as dependências e construir o projeto.
FROM node:20-alpine AS build

# Define um argumento que pode ser passado durante o build a partir do docker-compose.yml
ARG REACT_APP_API_URL

# Define a variável de ambiente para que o create-react-app a utilize durante o build
ENV REACT_APP_API_URL=$REACT_APP_API_URL

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia o package.json e o package-lock.json para o container
# Isso aproveita o cache do Docker, reinstalando dependências apenas se esses arquivos mudarem.
COPY package.json ./
COPY package-lock.json ./

# Instala as dependências do projeto
RUN npm install

# Copia o restante do código-fonte da aplicação
COPY . .

# Executa o script de build para gerar os arquivos estáticos de produção
RUN npm run build

# Estágio 2: Serve
# Usamos uma imagem Nginx leve para servir os arquivos estáticos gerados.
FROM nginx:stable-alpine

# Instala o curl para ser usado no healthcheck.
RUN apk add --no-cache curl

# Copia a configuração customizada do Nginx para lidar com o roteamento do React
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Copia os arquivos de build do estágio anterior para o diretório padrão do Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Expõe a porta 80 para acesso externo
EXPOSE 80

# O comando padrão do Nginx já inicia o servidor.
CMD ["nginx", "-g", "daemon off;"]