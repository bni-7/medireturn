import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api/auth';
import { toast } from 'react-hot-toast';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false); // ✅ Prevent re-initialization

  // Load user on mount - ONLY ONCE
  useEffect(() => {
    if (initialized) return; // ✅ Skip if already initialized

    const loadUser = () => {
      try {
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        
        console.log('🔄 Loading user from localStorage:', { 
          hasToken: !!token, 
          hasSavedUser: !!savedUser 
        });
        
        if (token && savedUser) {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          console.log('✅ User restored from localStorage:', parsedUser.email);
        } else {
          console.log('❌ No user in localStorage');
        }
      } catch (error) {
        console.error('❌ Error loading user:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
        setInitialized(true); // ✅ Mark as initialized
      }
    };

    loadUser();
  }, [initialized]); // ✅ Add initialized to deps

  const login = async (credentials) => {
    try {
      console.log('🔐 Attempting login...', credentials.expectedRole ? `(Expected role: ${credentials.expectedRole})` : '');
      const response = await authAPI.login(credentials);
      console.log('📥 Login response received');

      if (response.success && response.token && response.user) {
        // ✅ Check if user role matches expected role (if provided)
        if (credentials.expectedRole && response.user.role !== credentials.expectedRole) {
          const roleNames = {
            admin: 'Administrator',
            collection_point: 'Collection Point',
            citizen: 'Citizen'
          };
          const expectedRoleName = roleNames[credentials.expectedRole] || credentials.expectedRole;
          const actualRoleName = roleNames[response.user.role] || response.user.role;
          
          const message = `Access denied. This login is for ${expectedRoleName} accounts only. You are logged in as ${actualRoleName}.`;
          toast.error(message);
          return { success: false, error: message, user: response.user };
        }

        // ✅ Save to localStorage FIRST
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        console.log('💾 Token saved to localStorage');
        console.log('💾 User saved to localStorage:', response.user.email);
        
        // ✅ Then update state
        setUser(response.user);
        
        console.log('✅ Login successful, state updated');
        toast.success(`Welcome back, ${response.user.name}!`);
        
        return { success: true, user: response.user };
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      const message = error.response?.data?.message || error.message || 'Login failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const register = async (userData) => {
    try {
      console.log('📝 Attempting registration...');
      const response = await authAPI.register(userData);
      console.log('📥 Registration response received');

      if (response.success && response.token && response.user) {
        // ✅ Save to localStorage FIRST
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        console.log('💾 Token saved to localStorage');
        console.log('💾 User saved to localStorage:', response.user.email);
        
        // ✅ Then update state
        setUser(response.user);
        
        console.log('✅ Registration successful, state updated');
        toast.success('Registration successful!');
        
        return { success: true };
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      console.error('❌ Registration error:', error);
      const message = error.response?.data?.message || 
                      error.response?.data?.error || 
                      error.message || 
                      'Registration failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const logout = () => {
    console.log('👋 Logging out...');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    toast.success('Logged out successfully');
  };

  const updateUser = (userData) => {
    console.log('🔄 Updating user:', userData.email);
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;