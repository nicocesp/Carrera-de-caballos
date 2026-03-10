# Frontend — Carreras de Caballos

Interfaz web del juego (HTML, CSS, JavaScript). Funciona en dos modos:

- **Con servidor**: abriendo la app desde `http://localhost:3000` (tras `npm start` en la raíz) se activan registro, salas de 4 jugadores y compra de puntos.
- **Solo estático**: abriendo `index.html` (o sirviendo la carpeta `web/`) solo está disponible la partida local.

## Estructura

- `index.html` — Entrada; carga Socket.io, api.js, model, game, app.js
- `css/styles.css` — Estilo tipo casino (verde, dorado, emojis 🪙 🏆 ⚔️ 🪵 🏇)
- `js/api.js` — Cliente API (auth, salas, puntos)
- `js/app.js` — Menú, auth, configuración, reglas, carrera, resultados, salas
- `js/model/` — Suit, Card, Horse, Deck, Track, Player, GameState
- `js/util/` — GameConfig, deckFactory
- `js/game/` — GameEngine (lógica de la carrera)

Para ejecutar el proyecto completo, ver el **README.md** en la raíz del repositorio.
