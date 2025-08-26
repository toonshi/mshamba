import React, { useState } from 'react';
import * as LucideIcons from 'lucide-react';

export const FarmListing = ({ onBack }) => {
  const [formData, setFormData] = useState({
    farmName: '',
    location: '',
    size: '',
    cropType: '',
    expectedYield: '',
    investmentNeeded: '',
    duration: '',
    expectedROI: '',
    description: '',
    farmerName: '',
    experience: '',
    phone: '',
    email: ''
  });

  const [images, setImages] = useState([]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages([...images, ...files]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Farm listing submitted successfully! It will be reviewed and published within 24 hours.');
    onBack();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white w-full">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <button 
            onClick={onBack}
            className="flex items-center space-x-2 text-green-400 hover:text-green-300 transition-colors"
          >
            <LucideIcons.ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
        </div>

        <div className="bg-gray-800 rounded-xl p-8">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
              <LucideIcons.Sprout className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">List Your Farm</h1>
              <p className="text-gray-400">Connect with investors and grow your agricultural business</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Farm Information */}
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <LucideIcons.MapPin className="w-5 h-5 mr-2 text-green-400" />
                Farm Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Farm Name *</label>
                  <input
                    type="text"
                    name="farmName"
                    value={formData.farmName}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500"
                    placeholder="e.g., Green Valley Farm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Location *</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500"
                    placeholder="e.g., Nakuru, Kenya"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Farm Size *</label>
                  <input
                    type="text"
                    name="size"
                    value={formData.size}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500"
                    placeholder="e.g., 50 acres"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Crop Type *</label>
                  <select
                    name="cropType"
                    value={formData.cropType}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500"
                  >
                    <option value="">Select crop type</option>
                    <option value="Maize">Maize</option>
                    <option value="Coffee">Coffee</option>
                    <option value="Vegetables">Vegetables</option>
                    <option value="Fruits">Fruits</option>
                    <option value="Beans">Beans</option>
                    <option value="Wheat">Wheat</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Investment Details */}
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <LucideIcons.DollarSign className="w-5 h-5 mr-2 text-green-400" />
                Investment Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Investment Needed *</label>
                  <input
                    type="number"
                    name="investmentNeeded"
                    value={formData.investmentNeeded}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500"
                    placeholder="e.g., 50000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Expected ROI (%) *</label>
                  <input
                    type="number"
                    name="expectedROI"
                    value={formData.expectedROI}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500"
                    placeholder="e.g., 18"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Duration *</label>
                  <select
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500"
                  >
                    <option value="">Select duration</option>
                    <option value="3 months">3 months</option>
                    <option value="6 months">6 months</option>
                    <option value="9 months">9 months</option>
                    <option value="12 months">12 months</option>
                    <option value="18 months">18 months</option>
                    <option value="24 months">24 months</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Expected Yield</label>
                  <input
                    type="text"
                    name="expectedYield"
                    value={formData.expectedYield}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500"
                    placeholder="e.g., 2000 bags"
                  />
                </div>
              </div>
            </div>

            {/* Farmer Information */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Farmer Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="farmerName"
                    value={formData.farmerName}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500"
                    placeholder="e.g., John Kamau"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Years of Experience</label>
                  <input
                    type="number"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500"
                    placeholder="e.g., 15"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500"
                    placeholder="e.g., +254 700 123 456"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500"
                    placeholder="e.g., john@example.com"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2">Farm Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500"
                placeholder="Describe your farm, farming methods, and what makes it special..."
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">Farm Images</label>
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
                <LucideIcons.Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">Upload farm images to attract investors</p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg cursor-pointer transition-colors"
                >
                  Choose Images
                </label>
                {images.length > 0 && (
                  <p className="text-green-400 mt-2">{images.length} image(s) selected</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={onBack}
                className="flex-1 bg-gray-600 hover:bg-gray-500 py-3 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-green-600 hover:bg-green-700 py-3 rounded-lg font-medium transition-colors"
              >
                Submit Farm Listing
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};