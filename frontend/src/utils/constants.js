export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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

export const BADGES = {
  BEGINNER: {
    name: 'Beginner',
    description: 'First collection',
    icon: '🌟',
    requirement: 1
  },
  ENTHUSIAST: {
    name: 'Enthusiast',
    description: '5 collections',
    icon: '🔥',
    requirement: 5
  },
  CHAMPION: {
    name: 'Champion',
    description: '10 collections',
    icon: '💎',
    requirement: 10
  },
  LEGEND: {
    name: 'Legend',
    description: '25 collections',
    icon: '👑',
    requirement: 25
  },
  ECO_WARRIOR: {
    name: 'Eco Warrior',
    description: '100kg collected',
    icon: '🌍',
    requirement: 100
  }
};

// ✅ ADD THIS - Map configuration
export const MAP_CENTER = {
  lat: 20.5937,
  lng: 78.9629, // India center
  zoom: 5
};

export const BADGE_COLORS = {
  BEGINNER: 'bg-gray-100 text-gray-800 border-gray-300',
  ENTHUSIAST: 'bg-orange-100 text-orange-800 border-orange-300',
  CHAMPION: 'bg-blue-100 text-blue-800 border-blue-300',
  LEGEND: 'bg-purple-100 text-purple-800 border-purple-300',
  ECO_WARRIOR: 'bg-green-100 text-green-800 border-green-300'
};

export const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  accepted: 'bg-blue-100 text-blue-800',
  rejected: 'bg-red-100 text-red-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-gray-100 text-gray-800'
};