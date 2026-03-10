# Carreras de Caballos - App completa (Node + login, salas, puntos)
FROM node:20-alpine

WORKDIR /app

COPY package.json ./
COPY server/ server/
COPY web/ web/

RUN cd server && npm install --production

EXPOSE 3000
CMD ["node", "server/src/server.js"]
