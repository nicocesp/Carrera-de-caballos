/**
 * Palos de la baraja española (emojis).
 */
const Suit = {
  OROS: { key: 'OROS', displayName: 'Oros', symbol: '🪙' },
  COPAS: { key: 'COPAS', displayName: 'Copas', symbol: '🏆' },
  ESPADAS: { key: 'ESPADAS', displayName: 'Espadas', symbol: '⚔️' },
  BASTOS: { key: 'BASTOS', displayName: 'Bastos', symbol: '🪵' }
};

Suit.values = () => [Suit.OROS, Suit.COPAS, Suit.ESPADAS, Suit.BASTOS];

Suit.fromKey = (key) => Suit.values().find(s => s.key === key) || null;

window.Suit = Suit;
