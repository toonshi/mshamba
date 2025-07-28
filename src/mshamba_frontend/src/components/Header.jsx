import React from 'react';
import { Search, Sprout } from 'lucide-react';

export const Header = ({ onListFarm, onMyInvestments, onMarketAnalysis, onBrowseInvestments, onSupplyChain, onFarmerRecords, onLogin, onSignup }) => {
  return (
    <header className="bg-gray-800 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <Sprout className="w-8 h-8 text-green-500" />
              <span className="text-2xl font-bold text-white">M-Shamba</span>
            </div>
            <nav className="hidden md:flex space-x-6">
              <button className="text-gray-300 hover:text-white transition-colors">Dashboard</button>
              <button 
                onClick={onBrowseInvestments}
                className="text-gray-300 hover:text-white transition-colors"
              >
                Farm Listings
              </button>
              <button 
                onClick={onMyInvestments}
                className="text-gray-300 hover:text-white transition-colors"
              >
                My Investments
              </button>
              <button 
                onClick={onMarketAnalysis}
                className="text-gray-300 hover:text-white transition-colors"
              >
                Market Analysis
              </button>
              <button 
                onClick={onSupplyChain}
                className="text-gray-300 hover:text-white transition-colors"
              >
                Supply Chain
              </button>
              <button 
                onClick={onFarmerRecords}
                className="text-gray-300 hover:text-white transition-colors"
              >
                Farm Records
              </button>
            </nav>
          </div>

          {/* Search and Actions */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search farms, crops, locations..."
                className="bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-green-500"
              />
            </div>
            <button 
              onClick={onLogin}
              className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
            >
              Login
            </button>
            <button 
              onClick={onSignup}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Sign Up
            </button>
            <button 
              onClick={onListFarm}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              List Your Farm
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};