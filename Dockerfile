# Carreras de Caballos - Despliegue en Railway (raíz del repo)
# La app está en la carpeta "carrera de caballos/"; este Dockerfile está en la raíz para que Railway lo detecte.
FROM node:20-alpine

RUN npm install -g serve

WORKDIR /app
COPY ["carrera de caballos/web", "/app/web"]

EXPOSE 8080
CMD ["sh", "-c", "serve web -s -l ${PORT:-8080}"]
