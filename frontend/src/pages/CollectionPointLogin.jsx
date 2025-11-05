import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, MapPin } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { validateEmail, validateRequired } from '../utils/validators';

const CollectionPointLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (error) {
      setError('');
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!validateRequired(formData.email)) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (!validateRequired(formData.password)) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    setError('');
    setLoading(true);

    try {
      const result = await login({ ...formData, expectedRole: 'collection_point' });
      
      if (result.success) {
        if (result.user.role !== 'collection_point') {
          setError('Access denied. Collection point credentials required.');
          return;
        }
        
        await new Promise(resolve => setTimeout(resolve, 300));
        navigate('/collection-point-dashboard', { replace: true });
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      console.error('Collection point login error:', err);
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
              <MapPin className="text-white" size={32} />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Collection Point Portal</h2>
          <p className="mt-2 text-gray-600">Sign in to manage your collection point</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="collectionpoint@example.com"
              error={errors.email}
              icon={Mail}
              required
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                error={errors.password}
                icon={Lock}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={loading}
              className="bg-teal-600 hover:bg-teal-700"
            >
              Sign In
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Other login options</span>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <Link to="/citizen-login" className="flex-1 text-center text-sm text-teal-600 hover:text-teal-700 font-medium">
                Citizen Login
              </Link>
              <Link to="/admin-login" className="flex-1 text-center text-sm text-teal-600 hover:text-teal-700 font-medium">
                Admin Portal
              </Link>
            </div>
          </div>
        </div>

        {/* Note */}
        <div className="mt-6 bg-teal-50 rounded-lg p-4 text-sm text-teal-800">
          <p className="font-medium mb-3">📍 Available Collection Point Accounts:</p>
          <div className="space-y-2 text-xs">
            <div className="bg-white p-2 rounded">
              <p><strong>Apollo Pharmacy (Mumbai)</strong></p>
              <p>Email: apollo.mumbai@pharmacy.com</p>
              <p>Password: password123</p>
            </div>
            <div className="bg-white p-2 rounded">
              <p><strong>Fortis Hospital (Delhi)</strong></p>
              <p>Email: fortis.delhi@hospital.com</p>
              <p>Password: password123</p>
            </div>
            <div className="bg-white p-2 rounded">
              <p><strong>Medlife Pharmacy (Bangalore)</strong></p>
              <p>Email: medlife.bangalore@pharmacy.com</p>
              <p>Password: password123</p>
            </div>
            <div className="bg-white p-2 rounded">
              <p><strong>Green Health NGO (Pune)</strong></p>
              <p>Email: greenhealth.pune@ngo.org</p>
              <p>Password: password123</p>
            </div>
            <div className="bg-white p-2 rounded">
              <p><strong>City Clinic (Chennai)</strong></p>
              <p>Email: cityclinic.chennai@clinic.com</p>
              <p>Password: password123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionPointLogin;
