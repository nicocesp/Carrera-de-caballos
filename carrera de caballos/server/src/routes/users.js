const express = require('express');
const { getDb } = require('../db/database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

/** Devuelve siempre los datos actuales del usuario (puntos al día tras apuestas/premios/compra). */
router.get('/me', async (req, res) => {
  const db = getDb();
  const user = await db.prepare('SELECT id, email, display_name, points FROM users WHERE id = ?').get(req.user.id);
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
  res.json({
    id: user.id,
    email: user.email,
    displayName: user.display_name,
    points: user.points
  });
});

module.exports = router;
