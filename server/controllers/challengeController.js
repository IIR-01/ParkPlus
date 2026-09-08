const Challenge = require('../models/Challenge');
const ChallengeProgress = require('../models/ChallengeProgress');

const CHALLENGE_TYPES = ['zone_checkin', 'ride_completed', 'points'];

// -------------------------------------------------------
// @route   POST /api/challenges
// @desc    Define a new challenge
// @access  Private — admin only
// -------------------------------------------------------
const createChallenge = async (req, res) => {
  try {
    const { title, description, type, target, reward } = req.body;

    if (!title || !description || !type || target === undefined) {
      return res.status(400).json({
        message: 'title, description, type and target are required',
      });
    }

    if (!CHALLENGE_TYPES.includes(type)) {
      return res.status(400).json({
        message: `type must be one of: ${CHALLENGE_TYPES.join(', ')}`,
      });
    }

    if (Number(target) < 1) {
      return res.status(400).json({ message: 'target must be at least 1' });
    }

    const challenge = await Challenge.create({
      title,
      description,
      type,
      target,
      reward: reward ?? 50,
      createdBy: req.user._id,
    });

    res.status(201).json({
      message: 'Challenge created successfully',
      challenge,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -------------------------------------------------------
// @route   GET /api/challenges
// @desc    List every challenge (admin management view)
// @access  Private — admin only
// -------------------------------------------------------
const getAllChallenges = async (req, res) => {
  try {
    const challenges = await Challenge.find().sort({ createdAt: -1 });
    res.json(challenges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -------------------------------------------------------
// @route   PUT /api/challenges/:id
// @desc    Update a challenge's definition or active state
// @access  Private — admin only
// -------------------------------------------------------
const updateChallenge = async (req, res) => {
  try {
    const { title, description, type, target, reward, isActive } = req.body;

    if (type !== undefined && !CHALLENGE_TYPES.includes(type)) {
      return res.status(400).json({
        message: `type must be one of: ${CHALLENGE_TYPES.join(', ')}`,
      });
    }

    if (target !== undefined && Number(target) < 1) {
      return res.status(400).json({ message: 'target must be at least 1' });
    }

    const updates = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (type !== undefined) updates.type = type;
    if (target !== undefined) updates.target = target;
    if (reward !== undefined) updates.reward = reward;
    if (isActive !== undefined) updates.isActive = isActive;

    const challenge = await Challenge.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    res.json({ message: 'Challenge updated successfully', challenge });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -------------------------------------------------------
// @route   DELETE /api/challenges/:id
// @desc    Remove a challenge and every visitor's progress on it
// @access  Private — admin only
// -------------------------------------------------------
const deleteChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findByIdAndDelete(req.params.id);

    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    await ChallengeProgress.deleteMany({ challenge: challenge._id });

    res.json({ message: 'Challenge deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -------------------------------------------------------
// @route   GET /api/challenges/me
// @desc    List active challenges with the logged-in visitor's progress
// @access  Private — visitor only
// -------------------------------------------------------
const getMyChallenges = async (req, res) => {
  try {
    const challenges = await Challenge.find({ isActive: true }).sort({
      createdAt: -1,
    });

    const progressDocs = await ChallengeProgress.find({
      visitor: req.user._id,
      challenge: { $in: challenges.map((c) => c._id) },
    });

    const progressByChallenge = new Map(
      progressDocs.map((p) => [p.challenge.toString(), p])
    );

    const result = challenges.map((challenge) => {
      const progressDoc = progressByChallenge.get(challenge._id.toString());
      return {
        _id: challenge._id,
        title: challenge.title,
        description: challenge.description,
        type: challenge.type,
        target: challenge.target,
        reward: challenge.reward,
        progress: progressDoc?.progress || 0,
        completed: progressDoc?.completed || false,
        completedAt: progressDoc?.completedAt || null,
      };
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createChallenge,
  getAllChallenges,
  updateChallenge,
  deleteChallenge,
  getMyChallenges,
};
