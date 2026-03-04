package carrera.model;

import carrera.util.GameConfig;

import java.util.ArrayList;
import java.util.Collections;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;

/**
 * Estado del juego: jugadores, caballos, mazo, pista, turno, log y configuración.
 * Mantiene invariantes (posiciones, flipped_index, unicidad de cartas).
 */
public class GameState {
    private final List<Player> players;
    private final Map<Suit, Horse> horses;
    private final Deck deck;
    private final Track track;
    private int turnCount;
    private final List<String> log;
    private final GameConfig config;
    private Suit winner;
    private int totalCardsRevealed;
    private final Map<Suit, Integer> retreatsBySuit;

    public GameState(GameConfig config) {
        this.config = config != null ? config : new GameConfig();
        this.players = new ArrayList<>();
        this.horses = new EnumMap<>(Suit.class);
        this.deck = new Deck();
        this.track = new Track(this.config.getTrackLength());
        this.turnCount = 0;
        this.log = new ArrayList<>();
        this.winner = null;
        this.totalCardsRevealed = 0;
        this.retreatsBySuit = new EnumMap<>(Suit.class);
        for (Suit s : Suit.values()) retreatsBySuit.put(s, 0);
    }

    public List<Player> getPlayers() {
        return Collections.unmodifiableList(players);
    }

    public void addPlayer(Player p) {
        if (p != null) players.add(p);
    }

    public Map<Suit, Horse> getHorses() {
        return Collections.unmodifiableMap(horses);
    }

    public void setHorse(Suit suit, Horse horse) {
        if (suit != null && horse != null) horses.put(suit, horse);
    }

    public Deck getDeck() {
        return deck;
    }

    public Track getTrack() {
        return track;
    }

    public int getTurnCount() {
        return turnCount;
    }

    public void incrementTurn() {
        turnCount++;
    }

    public List<String> getLog() {
        return Collections.unmodifiableList(log);
    }

    public void log(String message) {
        if (message != null && !message.isBlank()) log.add(message);
    }

    public GameConfig getConfig() {
        return config;
    }

    public Suit getWinner() {
        return winner;
    }

    public void setWinner(Suit winner) {
        this.winner = winner;
    }

    public int getTotalCardsRevealed() {
        return totalCardsRevealed;
    }

    public void incrementCardsRevealed() {
        totalCardsRevealed++;
    }

    public Map<Suit, Integer> getRetreatsBySuit() {
        return Collections.unmodifiableMap(retreatsBySuit);
    }

    public void recordRetreat(Suit suit) {
        if (suit != null) retreatsBySuit.merge(suit, 1, Integer::sum);
    }
}
