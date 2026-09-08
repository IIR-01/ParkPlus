const Challenge = require('../models/Challenge');
const ChallengeProgress = require('../models/ChallengeProgress');
const User = require('../models/User');
const Activity = require('../models/Activity');

// -------------------------------------------------------
// trackProgress — called whenever a visitor earns points from
// an activity (zone check-in, ride completion). Advances progress
// on every active challenge that matches the activity type (by 1,
// e.g. "check in 5 times") and every active 'points' challenge
// (by the points earned, e.g. "earn 100 points"), awarding the
// challenge's reward once a target is reached.
// -------------------------------------------------------
const trackProgress = async (visitorId, activityType, pointsEarned) => {
  const challenges = await Challenge.find({
    isActive: true,
    type: { $in: [activityType, 'points'] },
  });

  for (const challenge of challenges) {
    let progressDoc = await ChallengeProgress.findOne({
      visitor: visitorId,
      challenge: challenge._id,
    });

    if (!progressDoc) {
      progressDoc = new ChallengeProgress({
        visitor: visitorId,
        challenge: challenge._id,
      });
    }

    if (progressDoc.completed) continue;

    progressDoc.progress += challenge.type === 'points' ? pointsEarned : 1;

    if (progressDoc.progress >= challenge.target) {
      progressDoc.progress = challenge.target;
      progressDoc.completed = true;
      progressDoc.completedAt = new Date();

      await User.findByIdAndUpdate(visitorId, {
        $inc: { points: challenge.reward },
      });

      await Activity.create({
        visitor: visitorId,
        type: 'challenge_completed',
        refName: challenge.title,
        points: challenge.reward,
      });
    }

    await progressDoc.save();
  }
};

module.exports = { trackProgress };
