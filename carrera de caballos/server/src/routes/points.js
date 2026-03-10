const express = require('express');
const { getDb } = require('../db/database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

const PACKAGE_POINTS = 1000;
const PACKAGE_PRICE_COP = 10000;

router.post('/purchase', (req, res) => {
  const db = getDb();
  const user = db.prepare('SELECT id, points FROM users WHERE id = ?').get(req.user.id);
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

  const newPoints = user.points + PACKAGE_POINTS;
  const now = new Date().toISOString();
  db.prepare('UPDATE users SET points = ?, updated_at = ? WHERE id = ?').run(newPoints, now, req.user.id);
  const purchaseResult = db.prepare(
    'INSERT INTO point_purchases (user_id, points, amount_cop, payment_reference, created_at) VALUES (?, ?, ?, ?, ?)'
  ).run(req.user.id, PACKAGE_POINTS, PACKAGE_PRICE_COP, 'manual-' + Date.now(), now);
  db.prepare(
    'INSERT INTO point_transactions (user_id, amount, type, reference_type, reference_id, balance_after) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(req.user.id, PACKAGE_POINTS, 'purchase', 'point_purchase', purchaseResult.lastInsertRowid, newPoints);

  res.json({
    points: newPoints,
    added: PACKAGE_POINTS,
    amountCop: PACKAGE_PRICE_COP,
    message: `+${PACKAGE_POINTS} puntos por $${PACKAGE_PRICE_COP.toLocaleString('es-CO')} COP`
  });
});

router.get('/packages', (req, res) => {
  res.json({
    packages: [{ points: PACKAGE_POINTS, priceCop: PACKAGE_PRICE_COP }]
  });
});

module.exports = router;
