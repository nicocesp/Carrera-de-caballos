# Carreras de Caballos — Baraja Española

Juego web en **JavaScript** (frontend en el navegador + backend Node.js) con partida local y **multijugador en tiempo real**. Basado en la baraja española (Oros, Copas, Espadas, Bastos).

---

## Contenido

1. [Objetivo y reglas](#1-objetivo-y-reglas-del-juego)
2. [Multijugador y puntos](#2-multijugador-y-puntos)
3. [Modelo de datos](#3-modelo-de-datos)
4. [Estructura del proyecto](#4-estructura-del-proyecto)
5. [Cómo ejecutar](#5-cómo-ejecutar)
6. [Despliegue](#6-despliegue)

---

## 1. Objetivo y reglas del juego

Cuatro “caballos” (uno por palo: Oros, Copas, Espadas, Bastos) avanzan según las cartas reveladas de un mazo. La pista tiene N obstáculos (checkpoints). Cuando **todos** los caballos pasan un checkpoint, se voltea esa carta y el caballo de ese palo retrocede 1. Gana el primero que sobrepase el último checkpoint.

- **Pista**: N casillas; N cartas boca abajo forman la pista.
- **Mazo**: el resto de cartas. Cada turno se revela una; el caballo del palo avanza 1.
- **Rebaraje**: si el mazo se agota, se rebaraja solo el descarte y se sigue.

En la app puedes jugar **partida local** (solo en el navegador) o **en salas de 4 jugadores** con el servidor.

---

## 2. Multijugador y puntos

- **Registro**: email, contraseña, nombre. Al registrarte recibes **1000 puntos**.
- **Salas**: crear sala (precio de entrada 10–1000 puntos, longitud de pista, tu caballo) → código de 6 caracteres. Hasta 4 jugadores se unen con ese código y eligen caballo; al llenarse se descuenta la entrada a todos y la carrera se corre en el servidor.
- **Premio**: si tu caballo gana, recibes **apuesta × 5**.
- **Comprar puntos**: paquete de 1000 puntos por **$10.000 COP** (registro interno; sin pasarela de pago).

---

## 3. Modelo de datos

### Lógica del juego (frontend y servidor)

- **Card**, **Deck**, **Track**, **Horse**, **Player**, **GameState**, **GameConfig**: modelo compartido (ver `web/js/model/`, `web/js/game/GameEngine.js`, `server/src/game/runRace.js`).

### Servidor (persistencia)

| Entidad              | Descripción |
|----------------------|-------------|
| **users**            | id, email, password_hash, display_name, points, created_at, updated_at. |
| **rooms**            | id, code, creator_id, entry_price, status, track_length, race_state, winner_suit. |
| **room_players**     | room_id, user_id, suit, points_bet. |
| **point_transactions** | user_id, amount, type (signup \| race_bet \| race_win \| purchase), balance_after. |
| **point_purchases**   | user_id, points, amount_cop, payment_reference. |

Esquema SQL e índices en `server/src/db/schema.sql`. Por defecto se usa un store en JSON (`server/data/carrera.json`).

---

## 4. Estructura del proyecto

```
carrera de caballos/
├── package.json          # Scripts: start, dev, install:server
├── README.md
├── .gitignore
├── Dockerfile            # Despliegue web estático (solo carpeta web)
│
├── web/                  # Frontend (HTML, CSS, JS)
│   ├── index.html
│   ├── css/styles.css
│   └── js/
│       ├── api.js        # Cliente API (auth, salas, puntos)
│       ├── app.js        # Navegación, menú, auth, salas, partida local
│       ├── model/        # Suit, Card, Horse, Deck, Track, Player, GameState
│       ├── util/         # GameConfig, deckFactory
│       └── game/         # GameEngine
│
├── server/               # Backend Node (API + Socket.io)
│   ├── package.json
│   ├── src/
│   │   ├── server.js     # Express, rutas, estáticos, Socket.io
│   │   ├── db/           # database.js, schema.sql, init.js
│   │   ├── middleware/   # auth.js (JWT)
│   │   ├── routes/       # auth, users, rooms, points
│   │   ├── socket/       # roomHandler.js (salas, carrera, resultado)
│   │   └── game/        # runRace.js (carrera en servidor)
│   └── data/             # carrera.json (generado al usar la app)
│
└── docs/
    ├── ESTRUCTURA.md     # Detalle de directorios
    └── DEPLOY-RAILWAY.md # Despliegue en Railway
```

---

## 5. Cómo ejecutar

### Requisitos

- **Node.js 18** o superior.

### Con servidor (partida local + multijugador)

1. Instalar dependencias del servidor (una vez):
   ```bash
   npm run install:server
   ```
2. Arrancar el servidor:
   ```bash
   npm start
   ```
3. Abrir en el navegador: **http://localhost:3000**

Verás la pantalla de Entrar / Registrarse y “Jugar sin cuenta (solo local)”. Tras registrarte podrás crear salas, unirte con código, jugar partidas locales y comprar puntos.

Modo desarrollo (reinicio al cambiar código):

```bash
npm run dev
```

### Solo frontend (partida local, sin servidor)

Abrir `web/index.html` en el navegador (o servir la carpeta `web/` con cualquier servidor estático). Solo estará disponible la partida local; no habrá registro ni salas.

---

## 6. Despliegue

- **Solo web estática**: ver `docs/DEPLOY-RAILWAY.md` y el `Dockerfile` en la raíz (sirve la carpeta `web/`).
- **Servidor**: configurar `PORT` y `JWT_SECRET` en el entorno; la app se sirve desde el mismo Node (Express + estáticos desde `web/`).

Más detalle en `server/README.md`.
