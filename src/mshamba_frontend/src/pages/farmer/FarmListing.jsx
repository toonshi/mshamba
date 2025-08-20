import React, { useState } from "react";
import {
  ArrowLeft,
  Upload,
  MapPin,
  DollarSign,
  Sprout,
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
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="flex items-center mb-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-green-600 hover:text-green-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
        </div>

        {/* Farm Form */}
        <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Sprout className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Add a Farm</h1>
              <p className="text-gray-500">
                Fill in the details below and add your farm to the list
              </p>
            </div>
          </div>

          <form onSubmit={handleAddFarm} className="space-y-8">
            {/* Farm Information */}
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-800">
                <MapPin className="w-5 h-5 mr-2 text-green-600" />
                Farm Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="text"
                  name="farmName"
                  value={formData.farmName}
                  onChange={handleInputChange}
                  placeholder="Farm Name"
                  className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Location"
                  className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
                <input
                  type="text"
                  name="size"
                  value={formData.size}
                  onChange={handleInputChange}
                  placeholder="Farm Size"
                  className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="text"
                  name="cropType"
                  value={formData.cropType}
                  onChange={handleInputChange}
                  placeholder="Crop Type"
                  className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            {/* Investment Details */}
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-800">
                <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                Investment Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="number"
                  name="investmentNeeded"
                  value={formData.investmentNeeded}
                  onChange={handleInputChange}
                  placeholder="Investment Needed"
                  className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Farm Images
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
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
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg cursor-pointer"
                >
                  Choose Images
                </label>
                {images.length > 0 && (
                  <p className="text-green-600 mt-2">
                    {images.length} image(s) selected
                  </p>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={onBack}
                className="flex-1 bg-gray-200 hover:bg-gray-300 py-3 rounded-lg font-medium text-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-green-600 hover:bg-green-700 py-3 rounded-lg font-medium text-white"
              >
                Add Farm
              </button>
            </div>
          </form>
        </div>

        {/* Farm List */}
        <div className="bg-white rounded-xl shadow-sm border p-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Your Farms</h2>
          {farms.length === 0 ? (
            <p className="text-gray-500">No farms yet.</p>
          ) : (
            <ul className="space-y-4">
              {farms.map((farm, index) => (
                <li
                  key={index}
                  className="bg-gray-100 p-4 rounded-lg shadow-sm border"
                >
                  <h3 className="font-semibold text-lg text-gray-800">
                    {farm.farmName}
                  </h3>
                  <p className="text-gray-600">{farm.location}</p>
                  <p className="text-sm text-gray-500">
                    Crop: {farm.cropType || "N/A"} | Size:{" "}
                    {farm.size || "N/A"}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default FarmListing;
