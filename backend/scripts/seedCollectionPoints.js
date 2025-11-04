import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import User from '../src/models/User.js';
import CollectionPoint from '../src/models/CollectionPoint.js';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from backend root
dotenv.config({ path: join(__dirname, '..', '.env') });

const collectionPoints = [
  {
    user: {
      name: "Apollo Pharmacy",
      email: "apollo.mumbai@pharmacy.com",
      password: "password123",
      phone: "9876543210",
      role: "collection_point",
      address: {
        street: "MG Road, Colaba",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400001",
        lat: 18.9220,
        lng: 72.8347
      }
    },
    collectionPoint: {
      type: "pharmacy",
      operatingHours: {
        open: "08:00 AM",
        close: "10:00 PM"
      },
      servicesOffered: ["Unused Medicines", "Expired Medicines", "Medical Equipment"],
      description: "24/7 pharmacy accepting unused and expired medicines"
    }
  },
  {
    user: {
      name: "Fortis Hospital",
      email: "fortis.delhi@hospital.com",
      password: "password123",
      phone: "9876543211",
      role: "collection_point",
      address: {
        street: "Sector 62, Noida",
        city: "Delhi",
        state: "Delhi",
        pincode: "110001",
        lat: 28.6139,
        lng: 77.2090
      }
    },
    collectionPoint: {
      type: "hospital",
      operatingHours: {
        open: "09:00 AM",
        close: "09:00 PM"
      },
      servicesOffered: ["Unused Medicines", "Expired Medicines", "Medical Equipment", "Surgical Items"],
      description: "Multi-specialty hospital with dedicated medicine disposal unit"
    }
  },
  {
    user: {
      name: "Medlife Pharmacy",
      email: "medlife.bangalore@pharmacy.com",
      password: "password123",
      phone: "9876543212",
      role: "collection_point",
      address: {
        street: "Koramangala 5th Block",
        city: "Bangalore",
        state: "Karnataka",
        pincode: "560034",
        lat: 12.9352,
        lng: 77.6245
      }
    },
    collectionPoint: {
      type: "pharmacy",
      operatingHours: {
        open: "07:00 AM",
        close: "11:00 PM"
      },
      servicesOffered: ["Unused Medicines", "Expired Medicines"],
      description: "Leading pharmacy chain with eco-friendly disposal"
    }
  },
  {
    user: {
      name: "Green Health NGO",
      email: "greenhealth.pune@ngo.org",
      password: "password123",
      phone: "9876543213",
      role: "collection_point",
      address: {
        street: "FC Road",
        city: "Pune",
        state: "Maharashtra",
        pincode: "411004",
        lat: 18.5204,
        lng: 73.8567
      }
    },
    collectionPoint: {
      type: "ngo",
      operatingHours: {
        open: "10:00 AM",
        close: "06:00 PM"
      },
      servicesOffered: ["Unused Medicines", "Medical Equipment"],
      description: "NGO focused on safe medical waste disposal and recycling"
    }
  },
  {
    user: {
      name: "City Clinic",
      email: "cityclinic.chennai@clinic.com",
      password: "password123",
      phone: "9876543214",
      role: "collection_point",
      address: {
        street: "Anna Nagar",
        city: "Chennai",
        state: "Tamil Nadu",
        pincode: "600040",
        lat: 13.0827,
        lng: 80.2707
      }
    },
    collectionPoint: {
      type: "clinic",
      operatingHours: {
        open: "09:00 AM",
        close: "08:00 PM"
      },
      servicesOffered: ["Unused Medicines", "Expired Medicines", "Surgical Items"],
      description: "Multi-specialty clinic with medicine collection facility"
    }
  }
];

const seedCollectionPoints = async () => {
  try {
    console.log('Connecting to MongoDB...');
    console.log('MONGO_URI:', process.env.MONGO_URI ? 'Found' : 'Not found');
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ MongoDB connected');

    // Clear existing collection points
    await CollectionPoint.deleteMany({});
    await User.deleteMany({ role: 'collection_point' });
    console.log('✓ Cleared existing collection points');

    // Create collection points
    for (const cp of collectionPoints) {
      // Create user
      const user = await User.create(cp.user);
      console.log(`✓ Created user: ${user.name}`);

      // Create collection point with correct field names
      const collectionPoint = await CollectionPoint.create({
        userId: user._id,              // ✅ Changed from 'user' to 'userId'
        name: user.name,
        phone: user.phone,              // ✅ Added phone
        address: user.address,
        type: cp.collectionPoint.type,
        operatingHours: cp.collectionPoint.operatingHours,  // ✅ Changed structure
        servicesOffered: cp.collectionPoint.servicesOffered,
        description: cp.collectionPoint.description,
        isVerified: true,               // ✅ Auto-verify for demo
        isActive: true
      });
      console.log(`✓ Created collection point: ${collectionPoint.name}`);
    }

    console.log('\n✅ All collection points seeded successfully!');
    console.log('\nYou can now:');
    console.log('1. View them at: http://localhost:5173/map');
    console.log('2. Schedule pickup with them');
    console.log('3. Login with any of these credentials:');
    console.log('   - apollo.mumbai@pharmacy.com / password123');
    console.log('   - fortis.delhi@hospital.com / password123');
    console.log('   - medlife.bangalore@pharmacy.com / password123');
    console.log('   - greenhealth.pune@ngo.org / password123');
    console.log('   - cityclinic.chennai@clinic.com / password123');
    
    process.exit(0);
  } catch (error) {
    console.error('✗ Error seeding collection points:', error);
    process.exit(1);
  }
};

seedCollectionPoints();