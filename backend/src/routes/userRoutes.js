import express from 'express';
import { body } from 'express-validator';
import {
  getProfile,
  updateProfile,
  getDashboard,
  getTransactions,
  getCityLeaderboard
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { isCitizen } from '../middleware/roleCheck.js';
import { validate } from '../middleware/validation.js';

const router = express.Router();

// Validation rules
const updateProfileValidation = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('phone').optional().isMobilePhone().withMessage('Invalid phone number'),
  body('address.street').optional().notEmpty().withMessage('Street address cannot be empty'),
  body('address.city').optional().notEmpty().withMessage('City cannot be empty'),
  body('address.pincode').optional().notEmpty().withMessage('Pincode cannot be empty')
];

// Routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfileValidation, validate, updateProfile);
router.get('/dashboard', protect, isCitizen, getDashboard);
router.get('/transactions', protect, isCitizen, getTransactions);
router.get('/leaderboard/:city', getCityLeaderboard);

export default router;