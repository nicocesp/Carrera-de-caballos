package carrera;

import carrera.model.Card;
import carrera.model.Horse;
import carrera.model.Suit;
import carrera.model.Track;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Pruebas: límites de posición, retroceso no baja de 0, checkpoint flip una vez.
 */
class HorseAndTrackTest {

    @Test
    void posicionNoNegativa() {
        assertThrows(IllegalArgumentException.class, () -> new Horse(Suit.OROS, -1));
    }

    @Test
    void retreatNoBajaDeCero() {
        Horse h = new Horse(Suit.OROS, 0);
        h.retreat();
        assertEquals(0, h.getPosition());
    }

    @Test
    void advanceYRetreat() {
        Horse h = new Horse(Suit.OROS, 2);
        h.advance();
        assertEquals(3, h.getPosition());
        h.retreat();
        assertEquals(2, h.getPosition());
    }

    @Test
    void trackFlipAvanzaIndiceUnaVez() {
        Track track = new Track(2);
        track.addCheckpoint(new Card("c1", Suit.OROS, 2));
        track.addCheckpoint(new Card("c2", Suit.COPAS, 3));
        assertEquals(0, track.getFlippedIndex());
        assertNotNull(track.flipNext());
        assertEquals(1, track.getFlippedIndex());
        assertNotNull(track.flipNext());
        assertNull(track.flipNext());
    }
}
