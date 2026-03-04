/**
 * Carta: id, palo y rango.
 */
class Card {
  constructor(id, suit, rank) {
    if (!id || !id.trim()) throw new Error('id no puede ser nulo o vacío');
    if (!suit) throw new Error('suit no puede ser nulo');
    this.id = id.trim();
    this.suit = suit;
    this.rank = rank;
  }

  toShortString() {
    return this.rank + this.suit.symbol;
  }

  toString() {
    return `${this.suit.displayName} ${this.rank} (${this.id})`;
  }
}

window.Card = Card;
