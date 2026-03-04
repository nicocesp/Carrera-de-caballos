/**
 * Mazo: draw pile y descarte.
 */
class Deck {
  constructor() {
    this.drawPile = [];
    this.discardPile = [];
    this.allIds = new Set();
  }

  addToDraw(card) {
    if (!card) throw new Error('card no puede ser nula');
    if (this.allIds.has(card.id)) throw new Error('Carta duplicada: ' + card.id);
    this.allIds.add(card.id);
    this.drawPile.push(card);
  }

  draw() {
    return this.drawPile.shift() || null;
  }

  discard(card) {
    if (card) this.discardPile.push(card);
  }

  reshuffleDiscardIntoDraw(rng) {
    if (rng && typeof rng.shuffle === 'function') {
      rng.shuffle(this.discardPile);
    } else {
      for (let i = this.discardPile.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.discardPile[i], this.discardPile[j]] = [this.discardPile[j], this.discardPile[i]];
      }
    }
    this.drawPile.push(...this.discardPile);
    this.discardPile.length = 0;
  }

  get isDrawEmpty() {
    return this.drawPile.length === 0;
  }

  drawSize() {
    return this.drawPile.length;
  }

  discardSize() {
    return this.discardPile.length;
  }

  hasCardsToDrawOrDiscard() {
    return this.drawPile.length > 0 || this.discardPile.length > 0;
  }
}

window.Deck = Deck;
