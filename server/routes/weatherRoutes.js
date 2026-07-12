const express = require('express');
const router = express.Router();

// GET /api/weather
router.get('/', (req, res) => {
  res.json({ message: 'Weather route — coming in Sprint 1' });
});

module.exports = router;