# Estructura del proyecto — Carreras de Caballos

Proyecto 100% **JavaScript**: frontend en el navegador y backend Node.js con API REST y Socket.io.

---

## Árbol de directorios

```
carrera de caballos/
├── package.json          # Scripts: npm start, npm run dev, npm run install:server
├── README.md
├── .gitignore
├── Dockerfile            # Despliegue web estático (copia solo web/)
│
├── web/                  # Frontend
│   ├── index.html        # Entrada; carga CSS y scripts (api, model, game, app)
│   ├── README.md         # Notas de la versión web
│   ├── css/
│   │   └── styles.css    # Estilos tipo casino (verde, dorado, emojis)
│   └── js/
│       ├── api.js        # Cliente API: register, login, getMe, createRoom, joinRoom, purchasePoints
│       ├── app.js        # UI: auth, menú, partida local, crear/unirse sala, compra puntos
│       ├── model/
│       │   ├── Suit.js
│       │   ├── Card.js
│       │   ├── Horse.js
│       │   ├── Deck.js
│       │   ├── Track.js
│       │   ├── Player.js
│       │   └── GameState.js
│       ├── util/
│       │   ├── GameConfig.js
│       │   └── deckFactory.js
│       └── game/
│           └── GameEngine.js   # Turnos, avance, checkpoint, victoria (partida local)
│
├── server/                # Backend
│   ├── package.json      # Dependencias: express, socket.io, bcryptjs, jsonwebtoken, cors, sql.js
│   ├── README.md         # Cómo ejecutar y variables de entorno
│   ├── data/             # carrera.json (store por defecto; no en git)
│   └── src/
│       ├── server.js     # Express + Socket.io, rutas API, servir web/
│       ├── db/
│       │   ├── database.js   # Store JSON (getDb, runSchema)
│       │   ├── schema.sql    # Esquema e índices (referencia para PostgreSQL/SQLite)
│       │   └── init.js       # Ejecutar runSchema (opcional)
│       ├── middleware/
│       │   └── auth.js       # JWT: authMiddleware, signToken
│       ├── routes/
│       │   ├── auth.js       # POST /register, POST /login
│       │   ├── users.js      # GET /me
│       │   ├── rooms.js      # POST /create, POST /join, GET /:code
│       │   └── points.js     # POST /purchase, GET /packages
│       ├── socket/
│       │   └── roomHandler.js # join-room, room-state, race-finished
│       └── game/
│           └── runRace.js    # Lógica de carrera en servidor (mismo algoritmo que GameEngine)
│
└── docs/
    ├── ESTRUCTURA.md     # Este archivo
    └── DEPLOY-RAILWAY.md # Pasos para desplegar web estática en Railway
```

---

## Resumen por capa

| Capa        | Ubicación        | Responsabilidad |
|------------|------------------|------------------|
| **Entrada**| `web/index.html` | Carga CSS y JS; el servidor inyecta `API_URL` para activar multijugador. |
| **Modelo** | `web/js/model/` + `web/js/util/` | Suit, Card, Deck, Track, Horse, Player, GameState, GameConfig, deckFactory. |
| **Lógica** | `web/js/game/GameEngine.js`, `server/src/game/runRace.js` | Turno, checkpoint, victoria (local y servidor). |
| **UI**     | `web/js/app.js` + `web/css/styles.css` | Menú, auth, config, reglas, carrera, resultados, salas. |
| **API**    | `server/src/routes/` | Auth, usuarios, salas, puntos. |
| **Tiempo real** | `server/src/socket/roomHandler.js` | Salas, inicio de carrera, resultado. |
| **Datos**  | `server/src/db/database.js`, `server/data/carrera.json` | Usuarios, salas, jugadores, transacciones. |

---

## Cómo ejecutar

| Modo        | Comando / Acción |
|-------------|-------------------|
| **Servidor**| Desde la raíz del proyecto: `npm run install:server` (una vez), luego `npm start`. Abrir http://localhost:3000. |
| **Solo web**| Abrir `web/index.html` en el navegador o servir `web/` con `npx serve web`. Solo partida local. |
