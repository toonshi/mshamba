import React from 'react';

export const TabNavigation = ({ activeTab, onTabChange }) => {
  return (
    <div className="mb-6">
      <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg">
        <button
          onClick={() => onTabChange('investments')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'investments'
              ? 'bg-green-600 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Available Investments
        </button>
        <button
          onClick={() => onTabChange('yields')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'yields'
              ? 'bg-green-600 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Crop Yields
        </button>
      </div>
    </div>
  );
};