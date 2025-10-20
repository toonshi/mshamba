import React, { useState, useEffect } from 'react';
import { User, MapPin, Phone, Check } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export const UserRegistration = () => {
  const { actor } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [existingProfile, setExistingProfile] = useState(null);

  const [formData, setFormData] = useState({
    role: 'Farmer',
    name: '',
    phoneNumber: '',
    latitude: '',
    longitude: '',
    address: '',
    region: '',
    country: 'Kenya',
  });

  const roles = [
    { id: 'Farmer', name: 'Farmer', description: 'I grow crops and buy inputs' },
    { id: 'Supplier', name: 'Supplier', description: 'I sell seeds, fertilizers, tools' },
    { id: 'ServiceProvider', name: 'Service Provider', description: 'I provide transport, labor, storage' },
    { id: 'Buyer', name: 'Buyer', description: 'I buy agricultural products' },
  ];

  // Check if user already has a profile
  useEffect(() => {
    checkExistingProfile();
  }, [actor]);

  const checkExistingProfile = async () => {
    if (!actor) return;
    
    try {
      const profile = await actor.getMyProfile();
      if (profile.length > 0) {
        setExistingProfile(profile[0]);
        
        // Pre-fill form
        const userRole = Object.keys(profile[0].role)[0];
        setFormData({
          role: userRole,
          name: profile[0].name,
          phoneNumber: profile[0].phoneNumber.length > 0 ? profile[0].phoneNumber[0] : '',
          latitude: profile[0].location.length > 0 ? profile[0].location[0].latitude.toString() : '',
          longitude: profile[0].location.length > 0 ? profile[0].location[0].longitude.toString() : '',
          address: profile[0].location.length > 0 ? profile[0].location[0].address : '',
          region: profile[0].location.length > 0 ? profile[0].location[0].region : '',
          country: profile[0].location.length > 0 ? profile[0].location[0].country : 'Kenya',
        });
      }
    } catch (error) {
      console.error('Error checking profile:', error);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString(),
          }));
          alert('✅ Location captured!');
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
      alert('Please sign in first');
      return;
    }

    if (!formData.name || !formData.region) {
      alert('Please fill in your name and region');
      return;
    }

    setLoading(true);

    try {
      const roleVariant = { [formData.role]: null };
      
      const location = formData.latitude && formData.longitude ? [{
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        address: formData.address,
        region: formData.region,
        country: formData.country,
      }] : [];

      const phoneNumber = formData.phoneNumber ? [formData.phoneNumber] : [];

      const result = await actor.registerUser(
        roleVariant,
        formData.name,
        location,
        phoneNumber
      );

      if ('ok' in result) {
        alert(existingProfile ? '✅ Profile updated successfully!' : '✅ Registration successful!');
        navigate('/marketplace');
      } else {
        throw new Error(result.err);
      }
    } catch (error) {
      console.error('Error registering user:', error);
      alert('Registration failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-bold mb-2">
            {existingProfile ? 'Update Profile' : 'Complete Your Profile'}
          </h1>
          <p className="text-gray-400">
            {existingProfile ? 'Update your marketplace profile' : 'Join the Mshamba marketplace'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-gray-800 rounded-xl p-8 space-y-6">
          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium mb-3">
              I am a... <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {roles.map(role => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, role: role.id }))}
                  className={`p-4 rounded-lg text-left transition-all ${
                    formData.role === role.id
                      ? 'bg-green-600 ring-2 ring-green-400'
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold">{role.name}</span>
                    {formData.role === role.id && <Check className="w-5 h-5" />}
                  </div>
                  <p className="text-sm text-gray-300">{role.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., John Kamau"
              className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Phone Number (Optional)
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="+254 712 345 678"
                className="w-full pl-10 pr-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Location <span className="text-red-500">*</span>
            </label>
            
            <div className="space-y-3">
              {/* Region */}
              <input
                type="text"
                name="region"
                value={formData.region}
                onChange={handleChange}
                placeholder="Region (e.g., Nakuru, Kiambu)"
                className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />

              {/* Address */}
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Address (Optional)"
                className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />

              {/* Coordinates */}
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  placeholder="Latitude"
                  className="px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="text"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  placeholder="Longitude"
                  className="px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <button
                type="button"
                onClick={getCurrentLocation}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                <MapPin size={18} />
                <span>Get Current Location</span>
              </button>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
            <p className="text-sm text-blue-300">
              💡 Your location helps farmers find nearby suppliers and services. 
              Only your region is displayed publicly.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Check size={20} />
                <span>{existingProfile ? 'Update Profile' : 'Complete Registration'}</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserRegistration;
