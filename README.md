# 🏥 MediReturn - Prescription Drug Take-Back Platform

A comprehensive web application for safe disposal of unused prescription drugs in India. Built with MERN stack (MongoDB, Express.js, React, Node.js).

![MediReturn Banner](https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1200&h=400&fit=crop)

## 🌟 Overview

MediReturn connects citizens with verified collection points (pharmacies, hospitals, NGOs) for safe disposal of unused medicines. The platform features:

- 🗺️ Interactive map to find collection points
- 📅 Schedule pickup requests
- 🏆 Gamification with points and badges
- 📊 Analytics dashboard
- 🎯 Leaderboard system
- 🔐 Role-based access control

## 🎯 Problem Statement

- **14% of households** in India have unused medicines
- **$200 billion worth** of unused drugs disposed improperly
- Improper disposal leads to environmental pollution and drug misuse

## 💡 Solution

MediReturn provides a centralized platform to:
- Locate nearby collection points
- Schedule convenient pickups
- Track environmental impact
- Earn rewards for participation
- Promote community health awareness

## 🚀 Tech Stack

### Frontend
- **React 18** - UI Library
- **Vite** - Build Tool
- **Tailwind CSS** - Styling Framework
- **React Router** - Navigation
- **React Leaflet** - Map Integration
- **Axios** - HTTP Client
- **Recharts** - Data Visualization
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime Environment
- **Express.js** - Web Framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password Hashing
- **Cookie-Parser** - Session Management
- **Express Validator** - Input Validation
- **Cors** - Cross-Origin Resource Sharing

## 📋 Features

### For Citizens
✅ User registration and authentication  
✅ Find collection points on interactive map  
✅ Schedule medicine pickups  
✅ Track pickup status (pending/accepted/completed)  
✅ View collection history  
✅ Earn points and badges  
✅ City-wise leaderboard  
✅ Referral system  
✅ Profile management  

### For Collection Points
✅ Register as collection point  
✅ Admin verification system  
✅ Manage pickup requests  
✅ Accept/Reject pickups  
✅ Mark pickups as completed  
✅ View statistics dashboard  
✅ Track monthly performance  

### For Admins
✅ Approve/Reject collection points  
✅ View platform analytics  
✅ User management  
✅ System-wide statistics  
✅ Monitor all activities  

## 🏗️ Architecture

```
MediReturn/
├── backend/           # Node.js + Express API
│   ├── config/       # Configuration files
│   ├── controllers/  # Route controllers
│   ├── middlewares/  # Custom middlewares
│   ├── models/       # Mongoose models
│   ├── routes/       # API routes
│   ├── utils/        # Helper functions
│   └── server.js     # Entry point
│
└── frontend/         # React + Vite
    ├── src/
    │   ├── api/      # API services
    │   ├── components/ # React components
    │   ├── context/  # Context providers
    │   ├── hooks/    # Custom hooks
    │   ├── pages/    # Page components
    │   ├── utils/    # Utilities
    │   └── main.jsx  # Entry point
    └── public/       # Static assets
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ and npm/yarn
- MongoDB 6+
- Git

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/medireturn.git
cd medireturn
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file in backend directory:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/medireturn

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Cookie
COOKIE_EXPIRE=7

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

Start backend server:

```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create `.env` file in frontend directory:

```env
VITE_API_URL=http://localhost:5000/api
```

Start frontend server:

```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## 🗄️ Database Models

### User
```javascript
{
  name: String,
  email: String,
  password: String (hashed),
  phone: String,
  role: ['citizen', 'collection_point', 'admin'],
  address: {
    street, city, state, pincode,
    lat, lng
  },
  points: Number,
  totalCollected: Number,
  referralCode: String,
  isActive: Boolean
}
```

### Collection Point
```javascript
{
  userId: ObjectId,
  name: String,
  type: ['pharmacy', 'hospital', 'ngo', 'clinic'],
  address: Object,
  phone: String,
  operatingHours: Object,
  isVerified: Boolean,
  totalCollected: Number
}
```

### Pickup
```javascript
{
  userId: ObjectId,
  collectionPointId: ObjectId,
  address: Object,
  preferredDate: Date,
  timeSlot: String,
  status: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
  quantityCollected: Number,
  notes: String
}
```

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/register     # Register new user
POST   /api/auth/login        # Login user
POST   /api/auth/logout       # Logout user
GET    /api/auth/me           # Get current user
```

### Users
```
GET    /api/users/profile           # Get user profile
PUT    /api/users/profile           # Update profile
GET    /api/users/dashboard         # Get dashboard data
GET    /api/users/transactions      # Get transactions
GET    /api/users/leaderboard/:city # Get city leaderboard
```

