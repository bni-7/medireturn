// filepath: backend/src/utils/gamification.js
import { POINTS, TRANSACTION_TYPES } from '../config/constants.js';
import User from '../models/User.js';
import Transaction from '../models/Transaction.js';

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