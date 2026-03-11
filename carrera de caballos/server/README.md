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

- Se usa **MySQL** (por ejemplo con XAMPP). Ver **docs/XAMPP.md** en la raíz del proyecto para crear la base de datos y las tablas.
- Esquema: `src/db/schema-mysql.sql`. Tablas: `users`, `rooms`, `room_players`, `point_transactions`, `point_purchases`.
- Variables: `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` (ver `.env.example`).

## Reglas de negocio

- **Registro**: 1000 puntos iniciales.
- **Sala**: 4 jugadores, precio de entrada variable (10–1000 puntos).
- **Carrera**: cuando se llena la sala se descuenta la entrada a todos y se corre la carrera en el servidor. Ganador: **apuesta × 5**.
- **Comprar puntos**: paquete de 1000 puntos por $10.000 COP (registro interno; sin pasarela de pago).

## Variables de entorno

- `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`: conexión MySQL (por defecto localhost, root, vacío, carrera).
- `PORT`: puerto (default 3000).
- `JWT_SECRET`: secreto para tokens (cambiar en producción).
