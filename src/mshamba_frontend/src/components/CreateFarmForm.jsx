import React, { useState } from 'react';
import { mshamba_assets } from 'declarations/mshamba_assets'; // Import assets canister

export const CreateFarmForm = ({ onSubmit, isLoading }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [fundingGoal, setFundingGoal] = useState('');
  const [imageFile, setImageFile] = useState(null); // State for image file (Uint8Array)
  const [crop, setCrop] = useState(''); // State for crop
  const [size, setSize] = useState(''); // State for size
  const [minInvestment, setMinInvestment] = useState(''); // State for minInvestment
  const [duration, setDuration] = useState(''); // State for duration

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const arrayBuffer = event.target.result;
        const uint8Array = new Uint8Array(arrayBuffer);
        setImageFile(uint8Array);
      };
      reader.readAsArrayBuffer(file);
    } else {
      setImageFile(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let imageId = "";
    if (imageFile) {
      try {
        // Upload image to mshamba_assets canister
        // Array.from(imageFile) converts Uint8Array to Array<Nat8> which Motoko expects
        imageId = await mshamba_assets.uploadImage(Array.from(imageFile));
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Failed to upload image. Please try again.");
        return;
      }
    }

    onSubmit({
      name,
      description,
      location,
      fundingGoal: BigInt(fundingGoal),
      image: imageId, // Pass the image ID
      crop,
      size,
      minInvestment: BigInt(minInvestment),
      duration: BigInt(duration),
    });
  };

  return (
    <div className="bg-gray-800 shadow-lg rounded-xl p-6 mb-8">
      <h2 className="text-2xl font-bold mb-4">Create a New Farm</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Farm Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
              placeholder="Green Acres"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
              rows="3"
              placeholder="A farm specializing in organic vegetables..."
              required
            ></textarea>
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-1">Location</label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
              placeholder="Rural Area, Kenya"
              required
            />
          </div>
          <div>
            <label htmlFor="fundingGoal" className="block text-sm font-medium text-gray-300 mb-1">Funding Goal (in USD)</label>
            <input
              type="number"
              id="fundingGoal"
              value={fundingGoal}
              onChange={(e) => setFundingGoal(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
              placeholder="10000"
              required
            />
          </div>
          {/* New fields */}
          <div className="md:col-span-2">
            <label htmlFor="image" className="block text-sm font-medium text-gray-300 mb-1">Farm Image</label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow text-gray-300"
            />
          </div>
          <div>
            <label htmlFor="crop" className="block text-sm font-medium text-gray-300 mb-1">Main Crop</label>
            <input
              type="text"
              id="crop"
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
              placeholder="e.g., Maize, Vegetables"
              required
            />
          </div>
          <div>
            <label htmlFor="size" className="block text-sm font-medium text-gray-300 mb-1">Farm Size (e.g., "10 acres")</label>
            <input
              type="text"
              id="size"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
              placeholder="e.g., 10 acres, 5 hectares"
              required
            />
          </div>
          <div>
            <label htmlFor="minInvestment" className="block text-sm font-medium text-gray-300 mb-1">Minimum Investment (in USD)</label>
            <input
              type="number"
              id="minInvestment"
              value={minInvestment} 
              onChange={(e) => setMinInvestment(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
              placeholder="100"
              required
            />
          </div>
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-300 mb-1">Duration (in months)</label>
            <input
              type="number"
              id="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
              placeholder="6"
              required
            />
          </div>
        }
        <div className="mt-6">
          <button type="submit" disabled={isLoading} className="w-full py-3 px-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-transform transform hover:scale-105 disabled:opacity-50">
            {isLoading ? 'Creating Farm...' : 'Create Farm'}
          </button>
        </div>
      </form>
    </div>
  );
};
