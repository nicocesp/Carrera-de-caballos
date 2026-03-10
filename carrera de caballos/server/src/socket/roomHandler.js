const { getDb } = require('../db/database');
const { runRace } = require('../game/runRace');

function setupRoomHandlers(io) {
  io.on('connection', (socket) => {
    socket.on('join-room', async (data) => {
      const { roomCode, userId, displayName } = data || {};
      if (!roomCode) return socket.emit('error', { message: 'Código de sala requerido' });
      const db = getDb();
      const room = db.prepare('SELECT * FROM rooms WHERE code = ?').get(String(roomCode).trim().toUpperCase());
      if (!room) return socket.emit('error', { message: 'Sala no encontrada' });
      socket.join('room-' + room.id);
      socket.roomId = room.id;
      socket.userId = userId;
      socket.displayName = displayName || 'Jugador';

      const players = db.prepare(`
        SELECT rp.suit, rp.points_bet, u.display_name, u.id as user_id
        FROM room_players rp
        JOIN users u ON u.id = rp.user_id
        WHERE rp.room_id = ?
        ORDER BY rp.joined_at
      `).all(room.id);

      socket.emit('room-state', { roomId: room.id, code: room.code, status: room.status, players, entryPrice: room.entry_price, trackLength: room.track_length });
      io.to('room-' + room.id).emit('player-joined', { userId, displayName: displayName || 'Jugador', players });

      if (room.status === 'racing' && !room.race_state) {
        const result = runRace(room.track_length);
        const raceState = JSON.stringify({ winner: result.winner, log: result.log, positions: result.positions });
        db.prepare('UPDATE rooms SET race_state = ?, winner_suit = ?, status = ?, updated_at = ? WHERE id = ?')
          .run(raceState, result.winner, 'finished', new Date().toISOString(), room.id);

        const roomPlayers = db.prepare('SELECT user_id, suit, points_bet FROM room_players WHERE room_id = ?').all(room.id);
        for (const rp of roomPlayers) {
          if (rp.suit === result.winner) {
            const winAmount = rp.points_bet * 5;
            const u = db.prepare('SELECT points FROM users WHERE id = ?').get(rp.user_id);
            const newPoints = u.points + winAmount;
            db.prepare('UPDATE users SET points = ?, updated_at = ? WHERE id = ?').run(newPoints, new Date().toISOString(), rp.user_id);
            db.prepare('INSERT INTO point_transactions (user_id, amount, type, reference_type, reference_id, balance_after) VALUES (?, ?, ?, ?, ?, ?)')
              .run(rp.user_id, winAmount, 'race_win', 'room', room.id, newPoints);
          }
        }

        io.to('room-' + room.id).emit('race-finished', {
          winner: result.winner,
          log: result.log,
          positions: result.positions,
          players: roomPlayers.map(p => ({ userId: p.user_id, suit: p.suit, pointsBet: p.points_bet, won: p.suit === result.winner }))
        });
      } else if (room.race_state) {
        const state = JSON.parse(room.race_state);
        socket.emit('race-finished', { winner: room.winner_suit, log: state.log, positions: state.positions });
      }
    });

    socket.on('disconnect', () => {
      if (socket.roomId) {
        io.to('room-' + socket.roomId).emit('player-left', { userId: socket.userId, displayName: socket.displayName });
      }
    });
  });
}

module.exports = { setupRoomHandlers };
