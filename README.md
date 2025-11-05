# 🏥 MediReturn - Prescription Drug Take-Back Platform

A comprehensive web application for safe disposal of unused prescription drugs in India. Built with MERN stack (MongoDB, Express.js, React, Node.js).

![MediReturn Banner](https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1200&h=400&fit=crop)

## 🌟 Overview

MediReturn connects citizens with verified collection points (pharmacies, hospitals, NGOs, clinics) for safe disposal of unused medicines. The platform features:

- 🗺️ Interactive map with 5 pre-seeded collection points
- 📅 Schedule pickup requests with flexible time slots
- 🎯 Points-based reward system
- 📊 Real-time analytics dashboards
- � City-based leaderboard system
- 🔐 Three-tier role-based access control (Citizen, Collection Point, Admin)
- 📱 Auto-refresh functionality for live updates
- 🔄 Complete pickup workflow management

## 🎯 Problem Statement

- **14% of households** in India have unused medicines
- **$200 billion worth** of unused drugs disposed improperly annually
- Improper disposal leads to environmental pollution and drug misuse
- Lack of accessible and convenient disposal infrastructure

## 💡 Solution

MediReturn provides a centralized platform to:
- Locate nearby collection points on an interactive map
- Schedule convenient pickups with date and time preferences
- Track environmental impact through collection metrics
- Earn points for participation (10 points per kg + bonus rewards)
- Promote community health awareness through leaderboards
- Enable verified collection points to manage requests efficiently

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
✅ User registration with address and referral code  
✅ Three separate login portals (Citizen, Collection Point, Admin)  
✅ Find collection points on interactive map with filtering  
✅ Schedule medicine pickups with preferred date and time slot  
✅ Track pickup status in real-time (pending → accepted → completed)  
✅ View detailed pickup history with status indicators  
✅ Earn points (10 per kg + 50 first collection bonus)  
✅ City-wise leaderboard with ranking  
✅ Referral system with 50 bonus points  
✅ Profile management with editable information  
✅ Auto-refresh dashboard on window focus  

### For Collection Points
✅ Dedicated login portal  
✅ Dashboard with tabbed interface (Pending/Accepted/Completed/Rejected)  
✅ View all pickup requests with user details  
✅ Accept pickup requests with automatic tab switching  
✅ Reject pickups with mandatory reason  
✅ Complete pickups with quantity entry  
✅ Real-time status updates and statistics  
✅ Track total collected weight and completed pickups  
✅ Auto-navigation to relevant tabs after actions  
✅ Null-safe error handling  

### For Admins
✅ Dedicated admin portal  
✅ Platform-wide analytics with refresh button  
✅ User management and statistics  
✅ View all pickups with real-time updates  
✅ Top cities by collection ranking  
✅ Monitor system-wide metrics  
✅ Auto-refresh on window focus  

## 🔑 Pre-Seeded Accounts

### Admin Account
```
Email: admin@medireturn.com
Password: admin123
```

### Collection Points (5 Pre-Seeded)
```
1. Apollo Pharmacy (Mumbai)
   Email: apollo.mumbai@pharmacy.com
   Password: password123

2. Fortis Hospital (Delhi)
   Email: fortis.delhi@hospital.com
   Password: password123

3. Medlife Pharmacy (Bangalore)
   Email: medlife.bangalore@pharmacy.com
   Password: password123

4. Green Health NGO (Pune)
   Email: greenhealth.pune@ngo.org
   Password: password123

5. City Clinic (Chennai)
   Email: cityclinic.chennai@clinic.com
   Password: password123
```

### Test Citizen Account
Create your own by registering at `/register`  

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
- Node.js 18+ and npm
- MongoDB 6+ (local or Atlas)
- Git

### 1. Clone Repository

```bash
git clone https://github.com/bni-7/medireturn.git
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
# Or use MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/medireturn

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars
JWT_EXPIRE=7d

# Cookie
COOKIE_EXPIRE=7

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

**Seed Database with Collection Points:**

```bash
# Seed admin account
node src/seeds/adminSeed.js

