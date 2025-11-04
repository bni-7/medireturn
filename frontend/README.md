# MediReturn Frontend

React-based frontend application for the MediReturn prescription drug take-back platform.

## 🚀 Tech Stack

- **React 18** - UI Library
- **Vite** - Build Tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP Client
- **React Leaflet** - Maps Integration
- **Lucide React** - Icons
- **React Hot Toast** - Notifications
- **Recharts** - Data Visualization

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- Backend API running on `http://localhost:5000`

## 🛠️ Installation

### 1. Clone the repository

```bash
cd frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Setup

Create `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 📁 Project Structure

```
frontend/
├── src/
│   ├── api/                # API service calls
│   │   ├── admin.js
│   │   ├── auth.js
│   │   ├── axios.js
│   │   ├── collectionPoints.js
│   │   ├── pickups.js
│   │   └── users.js
│   │
│   ├── components/         # Reusable components
│   │   ├── auth/          # Authentication components
│   │   ├── common/        # Common UI components
│   │   ├── dashboard/     # Dashboard components
│   │   └── layout/        # Layout components
│   │
│   ├── context/           # React Context providers
│   │   ├── AuthContext.jsx
│   │   └── ToastContext.jsx
│   │
│   ├── hooks/             # Custom React hooks
│   │   ├── useAuth.js
│   │   ├── useGeolocation.js
│   │   └── useToast.js
│   │
│   ├── pages/             # Page components
│   │   ├── Dashboard.jsx
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Map.jsx
│   │   ├── NotFound.jsx
│   │   ├── Profile.jsx
│   │   ├── SchedulePickup.jsx
│   │   └── Signup.jsx
│   │
│   ├── utils/             # Utility functions
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   └── validators.js
│   │
│   ├── App.jsx            # Main App component
│   ├── index.css          # Global styles
│   └── main.jsx           # Entry point
│
├── public/                # Static assets
├── index.html             # HTML template
├── package.json           # Dependencies
├── tailwind.config.js     # Tailwind configuration
├── vite.config.js         # Vite configuration
└── vercel.json           # Vercel deployment config
```

## 🎨 Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🔑 Key Features

### Authentication
- User registration (Citizen & Collection Point)
- Login/Logout
- Protected routes
- Session management

### Citizen Features
- Find collection points on map
- Schedule medicine pickups
- Track pickup status
- View collection history
- Earn points and badges
- City leaderboard
- Referral system

### Collection Point Features
- Manage pickup requests
- Accept/Reject requests
- Mark pickups as completed
- View collection statistics
- Track monthly performance

### Map Integration
- Interactive map with Leaflet
- Search and filter collection points
- Get directions to locations
- View operating hours
- Distance calculation

## 🎯 User Roles

### 1. Citizen
- Schedule pickups
- Track collections
- Earn rewards
- View leaderboard

### 2. Collection Point
- Manage pickup requests
- View dashboard
- Track statistics

### 3. Admin (Backend only)
- Approve collection points
- View analytics
- Manage users

## 🌐 API Integration

The frontend communicates with the backend API using Axios. All API calls are centralized in the `src/api/` directory.

### API Services:
- **auth.js** - Authentication endpoints
- **users.js** - User management
- **collectionPoints.js** - Collection point operations
- **pickups.js** - Pickup scheduling and management
- **admin.js** - Admin operations

### API Configuration:
```javascript
// src/api/axios.js
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true
});
```

## 🎨 Styling

### Tailwind CSS
The project uses Tailwind CSS for styling with custom configuration:

```javascript
// tailwind.config.js
theme: {
  extend: {
    colors: {
      primary: { /* custom green palette */ }
    },
    animation: {
      'fade-in': 'fadeIn 0.3s ease-in-out',
      'slide-up': 'slideUp 0.3s ease-out'
    }
  }
}
```

### Component Variants
```javascript
// Common button variants
<Button variant="primary" />    // Green button
<Button variant="secondary" />  // Gray button
<Button variant="outline" />    // Outlined button
<Button variant="danger" />     // Red button
<Button variant="success" />    // Success button
```

## 🗺️ Map Integration

Uses React Leaflet for interactive maps:

```javascript
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

<MapContainer center={[lat, lng]} zoom={13}>
  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
  <Marker position={[lat, lng]}>
    <Popup>Location Name</Popup>
  </Marker>
</MapContainer>
```

## 🔔 Notifications

Uses React Hot Toast for notifications:

```javascript
import { useToast } from '../hooks/useToast';

const { showSuccess, showError } = useToast();

showSuccess('Operation successful!');
showError('Something went wrong!');
```

## 🛡️ Protected Routes

Routes are protected based on authentication status:

```javascript
<Route path="/dashboard" element={
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
} />
```

## 📱 Responsive Design

The application is fully responsive:
- Mobile-first approach
- Breakpoints: `sm`, `md`, `lg`, `xl`
- Hamburger menu on mobile
- Optimized layouts for all screen sizes

## 🚀 Deployment

### Vercel (Recommended)

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy**
```bash
vercel --prod
```

4. **Environment Variables**
Add in Vercel dashboard:
```
VITE_API_URL=https://your-backend-url.com/api
```

### Manual Deployment

1. **Build the project**
```bash
npm run build
```

2. **Deploy `dist` folder to any static hosting:**
   - Netlify
   - GitHub Pages
   - AWS S3
   - Firebase Hosting

## 🔧 Configuration Files

### vite.config.js
```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
});
```

### vercel.json
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## 🐛 Troubleshooting

### CORS Issues
If you encounter CORS errors:
1. Ensure backend is configured to allow your frontend URL
2. Check that `withCredentials: true` is set in axios config

### Map Not Loading
1. Check if Leaflet CSS is imported
2. Verify internet connection (maps use external tiles)
3. Check browser console for errors

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite
```

### Environment Variables Not Working
- Ensure `.env` file is in the root of `frontend/` directory
- Variable names must start with `VITE_`
- Restart dev server after changes

## 📊 Performance Optimization

### Code Splitting
Pages are lazy-loaded using React.lazy:
```javascript
const Home = lazy(() => import('./pages/Home'));
```

### Image Optimization
- Use WebP format when possible
- Lazy load images
- Use appropriate image sizes

### Bundle Size
```bash
# Analyze bundle size
npm run build
npx vite-bundle-visualizer
```

## 🔐 Security Best Practices

1. **Environment Variables**
   - Never commit `.env` files
   - Use `VITE_` prefix for public variables
   - Keep sensitive keys on backend only

2. **Authentication**
   - Tokens stored in HTTP-only cookies (backend)
   - Protected routes implemented
   - Automatic logout on session expiry

3. **Input Validation**
   - Client-side validation for UX
   - Server-side validation for security
   - XSS protection with React's built-in escaping

## 📚 Learning Resources

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev/guide)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React Router](https://reactrouter.com)
- [Leaflet Documentation](https://leafletjs.com)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Development Team

Built with ❤️ for making communities healthier and safer.

## 📞 Support

For issues and questions:
- GitHub Issues
- Email: support@medireturn.com

---

**Happy Coding! 🚀**