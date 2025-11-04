// filepath: backend/src/utils/gamification.js
import { BADGES, POINTS, TRANSACTION_TYPES } from '../config/constants.js';
import User from '../models/User.js';
import Transaction from '../models/Transaction.js';

export const checkAndAwardBadges = async (userId, totalCollected) => {
  const user = await User.findById(userId);
  if (!user) return;

  const earnedBadges = user.badges.map(b => b.name);
  const newBadges = [];

  // Check First Drop badge
  if (totalCollected > 0 && !earnedBadges.includes(BADGES.FIRST_DROP.name)) {
    newBadges.push({
      name: BADGES.FIRST_DROP.name,
      earnedAt: new Date()
    });
  }

  // Check Bronze badge
  if (totalCollected >= BADGES.BRONZE.requirement && !earnedBadges.includes(BADGES.BRONZE.name)) {
    newBadges.push({
      name: BADGES.BRONZE.name,
      earnedAt: new Date()
    });
  }

  // Check Silver badge
  if (totalCollected >= BADGES.SILVER.requirement && !earnedBadges.includes(BADGES.SILVER.name)) {
    newBadges.push({
      name: BADGES.SILVER.name,
      earnedAt: new Date()
    });
  }

  // Check Gold badge
  if (totalCollected >= BADGES.GOLD.requirement && !earnedBadges.includes(BADGES.GOLD.name)) {
    newBadges.push({
      name: BADGES.GOLD.name,
      earnedAt: new Date()
    });
  }

  if (newBadges.length > 0) {
    user.badges.push(...newBadges);
    await user.save();
  }

  return newBadges;
};

export const awardPoints = async (userId, points, description, referenceId = null, referenceModel = null) => {
  const user = await User.findById(userId);
  if (!user) return null;

  user.points += points;
  await user.save();

  const transaction = await Transaction.create({
    userId,
    type: TRANSACTION_TYPES.COLLECTION,
    points,
    description,
    referenceId,
    referenceModel
  });

  return transaction;
};

export const processReferralReward = async (referredUserId) => {
  const referredUser = await User.findById(referredUserId);
  if (!referredUser || !referredUser.referredBy) return;

  const referrer = await User.findOne({ referralCode: referredUser.referredBy });
  if (!referrer) return;

  // Award points to referrer
  referrer.points += POINTS.REFERRAL;
  await referrer.save();

  await Transaction.create({
    userId: referrer._id,
    type: TRANSACTION_TYPES.REFERRAL,
    points: POINTS.REFERRAL,
    description: `Referral bonus for ${referredUser.name}`,
    referenceId: referredUserId,
    referenceModel: 'User'
  });
};