package carrera.game;

import carrera.model.Card;
import carrera.model.Horse;
import carrera.model.Suit;
import carrera.model.Track;
import carrera.util.DeckFactory;
import carrera.model.GameState;
import carrera.model.Deck;
import carrera.util.GameConfig;

import java.util.Map;
import java.util.Random;

/**
 * Motor del juego: revelar carta, avanzar caballo, voltear checkpoint, verificar victoria, rebarajar.
 */
public class GameEngine {
    private final GameState state;
    private final Random rng;

    public GameEngine(GameState state, Long seed) {
        this.state = state;
        this.rng = seed != null ? new Random(seed) : new Random();
    }

    /** Inicializa una partida nueva: caballos en 0, mazo y pista según config. */
    public void initNewRace() {
        GameConfig config = state.getConfig();
        int n = config.getTrackLength();
        for (Suit s : Suit.values()) {
            state.setHorse(s, new Horse(s, 0));
        }
        Track track = state.getTrack();
        if (track.getLength() != 0) {
            throw new IllegalStateException("Track ya fue inicializado");
        }
        Deck deck = state.getDeck();
        DeckFactory.setupDeckAndTrack(deck, track, n, config.getDeckSize(), rng);
        state.log("Carrera iniciada. Pista de " + n + " checkpoints. Mazo de " + deck.drawSize() + " cartas.");
    }

    /**
     * Un turno: robar carta del mazo (rebarajando descarte si hace falta), avanzar caballo del palo, luego
     * comprobar si todos alcanzaron el siguiente checkpoint y voltear (retroceso).
     */
    public TurnResult runOneTurn() {
        Deck deck = state.getDeck();
        if (deck.isDrawEmpty() && deck.discardSize() > 0) {
            deck.reshuffleDiscardIntoDraw(rng);
            state.log("Mazo vacío. Se rebaraja el descarte (" + deck.drawSize() + " cartas).");
        }
        Card drawn = deck.draw();
        if (drawn == null) {
            return new TurnResult(null, false, null, "No hay más cartas.");
        }
        deck.discard(drawn);
        state.incrementCardsRevealed();
        state.incrementTurn();

        Horse horse = state.getHorses().get(drawn.getSuit());
        if (horse != null) {
            horse.advance();
            state.log("Turno " + state.getTurnCount() + ": " + drawn.toShortString() + " → " + drawn.getSuit() + " avanza a " + horse.getPosition());
        }

        Card flipped = tryFlipCheckpoint();
        if (flipped != null) {
            Horse retreatHorse = state.getHorses().get(flipped.getSuit());
            if (retreatHorse != null) {
                retreatHorse.retreat();
                state.recordRetreat(flipped.getSuit());
                state.log("Checkpoint volteado: " + flipped.toShortString() + " → " + flipped.getSuit() + " retrocede a " + retreatHorse.getPosition());
            }
        }

        Suit winner = checkWinner();
        return new TurnResult(drawn, flipped != null, flipped, winner != null ? "Ganador: " + winner : null);
    }

    /** Si todos los caballos han alcanzado o sobrepasado el checkpoint en flippedIndex, lo volteamos. */
    private Card tryFlipCheckpoint() {
        Track track = state.getTrack();
        if (!track.hasNextToFlip()) return null;
        int nextCheck = track.getFlippedIndex();
        Map<Suit, Horse> horses = state.getHorses();
        for (Horse h : horses.values()) {
            if (h.getPosition() <= nextCheck) return null;
        }
        return track.flipNext();
    }

    /** Gana el primero con posición > N. */
    public Suit checkWinner() {
        int n = state.getTrack().getLength();
        for (Map.Entry<Suit, Horse> e : state.getHorses().entrySet()) {
            if (e.getValue().getPosition() > n) {
                state.setWinner(e.getKey());
                return e.getKey();
            }
        }
        return null;
    }

    public GameState getState() {
        return state;
    }

    public boolean hasWinner() {
        return state.getWinner() != null;
    }

    public boolean canContinue() {
        Deck d = state.getDeck();
        return d.hasCardsToDrawOrDiscard();
    }

    /** Resultado de un turno para la UI. */
    public static final class TurnResult {
        private final Card drawnCard;
        private final boolean checkpointFlipped;
        private final Card flippedCard;
        private final String message;

        public TurnResult(Card drawnCard, boolean checkpointFlipped, Card flippedCard, String message) {
            this.drawnCard = drawnCard;
            this.checkpointFlipped = checkpointFlipped;
            this.flippedCard = flippedCard;
            this.message = message;
        }

        public Card getDrawnCard() { return drawnCard; }
        public boolean isCheckpointFlipped() { return checkpointFlipped; }
        public Card getFlippedCard() { return flippedCard; }
        public String getMessage() { return message; }
    }
}
