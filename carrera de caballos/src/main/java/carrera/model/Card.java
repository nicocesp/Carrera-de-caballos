package carrera.model;

import java.util.Objects;

/**
 * Entidad Carta: id único, palo y rango.
 * Restricción: no puede haber cartas duplicadas (mismo id en el mazo).
 */
public final class Card {
    private final String id;
    private final Suit suit;
    private final int rank;

    public Card(String id, Suit suit, int rank) {
        if (id == null || id.isBlank()) throw new IllegalArgumentException("id no puede ser nulo o vacío");
        if (suit == null) throw new IllegalArgumentException("suit no puede ser nulo");
        this.id = id.trim();
        this.suit = suit;
        this.rank = rank;
    }

    public String getId() {
        return id;
    }

    public Suit getSuit() {
        return suit;
    }

    public int getRank() {
        return rank;
    }

    /** Representación corta para UI, ej: "1♦" */
    public String toShortString() {
        return rank + suit.getSymbol();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Card card = (Card) o;
        return Objects.equals(id, card.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return suit.getDisplayName() + " " + rank + " (" + id + ")";
    }
}
