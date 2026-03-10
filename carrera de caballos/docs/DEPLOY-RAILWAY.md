# Desplegar en Railway

El **Dockerfile** despliega la **app completa** (servidor Node + web con login, salas y puntos).

### Qué hace el Dockerfile

- Imagen base: `node:20-alpine`
- Copia `package.json`, `server/` y `web/`
- Instala dependencias en `server/` (`npm install --production`)
- Arranca el servidor Node: `node server/src/server.js`
- El servidor usa la variable **PORT** que Railway inyecta automáticamente

### Pasos en Railway

1. **Root Directory**  
   **Settings** → **Source** → **Root Directory** → `carrera de caballos` (si el repo tiene esa carpeta; si el repo es solo el proyecto, déjalo vacío).

2. **Builder**  
   Railway detectará el Dockerfile y hará el build con Docker.

3. **Variables (opcional)**  
   En **Variables** puedes añadir `JWT_SECRET` con un valor secreto para producción.

4. **Dominio**  
   Tras el deploy: **Settings** → **Networking** → **Generate Domain**.

### Resultado

La app en la URL de Railway tendrá **login/registro**, **1000 puntos** al registrarse, **crear/unirse a salas** (4 jugadores), **premio ×5** y **comprar puntos**. Los datos se guardan en el store JSON del contenedor (si reinicias el servicio se pierden; para persistencia real puedes añadir PostgreSQL más adelante).

Haz **Redeploy** después de cambiar el Dockerfile o el Root Directory.
