package carrera.model;

import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Deque;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Mazo: draw pile (cola LIFO/FIFO según uso) y descarte.
 * Invariantes: no duplicados; los 4 ases no están en draw ni en pista.
 */
public class Deck {
    private final Deque<Card> drawPile;
    private final List<Card> discardPile;
    private final Set<String> allIds;

    public Deck() {
        this.drawPile = new ArrayDeque<>();
        this.discardPile = new ArrayList<>();
        this.allIds = new HashSet<>();
    }

    /** Añade una carta al mazo de robo. Restricción: id único. */
    public void addToDraw(Card card) {
        if (card == null) throw new IllegalArgumentException("card no puede ser nula");
        if (!allIds.add(card.getId())) throw new IllegalArgumentException("Carta duplicada: " + card.getId());
        drawPile.addLast(card);
    }

    /** Roba una carta del mazo y la devuelve; si está vacío devuelve null. */
    public Card draw() {
        return drawPile.pollFirst();
    }

    /** Añade una carta al descarte (para rebarajar después). */
    public void discard(Card card) {
        if (card != null) discardPile.add(card);
    }

    /** Rebaraja el descarte en el mazo de robo (las cartas de pista NO se rebarajan). */
    public void reshuffleDiscardIntoDraw(java.util.Random rng) {
        if (rng != null) Collections.shuffle(discardPile, rng);
        else Collections.shuffle(discardPile);
        for (Card c : discardPile) drawPile.addLast(c);
        discardPile.clear();
    }

    public boolean isDrawEmpty() {
        return drawPile.isEmpty();
    }

    public int drawSize() {
        return drawPile.size();
    }

    public int discardSize() {
        return discardPile.size();
    }

    public boolean hasCardsToDrawOrDiscard() {
        return !drawPile.isEmpty() || !discardPile.isEmpty();
    }
}
