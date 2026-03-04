package carrera;

import carrera.model.Card;
import carrera.model.Deck;
import carrera.model.Suit;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Pruebas: unicidad en mazo, rechazo de duplicados, rebarajado.
 */
class DeckTest {

    @Test
    void noAceptaCartasDuplicadas() {
        Deck deck = new Deck();
        deck.addToDraw(new Card("A", Suit.OROS, 1));
        assertThrows(IllegalArgumentException.class, () -> deck.addToDraw(new Card("A", Suit.COPAS, 2)));
    }

    @Test
    void drawYDiscardRebarajan() {
        Deck deck = new Deck();
        deck.addToDraw(new Card("1", Suit.OROS, 1));
        deck.addToDraw(new Card("2", Suit.COPAS, 1));
        Card c1 = deck.draw();
        assertNotNull(c1);
        deck.discard(c1);
        Card c2 = deck.draw();
        assertNotNull(c2);
        deck.discard(c2);
        assertTrue(deck.isDrawEmpty());
        assertEquals(2, deck.discardSize());
        deck.reshuffleDiscardIntoDraw(new java.util.Random(1));
        assertEquals(0, deck.discardSize());
        assertEquals(2, deck.drawSize());
    }
}
