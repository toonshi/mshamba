import React, { useState } from 'react';
import { ArrowLeft, TrendingUp, TrendingDown, BarChart3, PieChart, Calendar } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, BarChart, Bar, PieChart as RechartsPieChart, Cell } from 'recharts';

export const MarketAnalysis = ({ onBack }) => {
  const [activeTimeframe, setActiveTimeframe] = useState('6M');
  const [activeTab, setActiveTab] = useState('prices');

  const timeframes = ['1M', '3M', '6M', '1Y', '2Y'];

  const priceData = [
    { month: 'Jan', maize: 45, coffee: 120, beans: 80, vegetables: 35 },
    { month: 'Feb', maize: 48, coffee: 125, beans: 82, vegetables: 38 },
    { month: 'Mar', maize: 52, coffee: 118, beans: 78, vegetables: 42 },
    { month: 'Apr', maize: 49, coffee: 130, beans: 85, vegetables: 40 },
    { month: 'May', maize: 55, coffee: 135, beans: 88, vegetables: 45 },
    { month: 'Jun', maize: 58, coffee: 140, beans: 90, vegetables: 48 },
  ];

  const yieldData = [
    { crop: 'Maize', currentYear: 2.8, lastYear: 2.5, potential: 3.2 },
    { crop: 'Coffee', currentYear: 1.2, lastYear: 1.1, potential: 1.5 },
    { crop: 'Beans', currentYear: 1.8, lastYear: 1.6, potential: 2.0 },
    { crop: 'Vegetables', currentYear: 15.5, lastYear: 14.2, potential: 18.0 },
  ];

  const marketShareData = [
    { name: 'Maize', value: 35, color: '#10B981' },
    { name: 'Coffee', value: 25, color: '#F59E0B' },
    { name: 'Vegetables', value: 20, color: '#EF4444' },
    { name: 'Beans', value: 12, color: '#8B5CF6' },
    { name: 'Others', value: 8, color: '#6B7280' },
  ];

  const investmentTrends = [
    { month: 'Jan', investments: 1200000, farms: 45 },
    { month: 'Feb', investments: 1450000, farms: 52 },
    { month: 'Mar', investments: 1680000, farms: 61 },
    { month: 'Apr', investments: 1920000, farms: 68 },
    { month: 'May', investments: 2150000, farms: 75 },
    { month: 'Jun', investments: 2380000, farms: 82 },
  ];

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
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Market Analysis</h1>
              <p className="text-gray-400">Comprehensive agricultural market insights and trends</p>
            </div>
          </div>

          {/* Timeframe Selection */}
          <div className="flex space-x-2">
            {timeframes.map((timeframe) => (
              <button
                key={timeframe}
                onClick={() => setActiveTimeframe(timeframe)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTimeframe === timeframe
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-700 text-gray-400 hover:text-white'
                }`}
              >
                {timeframe}
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">Total Market Value</span>
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-green-400">$2.38M</div>
            <div className="text-sm text-green-400">+12.5% from last month</div>
          </div>
          <div className="bg-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">Active Farms</span>
              <TrendingUp className="w-5 h-5 text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-blue-400">847</div>
            <div className="text-sm text-blue-400">+8.2% from last month</div>
          </div>
          <div className="bg-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">Avg. ROI</span>
              <TrendingUp className="w-5 h-5 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-purple-400">19.8%</div>
            <div className="text-sm text-purple-400">+2.1% from last month</div>
          </div>
          <div className="bg-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">Success Rate</span>
              <TrendingDown className="w-5 h-5 text-red-400" />
            </div>
            <div className="text-2xl font-bold text-red-400">87.3%</div>
            <div className="text-sm text-red-400">-1.2% from last month</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg mb-8">
          <button
            onClick={() => setActiveTab('prices')}
            className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'prices' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Crop Prices
          </button>
          <button
            onClick={() => setActiveTab('yields')}
            className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'yields' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Yield Analysis
          </button>
          <button
            onClick={() => setActiveTab('market')}
            className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'market' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Market Share
          </button>
          <button
            onClick={() => setActiveTab('investments')}
            className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'investments' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Investment Trends
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'prices' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-6">Crop Price Trends (KSh/kg)</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={priceData}>
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                    <YAxis hide />
                    <Line type="monotone" dataKey="maize" stroke="#10B981" strokeWidth={2} />
                    <Line type="monotone" dataKey="coffee" stroke="#F59E0B" strokeWidth={2} />
                    <Line type="monotone" dataKey="beans" stroke="#EF4444" strokeWidth={2} />
                    <Line type="monotone" dataKey="vegetables" stroke="#8B5CF6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-4 mt-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span className="text-sm text-gray-400">Maize</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                  <span className="text-sm text-gray-400">Coffee</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span className="text-sm text-gray-400">Beans</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-500 rounded"></div>
                  <span className="text-sm text-gray-400">Vegetables</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-6">Current Market Prices</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Maize</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">KSh 58/kg</div>
                    <div className="text-sm text-green-400">+5.4%</div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span>Coffee</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">KSh 140/kg</div>
                    <div className="text-sm text-green-400">+3.7%</div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span>Beans</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">KSh 90/kg</div>
                    <div className="text-sm text-green-400">+2.3%</div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span>Vegetables</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">KSh 48/kg</div>
                    <div className="text-sm text-green-400">+6.7%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'yields' && (
          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-6">Yield Comparison (Tons/Hectare)</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={yieldData}>
                  <XAxis dataKey="crop" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                  <YAxis hide />
                  <Bar dataKey="currentYear" fill="#10B981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="lastYear" fill="#6B7280" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="potential" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center space-x-6 mt-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span className="text-sm text-gray-400">Current Year</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-500 rounded"></div>
                <span className="text-sm text-gray-400">Last Year</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span className="text-sm text-gray-400">Potential</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'market' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-6">Investment Distribution</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <RechartsPieChart
                      data={marketShareData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {marketShareData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </RechartsPieChart>
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-6">Market Share Breakdown</h3>
              <div className="space-y-4">
                {marketShareData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }}></div>
                      <span>{item.name}</span>
                    </div>
                    <div className="font-semibold">{item.value}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'investments' && (
          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-6">Investment Growth Trends</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={investmentTrends}>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                  <YAxis hide />
                  <Line type="monotone" dataKey="investments" stroke="#10B981" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-6 mt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">$2.38M</div>
                <div className="text-sm text-gray-400">Total Investments</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">82</div>
                <div className="text-sm text-gray-400">Active Farms</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};