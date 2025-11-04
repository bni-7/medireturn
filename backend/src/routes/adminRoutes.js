import express from 'express';
import {
  getAnalytics,
  getAllUsers,
  getPendingCollectionPoints,
  approveCollectionPoint,
  rejectCollectionPoint,
  toggleUserStatus,
  getAllCollectionPoints
} from '../controllers/adminController.js';
import { protect } from '../middleware/auth.js';
import { isAdmin } from '../middleware/roleCheck.js';

const router = express.Router();

// All routes are protected and require admin role
router.use(protect, isAdmin);

// Routes
router.get('/analytics', getAnalytics);
router.get('/users', getAllUsers);
router.get('/collection-points', getAllCollectionPoints);
router.get('/collection-points/pending', getPendingCollectionPoints);
router.put('/collection-points/:id/approve', approveCollectionPoint);
router.delete('/collection-points/:id/reject', rejectCollectionPoint);
router.put('/users/:id/toggle-status', toggleUserStatus);

export default router;