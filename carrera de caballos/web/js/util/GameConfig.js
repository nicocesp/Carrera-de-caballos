/**
 * Configuración del juego.
 */
const GameConfig = {
  DEFAULT_TRACK_LENGTH: 7,
  MIN_PLAYERS: 1,
  MAX_PLAYERS: 8,
  DECK_40: 40,
  DECK_48: 48,

  trackLength: 7,
  numPlayers: 2,
  deckSize: 40,
  betsEnabled: true,
  autoMode: false,

  getTrackLength() { return this.trackLength; },
  setTrackLength(v) { this.trackLength = Math.max(1, Math.min(20, v)); },

  getNumPlayers() { return this.numPlayers; },
  setNumPlayers(v) { this.numPlayers = Math.max(this.MIN_PLAYERS, Math.min(this.MAX_PLAYERS, v)); },

  getDeckSize() { return this.deckSize; },
  setDeckSize(v) { this.deckSize = v === this.DECK_48 ? this.DECK_48 : this.DECK_40; },

  isBetsEnabled() { return this.betsEnabled; },
  setBetsEnabled(v) { this.betsEnabled = !!v; },

  isAutoMode() { return this.autoMode; },
  setAutoMode(v) { this.autoMode = !!v; }
};

window.GameConfig = GameConfig;
