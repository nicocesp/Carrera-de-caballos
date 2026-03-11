# Carreras de Caballos — Baraja Española

Juego web en **JavaScript** (frontend en el navegador + backend Node.js) con partida local y **multijugador en tiempo real**. Basado en la baraja española (Oros, Copas, Espadas, Bastos).

---

## Contenido

1. [Objetivo y reglas](#1-objetivo-y-reglas-del-juego)
2. [Multijugador y puntos](#2-multijugador-y-puntos)
3. [Modelo de datos](#3-modelo-de-datos)
4. [Estructura del proyecto](#4-estructura-del-proyecto)
5. [Cómo ejecutar](#5-cómo-ejecutar)
6. [Base de datos y configuración](#6-base-de-datos-y-configuración)

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

Esquema MySQL en `server/src/db/schema-mysql.sql`. La base de datos es **MySQL** (por ejemplo con XAMPP); ver `docs/XAMPP.md`.

---

## 4. Estructura del proyecto

```
carrera de caballos/
├── package.json          # Scripts: start, dev, install:server
├── README.md
├── .gitignore
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
├── server/               # Backend Node (API + Socket.io + MySQL)
│   ├── package.json
│   ├── .env.example      # Variables de entorno (DB_HOST, DB_USER, etc.)
│   ├── src/
│   │   ├── server.js     # Express, rutas, estáticos, Socket.io
│   │   ├── db/           # database.js (MySQL), schema-mysql.sql, init.js
│   │   ├── middleware/   # auth.js (JWT)
│   │   ├── routes/       # auth, users, rooms, points
│   │   ├── socket/       # roomHandler.js (salas, carrera, resultado)
│   │   └── game/         # runRace.js (carrera en servidor)
│   └── data/             # (ya no se usa; los datos están en MySQL)
│
└── docs/
    ├── ESTRUCTURA.md     # Detalle de directorios
    └── XAMPP.md          # Configurar MySQL con XAMPP
```

---

## 5. Cómo ejecutar

### Requisitos

- **Node.js 18** o superior.
- **MySQL** (XAMPP). Ver **docs/XAMPP.md** para crear la base de datos `carrera` y las tablas.

### Un solo servidor (recomendado)

Siempre usa el servidor Node para tener login, registro, salas y partida local en **una sola URL**:

1. Instalar dependencias del servidor (una vez): `npm run install:server`
2. Arrancar: `npm start`
3. Abrir **la URL que muestre la consola** (por defecto **http://localhost:3000**).

En esa URL tendrás “Jugar sin cuenta (solo local)”. En esa URL tendrás login, registro, salas y partida local.

No abras `web/index.html` directamente ni uses otro servidor: solo este activa login y salas. Si el puerto 3000 está ocupado, la consola indicará cómo liberarlo.

Modo desarrollo: `npm run dev`

---

## 6. Base de datos y configuración

- **MySQL (XAMPP)**: ver `docs/XAMPP.md` para instalar XAMPP, crear la base de datos `carrera` y ejecutar el esquema.
- **Variables de entorno**: en `server/` puedes crear un archivo `.env` (copiar de `.env.example`) con `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `PORT` y `JWT_SECRET`.

Más detalle en `server/README.md`.