### Collection Points
```
POST   /api/collection-points              # Register collection point
GET    /api/collection-points              # Get all (with filters)
GET    /api/collection-points/:id          # Get by ID
GET    /api/collection-points/my/point     # Get own point
GET    /api/collection-points/my/dashboard # Get dashboard
PUT    /api/collection-points/:id          # Update point
```

### Pickups
```
POST   /api/pickups                            # Schedule pickup
GET    /api/pickups/my                         # Get user pickups
GET    /api/pickups/:id                        # Get pickup by ID
PUT    /api/pickups/:id/accept                 # Accept pickup
PUT    /api/pickups/:id/reject                 # Reject pickup
PUT    /api/pickups/:id/complete               # Complete pickup
PUT    /api/pickups/:id/cancel                 # Cancel pickup
GET    /api/pickups/collection-point/all      # Get CP pickups
```

### Admin
```
GET    /api/admin/analytics                    # Get analytics
GET    /api/admin/users                        # Get all users
GET    /api/admin/collection-points            # Get all CPs
GET    /api/admin/collection-points/pending    # Get pending CPs
PUT    /api/admin/collection-points/:id/approve # Approve CP
DELETE /api/admin/collection-points/:id/reject  # Reject CP
PUT    /api/admin/users/:id/toggle-status      # Toggle user status
```

## 🎮 User Roles & Permissions

| Feature | Citizen | Collection Point | Admin |
|---------|---------|------------------|-------|
| Schedule Pickup | ✅ | ❌ | ❌ |
| Manage Pickups | ❌ | ✅ | ✅ |
| View Leaderboard | ✅ | ❌ | ✅ |
| Earn Points | ✅ | ❌ | ❌ |
| Approve CPs | ❌ | ❌ | ✅ |
| View Analytics | ❌ | ✅ | ✅ |

## 🏆 Gamification System

### Points System
- **First Collection**: 50 points
- **Per kg collected**: 10 points
- **Referral bonus**: 50 points
- **Monthly streak**: 25 points

### Badges
- 🌟 **Beginner**: First collection
- 🔥 **Enthusiast**: 5 collections
- 💎 **Champion**: 10 collections
- 👑 **Legend**: 25 collections
- 🌍 **Eco Warrior**: 100kg collected

## 📊 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

### API Testing (Postman)
Import the Postman collection from `/postman/MediReturn.postman_collection.json`

## 🚀 Deployment

### Backend Deployment (Render/Railway)

1. **Push to GitHub**
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **Deploy on Render**
- Connect GitHub repository
- Set environment variables
- Deploy

### Frontend Deployment (Vercel)

```bash
cd frontend
vercel --prod
```

Or use Vercel Dashboard:
1. Import GitHub repository
2. Set `VITE_API_URL` to backend URL
3. Deploy

## 🔐 Security

- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ HTTP-only cookies
- ✅ CORS protection
- ✅ Input validation
- ✅ XSS protection
- ✅ Rate limiting
- ✅ Helmet.js security headers

## 🐛 Common Issues & Solutions

### CORS Error
```javascript
// backend/server.js
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

### MongoDB Connection Error
- Check if MongoDB is running
- Verify connection string in `.env`
- Check network/firewall settings

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or change port in .env
PORT=5001
```

## 📈 Performance Optimization

### Backend
- Database indexing on frequently queried fields
- Request caching
- Query optimization
- Compression middleware

### Frontend
- Code splitting (React.lazy)
- Image optimization
- Lazy loading
- Memoization
- Bundle size optimization

## 🔄 Future Enhancements

- [ ] Mobile app (React Native)
- [ ] SMS/Email notifications
- [ ] Real-time chat support
- [ ] Payment integration for rewards
- [ ] AI-powered medicine identification
- [ ] Multi-language support
- [ ] Push notifications
- [ ] Advanced analytics
- [ ] Social media integration

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

### Coding Standards
- Use ESLint for linting
- Follow Airbnb style guide
- Write meaningful commit messages
- Add comments for complex logic
- Write tests for new features

## 📝 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

## 👥 Team

- **Developer**: Bhavana N I


## 🙏 Acknowledgments

- OpenStreetMap for map data
- Unsplash for images
- React community
- Node.js community

## 📞 Support

For support and queries:
- 📧 Email: support@medireturn.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/medireturn/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/yourusername/medireturn/discussions)

## 📱 Screenshots

### Home Page
![Home](screenshots/home.png)

### Map View
![Map](screenshots/map.png)

### Dashboard
![Dashboard](screenshots/dashboard.png)

### Schedule Pickup
![Schedule](screenshots/schedule.png)

---

**Made with ❤️ for a healthier and safer India**

**⭐ Star this repo if you find it helpful!**
