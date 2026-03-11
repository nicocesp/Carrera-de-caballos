-- Migración opcional: añade índices para mejor rendimiento en una BD ya existente.
-- Ejecutar en phpMyAdmin sobre la base de datos "carrera" si ya creaste las tablas antes.
-- Si creas la BD desde cero, usa schema-mysql.sql (ya incluye estos índices).

-- Índices para rooms (búsquedas por código y estado)
CREATE INDEX idx_rooms_status ON rooms (status);
CREATE INDEX idx_rooms_creator ON rooms (creator_id);

-- Índices para room_players (listar por sala, contar jugadores)
CREATE INDEX idx_room_players_room ON room_players (room_id);
CREATE INDEX idx_room_players_user ON room_players (user_id);

-- Índices para point_transactions (historial por usuario y fecha)
CREATE INDEX idx_point_tx_user ON point_transactions (user_id);
CREATE INDEX idx_point_tx_user_created ON point_transactions (user_id, created_at);
CREATE INDEX idx_point_tx_created ON point_transactions (created_at);

-- Índices para point_purchases
CREATE INDEX idx_purchases_user ON point_purchases (user_id);
CREATE INDEX idx_purchases_created ON point_purchases (created_at);
