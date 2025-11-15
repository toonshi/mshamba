import React, { useState } from 'react';
import { ArrowLeft, TrendingUp, DollarSign, Calendar, BarChart3, Eye, Download } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, AreaChart, Area } from 'recharts';

import { myInvestments, investmentData } from '../../data/mockFarmData';

export const MyInvestments = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('overview');

  // The myInvestments array is now imported from mockFarmData.js
  // The performanceData array is now imported as investmentData from mockFarmData.js


  const totalInvested = myInvestments.reduce((sum, inv) => sum + inv.invested, 0);
  const totalCurrentValue = myInvestments.reduce((sum, inv) => sum + inv.currentValue, 0);
  const totalGains = totalCurrentValue - totalInvested;
  const avgROI = ((totalGains / totalInvested) * 100).toFixed(1);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'text-green-400 bg-green-400 bg-opacity-20';
      case 'Harvesting': return 'text-yellow-400 bg-yellow-400 bg-opacity-20';
      case 'Growing': return 'text-blue-400 bg-blue-400 bg-opacity-20';
      default: return 'text-gray-400 bg-gray-400 bg-opacity-20';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white w-full">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <button 
            onClick={onBack}
            className="flex items-center space-x-2 text-green-400 hover:text-green-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
        </div>

        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">My Investments</h1>
              <p className="text-gray-400">Track your agricultural investment portfolio</p>
            </div>
          </div>

          {/* Portfolio Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-800 rounded-xl p-6">
              <div className="flex items-center space-x-2 mb-2">
                <DollarSign className="w-5 h-5 text-green-400" />
                <span className="text-sm text-gray-400">Total Invested</span>
              </div>
              <div className="text-2xl font-bold">${totalInvested.toLocaleString()}</div>
            </div>
            <div className="bg-gray-800 rounded-xl p-6">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-5 h-5 text-blue-400" />
                <span className="text-sm text-gray-400">Current Value</span>
              </div>
              <div className="text-2xl font-bold text-blue-400">${totalCurrentValue.toLocaleString()}</div>
            </div>
            <div className="bg-gray-800 rounded-xl p-6">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <span className="text-sm text-gray-400">Total Gains</span>
              </div>
              <div className="text-2xl font-bold text-green-400">+${totalGains.toLocaleString()}</div>
            </div>
            <div className="bg-gray-800 rounded-xl p-6">
              <div className="flex items-center space-x-2 mb-2">
                <BarChart3 className="w-5 h-5 text-purple-400" />
                <span className="text-sm text-gray-400">Average ROI</span>
              </div>
              <div className="text-2xl font-bold text-purple-400">{avgROI}%</div>
            </div>
          </div>

          {/* Performance Chart */}
          <div className="bg-gray-800 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold mb-6">Portfolio Performance</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={investmentData}>
                  <defs>
                    <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                  <YAxis hide />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#10B981"
                    strokeWidth={2}
                    fill="url(#portfolioGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg mb-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'overview' ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Investment Overview
          </button>
          <button
            onClick={() => setActiveTab('tokens')}
            className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'tokens' ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Token Holdings
          </button>
        </div>

        {/* Investment List */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {myInvestments.map((investment) => (
              <div key={investment.id} className="bg-gray-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{investment.farmName}</h3>
                      <p className="text-gray-400">{investment.location} • {investment.crop}</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(investment.status)}`}>
                    {investment.status}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-4">
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Invested</div>
                    <div className="text-lg font-semibold">${investment.invested.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Current Value</div>
                    <div className="text-lg font-semibold text-green-400">${investment.currentValue.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Gains</div>
                    <div className="text-lg font-semibold text-green-400">+${(investment.currentValue - investment.invested).toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 mb-1">ROI</div>
                    <div className="text-lg font-semibold text-green-400">{investment.roi}%</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span>Farmer: {investment.farmer}</span>
                    <span>•</span>
                    <span>Duration: {investment.duration}</span>
                    <span>•</span>
                    <span>Expected Harvest: {new Date(investment.expectedHarvest).toLocaleDateString()}</span>
                  </div>
                  <div className="flex space-x-2">
                    <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm transition-colors">
                      <Eye className="w-4 h-4" />
                      <span>View Details</span>
                    </button>
                    <button className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded-lg text-sm transition-colors">
                      <Download className="w-4 h-4" />
                      <span>Report</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'tokens' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myInvestments.map((investment) => (
              <div key={investment.id} className="bg-gray-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{investment.tokenSymbol}</h3>
                    <p className="text-gray-400 text-sm">{investment.farmName}</p>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(investment.status)}`}>
                    {investment.status}
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Tokens Held</span>
                    <span className="font-semibold">{investment.tokens} {investment.tokenSymbol}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Token Value</span>
                    <span className="font-semibold">${(investment.currentValue / investment.tokens).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Value</span>
                    <span className="font-semibold text-green-400">${investment.currentValue.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button className="flex-1 bg-green-600 hover:bg-green-700 py-2 rounded-lg text-sm transition-colors">
                    Trade
                  </button>
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded-lg text-sm transition-colors">
                    Sell
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};