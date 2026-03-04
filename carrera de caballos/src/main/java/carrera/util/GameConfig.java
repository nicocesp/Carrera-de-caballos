package carrera.util;

/**
 * Configuración del juego: tamaño pista, jugadores, baraja 40/48, apuestas, modo auto/paso a paso.
 */
public class GameConfig {
    public static final int DEFAULT_TRACK_LENGTH = 7;
    public static final int MIN_PLAYERS = 1;
    public static final int MAX_PLAYERS = 8;
    public static final int DECK_40 = 40;
    public static final int DECK_48 = 48;

    private int trackLength;
    private int numPlayers;
    private int deckSize;
    private boolean betsEnabled;
    private boolean autoMode;

    public GameConfig() {
        this.trackLength = DEFAULT_TRACK_LENGTH;
        this.numPlayers = 2;
        this.deckSize = DECK_40;
        this.betsEnabled = true;
        this.autoMode = false;
    }

    public int getTrackLength() {
        return trackLength;
    }

    public void setTrackLength(int trackLength) {
        this.trackLength = Math.max(1, Math.min(20, trackLength));
    }

    public int getNumPlayers() {
        return numPlayers;
    }

    public void setNumPlayers(int numPlayers) {
        this.numPlayers = Math.max(MIN_PLAYERS, Math.min(MAX_PLAYERS, numPlayers));
    }

    public int getDeckSize() {
        return deckSize;
    }

    public void setDeckSize(int deckSize) {
        this.deckSize = deckSize == DECK_48 ? DECK_48 : DECK_40;
    }

    public boolean isBetsEnabled() {
        return betsEnabled;
    }

    public void setBetsEnabled(boolean betsEnabled) {
        this.betsEnabled = betsEnabled;
    }

    public boolean isAutoMode() {
        return autoMode;
    }

    public void setAutoMode(boolean autoMode) {
        this.autoMode = autoMode;
    }
}
