package carrera.model;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Pista: N checkpoints (cartas boca abajo). flipped_index avanza en orden y no retrocede.
 * Un checkpoint solo se voltea una vez.
 */
public class Track {
    private final List<Card> checkpoints;
    private int flippedIndex;

    public Track(int size) {
        if (size < 1) throw new IllegalArgumentException("Tamaño de pista debe ser >= 1");
        this.checkpoints = new ArrayList<>(size);
        this.flippedIndex = 0;
    }

    /** Añade una carta como checkpoint (boca abajo). */
    public void addCheckpoint(Card card) {
        if (card == null) throw new IllegalArgumentException("card no puede ser nula");
        checkpoints.add(card);
    }

    /** Número de checkpoints. */
    public int getLength() {
        return checkpoints.size();
    }

    /** Índice del siguiente checkpoint por voltear (0..N-1). */
    public int getFlippedIndex() {
        return flippedIndex;
    }

    /** ¿Quedan checkpoints por voltear? */
    public boolean hasNextToFlip() {
        return flippedIndex < checkpoints.size();
    }

    /** Voltea el siguiente checkpoint y devuelve la carta (para aplicar retroceso). */
    public Card flipNext() {
        if (!hasNextToFlip()) return null;
        Card c = checkpoints.get(flippedIndex);
        flippedIndex++;
        return c;
    }

    /** Carta en la posición i (0..length-1). */
    public Card getCheckpoint(int i) {
        if (i < 0 || i >= checkpoints.size()) return null;
        return checkpoints.get(i);
    }

    /** Lista inmutable de checkpoints. */
    public List<Card> getCheckpoints() {
        return Collections.unmodifiableList(checkpoints);
    }
}
