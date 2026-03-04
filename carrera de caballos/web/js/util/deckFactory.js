/**
 * Crea baraja española 40 o 48 cartas. Separa 4 ases, N para pista, resto para mazo.
 */
function ranks40() {
  return [1, 2, 3, 4, 5, 6, 7, 10, 11, 12];
}

function ranks48() {
  return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
}

function buildFullDeck(deckSize) {
  const ranks = deckSize === GameConfig.DECK_48 ? ranks48() : ranks40();
  const all = [];
  for (const s of Suit.values()) {
    for (const r of ranks) {
      all.push(new Card(s.key + '_' + r, s, r));
    }
  }
  return all;
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function setupDeckAndTrack(deck, track, trackLength, deckSize) {
  const full = buildFullDeck(deckSize);
  shuffleArray(full);

  const forTrack = [];
  const forDraw = [];

  for (const c of full) {
    if (c.rank === 1) continue; // ases fuera (caballos)
    if (forTrack.length < trackLength) forTrack.push(c);
    else forDraw.push(c);
  }

  for (const c of forTrack) track.addCheckpoint(c);
  for (const c of forDraw) deck.addToDraw(c);
}

window.setupDeckAndTrack = setupDeckAndTrack;
