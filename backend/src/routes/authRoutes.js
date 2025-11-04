import express from 'express';
import { body } from 'express-validator';
import { 
  register, 
  login, 
  logout, 
  getMe,
  updateProfile,   // ✅ Add this
  updatePassword   // ✅ Add this
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';

const router = express.Router();

// Validation rules
const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['citizen', 'collection_point']).withMessage('Invalid role'),
  body('address.street').notEmpty().withMessage('Street address is required'),
  body('address.city').notEmpty().withMessage('City is required'),
  body('address.pincode').notEmpty().withMessage('Pincode is required'),
  body('phone').optional().isMobilePhone().withMessage('Invalid phone number')
];

const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

// ✅ Add validation for profile update
const updateProfileValidation = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('phone').optional().isMobilePhone('en-IN').withMessage('Invalid phone number'),
  body('address.street').optional().notEmpty().withMessage('Street cannot be empty'),
  body('address.city').optional().notEmpty().withMessage('City cannot be empty'),
  body('address.state').optional().notEmpty().withMessage('State cannot be empty'),
  body('address.pincode').optional().isLength({ min: 6, max: 6 }).withMessage('Pincode must be 6 digits')
];

// ✅ Add validation for password update
const updatePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
];

// Public routes
router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);

// Protected routes (require authentication)
router.use(protect);

router.post('/logout', logout);
router.get('/me', getMe);
router.get('/profile', getMe); // ✅ Add GET /profile endpoint
router.put('/profile', updateProfileValidation, validate, updateProfile); // ✅ Add PUT /profile
router.put('/password', updatePasswordValidation, validate, updatePassword); // ✅ Add PUT /password

export default router;