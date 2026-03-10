const express = require('express');
const { getDb } = require('../db/database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

router.post('/create', (req, res) => {
  const { entryPrice = 50, trackLength = 7, suit = 'OROS' } = req.body || {};
  const price = Math.max(10, Math.min(1000, Number(entryPrice) || 50));
  const track = Math.max(3, Math.min(15, Number(trackLength) || 7));
  const suitUpper = String(suit).toUpperCase();
  if (!['OROS', 'COPAS', 'ESPADAS', 'BASTOS'].includes(suitUpper)) {
    return res.status(400).json({ error: 'Palo no válido' });
  }
  const db = getDb();
  if (req.user.points < price) {
    return res.status(400).json({ error: 'Puntos insuficientes para crear sala' });
  }
  let code;
  for (let i = 0; i < 10; i++) {
    code = generateCode();
    const exists = db.prepare('SELECT id FROM rooms WHERE code = ?').get(code);
    if (!exists) break;
  }
  const now = new Date().toISOString();
  const result = db.prepare(
    'INSERT INTO rooms (code, creator_id, entry_price, status, track_length, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).run(code, req.user.id, price, 'waiting', track, now, now);
  const roomId = result.lastInsertRowid;
  db.prepare(
    'INSERT INTO room_players (room_id, user_id, suit, points_bet) VALUES (?, ?, ?, ?)'
  ).run(roomId, req.user.id, suitUpper, 0);
  res.status(201).json({
    roomId,
    code,
    entryPrice: price,
    trackLength: track,
    message: 'Sala creada. Comparte el código para que entren 3 jugadores más.'
  });
});

router.post('/join', (req, res) => {
  const { code, suit } = req.body || {};
  if (!code) return res.status(400).json({ error: 'Código de sala requerido' });
  const suitUpper = (suit || 'OROS').toUpperCase();
  if (!['OROS', 'COPAS', 'ESPADAS', 'BASTOS'].includes(suitUpper)) {
    return res.status(400).json({ error: 'Palo no válido' });
  }
  const db = getDb();
  const room = db.prepare('SELECT * FROM rooms WHERE code = ? AND status = ?').get(String(code).trim().toUpperCase(), 'waiting');
  if (!room) return res.status(404).json({ error: 'Sala no encontrada o ya en juego' });
  const count = db.prepare('SELECT COUNT(*) as n FROM room_players WHERE room_id = ?').get(room.id);
  if (count.n >= 4) return res.status(400).json({ error: 'Sala llena' });
  const already = db.prepare('SELECT id FROM room_players WHERE room_id = ? AND user_id = ?').get(room.id, req.user.id);
  if (already) return res.status(400).json({ error: 'Ya estás en esta sala' });
  if (req.user.points < room.entry_price) {
    return res.status(400).json({ error: 'Puntos insuficientes. Entrada: ' + room.entry_price });
  }
  const countBefore = db.prepare('SELECT COUNT(*) as n FROM room_players WHERE room_id = ?').get(room.id);
  if (countBefore.n === 3) {
    const creator = db.prepare('SELECT id, points FROM users WHERE id = ?').get(room.creator_id);
    if (!creator || creator.points < room.entry_price) {
      return res.status(400).json({ error: 'El creador de la sala no tiene suficientes puntos (' + room.entry_price + '). Pídale que compre puntos o cree otra sala.' });
    }
  }
  db.prepare('INSERT INTO room_players (room_id, user_id, suit, points_bet) VALUES (?, ?, ?, ?)').run(room.id, req.user.id, suitUpper, room.entry_price);
  const newPoints = req.user.points - room.entry_price;
  db.prepare('UPDATE users SET points = ?, updated_at = ? WHERE id = ?').run(newPoints, new Date().toISOString(), req.user.id);
  db.prepare('INSERT INTO point_transactions (user_id, amount, type, reference_type, reference_id, balance_after) VALUES (?, ?, ?, ?, ?, ?)')
    .run(req.user.id, -room.entry_price, 'race_bet', 'room', room.id, newPoints);

  const countAfter = db.prepare('SELECT COUNT(*) as n FROM room_players WHERE room_id = ?').get(room.id);
  if (countAfter.n === 4) {
    const creator = db.prepare('SELECT id, points FROM users WHERE id = ?').get(room.creator_id);
    const creatorNewPoints = creator.points - room.entry_price;
    db.prepare('UPDATE users SET points = ?, updated_at = ? WHERE id = ?').run(creatorNewPoints, new Date().toISOString(), room.creator_id);
    db.prepare('UPDATE room_players SET points_bet = ? WHERE room_id = ? AND user_id = ?').run(room.entry_price, room.id, room.creator_id);
    db.prepare('INSERT INTO point_transactions (user_id, amount, type, reference_type, reference_id, balance_after) VALUES (?, ?, ?, ?, ?, ?)')
      .run(room.creator_id, -room.entry_price, 'race_bet', 'room', room.id, creatorNewPoints);
    db.prepare('UPDATE rooms SET status = ? WHERE id = ?').run('racing', room.id);
  }

  res.json({
    roomId: room.id,
    code: room.code,
    entryPrice: room.entry_price,
    suit: suitUpper,
    pointsLeft: newPoints
  });
});

router.get('/:code', (req, res) => {
  const db = getDb();
  const room = db.prepare('SELECT * FROM rooms WHERE code = ?').get(String(req.params.code).trim().toUpperCase());
  if (!room) return res.status(404).json({ error: 'Sala no encontrada' });
  const players = db.prepare(`
    SELECT rp.suit, rp.points_bet, u.display_name, u.id as user_id
    FROM room_players rp
    JOIN users u ON u.id = rp.user_id
    WHERE rp.room_id = ?
    ORDER BY rp.joined_at
  `).all(room.id);
  res.json({
    id: room.id,
    code: room.code,
    entryPrice: room.entry_price,
    trackLength: room.track_length,
    status: room.status,
    winnerSuit: room.winner_suit,
    raceState: room.race_state ? JSON.parse(room.race_state) : null,
    players
  });
});

module.exports = router;
