import { POINTS } from '../config/constants.js';

export const calculatePoints = (quantity, isFirstCollection = false) => {
  let points = quantity * POINTS.PER_KG;
  
  if (isFirstCollection) {
    points += POINTS.FIRST_COLLECTION;
  }
  
  return Math.round(points);
};

export const awardBadges = (totalCollections, totalCollected) => {
  const badges = [];

  if (totalCollections >= 1) badges.push('BEGINNER');
  if (totalCollections >= 5) badges.push('ENTHUSIAST');
  if (totalCollections >= 10) badges.push('CHAMPION');
  if (totalCollections >= 25) badges.push('LEGEND');
  if (totalCollected >= 100) badges.push('ECO_WARRIOR');

  return badges;
};