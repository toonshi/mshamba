import React, { useState } from 'react';

export const CreateFarmForm = ({ onSubmit, isLoading, disabled }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [fundingGoal, setFundingGoal] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, description, location, fundingGoal: BigInt(fundingGoal) });
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
              disabled={disabled}
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
              disabled={disabled}
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
              disabled={disabled}
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
              disabled={disabled}
            />
          </div>
        </div>
        <div className="mt-6">
          <button type="submit" disabled={isLoading || disabled} className="w-full py-3 px-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-transform transform hover:scale-105 disabled:opacity-50">
            {isLoading ? 'Creating Farm...' : 'Create Farm'}
          </button>
        </div>
      </form>
    </div>
  );
};
