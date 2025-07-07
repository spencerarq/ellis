#!/bin/bash
#
# Este script é executado pelo Webtop na inicialização do container.
# Ele navega até o diretório do frontend e inicia o servidor de desenvolvimento do React.

echo "--- Iniciando a aplicação React no Webtop ---"

cd /app/frontend
# Define a porta para o React App e o inicia em segundo plano para não bloquear o desktop.
# Inicia o servidor em segundo plano para não bloquear a inicialização do desktop
PORT=3001 npm start &