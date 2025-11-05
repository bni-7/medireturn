import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import CollectionPointLogin from './pages/CollectionPointLogin';
import CitizenLogin from './pages/CitizenLogin';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import CollectionPointDashboard from './pages/CollectionPointDashboard';
import CollectionPoints from './pages/CollectionPoints';
import SchedulePickup from './pages/SchedulePickup';
import Profile from './pages/Profile';
import Map from './pages/Map';
import NotFound from './pages/NotFound';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Public Route Component
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }
  
  if (user) {
    // Redirect based on user role
    if (user.role === 'admin') {
      return <Navigate to="/admin" replace />;
    } else if (user.role === 'collection_point') {
      return <Navigate to="/collection-point-dashboard" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

// Admin Route Component
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/admin-login" replace />;
  }
  
  if (user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

// Collection Point Route Component
const CollectionPointRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/collection-point-login" replace />;
  }
  
  if (user.role !== 'collection_point') {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

// ✅ Layout wrapper component - must be inside Router and AuthProvider
const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        
        <Routes>
          {/* Public Routes with Layout */}
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/collection-points" element={<Layout><CollectionPoints /></Layout>} />
          <Route path="/map" element={<Layout><Map /></Layout>} />
          
          {/* Auth Routes - No Header/Footer */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />
          <Route 
            path="/admin-login" 
            element={
              <PublicRoute>
                <AdminLogin />
              </PublicRoute>
            } 
          />
          <Route 
            path="/collection-point-login" 
            element={
              <PublicRoute>
                <CollectionPointLogin />
              </PublicRoute>
            } 
          />
          <Route 
            path="/citizen-login" 
            element={
              <PublicRoute>
                <CitizenLogin />
              </PublicRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } 
          />
          
          {/* Protected Routes with Layout */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/schedule-pickup" 
            element={
              <ProtectedRoute>
                <Layout>
                  <SchedulePickup />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Layout>
                  <Profile />
                </Layout>
              </ProtectedRoute>
            } 
          />

          {/* Admin Routes with Layout */}
          <Route 
            path="/admin" 
            element={
              <AdminRoute>
                <Layout>
                  <AdminDashboard />
                </Layout>
              </AdminRoute>
            } 
          />

          {/* Collection Point Routes with Layout */}
          <Route 
            path="/collection-point-dashboard" 
            element={
              <CollectionPointRoute>
                <Layout>
                  <CollectionPointDashboard />
                </Layout>
              </CollectionPointRoute>
            } 
          />

          {/* 404 with Layout */}
          <Route path="*" element={<Layout><NotFound /></Layout>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;