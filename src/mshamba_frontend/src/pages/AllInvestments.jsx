import React, { useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { FarmCard } from '../components/FarmCard';
import { farmListings } from '../data/farmData';

export const AllInvestments = ({ onBack, onInvest, hasWallet }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [sortBy, setSortBy] = useState('roi');

  const filters = [
    { value: 'all', label: 'All Farms' },
    { value: 'maize', label: 'Maize' },
    { value: 'coffee', label: 'Coffee' },
    { value: 'vegetables', label: 'Vegetables' },
    { value: 'fruits', label: 'Fruits' },
  ];

  const sortOptions = [
    { value: 'roi', label: 'Highest ROI' },
    { value: 'investment', label: 'Lowest Investment' },
    { value: 'duration', label: 'Shortest Duration' },
    { value: 'newest', label: 'Newest Listed' },
  ];

  const filteredFarms = farmListings.filter(farm => {
    const matchesSearch = farm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         farm.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         farm.crop.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || 
                         farm.crop.toLowerCase().includes(selectedFilter.toLowerCase());
    
    return matchesSearch && matchesFilter;
  });

  const sortedFarms = [...filteredFarms].sort((a, b) => {
    switch (sortBy) {
      case 'roi':
        return parseFloat(b.expectedReturn) - parseFloat(a.expectedReturn);
      case 'investment':
        return parseFloat(a.minInvestment.replace(/[$,]/g, '')) - parseFloat(b.minInvestment.replace(/[$,]/g, ''));
      case 'duration':
        return parseFloat(a.duration) - parseFloat(b.duration);
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white w-full">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <button 
            onClick={onBack}
            className="flex items-center space-x-2 text-green-400 hover:text-green-300 transition-colors"
          >
            <LucideIcons.ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
        </div>

        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <LucideIcons.DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Browse All Investments</h1>
              <p className="text-gray-400">Discover profitable agricultural investment opportunities</p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="relative">
              <LucideIcons.Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search farms, locations, crops..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-green-500"
              />
            </div>

            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500"
            >
              {filters.map(filter => (
                <option key={filter.value} value={filter.value}>{filter.label}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <LucideIcons.MapPin className="w-4 h-4 text-green-400" />
                <span className="text-sm text-gray-400">Total Farms</span>
              </div>
              <div className="text-2xl font-bold">{sortedFarms.length}</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <LucideIcons.TrendingUp className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-gray-400">Avg. ROI</span>
              </div>
              <div className="text-2xl font-bold text-blue-400">19.2%</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <LucideIcons.DollarSign className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-gray-400">Min Investment</span>
              </div>
              <div className="text-2xl font-bold text-purple-400">$3,000</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <LucideIcons.Clock className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-gray-400">Avg. Duration</span>
              </div>
              <div className="text-2xl font-bold text-yellow-400">7.5 months</div>
            </div>
          </div>
        </div>

        {/* Farm Listings */}
        {sortedFarms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedFarms.map((farm) => (
              <FarmCard
                key={farm.id}
                farm={farm}
                onInvest={onInvest}
                hasWallet={hasWallet}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <LucideIcons.Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No farms found</h3>
            <p className="text-gray-400">Try adjusting your search criteria or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};
