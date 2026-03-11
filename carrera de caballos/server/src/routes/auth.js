const express = require('express');
const bcrypt = require('bcryptjs');
const { getDb } = require('../db/database');
const { signToken } = require('../middleware/auth');
const { SIGNUP_POINTS } = require('../config/constants');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { email, password, displayName } = req.body || {};
  if (!email || !password || !displayName) {
    return res.status(400).json({ error: 'Faltan email, password o nombre' });
  }
  const emailTrim = String(email).trim().toLowerCase();
  const nameTrim = String(displayName).trim();
  if (nameTrim.length < 2) return res.status(400).json({ error: 'Nombre muy corto' });
  if (password.length < 6) return res.status(400).json({ error: 'Password mínimo 6 caracteres' });

  const db = getDb();
  const existing = await db.prepare('SELECT id FROM users WHERE email = ?').get(emailTrim);
  if (existing) return res.status(409).json({ error: 'Email ya registrado' });

  const passwordHash = bcrypt.hashSync(password, 10);
  const points = SIGNUP_POINTS;
  const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const result = await db.prepare(
    'INSERT INTO users (email, password_hash, display_name, points, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(emailTrim, passwordHash, nameTrim, points, now, now);

  const userId = result.lastInsertRowid;
  await db.prepare(
    'INSERT INTO point_transactions (user_id, amount, type, balance_after) VALUES (?, ?, ?, ?)'
  ).run(userId, points, 'signup', points);

  const token = signToken(userId);
  res.status(201).json({
    token,
    user: { id: userId, email: emailTrim, displayName: nameTrim, points }
  });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Email y password requeridos' });

  const db = getDb();
  const user = await db.prepare('SELECT id, email, display_name, points, password_hash FROM users WHERE email = ?').get(String(email).trim().toLowerCase());
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: 'Credenciales incorrectas' });
  }
  const token = signToken(user.id);
  res.json({
    token,
    user: { id: user.id, email: user.email, displayName: user.display_name, points: user.points }
  });
});

module.exports = router;
