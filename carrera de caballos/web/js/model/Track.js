/**
 * Pista: N checkpoints (cartas boca abajo).
 */
class Track {
  constructor(size) {
    if (size < 1) throw new Error('Tamaño de pista debe ser >= 1');
    this.checkpoints = [];
    this.flippedIndex = 0;
  }

  addCheckpoint(card) {
    if (!card) throw new Error('card no puede ser nula');
    this.checkpoints.push(card);
  }

  getLength() {
    return this.checkpoints.length;
  }

  getFlippedIndex() {
    return this.flippedIndex;
  }

  hasNextToFlip() {
    return this.flippedIndex < this.checkpoints.length;
  }

  flipNext() {
    if (!this.hasNextToFlip()) return null;
    const c = this.checkpoints[this.flippedIndex];
    this.flippedIndex++;
    return c;
  }

  getCheckpoint(i) {
    if (i < 0 || i >= this.checkpoints.length) return null;
    return this.checkpoints[i];
  }
}

window.Track = Track;
