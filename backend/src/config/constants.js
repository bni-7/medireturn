export const ROLES = {
  CITIZEN: 'citizen',
  COLLECTION_POINT: 'collection_point',
  ADMIN: 'admin'
};

export const COLLECTION_POINT_TYPES = {
  PHARMACY: 'pharmacy',
  HOSPITAL: 'hospital',
  NGO: 'ngo',
  CLINIC: 'clinic'
};

export const PICKUP_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

export const TRANSACTION_TYPES = {
  COLLECTION: 'collection',
  REFERRAL_BONUS: 'referral_bonus',
  MONTHLY_STREAK: 'monthly_streak'
};

export const TIME_SLOTS = [
  '09:00 AM - 12:00 PM',
  '12:00 PM - 03:00 PM',
  '03:00 PM - 06:00 PM',
  '06:00 PM - 09:00 PM'
];

export const POINTS = {
  FIRST_COLLECTION: 50,
  PER_KG: 10,
  REFERRAL_BONUS: 50,
  MONTHLY_STREAK: 25
};