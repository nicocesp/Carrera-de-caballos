/**
 * Estado del juego: jugadores, caballos, mazo, pista, log, config.
 */
class GameState {
  constructor(config) {
    this.config = config || {};
    this.players = [];
    this.horses = {};
    for (const s of Suit.values()) this.horses[s.key] = null;
    this.deck = new Deck();
    const len = (this.config && typeof this.config.getTrackLength === 'function') ? this.config.getTrackLength() : 7;
    this.track = new Track(len);
    this.turnCount = 0;
    this.logMessages = [];
    this.winner = null;
    this.totalCardsRevealed = 0;
    this.retreatsBySuit = {};
    for (const s of Suit.values()) this.retreatsBySuit[s.key] = 0;
  }

  addPlayer(p) {
    if (p) this.players.push(p);
  }

  setHorse(suit, horse) {
    if (suit && horse) this.horses[suit.key] = horse;
  }

  incrementTurn() {
    this.turnCount++;
  }

  log(msg) {
    if (msg && String(msg).trim()) this.logMessages.push(msg);
  }

  incrementCardsRevealed() {
    this.totalCardsRevealed++;
  }

  recordRetreat(suit) {
    if (suit) this.retreatsBySuit[suit.key]++;
  }

  setWinner(suit) {
    this.winner = suit;
  }
}

window.GameState = GameState;
