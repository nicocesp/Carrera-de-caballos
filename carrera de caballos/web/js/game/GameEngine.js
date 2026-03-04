/**
 * Motor del juego: revelar carta, avanzar caballo, voltear checkpoint, rebarajar.
 */
class GameEngine {
  constructor(state) {
    this.state = state;
  }

  initNewRace() {
    const config = this.state.config;
    const n = (typeof config.getTrackLength === 'function') ? config.getTrackLength() : 7;
    for (const s of Suit.values()) {
      this.state.setHorse(s, new Horse(s, 0));
    }
    const track = this.state.track;
    const deck = this.state.deck;
    setupDeckAndTrack(deck, track, n, (typeof config.getDeckSize === 'function') ? config.getDeckSize() : 40);
    this.state.log('Carrera iniciada. Pista de ' + n + ' checkpoints. Mazo de ' + deck.drawSize() + ' cartas.');
  }

  runOneTurn() {
    const deck = this.state.deck;
    if (deck.isDrawEmpty && deck.discardSize() > 0) {
      deck.reshuffleDiscardIntoDraw(null);
      this.state.log('Mazo vacío. Se rebaraja el descarte (' + deck.drawSize() + ' cartas).');
    }

    const drawn = deck.draw();
    if (!drawn) {
      return { drawnCard: null, checkpointFlipped: false, flippedCard: null, message: 'No hay más cartas.' };
    }
    deck.discard(drawn);
    this.state.incrementCardsRevealed();
    this.state.incrementTurn();

    const horse = this.state.horses[drawn.suit.key];
    if (horse) {
      horse.advance();
      this.state.log('Turno ' + this.state.turnCount + ': ' + drawn.toShortString() + ' → ' + drawn.suit.displayName + ' avanza a ' + horse.position);
    }

    const flipped = this.tryFlipCheckpoint();
    if (flipped) {
      const retreatHorse = this.state.horses[flipped.suit.key];
      if (retreatHorse) {
        retreatHorse.retreat();
        this.state.recordRetreat(flipped.suit);
        this.state.log('Checkpoint volteado: ' + flipped.toShortString() + ' → ' + flipped.suit.displayName + ' retrocede a ' + retreatHorse.position);
      }
    }

    const winner = this.checkWinner();
    return {
      drawnCard: drawn,
      checkpointFlipped: !!flipped,
      flippedCard: flipped,
      message: winner ? 'Ganador: ' + winner.displayName : null
    };
  }

  tryFlipCheckpoint() {
    const track = this.state.track;
    if (!track.hasNextToFlip()) return null;
    const nextCheck = track.getFlippedIndex();
    for (const s of Suit.values()) {
      const h = this.state.horses[s.key];
      if (h && h.position <= nextCheck) return null;
    }
    return track.flipNext();
  }

  checkWinner() {
    const n = this.state.track.getLength();
    for (const s of Suit.values()) {
      const h = this.state.horses[s.key];
      if (h && h.position > n) {
        this.state.setWinner(s);
        return s;
      }
    }
    return null;
  }

  hasWinner() {
    return this.state.winner != null;
  }

  canContinue() {
    return this.state.deck.hasCardsToDrawOrDiscard();
  }
}

window.GameEngine = GameEngine;
