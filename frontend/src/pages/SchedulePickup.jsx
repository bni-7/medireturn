import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Calendar, Clock, Package, Phone } from "lucide-react";
import toast from 'react-hot-toast'; // ✅ Import react-hot-toast directly
import { collectionPointsAPI } from "../api/collectionPoints";
import { pickupsAPI } from "../api/pickups";
import { useAuth } from "../hooks/useAuth";

const TIME_SLOTS = [
  '09:00 AM - 12:00 PM',
  '12:00 PM - 03:00 PM',
  '03:00 PM - 06:00 PM',
  '06:00 PM - 09:00 PM'
];

const SchedulePickup = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [collectionPoints, setCollectionPoints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    collectionPoint: "",
    pickupDate: "",
    timeSlot: "",
    medicineDetails: "",
    estimatedQuantity: "",
    contactPhone: user?.phone || "",
    alternatePhone: "",
    specialInstructions: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchCollectionPoints();
  }, []);

  // Helper function to format operating hours
  const formatOperatingHours = (operatingHours) => {
    if (!operatingHours || typeof operatingHours !== 'object') {
      return null;
    }
    
    // Check if it's a simple object with open/close times
    if (operatingHours.open && operatingHours.close) {
      return `${operatingHours.open} - ${operatingHours.close}`;
    }
    
    // Check if it's a weekly schedule - show today's hours
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    if (operatingHours[today] && !operatingHours[today].closed) {
      return `${operatingHours[today].open} - ${operatingHours[today].close}`;
    }
    
    return null;
  };

  const fetchCollectionPoints = async () => {
    try {
      const response = await collectionPointsAPI.getAll();
      
      let points = [];
      if (Array.isArray(response)) {
        points = response;
      } else if (response.data && Array.isArray(response.data)) {
        points = response.data;
      } else if (response.collectionPoints && Array.isArray(response.collectionPoints)) {
        points = response.collectionPoints;
      }
      
      setCollectionPoints(points);
      
      if (points.length === 0) {
        toast('No collection points available at the moment', { icon: 'ℹ️' }); // ✅ Changed
      }
    } catch (error) {
      console.error("Error fetching collection points:", error);
      toast.error("Failed to load collection points"); // ✅ Changed
      setCollectionPoints([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.collectionPoint) {
      newErrors.collectionPoint = "Please select a collection point";
    }

    if (!formData.pickupDate) {
      newErrors.pickupDate = "Please select a pickup date";
    } else {
      const selectedDate = new Date(formData.pickupDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.pickupDate = "Pickup date cannot be in the past";
      }
    }

    if (!formData.timeSlot) {
      newErrors.timeSlot = "Please select a time slot";
    }

    if (!formData.medicineDetails) {
      newErrors.medicineDetails = "Please provide medicine details";
    }

    if (!formData.estimatedQuantity) {
      newErrors.estimatedQuantity = "Please provide estimated quantity";
    } else if (isNaN(formData.estimatedQuantity) || Number(formData.estimatedQuantity) <= 0) {
      newErrors.estimatedQuantity = "Please enter a valid quantity";
    }

    if (!formData.contactPhone) {
      newErrors.contactPhone = "Contact phone is required";
    } else if (!/^[6-9]\d{9}$/.test(formData.contactPhone)) {
      newErrors.contactPhone = "Please enter a valid Indian phone number";
    }

    if (formData.alternatePhone && !/^[6-9]\d{9}$/.test(formData.alternatePhone)) {
      newErrors.alternatePhone = "Please enter a valid Indian phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) {
    console.log('❌ Form validation failed'); // ✅ Add this
    toast.error("Please fix all errors before submitting");
    return;
  }
  console.log('✅ Form validation passed'); // ✅ Add this

  setLoading(true);
  try {
    const payload = {
      collectionPointId: formData.collectionPoint,
      pickupDate: formData.pickupDate,
      timeSlot: formData.timeSlot,
      medicineDetails: formData.medicineDetails,
      estimatedQuantity: Number(formData.estimatedQuantity),
      contactPhone: formData.contactPhone,
    };

    if (formData.alternatePhone) {
      payload.alternatePhone = formData.alternatePhone;
    }
    if (formData.specialInstructions) {
      payload.specialInstructions = formData.specialInstructions;
    }

    console.log('Submitting payload:', payload);

    const response = await pickupsAPI.schedule(payload);
    
    console.log('Success response:', response);

    toast.success("Pickup scheduled successfully!");
    setTimeout(() => navigate("/dashboard"), 1500);
  } catch (error) {
    console.error("Error scheduling pickup:", error);
    console.error("Error response:", error.response?.data);
    
    // Handle different error formats
    let errorMessage = "Failed to schedule pickup";
    
    if (error.response?.data) {
      const { message, errors } = error.response.data;
      
      if (errors && Array.isArray(errors)) {
        errorMessage = errors.join(', ');
      } else if (message) {
        errorMessage = message;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    toast.error(errorMessage);
  } finally {
    setLoading(false);
  }
};

  const today = new Date().toISOString().split("T")[0];

  const selectedCP = Array.isArray(collectionPoints) 
    ? collectionPoints.find((cp) => cp._id === formData.collectionPoint)
    : null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Schedule Pickup</h1>
          <p className="mt-2 text-gray-600">
            Schedule a pickup for your unused or expired medicines
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Collection Point Selection */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-primary-600" />
              Select Collection Point
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Collection Point *
              </label>
              <select
                name="collectionPoint"
                value={formData.collectionPoint}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.collectionPoint ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select a collection point</option>
                {collectionPoints.map((cp) => (
                  <option key={cp._id} value={cp._id}>
                    {cp.name} - {cp.address?.city || ''} ({cp.type})
                  </option>
                ))}
              </select>
              {errors.collectionPoint && (
                <p className="mt-1 text-sm text-red-600">{errors.collectionPoint}</p>
              )}
            </div>

            {/* Selected CP Details */}
            {selectedCP && (
              <div className="mt-4 p-4 bg-primary-50 rounded-lg border border-primary-200">
                <h3 className="font-semibold text-gray-900 mb-2">
                  {selectedCP.name}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {selectedCP.address?.street}, {selectedCP.address?.city},{" "}
                  {selectedCP.address?.state} - {selectedCP.address?.pincode}
                </p>
                {formatOperatingHours(selectedCP.operatingHours) && (
                  <div className="flex items-center text-sm text-gray-600 mb-1">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>
                      {formatOperatingHours(selectedCP.operatingHours)}
                    </span>
                  </div>
                )}
                {selectedCP.phone && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="w-4 h-4 mr-2" />
                    <span>{selectedCP.phone}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Pickup Schedule */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-primary-600" />
              Pickup Schedule
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pickup Date *
                </label>
                <input
                  type="date"
                  name="pickupDate"
                  value={formData.pickupDate}
                  onChange={handleChange}
                  min={today}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.pickupDate ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.pickupDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.pickupDate}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time Slot *
                </label>
                <select
                  name="timeSlot"
                  value={formData.timeSlot}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.timeSlot ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select time slot</option>
                  {TIME_SLOTS.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
                {errors.timeSlot && (
                  <p className="mt-1 text-sm text-red-600">{errors.timeSlot}</p>
                )}
              </div>
            </div>
          </div>

          {/* Medicine Details */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Package className="w-5 h-5 mr-2 text-primary-600" />
              Medicine Details
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Medicine Details *
                </label>
                <textarea
                  name="medicineDetails"
                  value={formData.medicineDetails}
                  onChange={handleChange}
                  rows="3"
                  placeholder="List the medicines you want to dispose (e.g., Paracetamol 500mg, Cough Syrup)"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.medicineDetails ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.medicineDetails && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.medicineDetails}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Quantity (in kg) *
                </label>
                <input
                  type="number"
                  name="estimatedQuantity"
                  value={formData.estimatedQuantity}
                  onChange={handleChange}
                  step="0.1"
                  min="0.1"
                  placeholder="e.g., 0.5"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.estimatedQuantity
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors.estimatedQuantity && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.estimatedQuantity}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Phone className="w-5 h-5 mr-2 text-primary-600" />
              Contact Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Phone *
                </label>
                <input
                  type="tel"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.contactPhone ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.contactPhone && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.contactPhone}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alternate Phone (Optional)
                </label>
                <input
                  type="tel"
                  name="alternatePhone"
                  value={formData.alternatePhone}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.alternatePhone ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.alternatePhone && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.alternatePhone}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Instructions (Optional)
              </label>
              <textarea
                name="specialInstructions"
                value={formData.specialInstructions}
                onChange={handleChange}
                rows="2"
                placeholder="Any special instructions for the pickup"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Scheduling..." : "Schedule Pickup"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SchedulePickup;