# Seed 5 collection points
node scripts/seedCollectionPoints.js
```

**Start backend server:**

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

**Start frontend server:**

```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

### 4. Access the Application

Open your browser and navigate to:
- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000/api`

**Default Login Credentials:**
- Admin: `admin@medireturn.com` / `admin123`
- Collection Points: See [Pre-Seeded Accounts](#-pre-seeded-accounts) section

## 🗄️ Database Models

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (bcrypt hashed),
  phone: String,
  role: ['citizen', 'collection_point', 'admin'],
  address: {
    street, city, state, pincode,
    lat, lng
  },
  points: Number (default: 0),
  totalCollected: Number (default: 0),
  referralCode: String (unique),
  referredBy: String,
  isActive: Boolean (default: true)
}
```

### Collection Point
```javascript
{
  userId: ObjectId (ref: User),
  name: String,
  type: ['pharmacy', 'hospital', 'ngo', 'clinic'],
  address: Object (same structure as User),
  phone: String,
  operatingHours: {
    open: String, // e.g., "08:00 AM"
    close: String  // e.g., "10:00 PM"
  },
  servicesOffered: [String],
  description: String,
  isVerified: Boolean (default: false),
  isActive: Boolean (default: true),
  totalCollected: Number (default: 0),
  completedPickups: Number (default: 0)
}
```

### Pickup
```javascript
{
  userId: ObjectId (ref: User),
  collectionPointId: ObjectId (ref: CollectionPoint),
  address: Object,
  preferredDate: Date,
  timeSlot: String (4 options),
  status: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
  quantityCollected: Number (set on completion),
  rejectionReason: String (for rejected pickups),
  notes: String,
  completedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Transaction
```javascript
{
  userId: ObjectId (ref: User),
  type: ['collection', 'referral_bonus', 'monthly_streak'],
  points: Number,
  description: String,
  referenceId: ObjectId,
  referenceModel: String,
  createdAt: Date
}
```

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/register     # Register new user (citizen)
POST   /api/auth/login        # Login user (all roles, with role validation)
POST   /api/auth/logout       # Logout user
GET    /api/auth/me           # Get current user
```

### Users
```
GET    /api/users/profile           # Get user profile
PUT    /api/users/profile           # Update profile (name, phone, address)
GET    /api/users/dashboard         # Get dashboard data (stats, leaderboard, transactions)
GET    /api/users/transactions      # Get paginated transactions
GET    /api/users/leaderboard/:city # Get city-based leaderboard
```

### Collection Points
```
POST   /api/collection-points              # Register collection point
GET    /api/collection-points              # Get all (with type/city filters)
GET    /api/collection-points/:id          # Get by ID
GET    /api/collection-points/my/point     # Get own collection point
GET    /api/collection-points/my/dashboard # Get CP dashboard (stats, pickups)
PUT    /api/collection-points/:id          # Update collection point
```

### Pickups
```
POST   /api/pickups                            # Schedule new pickup (citizen)
GET    /api/pickups/my                         # Get user's pickups
GET    /api/pickups/:id                        # Get pickup by ID
PUT    /api/pickups/:id/accept                 # Accept pickup (collection point)
PUT    /api/pickups/:id/reject                 # Reject pickup with reason
PUT    /api/pickups/:id/complete               # Complete pickup with quantity
PUT    /api/pickups/:id/cancel                 # Cancel pickup (citizen)
GET    /api/pickups/collection-point/all      # Get all CP pickups
```

