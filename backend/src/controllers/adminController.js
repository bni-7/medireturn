import User from '../models/User.js';
import CollectionPoint from '../models/CollectionPoint.js';
import Pickup from '../models/Pickup.js';
import Transaction from '../models/Transaction.js';
import { PICKUP_STATUS } from '../config/constants.js';

// @desc    Get platform analytics
// @route   GET /api/admin/analytics
// @access  Private (Admin)
export const getAnalytics = async (req, res) => {
  try {
    // Total users by role
    const totalCitizens = await User.countDocuments({ role: 'citizen' });
    const totalCollectionPoints = await CollectionPoint.countDocuments();
    const verifiedCollectionPoints = await CollectionPoint.countDocuments({ isVerified: true });
    const pendingCollectionPoints = await CollectionPoint.countDocuments({ isVerified: false });

    // Total pickups by status
    const totalPickups = await Pickup.countDocuments();
    const completedPickups = await Pickup.countDocuments({ status: PICKUP_STATUS.COMPLETED });
    const pendingPickups = await Pickup.countDocuments({ status: PICKUP_STATUS.PENDING });
    const acceptedPickups = await Pickup.countDocuments({ status: PICKUP_STATUS.ACCEPTED });

    // Total medicines collected
    const totalCollected = await User.aggregate([
      { $group: { _id: null, total: { $sum: '$totalCollected' } } }
    ]);

    const totalKgCollected = totalCollected.length > 0 ? totalCollected[0].total : 0;

    // City-wise breakdown
    const cityStats = await User.aggregate([
      {
        $match: { role: 'citizen', 'address.city': { $exists: true, $ne: null } }
      },
      {
        $group: {
          _id: '$address.city',
          users: { $sum: 1 },
          totalCollected: { $sum: '$totalCollected' },
          totalPoints: { $sum: '$points' }
        }
      },
      { $sort: { totalCollected: -1 } },
      { $limit: 10 }
    ]);

    // Monthly growth (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyStats = await Pickup.aggregate([
      {
        $match: {
          status: PICKUP_STATUS.COMPLETED,
          completedAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$completedAt' },
            month: { $month: '$completedAt' }
          },
          pickups: { $sum: 1 },
          totalCollected: { $sum: '$quantityCollected' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Recent activities - show all pickups (not just completed)
    const recentPickups = await Pickup.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('userId', 'name')
      .populate('collectionPointId', 'name');

    res.json({
      success: true,
      analytics: {
        overview: {
          totalCitizens,
          totalCollectionPoints,
          verifiedCollectionPoints,
          pendingCollectionPoints,
          totalPickups,
          completedPickups,
          pendingPickups,
          acceptedPickups,
          totalKgCollected
        },
        cityStats,
        monthlyStats,
        recentPickups
      }
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
export const getAllUsers = async (req, res) => {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (role) {
      query.role = role;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Get pending collection points
// @route   GET /api/admin/collection-points/pending
// @access  Private (Admin)
export const getPendingCollectionPoints = async (req, res) => {
  try {
    const collectionPoints = await CollectionPoint.find({ isVerified: false })
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: collectionPoints.length,
      collectionPoints
    });
  } catch (error) {
    console.error('Get pending collection points error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Approve collection point
// @route   PUT /api/admin/collection-points/:id/approve
// @access  Private (Admin)
export const approveCollectionPoint = async (req, res) => {
  try {
    const collectionPoint = await CollectionPoint.findById(req.params.id);

    if (!collectionPoint) {
      return res.status(404).json({
        success: false,
        message: 'Collection point not found'
      });
    }

    if (collectionPoint.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Collection point is already verified'
      });
    }

    collectionPoint.isVerified = true;
    await collectionPoint.save();

    res.json({
      success: true,
      message: 'Collection point approved successfully',
      collectionPoint
    });
  } catch (error) {
    console.error('Approve collection point error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Reject collection point
// @route   DELETE /api/admin/collection-points/:id/reject
// @access  Private (Admin)
export const rejectCollectionPoint = async (req, res) => {
  try {
    const collectionPoint = await CollectionPoint.findById(req.params.id);

    if (!collectionPoint) {
      return res.status(404).json({
        success: false,
        message: 'Collection point not found'
      });
    }

    await collectionPoint.deleteOne();

    res.json({
      success: true,
      message: 'Collection point rejected and deleted'
    });
  } catch (error) {
    console.error('Reject collection point error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Toggle user active status
// @route   PUT /api/admin/users/:id/toggle-status
// @access  Private (Admin)
export const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.role === 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Cannot deactivate admin users'
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isActive: user.isActive
      }
    });
  } catch (error) {
    console.error('Toggle user status error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Get all collection points
// @route   GET /api/admin/collection-points
// @access  Private (Admin)
export const getAllCollectionPoints = async (req, res) => {
  try {
    const { isVerified, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (isVerified !== undefined) {
      query.isVerified = isVerified === 'true';
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { 'address.city': { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    const collectionPoints = await CollectionPoint.find(query)
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await CollectionPoint.countDocuments(query);

    res.json({
      success: true,
      collectionPoints,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get all collection points error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};