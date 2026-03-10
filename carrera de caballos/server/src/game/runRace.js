/**
 * Ejecuta una carrera en el servidor (misma lógica que el cliente).
 * Devuelve el palo ganador y el log.
 */
function runRace(trackLength) {
  const Suit = { OROS: { key: 'OROS' }, COPAS: { key: 'COPAS' }, ESPADAS: { key: 'ESPADAS' }, BASTOS: { key: 'BASTOS' } };
  const suits = [Suit.OROS, Suit.COPAS, Suit.ESPADAS, Suit.BASTOS];

  const ranks40 = () => [1, 2, 3, 4, 5, 6, 7, 10, 11, 12];
  const buildDeck = () => {
    const all = [];
    for (const s of suits) for (const r of ranks40()) all.push({ suit: s, rank: r });
    return all;
  };
  const shuffle = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  };

  let deck = buildDeck().filter(c => c.rank !== 1);
  shuffle(deck);
  const track = deck.splice(0, trackLength);
  const draw = deck;
  const horses = {};
  suits.forEach(s => { horses[s.key] = { position: 0 }; });
  let flippedIndex = 0;
  let winner = null;
  const log = [];

  const flipNext = () => {
    if (flippedIndex >= track.length) return null;
    const c = track[flippedIndex];
    flippedIndex++;
    return c;
  };
  const allPast = (idx) => suits.every(s => horses[s.key].position > idx);
  const checkWinner = () => {
    for (const s of suits) if (horses[s.key].position > trackLength) return s;
    return null;
  };

  while (winner === null && draw.length > 0) {
    const card = draw.shift();
    horses[card.suit.key].position++;
    log.push({ drawn: card.suit.key, positions: { ...Object.fromEntries(suits.map(s => [s.key, horses[s.key].position])) } });
    while (allPast(flippedIndex)) {
      const flipped = flipNext();
      if (flipped) {
        horses[flipped.suit.key].position = Math.max(0, horses[flipped.suit.key].position - 1);
        log.push({ obstacle: flipped.suit.key });
      }
    }
    winner = checkWinner();
  }

  return { winner: winner ? winner.key : null, log, positions: Object.fromEntries(suits.map(s => [s.key, horses[s.key].position])) };
}

module.exports = { runRace };
