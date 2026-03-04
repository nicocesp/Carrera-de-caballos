package carrera.model;

/**
 * Caballo: uno por palo. position ∈ [0, N+1] (0 = salida; > N = meta).
 */
public final class Horse {
    private final Suit suit;
    private int position;

    public Horse(Suit suit, int position) {
        if (suit == null) throw new IllegalArgumentException("suit no puede ser nulo");
        if (position < 0) throw new IllegalArgumentException("position no puede ser negativa");
        this.suit = suit;
        this.position = position;
    }

    public Suit getSuit() {
        return suit;
    }

    public int getPosition() {
        return position;
    }

    /** Avanza 1 casilla. */
    public void advance() {
        position++;
    }

    /** Retrocede 1 casilla; no baja de 0. */
    public void retreat() {
        if (position > 0) position--;
    }

    public void setPosition(int position) {
        if (position < 0) throw new IllegalArgumentException("position no puede ser negativa");
        this.position = position;
    }
}
