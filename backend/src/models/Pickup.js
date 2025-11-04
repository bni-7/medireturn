import mongoose from 'mongoose';
import { PICKUP_STATUS, TIME_SLOTS } from '../config/constants.js';

const addressSchema = new mongoose.Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  pincode: { type: String, required: true },
  lat: { type: Number },
  lng: { type: Number }
}, { _id: false });

const pickupSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  collectionPointId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CollectionPoint',
    required: true
  },
  address: {
    type: addressSchema,
    required: true
  },
  preferredDate: {
    type: Date,
    required: [true, 'Preferred date is required']
  },
  timeSlot: {
    type: String,
    enum: TIME_SLOTS,
    required: [true, 'Time slot is required']
  },
  notes: {
    type: String,
    maxlength: 500
  },
  status: {
    type: String,
    enum: Object.values(PICKUP_STATUS),
    default: PICKUP_STATUS.PENDING
  },
  quantityCollected: {
    type: Number,
    default: 0
  },
  rejectionReason: {
    type: String
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true
});

const Pickup = mongoose.model('Pickup', pickupSchema);

export default Pickup;