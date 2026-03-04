# Estructura del proyecto — Carreras de Caballos

Resumen del árbol de directorios y responsabilidad de cada parte.

---

## Árbol de directorios

```
carrera de caballos/
├── .gitignore
├── README.md
├── pom.xml                    # Maven: Java 17, JavaFX 21, JUnit 5
├── mvnw.cmd                   # Maven Wrapper (Windows)
├── run.bat                    # Ejecutar app Java (Windows, requiere JAVA_HOME)
├── run.ps1                    # Ejecutar app Java (PowerShell)
│
├── .mvn/
│   └── wrapper/
│       ├── maven-wrapper.jar
│       └── maven-wrapper.properties
│
├── src/
│   ├── main/
│   │   ├── java/carrera/
│   │   │   ├── Main.java              # Punto de entrada (lanza JavaFX)
│   │   │   ├── game/
│   │   │   │   └── GameEngine.java     # Motor: turnos, avance, checkpoint, victoria
│   │   │   ├── model/
│   │   │   │   ├── Card.java           # Carta (id, palo, rango)
│   │   │   │   ├── Deck.java           # Mazo (draw + descarte)
│   │   │   │   ├── GameState.java      # Estado: jugadores, caballos, pista, log
│   │   │   │   ├── Horse.java          # Caballo (palo, posición)
│   │   │   │   ├── Player.java         # Jugador (nombre, apuesta, fichas)
│   │   │   │   ├── Suit.java           # Palos: Oros, Copas, Espadas, Bastos
│   │   │   │   └── Track.java          # Pista (N checkpoints)
│   │   │   ├── ui/
│   │   │   │   ├── AppController.java  # Navegación entre vistas
│   │   │   │   ├── GameApplication.java# Inicio JavaFX y carga fuente emoji
│   │   │   │   ├── MenuView.java       # Menú principal
│   │   │   │   ├── ConfigView.java     # Configuración
│   │   │   │   ├── RulesView.java      # Reglas del juego
│   │   │   │   ├── RaceView.java       # Vista de carrera (pista, log, turno)
│   │   │   │   └── ResultsView.java    # Resultados y apuestas
│   │   │   └── util/
│   │   │       ├── DeckFactory.java    # Creación baraja y pista
│   │   │       └── GameConfig.java     # Config (pista, jugadores, baraja, apuestas)
│   │   └── resources/
│   │       └── styles.css              # Estilos tipo casino (JavaFX)
│   │
│   └── test/java/carrera/
│       ├── DeckTest.java
│       ├── DeckFactoryTest.java
│       ├── GameEngineTest.java
│       └── HorseAndTrackTest.java
│
└── web/                       # Versión JavaScript (navegador)
    ├── index.html             # Entrada; carga CSS y scripts
    ├── README.md              # Cómo ejecutar la versión web
    ├── css/
    │   └── styles.css         # Estilos tipo casino (web)
    └── js/
        ├── app.js             # Menú, config, reglas, carrera, resultados
        ├── game/
        │   └── GameEngine.js  # Misma lógica que Java
        ├── model/
        │   ├── Card.js
        │   ├── Deck.js
        │   ├── GameState.js
        │   ├── Horse.js
        │   ├── Player.js
        │   ├── Suit.js
        │   └── Track.js
        └── util/
            ├── GameConfig.js
            └── deckFactory.js
```

---

## Resumen por capa

| Capa        | Java (JavaFX)     | Web (JS)        |
|------------|-------------------|-----------------|
| **Entrada**| `Main.java`       | `index.html`    |
| **Modelo** | `model/*` + `util`| `js/model/*` + `js/util/*` |
| **Lógica** | `game/GameEngine` | `js/game/GameEngine.js` |
| **UI**     | `ui/*` + `styles.css` | `js/app.js` + `css/styles.css` |

---

## Dependencias

- **Java**: JDK 17+ (recomendado 21). JavaFX 21 (vía Maven).
- **Web**: solo navegador; sin dependencias externas (JS vanilla).

---

## Cómo ejecutar

| Versión | Comando / Acción |
|--------|-------------------|
| **Java** | `run.bat` o `run.ps1`, o `mvnw.cmd compile javafx:run` (con `JAVA_HOME` definido). |
| **Web** | Abrir `web/index.html` en el navegador, o `npx serve web` y abrir la URL indicada. |
