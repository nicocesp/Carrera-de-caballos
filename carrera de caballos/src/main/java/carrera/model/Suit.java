package carrera.model;

/**
 * Palos de la baraja española.
 * Usados para identificar caballos y movimiento en la pista.
 */
public enum Suit {
    OROS("Oros", "🪙"),
    COPAS("Copas", "🏆"),
    ESPADAS("Espadas", "⚔️"),
    BASTOS("Bastos", "🪵");

    private final String displayName;
    private final String symbol;

    Suit(String displayName, String symbol) {
        this.displayName = displayName;
        this.symbol = symbol;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getSymbol() {
        return symbol;
    }

    @Override
    public String toString() {
        return displayName;
    }
}
