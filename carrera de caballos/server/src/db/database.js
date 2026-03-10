/**
 * Store de datos (JSON). Persiste usuarios, salas, jugadores y transacciones.
 * Para mejor rendimiento en producción usar PostgreSQL/SQLite con server/src/db/schema.sql.
 */
const path = require('path');
const fs = require('fs');

const dir = path.join(__dirname, '../../data');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
const dbPath = path.join(dir, 'carrera.json');

let data = {
  users: [],
  rooms: [],
  room_players: [],
  point_transactions: [],
  point_purchases: [],
  _seq: { users: 0, rooms: 0, room_players: 0, point_transactions: 0, point_purchases: 0 }
};

function load() {
  try {
    const raw = fs.readFileSync(dbPath, 'utf8');
    const parsed = JSON.parse(raw);
    data = { ...data, ...parsed };
    if (!data._seq) data._seq = { users: 0, rooms: 0, room_players: 0, point_transactions: 0, point_purchases: 0 };
  } catch (_) {}
}

function save() {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 0), 'utf8');
}

load();

function nextId(table) {
  data._seq[table] = (data._seq[table] || 0) + 1;
  return data._seq[table];
}

function getDb() {
  return {
    prepare: (sql) => {
      const s = sql.replace(/\s+/g, ' ').trim();
      const run = (...params) => {
        if (s.startsWith('INSERT INTO users')) {
          const id = nextId('users');
          data.users.push({ id, email: params[0], password_hash: params[1], display_name: params[2], points: params[3] ?? 1000, created_at: params[4], updated_at: params[5] });
          save();
          return { lastInsertRowid: id };
        }
        if (s.startsWith('INSERT INTO point_transactions')) {
          const id = nextId('point_transactions');
          const row = { id, user_id: params[0], amount: params[1], type: params[2], created_at: (params[6] || params[5] || new Date().toISOString()) };
          if (params.length >= 4) row.balance_after = params[3];
          if (params.length >= 6) { row.reference_type = params[4]; row.reference_id = params[5]; }
          data.point_transactions.push(row);
          save();
          return { lastInsertRowid: id };
        }
        if (s.startsWith('INSERT INTO rooms')) {
          const id = nextId('rooms');
          data.rooms.push({ id, code: params[0], creator_id: params[1], entry_price: params[2], status: params[3] || 'waiting', track_length: params[4], race_state: null, winner_suit: null, created_at: params[5], updated_at: params[6] });
          save();
          return { lastInsertRowid: id };
        }
        if (s.startsWith('INSERT INTO room_players')) {
          const id = nextId('room_players');
          data.room_players.push({ id, room_id: params[0], user_id: params[1], suit: params[2], points_bet: params[3], joined_at: new Date().toISOString() });
          save();
          return { lastInsertRowid: id };
        }
        if (s.startsWith('INSERT INTO point_purchases')) {
          const id = nextId('point_purchases');
          data.point_purchases.push({ id, user_id: params[0], points: params[1], amount_cop: params[2], payment_reference: params[3], created_at: params[4] });
          save();
          return { lastInsertRowid: id };
        }
        if (s.includes('UPDATE users SET')) {
          const u = data.users.find(x => x.id === params[2]);
          if (u) { u.points = params[0]; u.updated_at = params[1]; save(); }
          return {};
        }
        if (s.includes('UPDATE room_players SET')) {
          const rp = data.room_players.find(x => x.room_id === params[1] && x.user_id === params[2]);
          if (rp) { rp.points_bet = params[0]; save(); }
          return {};
        }
        if (s.includes('UPDATE rooms SET') && s.includes('race_state')) {
          const r = data.rooms.find(x => x.id === params[4]);
          if (r) { r.race_state = params[0]; r.winner_suit = params[1]; r.status = params[2]; r.updated_at = params[3]; save(); }
          return {};
        }
        if (s.includes('UPDATE rooms SET') && s.includes('status')) {
          const r = data.rooms.find(x => x.id === params[1]);
          if (r) { r.status = params[0]; save(); }
          return {};
        }
        return { lastInsertRowid: 0 };
      };
      const get = (...params) => {
        if (s.includes('FROM users WHERE email') && s.includes('id FROM')) {
          const u = data.users.find(x => x.email === params[0]); return u ? { id: u.id } : undefined;
        }
        if (s.includes('FROM users WHERE email')) {
          return data.users.find(x => x.email === params[0]) || null;
        }
        if (s.includes('FROM users WHERE id') && s.includes('display_name')) {
          return data.users.find(x => x.id === params[0]) || null;
        }
        if (s.includes('FROM users WHERE id') && s.includes('points')) {
          const u = data.users.find(x => x.id === params[0]); return u ? { id: u.id, points: u.points } : null;
        }
        if (s.includes('SELECT points FROM users')) {
          const u = data.users.find(x => x.id === params[0]); return u ? { points: u.points } : null;
        }
        if (s.includes('FROM rooms WHERE code') && s.includes('AND status')) {
          return data.rooms.find(r => r.code === params[0] && r.status === params[1]) || null;
        }
        if (s.includes('FROM rooms WHERE code')) {
          return data.rooms.find(r => r.code === params[0]) || null;
        }
        if (s.includes('SELECT id FROM rooms WHERE code')) {
          return data.rooms.find(r => r.code === params[0]) ? { id: data.rooms.find(r => r.code === params[0]).id } : undefined;
        }
        if (s.includes('COUNT(*)') && s.includes('room_players')) {
          return { n: data.room_players.filter(rp => rp.room_id === params[0]).length };
        }
        if (s.includes('FROM room_players WHERE room_id') && s.includes('user_id')) {
          return data.room_players.find(rp => rp.room_id === params[0] && rp.user_id === params[1]) || undefined;
        }
        return null;
      };
      const all = (...params) => {
        if (s.includes('rp.room_id') && s.includes('JOIN users')) {
          return data.room_players.filter(rp => rp.room_id === params[0]).map(rp => {
            const u = data.users.find(x => x.id === rp.user_id);
            return { suit: rp.suit, points_bet: rp.points_bet, display_name: u ? u.display_name : '', user_id: rp.user_id };
          });
        }
        if (s.includes('FROM room_players WHERE room_id')) {
          return data.room_players.filter(rp => rp.room_id === params[0]);
        }
        return [];
      };
      return { run, get, all };
    }
  };
}

function runSchema() {
  if (!data._seq) data._seq = { users: 0, rooms: 0, room_players: 0, point_transactions: 0, point_purchases: 0 };
  save();
}

module.exports = { getDb, runSchema };
