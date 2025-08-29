const { Router } = require('express');
const pool = require('../config/db');

const router = Router();

router.get('/health', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT NOW() AS ahora');
    res.json({
      status: 'ok',
      db: 'connected',
      serverTime: rows[0].ahora,
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      db: 'disconnected',
      message: err.message,
    });
  }
});

module.exports = router;
