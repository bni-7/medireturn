export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validatePhone = (phone) => {
  const re = /^[6-9]\d{9}$/;
  return re.test(phone);
};

export const validatePincode = (pincode) => {
  const re = /^\d{6}$/;
  return re.test(pincode);
};

export const validateRequired = (value) => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined;
};

export const validateQuantity = (quantity) => {
  return !isNaN(quantity) && parseFloat(quantity) > 0;
};

export const validatePickupForm = (formData) => {
    const { address, preferredDate, timeSlot } = formData;
    return (
        validateRequired(address) &&
        validateRequired(preferredDate) &&
        validateRequired(timeSlot)
    );
};