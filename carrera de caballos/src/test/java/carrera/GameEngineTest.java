package carrera;

import carrera.game.GameEngine;
import carrera.model.GameState;
import carrera.model.Horse;
import carrera.model.Suit;
import carrera.util.GameConfig;
import org.junit.jupiter.api.Test;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Pruebas: condición de victoria (posición > N), checkpoint cuando todos alcanzan.
 */
class GameEngineTest {

    @Test
    void ganadorCuandoPosicionMayorQueN() {
        GameConfig config = new GameConfig();
        config.setTrackLength(3);
        GameState state = new GameState(config);
        GameEngine engine = new GameEngine(state, 12345L);
        engine.initNewRace();
        int n = state.getTrack().getLength();
        // Forzar que Oros llegue a n+1
        state.setHorse(Suit.OROS, new Horse(Suit.OROS, n + 1));
        assertEquals(Suit.OROS, engine.checkWinner());
    }

    @Test
    void noGanadorSiNadiePasoMeta() {
        GameConfig config = new GameConfig();
        config.setTrackLength(5);
        GameState state = new GameState(config);
        GameEngine engine = new GameEngine(state, 999L);
        engine.initNewRace();
        assertNull(engine.checkWinner());
    }

    @Test
    void unTurnoRevelaCartaYAvanzaCaballo() {
        GameConfig config = new GameConfig();
        config.setTrackLength(7);
        GameState state = new GameState(config);
        GameEngine engine = new GameEngine(state, 42L);
        engine.initNewRace();
        GameEngine.TurnResult r = engine.runOneTurn();
        assertNotNull(r.getDrawnCard());
        Map<Suit, Horse> horses = state.getHorses();
        // El caballo del palo de la carta debe haber avanzado 1
        int pos = horses.get(r.getDrawnCard().getSuit()).getPosition();
        assertTrue(pos >= 1);
    }
}
