/**
 * Caballo: uno por palo. position ∈ [0, N+1].
 */
class Horse {
  constructor(suit, position = 0) {
    if (!suit) throw new Error('suit no puede ser nulo');
    if (position < 0) throw new Error('position no puede ser negativa');
    this.suit = suit;
    this.position = position;
  }

  advance() {
    this.position++;
  }

  retreat() {
    if (this.position > 0) this.position--;
  }
}

window.Horse = Horse;
