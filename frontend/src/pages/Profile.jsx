import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Edit2, Save, X } from 'lucide-react';
import toast from 'react-hot-toast'; // ✅ Import react-hot-toast
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { useAuth } from '../hooks/useAuth';
import { authAPI } from '../api/auth'; // ✅ Changed from usersAPI
import { usersAPI } from '../api/users';
import { validatePhone, validatePincode, validateRequired } from '../utils/validators';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: {
      street: user?.address?.street || '',
      city: user?.address?.city || '',
      state: user?.address?.state || '',
      pincode: user?.address?.pincode || ''
    }
  });
  const [errors, setErrors] = useState({});

  // Fetch latest user profile data on mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await usersAPI.getProfile();
        if (response.success && response.user) {
          // Update the user context with latest data
          updateUser(response.user);
          // Update form data as well
          setFormData({
            name: response.user.name || '',
            phone: response.user.phone || '',
            address: {
              street: response.user.address?.street || '',
              city: response.user.address?.city || '',
              state: response.user.address?.state || '',
              pincode: response.user.address?.pincode || ''
            }
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        // Don't show error toast, just use cached data
      }
    };

    if (user) {
      fetchUserProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Clear error
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!validateRequired(formData.name)) {
      newErrors.name = 'Name is required';
    }

    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone = 'Invalid phone number';
    }

    if (!validateRequired(formData.address.street)) {
      newErrors['address.street'] = 'Street is required';
    }

    if (!validateRequired(formData.address.city)) {
      newErrors['address.city'] = 'City is required';
    }

    // ✅ Added state validation
    if (!validateRequired(formData.address.state)) {
      newErrors['address.state'] = 'State is required';
    }

    if (!validateRequired(formData.address.pincode)) {
      newErrors['address.pincode'] = 'Pincode is required';
    } else if (!validatePincode(formData.address.pincode)) {
      newErrors['address.pincode'] = 'Invalid pincode';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error('Please fix all errors'); // ✅ Changed
      return;
    }

    try {
      setLoading(true);
      console.log('Updating profile with:', formData); // ✅ Debug log
      
      const response = await authAPI.updateProfile(formData); // ✅ Changed to authAPI
      
      console.log('Profile update response:', response); // ✅ Debug log
      
      updateUser(response.user || response.data);
      toast.success('Profile updated successfully'); // ✅ Changed
      setIsEditing(false);
    } catch (error) {
      console.error('Profile update error:', error); // ✅ Debug log
      toast.error(error.response?.data?.message || 'Failed to update profile'); // ✅ Changed
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      phone: user?.phone || '',
      address: {
        street: user?.address?.street || '',
        city: user?.address?.city || '',
        state: user?.address?.state || '',
        pincode: user?.address?.pincode || ''
      }
    });
    setErrors({});
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
          <p className="text-gray-600">Manage your account information</p>
        </div>

        {/* Profile Header */}
        <Card className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
                <p className="text-gray-600">{user?.email}</p>
                <div className="mt-2">
                  <Badge variant="primary">
                    {user?.role === 'citizen' ? 'Citizen' : 'Collection Point'}
                  </Badge>
                </div>
              </div>
            </div>
            {!isEditing && (
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2"
              >
                <Edit2 size={18} />
                Edit Profile
              </Button>
            )}
          </div>
        </Card>

        {/* Profile Form */}
        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Input
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing}
                error={errors.name}
                icon={User}
                required
              />

              <Input
                label="Email"
                type="email"
                value={user?.email}
                disabled
                icon={Mail}
              />

              <Input
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!isEditing}
                error={errors.phone}
                icon={Phone}
                placeholder="10-digit mobile number"
              />

              <Input
                label="Role"
                value={user?.role === 'citizen' ? 'Citizen' : 'Collection Point'}
                disabled
                icon={User}
              />
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin size={20} />
                Address Information
              </h3>

              <div className="space-y-4">
                <Input
                  label="Street Address"
                  name="address.street"
                  value={formData.address.street}
                  onChange={handleChange}
                  disabled={!isEditing}
                  error={errors['address.street']}
                  placeholder="House no, Street, Area"
                  required
                />

                <div className="grid md:grid-cols-3 gap-4">
                  <Input
                    label="City"
                    name="address.city"
                    value={formData.address.city}
                    onChange={handleChange}
                    disabled={!isEditing}
                    error={errors['address.city']}
                    placeholder="Enter city"
                    required
                  />

                  <Input
                    label="State"
                    name="address.state"
                    value={formData.address.state}
                    onChange={handleChange}
                    disabled={!isEditing}
                    error={errors['address.state']}
                    placeholder="Enter state"
                    required
                  />

                  <Input
                    label="Pincode"
                    name="address.pincode"
                    value={formData.address.pincode}
                    onChange={handleChange}
                    disabled={!isEditing}
                    error={errors['address.pincode']}
                    placeholder="6-digit pincode"
                    maxLength={6}
                    required
                  />
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleCancel}
                  className="flex items-center gap-2"
                >
                  <X size={18} />
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  loading={loading}
                  className="flex items-center gap-2"
                >
                  <Save size={18} />
                  Save Changes
                </Button>
              </div>
            )}
          </form>
        </Card>

        {/* Stats Card */}
        {user?.role === 'citizen' && (
          <Card className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Your Impact
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary-600">
                  {user?.totalCollected || 0}kg
                </p>
                <p className="text-sm text-gray-600 mt-1">Total Collected</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-primary-600">
                  {user?.points || 0}
                </p>
                <p className="text-sm text-gray-600 mt-1">Points Earned</p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Profile;