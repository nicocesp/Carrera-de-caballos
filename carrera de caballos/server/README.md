# Servidor Carreras de Caballos

API y multijugador en tiempo real (4 jugadores por sala).

## Cómo ejecutar

Desde la **raíz del proyecto** (recomendado):

```bash
npm run install:server   # una vez
npm start
```

O desde esta carpeta `server/`:

```bash
npm install
npm start
```

La app web se sirve en `http://localhost:3000`. La API está en `/api`.

## Base de datos

- Por defecto se usa un store en **JSON** (`data/carrera.json`) para no depender de compilación nativa.
- Esquema lógico: `users`, `rooms`, `room_players`, `point_transactions`, `point_purchases`.
- Para producción con más carga puedes sustituir `src/db/database.js` por una implementación con **PostgreSQL** o **SQLite** (better-sqlite3) usando el mismo esquema en `schema.sql`.

## Reglas de negocio

- **Registro**: 1000 puntos iniciales.
- **Sala**: 4 jugadores, precio de entrada variable (10–1000 puntos).
- **Carrera**: cuando se llena la sala se descuenta la entrada a todos y se corre la carrera en el servidor. Ganador: **apuesta × 5**.
- **Comprar puntos**: paquete de 1000 puntos por $10.000 COP (registro interno; sin pasarela de pago).

## Variables de entorno

- `PORT`: puerto (default 3000).
- `JWT_SECRET`: secreto para tokens (cambiar en producción).
