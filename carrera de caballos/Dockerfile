# Carreras de Caballos - Despliegue web estático en Railway
FROM node:20-alpine

RUN npm install -g serve

WORKDIR /app
COPY web /app/web

EXPOSE 8080
CMD ["sh", "-c", "serve web -s -l ${PORT:-8080}"]
