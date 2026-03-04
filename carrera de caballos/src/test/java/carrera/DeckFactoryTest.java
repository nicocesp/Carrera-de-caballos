package carrera;

import carrera.model.Card;
import carrera.model.Deck;
import carrera.model.Suit;
import carrera.model.Track;
import carrera.util.DeckFactory;
import carrera.util.GameConfig;
import org.junit.jupiter.api.Test;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Pruebas: baraja válida, unicidad de cartas, tamaños 40/48.
 */
class DeckFactoryTest {

    @Test
    void baraja40Tiene40Cartas() {
        List<Card> deck = DeckFactory.buildFullDeck(GameConfig.DECK_40);
        assertEquals(40, deck.size());
    }

    @Test
    void baraja48Tiene48Cartas() {
        List<Card> deck = DeckFactory.buildFullDeck(GameConfig.DECK_48);
        assertEquals(48, deck.size());
    }

    @Test
    void noHayCartasDuplicadas() {
        List<Card> deck = DeckFactory.buildFullDeck(GameConfig.DECK_40);
        Set<String> ids = new HashSet<>();
        for (Card c : deck) {
            assertTrue(ids.add(c.getId()), "Carta duplicada: " + c.getId());
        }
    }

    @Test
    void baraja40TieneCuatroAses() {
        List<Card> deck = DeckFactory.buildFullDeck(GameConfig.DECK_40);
        long ases = deck.stream().filter(c -> c.getRank() == 1).count();
        assertEquals(4, ases);
    }

    @Test
    void setupDeckAndTrackSeparaCorrectamente() {
        Deck deck = new Deck();
        Track track = new Track(5);
        DeckFactory.setupDeckAndTrack(deck, track, 5, GameConfig.DECK_40, new java.util.Random(42));
        assertEquals(5, track.getLength());
        // 40 - 4 ases - 5 pista = 31 en draw
        assertEquals(31, deck.drawSize());
    }
}
