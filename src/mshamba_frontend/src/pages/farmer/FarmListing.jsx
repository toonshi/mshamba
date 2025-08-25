import React, { useState } from "react";
import {
  ArrowLeft,
  Upload,
  MapPin,
  DollarSign,
  Sprout,
  User,
  Clock,
  TrendingUp,
  FileText,
} from "lucide-react";

export const FarmListing = ({ onBack }) => {
  const [farms, setFarms] = useState([]);
  const [formData, setFormData] = useState({
    farmName: "",
    location: "",
    size: "",
    cropType: "",
    expectedYield: "",
    investmentNeeded: "",
    duration: "",
    expectedROI: "",
    description: "",
    farmerName: "",
    experience: "",
    phone: "",
    email: "",
  });
  const [images, setImages] = useState([]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages([...images, ...files]);
  };

  const handleAddFarm = (e) => {
    e.preventDefault();
    setFarms([...farms, { ...formData, images }]);

    setFormData({
      farmName: "",
      location: "",
      size: "",
      cropType: "",
      expectedYield: "",
      investmentNeeded: "",
      duration: "",
      expectedROI: "",
      description: "",
      farmerName: "",
      experience: "",
      phone: "",
      email: "",
    });
    setImages([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 w-full">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Farm Form */}
        <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 mb-6 sm:mb-8">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Sprout className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Add a Farm</h1>
              <p className="text-gray-500 text-sm sm:text-base">
                Fill in the details below and add your farm to the list
              </p>
            </div>
          </div>

          <div className="space-y-6 sm:space-y-8">
            {/* Farm Information */}
            <div>
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center text-gray-800">
                <MapPin className="w-5 h-5 mr-2 text-green-600" />
                Farm Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <input
                  type="text"
                  name="farmName"
                  value={formData.farmName}
                  onChange={handleInputChange}
                  placeholder="Farm Name"
                  className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
                  required
                />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Location"
                  className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
                  required
                />
                <input
                  type="text"
                  name="size"
                  value={formData.size}
                  onChange={handleInputChange}
                  placeholder="Farm Size (e.g., 5 acres)"
                  className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
                />
                <input
                  type="text"
                  name="cropType"
                  value={formData.cropType}
                  onChange={handleInputChange}
                  placeholder="Crop Type"
                  className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
                />
                <input
                  type="text"
                  name="expectedYield"
                  value={formData.expectedYield}
                  onChange={handleInputChange}
                  placeholder="Expected Yield (e.g., 100 tons)"
                  className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
                />
              </div>
            </div>

            {/* Investment Details */}
            <div>
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center text-gray-800">
                <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                Investment Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <input
                  type="number"
                  name="investmentNeeded"
                  value={formData.investmentNeeded}
                  onChange={handleInputChange}
                  placeholder="Investment Needed ($)"
                  className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
                />
              </div>
            </div>

            {/* Project Description */}
            <div>
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center text-gray-800">
                <FileText className="w-5 h-5 mr-2 text-green-600" />
                Project Description
              </h2>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your farming project, goals, and investment opportunity..."
                rows={4}
                className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base resize-vertical"
              />
            </div>

            {/* Farmer Information */}
            <div>
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center text-gray-800">
                <User className="w-5 h-5 mr-2 text-green-600" />
                Farmer Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <input
                  type="text"
                  name="farmerName"
                  value={formData.farmerName}
                  onChange={handleInputChange}
                  placeholder="Farmer Name"
                  className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
                  required
                />
                <input
                  type="text"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  placeholder="Years of Experience"
                  className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
                />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Phone Number"
                  className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email Address"
                  className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
                  required
                />
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Farm Images
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-8 text-center">
                <Upload className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-2 sm:mb-4" />
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
                  className="bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-2 rounded-lg cursor-pointer text-sm sm:text-base inline-block"
                >
                  Choose Images
                </label>
                {images.length > 0 && (
                  <p className="text-green-600 mt-2 text-sm sm:text-base">
                    {images.length} image(s) selected
                  </p>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                type="button"
                onClick={onBack}
                className="w-full sm:flex-1 bg-gray-200 hover:bg-gray-300 py-3 rounded-lg font-medium text-gray-800 text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddFarm}
                className="w-full sm:flex-1 bg-green-600 hover:bg-green-700 py-3 rounded-lg font-medium text-white text-sm sm:text-base"
              >
                Add Farm
              </button>
            </div>
          </div>
        </div>

        {/* Farm List */}
        <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6 lg:p-8">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800">Your Farms</h2>
          {farms.length === 0 ? (
            <p className="text-gray-500 text-sm sm:text-base">No farms added yet. Fill out the form above to get started!</p>
          ) : (
            <div className="space-y-4">
              {farms.map((farm, index) => (
                <div
                  key={index}
                  className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow-sm border"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="lg:col-span-2">
                      <h3 className="font-semibold text-lg sm:text-xl text-gray-800 mb-2">
                        {farm.farmName}
                      </h3>
                      <div className="space-y-1 text-sm sm:text-base text-gray-600">
                        <p className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2 text-green-600" />
                          {farm.location}
                        </p>
                        {farm.farmerName && (
                          <p className="flex items-center">
                            <User className="w-4 h-4 mr-2 text-green-600" />
                            {farm.farmerName}
                            {farm.experience && ` (${farm.experience} years exp.)`}
                          </p>
                        )}
                        {farm.description && (
                          <p className="text-gray-500 mt-2">{farm.description}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 text-sm">
                      {farm.cropType && (
                        <div className="bg-green-50 p-2 rounded border-l-4 border-green-400">
                          <p className="text-green-700 font-medium">Crop</p>
                          <p className="text-green-600">{farm.cropType}</p>
                        </div>
                      )}
                      {farm.size && (
                        <div className="bg-blue-50 p-2 rounded border-l-4 border-blue-400">
                          <p className="text-blue-700 font-medium">Size</p>
                          <p className="text-blue-600">{farm.size}</p>
                        </div>
                      )}
                      {farm.investmentNeeded && (
                        <div className="bg-yellow-50 p-2 rounded border-l-4 border-yellow-400">
                          <p className="text-yellow-700 font-medium">Investment</p>
                          <p className="text-yellow-600">${farm.investmentNeeded}</p>
                        </div>
                      )}
                      {farm.expectedROI && (
                        <div className="bg-purple-50 p-2 rounded border-l-4 border-purple-400">
                          <p className="text-purple-700 font-medium">Expected ROI</p>
                          <p className="text-purple-600">{farm.expectedROI}%</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {(farm.phone || farm.email) && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-500 mb-2">Contact Information:</p>
                      <div className="flex flex-wrap gap-4 text-sm">
                        {farm.phone && (
                          <span className="text-gray-600">📞 {farm.phone}</span>
                        )}
                        {farm.email && (
                          <span className="text-gray-600">✉️ {farm.email}</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FarmListing;