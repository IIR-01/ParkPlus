const express = require('express');
const router = express.Router();

const {
  createChallenge,
  getAllChallenges,
  updateChallenge,
  deleteChallenge,
  getMyChallenges,
} = require('../controllers/challengeController');

const { protect, requireRole } = require('../middleware/authMiddleware');

// GET /api/challenges/me — visitor's active challenges + progress
router.get('/me', protect, requireRole('visitor'), getMyChallenges);

// GET /api/challenges — admin management list
router.get('/', protect, requireRole('admin'), getAllChallenges);

// POST /api/challenges — admin defines a new challenge
router.post('/', protect, requireRole('admin'), createChallenge);

// PUT /api/challenges/:id — admin edits a challenge
router.put('/:id', protect, requireRole('admin'), updateChallenge);

// DELETE /api/challenges/:id — admin removes a challenge
router.delete('/:id', protect, requireRole('admin'), deleteChallenge);

module.exports = router;
