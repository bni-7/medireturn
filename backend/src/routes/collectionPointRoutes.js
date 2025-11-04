import express from 'express';
import { body } from 'express-validator';
import {
  registerCollectionPoint,
  getCollectionPoints,
  getCollectionPoint,
  getMyCollectionPoint,
  updateCollectionPoint,
  getCollectionPointDashboard
} from '../controllers/collectionPointController.js';
import { protect } from '../middleware/auth.js';
import { isCollectionPoint, isCollectionPointOrAdmin } from '../middleware/roleCheck.js';
import { validate } from '../middleware/validation.js';

const router = express.Router();

// Validation rules
const registerValidation = [
  body('name').trim().notEmpty().withMessage('Collection point name is required'),
  body('type').isIn(['pharmacy', 'hospital', 'ngo', 'clinic']).withMessage('Invalid collection point type'),
  body('address.street').notEmpty().withMessage('Street address is required'),
  body('address.city').notEmpty().withMessage('City is required'),
  body('address.pincode').notEmpty().withMessage('Pincode is required'),
  body('address.lat').isFloat().withMessage('Latitude is required'),
  body('address.lng').isFloat().withMessage('Longitude is required'),
  body('phone').isMobilePhone().withMessage('Invalid phone number'),
  body('operatingHours').notEmpty().withMessage('Operating hours are required')
];

const updateValidation = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('type').optional().isIn(['pharmacy', 'hospital', 'ngo', 'clinic']).withMessage('Invalid type'),
  body('phone').optional().isMobilePhone().withMessage('Invalid phone number')
];

// Routes
router.post('/', protect, isCollectionPoint, registerValidation, validate, registerCollectionPoint);
router.get('/', getCollectionPoints);
router.get('/my/point', protect, isCollectionPoint, getMyCollectionPoint);
router.get('/my/dashboard', protect, isCollectionPoint, getCollectionPointDashboard);
router.get('/:id', getCollectionPoint);
router.put('/:id', protect, isCollectionPointOrAdmin, updateValidation, validate, updateCollectionPoint);

export default router;