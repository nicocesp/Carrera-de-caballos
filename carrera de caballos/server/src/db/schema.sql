-- Carreras de Caballos - Esquema optimizado para rendimiento y consistencia
-- Índices pensados para consultas frecuentes y unicidad

-- Usuarios: email único, índice para login y listados
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  display_name TEXT NOT NULL,
  points INTEGER NOT NULL DEFAULT 1000 CHECK (points >= 0),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- Salas: 4 jugadores, precio entrada variable, estado
CREATE TABLE IF NOT EXISTS rooms (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT NOT NULL UNIQUE,
  creator_id INTEGER NOT NULL REFERENCES users(id),
  entry_price INTEGER NOT NULL CHECK (entry_price > 0),
  status TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'racing', 'finished')),
  track_length INTEGER NOT NULL DEFAULT 7,
  race_state TEXT,
  winner_suit TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_rooms_code ON rooms(code);
CREATE INDEX IF NOT EXISTS idx_rooms_status ON rooms(status);
CREATE INDEX IF NOT EXISTS idx_rooms_creator ON rooms(creator_id);
CREATE INDEX IF NOT EXISTS idx_rooms_created_at ON rooms(created_at);

-- Jugadores en sala: un usuario por sala, palo apostado, puntos apostados
CREATE TABLE IF NOT EXISTS room_players (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  room_id INTEGER NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id),
  suit TEXT NOT NULL CHECK (suit IN ('OROS', 'COPAS', 'ESPADAS', 'BASTOS')),
  points_bet INTEGER NOT NULL CHECK (points_bet >= 0),
  position INTEGER,
  joined_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(room_id, user_id)
);
CREATE INDEX IF NOT EXISTS idx_room_players_room ON room_players(room_id);
CREATE INDEX IF NOT EXISTS idx_room_players_user ON room_players(user_id);

-- Movimientos de puntos: auditoría y consistencia
CREATE TABLE IF NOT EXISTS point_transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id),
  amount INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('signup', 'race_bet', 'race_win', 'purchase', 'refund')),
  reference_type TEXT,
  reference_id INTEGER,
  balance_after INTEGER,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_point_transactions_user ON point_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_point_transactions_created ON point_transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_point_transactions_ref ON point_transactions(reference_type, reference_id);

-- Compras de puntos (paquetes 1000 pts = 10000 COP)
CREATE TABLE IF NOT EXISTS point_purchases (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id),
  points INTEGER NOT NULL CHECK (points > 0),
  amount_cop INTEGER NOT NULL CHECK (amount_cop > 0),
  payment_reference TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_point_purchases_user ON point_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_point_purchases_created ON point_purchases(created_at);
