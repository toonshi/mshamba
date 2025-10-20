import React, { useState, useEffect } from 'react';
import { Package, DollarSign, MapPin, Image, Plus } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export const CreateListing = () => {
  const { actor } = useAuth();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    category: 'Seeds',
    title: '',
    description: '',
    priceInCkUSDC: '',
    unit: 'kg',
    quantity: '',
    latitude: '',
    longitude: '',
    address: '',
    region: '',
    country: 'Kenya',
  });

  const categories = [
    'Seeds',
    'Fertilizers',
    'Pesticides',
    'Tools',
    'Equipment',
    'Transport',
    'Labor',
    'Storage',
    'Processing',
  ];

  const units = [
    'kg', 'bag', 'liter', 'piece', 'hour', 'day', 'trip', 'acre', 'hectare'
  ];

  // Load user profile
  useEffect(() => {
    loadProfile();
  }, [actor]);

  const loadProfile = async () => {
    if (!actor) return;
    
    try {
      const profile = await actor.getMyProfile();
      if (profile.length > 0) {
        setUserProfile(profile[0]);
        
        // Pre-fill location if available
        if (profile[0].location && profile[0].location.length > 0) {
          const loc = profile[0].location[0];
          setFormData(prev => ({
            ...prev,
            latitude: loc.latitude.toString(),
            longitude: loc.longitude.toString(),
            address: loc.address,
            region: loc.region,
            country: loc.country,
          }));
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  // Get current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString(),
          }));
          alert('Location captured!');
        },
        (error) => {
          alert('Could not get location: ' + error.message);
        }
      );
    } else {
      alert('Geolocation is not supported by your browser');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!actor) {
      alert('Please sign in to create a listing');
      return;
    }

    // Validate
    if (!formData.title || !formData.description || !formData.priceInCkUSDC || !formData.quantity) {
      alert('Please fill in all required fields');
      return;
    }

    if (!formData.latitude || !formData.longitude) {
      alert('Please provide location (use "Get Current Location" button)');
      return;
    }

    setLoading(true);

    try {
      // Convert price to smallest units (6 decimals for ckUSDC)
      const priceInSmallestUnits = Math.floor(parseFloat(formData.priceInCkUSDC) * 1_000_000);
      
      const location = {
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        address: formData.address,
        region: formData.region,
        country: formData.country,
      };

      // Create category variant
      const categoryVariant = { [formData.category]: null };

      const result = await actor.createListing(
        categoryVariant,
        formData.title,
        formData.description,
        priceInSmallestUnits,
        formData.unit,
        parseInt(formData.quantity),
        location,
        [] // images array (empty for MVP)
      );

      if ('ok' in result) {
        alert('✅ Listing created successfully!');
        navigate('/marketplace');
      } else {
        throw new Error(result.err);
      }
    } catch (error) {
      console.error('Error creating listing:', error);
      alert('Failed to create listing: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Loading...</h2>
          <p className="text-gray-400">Please wait while we load your profile</p>
        </div>
      </div>
    );
  }

  // Check if user can create listings
  const userRole = Object.keys(userProfile.role)[0];
  if (userRole !== 'Supplier' && userRole !== 'ServiceProvider') {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-gray-400 mb-4">Only Suppliers and Service Providers can create listings</p>
          <button
            onClick={() => navigate('/marketplace')}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
          >
            Back to Marketplace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Create New Listing</h1>
          <p className="text-gray-400">List your products or services on the marketplace</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-gray-800 rounded-xl p-8 space-y-6">
          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Hybrid Maize Seeds H614"
              className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your product or service..."
              rows="4"
              className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* Price and Unit */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Price (ckUSDC) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="number"
                  name="priceInCkUSDC"
                  value={formData.priceInCkUSDC}
                  onChange={handleChange}
                  step="0.01"
                  placeholder="0.00"
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Unit <span className="text-red-500">*</span>
              </label>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {units.map(unit => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Available Quantity <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="e.g., 100"
              className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Location <span className="text-red-500">*</span>
            </label>
            
            <div className="grid grid-cols-2 gap-4 mb-3">
              <input
                type="text"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                placeholder="Latitude"
                className="px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
              <input
                type="text"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                placeholder="Longitude"
                className="px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <button
              type="button"
              onClick={getCurrentLocation}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors mb-3"
            >
              <MapPin size={18} />
              <span>Get Current Location</span>
            </button>

            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="region"
                value={formData.region}
                onChange={handleChange}
                placeholder="Region (e.g., Nakuru)"
                className="px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Address"
                className="px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => navigate('/marketplace')}
              className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Plus size={20} />
                  <span>Create Listing</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateListing;
