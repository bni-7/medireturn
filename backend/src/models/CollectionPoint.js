import mongoose from 'mongoose';
import { COLLECTION_POINT_TYPES } from '../config/constants.js';

const addressSchema = new mongoose.Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  pincode: { type: String, required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true }
}, { _id: false });

const operatingHoursSchema = new mongoose.Schema({
  monday: { open: String, close: String, closed: Boolean },
  tuesday: { open: String, close: String, closed: Boolean },
  wednesday: { open: String, close: String, closed: Boolean },
  thursday: { open: String, close: String, closed: Boolean },
  friday: { open: String, close: String, closed: Boolean },
  saturday: { open: String, close: String, closed: Boolean },
  sunday: { open: String, close: String, closed: Boolean }
}, { _id: false });

const collectionPointSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Collection point name is required'],
    trim: true
  },
  type: {
    type: String,
    enum: Object.values(COLLECTION_POINT_TYPES),
    required: [true, 'Collection point type is required']
  },
  address: {
    type: addressSchema,
    required: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required']
  },
  operatingHours: {
    type: operatingHoursSchema,
    required: true
  },
  description: {
    type: String,
    maxlength: 500
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  totalCollected: {
    type: Number,
    default: 0
  },
  completedPickups: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const CollectionPoint = mongoose.model('CollectionPoint', collectionPointSchema);

export default CollectionPoint;