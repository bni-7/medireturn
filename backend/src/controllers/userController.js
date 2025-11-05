import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
import Pickup from '../models/Pickup.js';
import { PICKUP_STATUS } from '../config/constants.js';

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        address: user.address,
        phone: user.phone,
        points: user.points,
        referralCode: user.referralCode,
        totalCollected: user.totalCollected,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;

    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address) user.address = address;

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        address: user.address,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Get user dashboard stats
// @route   GET /api/users/dashboard
// @access  Private
export const getDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    // Get pickups count
    const totalPickups = await Pickup.countDocuments({ 
      userId: req.user._id,
      status: PICKUP_STATUS.COMPLETED
    });

    // Get pending pickups
    const pendingPickups = await Pickup.countDocuments({ 
      userId: req.user._id,
      status: { $in: [PICKUP_STATUS.PENDING, PICKUP_STATUS.ACCEPTED] }
    });

    // Get recent transactions
    const recentTransactions = await Transaction.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(5);

    // Get city leaderboard
    const leaderboard = await User.find({ 
      'address.city': user.address?.city,
      role: 'citizen',
      totalCollected: { $gt: 0 }
    })
      .sort({ totalCollected: -1 })
      .limit(10)
      .select('name totalCollected points');

    // Find user's rank
    const userRank = leaderboard.findIndex(u => u._id.toString() === user._id.toString()) + 1;

    res.json({
      success: true,
      dashboard: {
        points: user.points,
        totalCollected: user.totalCollected,
        totalPickups,
        pendingPickups,
        recentTransactions,
        leaderboard: leaderboard.map((u, index) => ({
          rank: index + 1,
          name: u.name,
          totalCollected: u.totalCollected,
          points: u.points,
          isCurrentUser: u._id.toString() === user._id.toString()
        })),
        userRank: userRank || null
      }
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Get user transactions
// @route   GET /api/users/transactions
// @access  Private
export const getTransactions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const transactions = await Transaction.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Transaction.countDocuments({ userId: req.user._id });

    res.json({
      success: true,
      transactions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Get city leaderboard
// @route   GET /api/users/leaderboard/:city
// @access  Public
export const getCityLeaderboard = async (req, res) => {
  try {
    const { city } = req.params;
    const limit = parseInt(req.query.limit) || 10;

    const leaderboard = await User.find({ 
      'address.city': city,
      role: 'citizen',
      totalCollected: { $gt: 0 }
    })
      .sort({ totalCollected: -1 })
      .limit(limit)
      .select('name totalCollected points');

    res.json({
      success: true,
      leaderboard: leaderboard.map((user, index) => ({
        rank: index + 1,
        name: user.name,
        totalCollected: user.totalCollected,
        points: user.points
      }))
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};