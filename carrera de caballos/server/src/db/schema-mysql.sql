-- Carreras de Caballos - Esquema MySQL optimizado (XAMPP)
-- Requisitos: 4 usuarios por sala, 1000 pts al registrarse, precio variable, premio x5, paquetes 1000 pts = $10.000 COP

-- ========== USUARIOS ==========
-- Registro: la app asigna 1000 puntos. Si se acaban, puede comprar paquetes.
CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  display_name VARCHAR(255) NOT NULL,
  points INT UNSIGNED NOT NULL DEFAULT 1000,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_users_email (email),
  KEY idx_users_updated (updated_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========== SALAS ==========
-- Precio variable por carrera: 10–1000 puntos. Solo inicia cuando hay 4 jugadores.
CREATE TABLE IF NOT EXISTS rooms (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(10) NOT NULL,
  creator_id INT UNSIGNED NOT NULL,
  entry_price INT UNSIGNED NOT NULL,
  status ENUM('waiting', 'racing', 'finished') NOT NULL DEFAULT 'waiting',
  track_length TINYINT UNSIGNED NOT NULL DEFAULT 7,
  race_state TEXT,
  winner_suit VARCHAR(20),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_rooms_code (code),
  KEY idx_rooms_status (status),
  KEY idx_rooms_creator (creator_id),
  CONSTRAINT fk_rooms_creator FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========== JUGADORES EN SALA ==========
-- Exactamente 4 usuarios por sala; cada uno elige palo y apuesta entry_price.
CREATE TABLE IF NOT EXISTS room_players (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  room_id INT UNSIGNED NOT NULL,
  user_id INT UNSIGNED NOT NULL,
  suit VARCHAR(20) NOT NULL,
  points_bet INT UNSIGNED NOT NULL DEFAULT 0,
  joined_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_room_user (room_id, user_id),
  KEY idx_room_players_room (room_id),
  KEY idx_room_players_user (user_id),
  CONSTRAINT fk_room_players_room FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
  CONSTRAINT fk_room_players_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========== MOVIMIENTOS DE PUNTOS (auditoría por usuario) ==========
-- signup: +1000 | race_bet: -entry_price | race_win: +apuesta*5 | purchase: +1000
CREATE TABLE IF NOT EXISTS point_transactions (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  amount INT NOT NULL,
  type ENUM('signup', 'race_bet', 'race_win', 'purchase', 'refund') NOT NULL,
  reference_type VARCHAR(50),
  reference_id INT UNSIGNED,
  balance_after INT UNSIGNED,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_point_tx_user (user_id),
  KEY idx_point_tx_user_created (user_id, created_at),
  KEY idx_point_tx_created (created_at),
  CONSTRAINT fk_point_tx_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========== COMPRAS DE PUNTOS ==========
-- Paquete: 1000 puntos por $10.000 COP
CREATE TABLE IF NOT EXISTS point_purchases (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  points INT UNSIGNED NOT NULL,
  amount_cop INT UNSIGNED NOT NULL,
  payment_reference VARCHAR(255),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_purchases_user (user_id),
  KEY idx_purchases_created (created_at),
  CONSTRAINT fk_purchases_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
