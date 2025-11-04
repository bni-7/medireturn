import express from 'express';
import { body } from 'express-validator';
import {
  schedulePickup,
  getMyPickups,
  getPickupById,
  cancelPickup,
  acceptPickup,
  rejectPickup,
  completePickup,
  getCollectionPointPickups
} from '../controllers/pickupController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';

const router = express.Router();

// ✅ FIXED Validation rules
const schedulePickupValidation = [
  body('collectionPointId').notEmpty().withMessage('Collection point is required'),
  body('pickupDate').notEmpty().withMessage('Pickup date is required'),
  body('timeSlot').notEmpty().withMessage('Time slot is required'),
  body('medicineDetails').notEmpty().withMessage('Medicine details are required'),
  body('estimatedQuantity').isFloat({ min: 0.1 }).withMessage('Valid estimated quantity is required'),
  body('contactPhone').isMobilePhone('en-IN').withMessage('Valid contact phone is required')
];

// Citizen routes
router.post('/', protect, authorize('citizen'), schedulePickupValidation, validate, schedulePickup);
router.get('/my', protect, authorize('citizen'), getMyPickups);
router.get('/:id', protect, getPickupById);
router.put('/:id/cancel', protect, authorize('citizen'), cancelPickup);

// Collection point routes
router.get('/collection-point/all', protect, authorize('collection_point'), getCollectionPointPickups);
router.put('/:id/accept', protect, authorize('collection_point'), acceptPickup);
router.put('/:id/reject', protect, authorize('collection_point'), rejectPickup);
router.put('/:id/complete', protect, authorize('collection_point'), completePickup);

export default router;