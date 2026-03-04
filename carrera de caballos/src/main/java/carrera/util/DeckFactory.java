package carrera.util;

import carrera.model.Card;
import carrera.model.Deck;
import carrera.model.Suit;
import carrera.model.Track;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Random;

/**
 * Crea baraja española 40 o 48 cartas, sin duplicados.
 * Separa 4 ases (caballos), N cartas para pista y el resto para mazo de carrera.
 */
public final class DeckFactory {

    /**
     * Rangos para baraja de 40: 1-7, 10-12 (sin 8 y 9).
     */
    public static int[] ranks40() {
        return new int[] { 1, 2, 3, 4, 5, 6, 7, 10, 11, 12 };
    }

    /**
     * Rangos para baraja de 48: 1-12.
     */
    public static int[] ranks48() {
        return new int[] { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 };
    }

    public static List<Card> buildFullDeck(int deckSize) {
        int[] ranks = deckSize == GameConfig.DECK_48 ? ranks48() : ranks40();
        List<Card> all = new ArrayList<>();
        for (Suit s : Suit.values()) {
            for (int r : ranks) {
                all.add(new Card(s.name() + "_" + r, s, r));
            }
        }
        return all;
    }

    /**
     * Inicializa mazo y pista: 4 ases fuera, N cartas para track, resto en deck.
     */
    public static void setupDeckAndTrack(Deck deck, Track track, int trackLength, int deckSize, Random rng) {
        List<Card> full = buildFullDeck(deckSize);
        if (rng != null) Collections.shuffle(full, rng);
        else Collections.shuffle(full);

        List<Card> aces = new ArrayList<>();
        List<Card> forTrack = new ArrayList<>();
        List<Card> forDraw = new ArrayList<>();

        for (Card c : full) {
            if (c.getRank() == 1) aces.add(c);
            else if (forTrack.size() < trackLength) forTrack.add(c);
            else forDraw.add(c);
        }

        for (Card c : forTrack) track.addCheckpoint(c);
        for (Card c : forDraw) deck.addToDraw(c);
        // Los 4 ases no están en mazo ni en pista (usados solo como representación de caballos).
    }
}