### Admin
```
GET    /api/admin/analytics                    # Get platform analytics
GET    /api/admin/users                        # Get all users (with pagination)
GET    /api/admin/collection-points            # Get all collection points
GET    /api/admin/collection-points/pending    # Get pending verification CPs
PUT    /api/admin/collection-points/:id/approve # Approve collection point
DELETE /api/admin/collection-points/:id/reject  # Reject collection point
PUT    /api/admin/users/:id/toggle-status      # Toggle user active status
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

## 🏆 Points & Rewards System

### Points Calculation
- **First Collection Bonus**: 50 points
- **Per kg collected**: 10 points
- **Referral bonus**: 50 points (when referred user completes first collection)
- **Monthly streak bonus**: 25 points

### Point Award Flow
1. Citizen schedules a pickup
2. Collection point accepts the pickup
3. Collection point marks pickup as complete with quantity
4. System automatically:
   - Awards points (quantity × 10)
   - Updates user's total collected weight
   - Creates transaction record
   - Processes referral bonus (if first collection)
   - Updates leaderboard rankings

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

### Issue: Dashboard Not Updating After Pickup Completion
**Solution**: The dashboard now auto-refreshes when:
- Window regains focus
- Tab becomes visible
- Navigate back to the page

**Manual Refresh**: Click the "Refresh Data" button (Admin Dashboard)

### Issue: "Pickup must be accepted before completion" Error
**Solution**: 
- The pickup workflow requires: Pending → Accepted → Completed
- After accepting a pickup, the system automatically switches to the "Accepted" tab
- Click "Mark Complete" button in the Accepted tab
- The system validates status before allowing completion

### Issue: Collection Point Dashboard Not Showing Pickups
**Solution**: 
- Ensure you're logged in with a collection point account
- Check that pickups are assigned to your specific collection point
- Use the tab interface to filter by status (Pending/Accepted/Completed/Rejected)
- Auto-refresh is enabled on window focus

### Issue: CORS Error
**Solution**:
```javascript
// backend/src/server.js - Already configured
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```
Verify `FRONTEND_URL` in backend `.env` matches your frontend URL.

### Issue: MongoDB Connection Error
**Solutions**:
- Verify MongoDB is running: `mongod` or check MongoDB Compass
- Check connection string in backend `.env`
- For MongoDB Atlas: Whitelist your IP address
- Check network/firewall settings
- Verify database name in connection string

### Issue: Port Already in Use
**Solution**:
```bash
# Windows (PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process

