// Helper function to format dates
export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatDateTime = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatTime = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Helper function to calculate distance between two coordinates
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance.toFixed(2); // Distance in km
};

// Helper function to truncate text
export const truncateText = (text, maxLength) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Helper function to format phone number
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  const cleaned = ('' + phone).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
};

// Helper function to capitalize first letter
export const capitalizeFirst = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Helper function to generate random color
export const getRandomColor = () => {
  const colors = [
    'bg-red-100 text-red-800',
    'bg-blue-100 text-blue-800',
    'bg-green-100 text-green-800',
    'bg-yellow-100 text-yellow-800',
    'bg-purple-100 text-purple-800',
    'bg-pink-100 text-pink-800',
    'bg-indigo-100 text-indigo-800'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Helper function to format bytes to readable size
export const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

// Helper function to check if email is valid
export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Helper function to check if phone is valid (Indian format)
export const isValidPhone = (phone) => {
  const re = /^[6-9]\d{9}$/;
  return re.test(phone);
};

// Helper function to debounce
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Helper function to get time ago
export const getTimeAgo = (date) => {
  if (!date) return '';
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  
  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) return interval + ' year' + (interval > 1 ? 's' : '') + ' ago';
  
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) return interval + ' month' + (interval > 1 ? 's' : '') + ' ago';
  
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return interval + ' day' + (interval > 1 ? 's' : '') + ' ago';
  
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return interval + ' hour' + (interval > 1 ? 's' : '') + ' ago';
  
  interval = Math.floor(seconds / 60);
  if (interval >= 1) return interval + ' minute' + (interval > 1 ? 's' : '') + ' ago';
  
  return Math.floor(seconds) + ' second' + (seconds !== 1 ? 's' : '') + ' ago';
};

// Helper to get greeting based on time
export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 18) return 'Good Afternoon';
  return 'Good Evening';
};

// Helper to get badge info
export const getBadgeInfo = (badgeName) => {
  const badges = {
    BEGINNER: { color: 'text-gray-600', bg: 'bg-gray-100', icon: '🌟' },
    ENTHUSIAST: { color: 'text-orange-600', bg: 'bg-orange-100', icon: '🔥' },
    CHAMPION: { color: 'text-blue-600', bg: 'bg-blue-100', icon: '💎' },
    LEGEND: { color: 'text-purple-600', bg: 'bg-purple-100', icon: '👑' },
    ECO_WARRIOR: { color: 'text-green-600', bg: 'bg-green-100', icon: '🌍' }
  };
  return badges[badgeName] || badges.BEGINNER;
};

// Helper to get status color
export const getStatusColor = (status) => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    accepted: 'bg-blue-100 text-blue-800 border-blue-300',
    rejected: 'bg-red-100 text-red-800 border-red-300',
    completed: 'bg-green-100 text-green-800 border-green-300',
    cancelled: 'bg-gray-100 text-gray-800 border-gray-300'
  };
  return colors[status] || colors.pending;
};

// Helper to get collection point type color
export const getTypeColor = (type) => {
  const colors = {
    pharmacy: 'bg-blue-100 text-blue-800 border-blue-300',
    hospital: 'bg-red-100 text-red-800 border-red-300',
    ngo: 'bg-green-100 text-green-800 border-green-300',
    clinic: 'bg-purple-100 text-purple-800 border-purple-300'
  };
  return colors[type] || colors.pharmacy;
};

// Helper to get collection point type icon
export const getCollectionPointIcon = (type) => {
  const icons = {
    pharmacy: '💊',
    hospital: '🏥',
    ngo: '🤝',
    clinic: '🩺'
  };
  return icons[type] || '📍';
};

// Helper to format status text
export const formatStatus = (status) => {
  if (!status) return '';
  return status
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Helper to format collection point type
export const formatType = (type) => {
  if (!type) return '';
  return type.charAt(0).toUpperCase() + type.slice(1);
};

// Helper to get initials from name
export const getInitials = (name) => {
  if (!name) return '';
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Helper to format Indian currency
export const formatCurrency = (amount) => {
  if (!amount) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

// Helper to format number with commas
export const formatNumber = (num) => {
  if (!num) return '0';
  return new Intl.NumberFormat('en-IN').format(num);
};

// Helper to check if collection point is open now
export const isOpenNow = (openingTime, closingTime) => {
  if (!openingTime || !closingTime) return false;
  
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes(); // Current time in minutes
  
  // Parse opening time (e.g., "09:00 AM")
  const openParts = openingTime.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!openParts) return false;
  
  let openHour = parseInt(openParts[1]);
  const openMin = parseInt(openParts[2]);
  const openPeriod = openParts[3].toUpperCase();
  
  if (openPeriod === 'PM' && openHour !== 12) openHour += 12;
  if (openPeriod === 'AM' && openHour === 12) openHour = 0;
  
  const openTimeInMin = openHour * 60 + openMin;
  
  // Parse closing time (e.g., "09:00 PM")
  const closeParts = closingTime.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!closeParts) return false;
  
  let closeHour = parseInt(closeParts[1]);
  const closeMin = parseInt(closeParts[2]);
  const closePeriod = closeParts[3].toUpperCase();
  
  if (closePeriod === 'PM' && closeHour !== 12) closeHour += 12;
  if (closePeriod === 'AM' && closeHour === 12) closeHour = 0;
  
  const closeTimeInMin = closeHour * 60 + closeMin;
  
  // Check if current time is between opening and closing
  if (closeTimeInMin > openTimeInMin) {
    // Normal case (e.g., 9 AM - 9 PM)
    return currentTime >= openTimeInMin && currentTime <= closeTimeInMin;
  } else {
    // Overnight case (e.g., 9 PM - 6 AM)
    return currentTime >= openTimeInMin || currentTime <= closeTimeInMin;
  }
};