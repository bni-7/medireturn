import CollectionPoint from '../models/CollectionPoint.js';
import User from '../models/User.js';
import Pickup from '../models/Pickup.js';
import { ROLES, PICKUP_STATUS } from '../config/constants.js';
import calculateDistance from '../utils/calculateDistance.js';

// @desc    Register collection point
// @route   POST /api/collection-points
// @access  Private (Collection Point role)
export const registerCollectionPoint = async (req, res) => {
  try {
    const { name, type, address, phone, operatingHours, description } = req.body;

    // Check if user already has a collection point
    const existingPoint = await CollectionPoint.findOne({ userId: req.user._id });
    if (existingPoint) {
      return res.status(400).json({
        success: false,
        message: 'You already have a collection point registered'
      });
    }

    const collectionPoint = await CollectionPoint.create({
      userId: req.user._id,
      name,
      type,
      address,
      phone,
      operatingHours,
      description
    });

    res.status(201).json({
      success: true,
      message: 'Collection point registered successfully. Awaiting admin approval.',
      collectionPoint
    });
  } catch (error) {
    console.error('Register collection point error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Get all collection points (with filters)
// @route   GET /api/collection-points
// @access  Public
export const getCollectionPoints = async (req, res) => {
  try {
    const { lat, lng, maxDistance, type, isOpen } = req.query;

    let query = { isVerified: true, isActive: true };

    // Filter by type
    if (type) {
      query.type = type;
    }

    let collectionPoints = await CollectionPoint.find(query)
      .populate('userId', 'name email phone');

    // Filter by distance if coordinates provided
    if (lat && lng) {
      collectionPoints = collectionPoints.map(point => {
        const distance = calculateDistance(
          parseFloat(lat),
          parseFloat(lng),
          point.address.lat,
          point.address.lng
        );
        return { ...point.toObject(), distance };
      });

      // Filter by max distance
      if (maxDistance) {
        collectionPoints = collectionPoints.filter(
          point => point.distance <= parseFloat(maxDistance)
        );
      }

      // Sort by distance
      collectionPoints.sort((a, b) => a.distance - b.distance);
    }

    // Filter by open now
    if (isOpen === 'true') {
      const now = new Date();
      const dayName = now.toLocaleDateString('en-US', { weekday: 'monday' }).toLowerCase();
      const currentTime = now.getHours() * 60 + now.getMinutes();

      collectionPoints = collectionPoints.filter(point => {
        const daySchedule = point.operatingHours[dayName];
        if (!daySchedule || daySchedule.closed) return false;

        const [openHour, openMin] = daySchedule.open.split(':').map(Number);
        const [closeHour, closeMin] = daySchedule.close.split(':').map(Number);
        const openTime = openHour * 60 + openMin;
        const closeTime = closeHour * 60 + closeMin;

        return currentTime >= openTime && currentTime <= closeTime;
      });
    }

    res.json({
      success: true,
      count: collectionPoints.length,
      collectionPoints
    });
  } catch (error) {
    console.error('Get collection points error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Get single collection point
// @route   GET /api/collection-points/:id
// @access  Public
export const getCollectionPoint = async (req, res) => {
  try {
    const collectionPoint = await CollectionPoint.findById(req.params.id)
      .populate('userId', 'name email phone');

    if (!collectionPoint) {
      return res.status(404).json({
        success: false,
        message: 'Collection point not found'
      });
    }

    res.json({
      success: true,
      collectionPoint
    });
  } catch (error) {
    console.error('Get collection point error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Get my collection point
// @route   GET /api/collection-points/my/point
// @access  Private (Collection Point)
export const getMyCollectionPoint = async (req, res) => {
  try {
    const collectionPoint = await CollectionPoint.findOne({ userId: req.user._id });

    if (!collectionPoint) {
      return res.status(404).json({
        success: false,
        message: 'Collection point not found'
      });
    }

    res.json({
      success: true,
      collectionPoint
    });
  } catch (error) {
    console.error('Get my collection point error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Update collection point
// @route   PUT /api/collection-points/:id
// @access  Private (Collection Point owner)
export const updateCollectionPoint = async (req, res) => {
  try {
    const collectionPoint = await CollectionPoint.findById(req.params.id);

    if (!collectionPoint) {
      return res.status(404).json({
        success: false,
        message: 'Collection point not found'
      });
    }

    // Check ownership
    if (collectionPoint.userId.toString() !== req.user._id.toString() && req.user.role !== ROLES.ADMIN) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this collection point'
      });
    }

    const { name, type, address, phone, operatingHours, description, isActive } = req.body;

    if (name) collectionPoint.name = name;
    if (type) collectionPoint.type = type;
    if (address) collectionPoint.address = address;
    if (phone) collectionPoint.phone = phone;
    if (operatingHours) collectionPoint.operatingHours = operatingHours;
    if (description !== undefined) collectionPoint.description = description;
    if (isActive !== undefined) collectionPoint.isActive = isActive;

    await collectionPoint.save();

    res.json({
      success: true,
      message: 'Collection point updated successfully',
      collectionPoint
    });
  } catch (error) {
    console.error('Update collection point error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Get collection point dashboard
// @route   GET /api/collection-points/my/dashboard
// @access  Private (Collection Point)
export const getCollectionPointDashboard = async (req, res) => {
  try {
    const collectionPoint = await CollectionPoint.findOne({ userId: req.user._id });

    if (!collectionPoint) {
      return res.status(404).json({
        success: false,
        message: 'Collection point not found'
      });
    }

    // Get pickup requests
    const pendingPickups = await Pickup.find({
      collectionPointId: collectionPoint._id,
      status: PICKUP_STATUS.PENDING
    })
      .populate('userId', 'name phone')
      .sort({ createdAt: -1 });

    const acceptedPickups = await Pickup.find({
      collectionPointId: collectionPoint._id,
      status: PICKUP_STATUS.ACCEPTED
    })
      .populate('userId', 'name phone')
      .sort({ preferredDate: 1 });

    const completedPickups = await Pickup.countDocuments({
      collectionPointId: collectionPoint._id,
      status: PICKUP_STATUS.COMPLETED
    });

    res.json({
      success: true,
      dashboard: {
        collectionPoint,
        pendingPickups,
        acceptedPickups,
        stats: {
          totalCollected: collectionPoint.totalCollected,
          completedPickups: collectionPoint.completedPickups,
          pendingCount: pendingPickups.length,
          acceptedCount: acceptedPickups.length
        }
      }
    });
  } catch (error) {
    console.error('Get collection point dashboard error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};