# Or change port in backend/.env
PORT=5001
```

### Issue: Login Not Working / Token Errors
**Solutions**:
- Clear browser localStorage: `localStorage.clear()` in console
- Verify JWT_SECRET is set in backend `.env` (min 32 characters)
- Check that backend is running on correct port
- Verify VITE_API_URL in frontend `.env`
- Check browser console for specific error messages

### Issue: Points Not Updating
**Solution**: 
- Points are calculated: quantity × 10 + first collection bonus
- Ensure pickup is marked as "completed" (not just accepted)
- Dashboard auto-updates on window focus
- Check transaction history in user profile

### Issue: Auto-Refresh Not Working
**Solution**:
- Auto-refresh triggers on window focus and visibility change
- If using multiple tabs, switch away and back to trigger refresh
- Use manual refresh buttons where available
- Check browser console for any JavaScript errors

## � Key Workflows

### 1. Citizen Pickup Workflow
```
1. Citizen registers/logs in at /citizen-login
2. Navigates to /schedule-pickup
3. Selects collection point from map
4. Chooses date and time slot
5. Submits pickup request (Status: PENDING)
6. Tracks status in Dashboard
7. Receives points after completion
```

### 2. Collection Point Workflow
```
1. Collection Point logs in at /collection-point-login
2. Views Dashboard with tabbed interface
3. PENDING Tab: Sees new requests
4. Clicks "Accept" → Auto-switches to ACCEPTED tab
5. ACCEPTED Tab: Clicks "Mark Complete"
6. Enters quantity collected
7. Pickup moves to COMPLETED tab
8. Stats update automatically
```

### 3. Points Award Flow
```
1. Collection Point marks pickup complete
2. Backend calculates: quantity × 10 points
3. First collection? Add 50 bonus points
4. Transaction record created
5. User's totalCollected updated
6. Leaderboard rankings updated
7. Dashboard auto-refreshes on focus
```

## 🔧 Technical Highlights

### Auto-Refresh Implementation
- Dashboard components use `window.addEventListener('focus')` and `document.addEventListener('visibilitychange')`
- Prevents infinite loops with empty dependency arrays
- Conditional updates only when data actually changes
- Reduces unnecessary re-renders

### Pickup Status Management
- Pre-validation before API calls prevents backend errors
- Automatic tab switching for better UX
- Clear error messages with actionable guidance
- Null-safe rendering prevents undefined errors

### Data Consistency
- User context updates synchronized with localStorage
- Backend returns full populated user data
- Frontend validates data structure before updates
- Transaction records maintain audit trail

## 🎨 UI/UX Features

### Responsive Design
- Mobile-first Tailwind CSS approach
- Adaptive layouts for all screen sizes
- Touch-friendly interactive elements
- Optimized map controls for mobile

### User Feedback
- Toast notifications for all actions
- Loading states during API calls
- Status badges with color coding
- Empty states with helpful messages

### Navigation
- Three separate login portals for role clarity
- Protected routes with role-based access
- Auto-redirect based on authentication state
- Breadcrumb navigation for context

## 🔄 Future Enhancements

- [ ] Mobile app (React Native)
- [ ] SMS/Email notifications for pickup status changes
- [ ] Real-time chat support between citizens and collection points
- [ ] Payment integration for reward redemption
- [ ] QR code generation for pickups
- [ ] Multi-language support (Hindi, Tamil, Telugu, etc.)
- [ ] Push notifications via Service Workers
- [ ] Advanced analytics with charts and graphs
- [ ] Social media sharing of environmental impact
- [ ] Bulk pickup scheduling for organizations
- [ ] Medicine donation tracking
- [ ] Integration with pharmacy inventory systems
- [ ] Gamification enhancements (achievements, streaks)
- [ ] Community forums and discussions

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
- **Repository**: [github.com/bni-7/medireturn](https://github.com/bni-7/medireturn)


## 🙏 Acknowledgments

- OpenStreetMap for map data
- Leaflet and React Leaflet for map integration
- Unsplash for placeholder images
- Lucide React for beautiful icons
- React community for excellent documentation
- Node.js and Express.js communities
- MongoDB for scalable database solution
- Tailwind CSS for utility-first styling

## 📞 Support

For support and queries:
-  Issues: [GitHub Issues](https://github.com/bni-7/medireturn/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/bni-7/medireturn/discussions)
- 📧 Email: Contact through GitHub profile

## 📱 Screenshots

### Home Page
![Home](screenshots/home.png)
*Landing page with three login portals and platform overview*

### Interactive Map
![Map](screenshots/map.png)
*Find collection points with filters and detailed information*

### Citizen Dashboard
![Dashboard](screenshots/dashboard.png)
*Track stats, points, leaderboard, and recent pickups*

### Schedule Pickup
![Schedule](screenshots/schedule.png)
*Easy pickup scheduling with date and time selection*

### Collection Point Dashboard
![CP Dashboard](screenshots/cp-dashboard.png)
*Manage pickup requests with tabbed interface*

### Admin Analytics
![Admin](screenshots/admin.png)
*Platform-wide analytics and monitoring*

---

**Made with ❤️ for a healthier and safer India**

**🌟 Star this repo if you find it helpful!**

## 📝 Changelog

### Version 1.0.0 (Current)
- ✅ Three-tier authentication system
- ✅ Complete pickup workflow with status management
- ✅ Points-based reward system (badges removed)
- ✅ Auto-refresh functionality on all dashboards
- ✅ 5 pre-seeded collection points
- ✅ Interactive map with OpenStreetMap
- ✅ Real-time updates and notifications
- ✅ City-based leaderboards
- ✅ Referral system with bonuses
- ✅ Comprehensive error handling
- ✅ Responsive design for all devices
