import Pickup from '../models/Pickup.js';
import CollectionPoint from '../models/CollectionPoint.js';
import User from '../models/User.js';
import { PICKUP_STATUS, ROLES, POINTS } from '../config/constants.js';
import { checkAndAwardBadges, awardPoints, processReferralReward } from '../utils/gamification.js';


// @desc    Schedule a pickup
// @route   POST /api/pickups
// @access  Private (Citizen)
export const schedulePickup = async (req, res) => {
  console.log('🚨 PICKUP CONTROLLER HIT!!!');
  
  try {
    console.log('📦 Received pickup request:', req.body);
    console.log('👤 User ID:', req.user._id);

    const { 
      collectionPointId, 
      pickupDate,        // ✅ Frontend sends pickupDate
      timeSlot, 
      medicineDetails, 
      estimatedQuantity, 
      contactPhone, 
      alternatePhone, 
      specialInstructions 
    } = req.body;

    // Manual validation (already done by express-validator, but keeping for clarity)
    if (!collectionPointId || !pickupDate || !timeSlot || !medicineDetails || !estimatedQuantity || !contactPhone) {
      return res.status(400).json({ 
        success: false, 
        message: 'All required fields must be provided'
      });
    }

    // Check if collection point exists
    const collectionPoint = await CollectionPoint.findById(collectionPointId);
    if (!collectionPoint) {
      console.log('❌ Collection point not found:', collectionPointId);
      return res.status(404).json({
        success: false,
        message: 'Collection point not found'
      });
    }

    console.log('✅ Collection point found:', collectionPoint.name);

    // Check if collection point is verified and active
    if (!collectionPoint.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Collection point is not verified yet'
      });
    }

    if (!collectionPoint.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Collection point is not active'
      });
    }

    // Check if pickup date is valid
    const selectedDate = new Date(pickupDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return res.status(400).json({
        success: false,
        message: 'Pickup date must be today or in the future'
      });
    }

    // Get user details
    const user = await User.findById(req.user._id);
    if (!user) {
      console.log('❌ User not found:', req.user._id);
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    console.log('✅ User found:', user.name);
    console.log('🔍 User address:', user.address);

    // Check if user has complete address
    if (!user.address || !user.address.street || !user.address.city || !user.address.pincode) {
      console.log('❌ User address incomplete:', user.address);
      return res.status(400).json({
        success: false,
        message: 'Please complete your profile with a valid address (street, city, pincode) before scheduling a pickup'
      });
    }

    console.log('✅ User address complete');

    // Verify timeSlot is valid
    const validTimeSlots = [
      '09:00 AM - 12:00 PM',
      '12:00 PM - 03:00 PM',
      '03:00 PM - 06:00 PM',
      '06:00 PM - 09:00 PM'
    ];

    if (!validTimeSlots.includes(timeSlot)) {
      console.log('❌ Invalid time slot:', timeSlot);
      return res.status(400).json({
        success: false,
        message: 'Invalid time slot selected'
      });
    }

    // Create pickup
    const pickupData = {
      userId: req.user._id,
      collectionPointId,
      address: {
        street: user.address.street,
        city: user.address.city,
        state: user.address.state || '',
        pincode: user.address.pincode,
        lat: user.address.lat,
        lng: user.address.lng
      },
      preferredDate: selectedDate,  // ✅ Store as preferredDate in DB
      timeSlot,
      notes: `Medicine Details: ${medicineDetails}\nEstimated Quantity: ${estimatedQuantity} kg\nContact Phone: ${contactPhone}${alternatePhone ? `\nAlternate Phone: ${alternatePhone}` : ''}${specialInstructions ? `\n\nSpecial Instructions: ${specialInstructions}` : ''}`,
      status: 'pending'
    };

    console.log('📝 Creating pickup with data:', pickupData);

    const pickup = await Pickup.create(pickupData);

    console.log('✅ Pickup created with ID:', pickup._id);

    // Populate references
    const populatedPickup = await Pickup.findById(pickup._id)
      .populate('userId', 'name email phone')
      .populate('collectionPointId', 'name address phone type');

    console.log('✅ Pickup scheduled successfully');

    res.status(201).json({
      success: true,
      message: 'Pickup scheduled successfully',
      pickup: populatedPickup
    });
  } catch (error) {
    console.error('❌ Schedule pickup error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};
// @desc    Get user's pickups
// @route   GET /api/pickups/my
// @access  Private (Citizen)
export const getMyPickups = async (req, res) => {
  try {
    const { status } = req.query;
    const query = { userId: req.user._id };

    if (status) {
      query.status = status;
    }

    const pickups = await Pickup.find(query)
      .populate('collectionPointId', 'name address phone type')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: pickups.length,
      pickups
    });
  } catch (error) {
    console.error('Get my pickups error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Get pickup by ID
// @route   GET /api/pickups/:id
// @access  Private
export const getPickup = async (req, res) => {
  try {
    const pickup = await Pickup.findById(req.params.id)
      .populate('userId', 'name phone email')
      .populate('collectionPointId', 'name address phone type');

    if (!pickup) {
      return res.status(404).json({
        success: false,
        message: 'Pickup not found'
      });
    }

    // Check authorization
    const collectionPoint = await CollectionPoint.findOne({ 
      _id: pickup.collectionPointId._id,
      userId: req.user._id 
    });

    if (
      pickup.userId._id.toString() !== req.user._id.toString() &&
      !collectionPoint &&
      req.user.role !== ROLES.ADMIN
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this pickup'
      });
    }

    res.json({
      success: true,
      pickup
    });
  } catch (error) {
    console.error('Get pickup error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Accept pickup request
// @route   PUT /api/pickups/:id/accept
// @access  Private (Collection Point)
export const acceptPickup = async (req, res) => {
  try {
    const pickup = await Pickup.findById(req.params.id);

    if (!pickup) {
      return res.status(404).json({
        success: false,
        message: 'Pickup not found'
      });
    }

    // Check if user owns this collection point
    const collectionPoint = await CollectionPoint.findOne({
      _id: pickup.collectionPointId,
      userId: req.user._id
    });

    if (!collectionPoint) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to accept this pickup'
      });
    }

    if (pickup.status !== PICKUP_STATUS.PENDING) {
      return res.status(400).json({
        success: false,
        message: `Pickup is already ${pickup.status}`
      });
    }

    pickup.status = PICKUP_STATUS.ACCEPTED;
    await pickup.save();

    const populatedPickup = await Pickup.findById(pickup._id)
      .populate('userId', 'name phone')
      .populate('collectionPointId', 'name address phone');

    res.json({
      success: true,
      message: 'Pickup accepted successfully',
      pickup: populatedPickup
    });
  } catch (error) {
    console.error('Accept pickup error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Reject pickup request
// @route   PUT /api/pickups/:id/reject
// @access  Private (Collection Point)
export const rejectPickup = async (req, res) => {
  try {
    const { reason } = req.body;
    const pickup = await Pickup.findById(req.params.id);

    if (!pickup) {
      return res.status(404).json({
        success: false,
        message: 'Pickup not found'
      });
    }

    // Check if user owns this collection point
    const collectionPoint = await CollectionPoint.findOne({
      _id: pickup.collectionPointId,
      userId: req.user._id
    });

    if (!collectionPoint) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to reject this pickup'
      });
    }

    if (pickup.status !== PICKUP_STATUS.PENDING) {
      return res.status(400).json({
        success: false,
        message: `Pickup is already ${pickup.status}`
      });
    }

    pickup.status = PICKUP_STATUS.REJECTED;
    pickup.rejectionReason = reason;
    await pickup.save();

    const populatedPickup = await Pickup.findById(pickup._id)
      .populate('userId', 'name phone')
      .populate('collectionPointId', 'name address phone');

    res.json({
      success: true,
      message: 'Pickup rejected',
      pickup: populatedPickup
    });
  } catch (error) {
    console.error('Reject pickup error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Complete pickup and log collection
// @route   PUT /api/pickups/:id/complete
// @access  Private (Collection Point)
export const completePickup = async (req, res) => {
  try {
    const { quantityCollected } = req.body;
    const pickup = await Pickup.findById(req.params.id);

    if (!pickup) {
      return res.status(404).json({
        success: false,
        message: 'Pickup not found'
      });
    }

    // Check if user owns this collection point
    const collectionPoint = await CollectionPoint.findOne({
      _id: pickup.collectionPointId,
      userId: req.user._id
    });

    if (!collectionPoint) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to complete this pickup'
      });
    }

    if (pickup.status !== PICKUP_STATUS.ACCEPTED) {
      return res.status(400).json({
        success: false,
        message: 'Pickup must be accepted before completion'
      });
    }

    if (!quantityCollected || quantityCollected <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid quantity collected'
      });
    }

    // Update pickup
    pickup.status = PICKUP_STATUS.COMPLETED;
    pickup.quantityCollected = quantityCollected;
    pickup.completedAt = new Date();
    await pickup.save();

    // Update user's total collected
    const user = await User.findById(pickup.userId);
    const wasFirstCollection = user.totalCollected === 0;
    user.totalCollected += quantityCollected;
    await user.save();

    // Update collection point stats
    collectionPoint.totalCollected += quantityCollected;
    collectionPoint.completedPickups += 1;
    await collectionPoint.save();

    // Award points
    const pointsEarned = quantityCollected * POINTS.PER_KG;
    await awardPoints(
      pickup.userId,
      pointsEarned,
      `Collected ${quantityCollected}kg of medicines`,
      pickup._id,
      'Pickup'
    );

    // Check and award badges
    const newBadges = await checkAndAwardBadges(pickup.userId, user.totalCollected);

    // Process referral reward if this was first collection
    if (wasFirstCollection && user.referredBy) {
      await processReferralReward(user._id);
    }

    const populatedPickup = await Pickup.findById(pickup._id)
      .populate('userId', 'name phone')
      .populate('collectionPointId', 'name address phone');

    res.json({
      success: true,
      message: 'Pickup completed successfully',
      pickup: populatedPickup,
      pointsEarned,
      newBadges: newBadges.map(b => b.name)
    });
  } catch (error) {
    console.error('Complete pickup error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Cancel pickup
// @route   PUT /api/pickups/:id/cancel
// @access  Private (Citizen)
export const cancelPickup = async (req, res) => {
  try {
    const pickup = await Pickup.findById(req.params.id);

    if (!pickup) {
      return res.status(404).json({
        success: false,
        message: 'Pickup not found'
      });
    }

    // Check ownership
    if (pickup.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this pickup'
      });
    }

    if (pickup.status === PICKUP_STATUS.COMPLETED) {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel a completed pickup'
      });
    }

    if (pickup.status === PICKUP_STATUS.CANCELLED) {
      return res.status(400).json({
        success: false,
        message: 'Pickup is already cancelled'
      });
    }

    pickup.status = PICKUP_STATUS.CANCELLED;
    await pickup.save();

    res.json({
      success: true,
      message: 'Pickup cancelled successfully',
      pickup
    });
  } catch (error) {
    console.error('Cancel pickup error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Get pickups for collection point
// @route   GET /api/pickups/collection-point/all
// @access  Private (Collection Point)
export const getCollectionPointPickups = async (req, res) => {
  try {
    const { status } = req.query;

    const collectionPoint = await CollectionPoint.findOne({ userId: req.user._id });

    if (!collectionPoint) {
      return res.status(404).json({
        success: false,
        message: 'Collection point not found'
      });
    }

    const query = { collectionPointId: collectionPoint._id };

    if (status) {
      query.status = status;
    }

    const pickups = await Pickup.find(query)
      .populate('userId', 'name phone address')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: pickups.length,
      pickups
    });
  } catch (error) {
    console.error('Get collection point pickups error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};
// @desc    Get pickup by ID
// @route   GET /api/pickups/:id
// @access  Private
export const getPickupById = async (req, res) => {
  try {
    const pickup = await Pickup.findById(req.params.id)
      .populate('userId', 'name email phone')
      .populate('collectionPointId', 'name address phone type');

    if (!pickup) {
      return res.status(404).json({
        success: false,
        message: 'Pickup not found'
      });
    }

    // Check if user is authorized to view this pickup
    if (
      req.user.role === 'citizen' && 
      pickup.userId._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this pickup'
      });
    }

    if (
      req.user.role === 'collection_point' && 
      pickup.collectionPointId._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this pickup'
      });
    }

    res.json({
      success: true,
      pickup
    });
  } catch (error) {
    console.error('Get pickup by ID error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Get my pickups (for citizens)
// @route   GET /api/pickups/my
// @access  Private (Citizen)

// @desc    Cancel pickup
// @route   PUT /api/pickups/:id/cancel
// @access  Private (Citizen)


// @desc    Get collection point pickups
// @route   GET /api/pickups/collection-point/all
// @access  Private (Collection Point)


// @desc    Accept pickup
// @route   PUT /api/pickups/:id/accept
// @access  Private (Collection Point)

// @desc    Reject pickup
// @route   PUT /api/pickups/:id/reject
// @access  Private (Collection Point)


