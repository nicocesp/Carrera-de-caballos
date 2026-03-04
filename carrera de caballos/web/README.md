# Carreras de Caballos - Versión Web (JavaScript)

Misma lógica que la app JavaFX, ejecutable en el navegador.

## Cómo ejecutar

1. **Abrir directamente**: abre `index.html` con doble clic o arrastrando al navegador.
2. **Con servidor local** (si hay problemas de CORS):
   ```bash
   npx serve .
   ```
   Luego entra en http://localhost:3000

## Estructura

- `index.html` – Punto de entrada
- `css/styles.css` – Estilo tipo casino (verde, dorado, emojis)
- `js/model/` – Suit, Card, Horse, Deck, Track, Player, GameState
- `js/game/` – GameEngine
- `js/util/` – GameConfig, deckFactory
- `js/app.js` – Menú, configuración, reglas, carrera y resultados

Los emojis (🪙 🏆 ⚔️ 🪵 🏇) se ven correctamente en navegadores modernos.
