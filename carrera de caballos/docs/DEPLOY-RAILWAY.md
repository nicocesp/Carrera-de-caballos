# Desplegar en Railway

El proyecto incluye un **Dockerfile** para desplegar la **versión web estática** (solo la carpeta `web/`) en Railway. La app es 100% JavaScript; el Dockerfile sirve los archivos estáticos sin backend.

Si quieres desplegar la app **con servidor** (multijugador), en Railway debes usar un servicio Node que ejecute `npm start` y, si aplica, añadir un add-on de base de datos (por ejemplo PostgreSQL) y adaptar `server/src/db/` para usarla.

---

## Despliegue solo web (estático)

### Qué hace el Dockerfile

- Imagen base: `node:20-alpine`
- Instala `serve` (servidor estático)
- Copia solo la carpeta **web/** (`.dockerignore` evita copiar `server/node_modules`, `server/data`, etc.)
- Expone puerto 8080 (o la variable `PORT` que inyecte Railway)
- Comando: `serve web -s -l ${PORT:-8080}` (`-s` = SPA fallback a `index.html`)

### Pasos en Railway

1. **Root Directory**  
   En el proyecto de Railway: **Settings** → **Source** → **Root Directory** → `carrera de caballos` (o el nombre de la carpeta del repo).

2. **Builder**  
   Railway detectará el **Dockerfile** y usará Docker para el build.

3. **Puerto**  
   El contenedor usa `PORT` si existe; por defecto 8080. Railway suele inyectar `PORT` automáticamente.

4. **Dominio**  
   Después del deploy: **Settings** → **Networking** → **Generate Domain**.

### Resultado

Solo se sirve el frontend. Los usuarios pueden jugar **partida local**; no habrá registro ni salas multijugador (para eso hace falta desplegar el servidor Node por separado).

---

## Resumen

| Dónde          | Valor / Acción                    |
|----------------|-----------------------------------|
| Root Directory | `carrera de caballos`             |
| Build          | Dockerfile (sirve `web/`)         |
| App desplegada | Versión web estática (partida local) |

Tras configurar Root Directory, haz **Redeploy** para que use el Dockerfile.
