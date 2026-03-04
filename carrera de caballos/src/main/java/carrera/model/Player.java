package carrera.model;

/**
 * Jugador: id, nombre, palo apostado, fichas/puntos.
 */
public final class Player {
    private final int id;
    private final String name;
    private Suit betSuit;
    private int chips;

    public Player(int id, String name, Suit betSuit, int chips) {
        if (name == null || name.isBlank()) throw new IllegalArgumentException("name no puede ser nulo o vacío");
        this.id = id;
        this.name = name.trim();
        this.betSuit = betSuit;
        this.chips = Math.max(0, chips);
    }

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public Suit getBetSuit() {
        return betSuit;
    }

    public void setBetSuit(Suit betSuit) {
        this.betSuit = betSuit;
    }

    public int getChips() {
        return chips;
    }

    public void addChips(int amount) {
        this.chips = Math.max(0, this.chips + amount);
    }
}
