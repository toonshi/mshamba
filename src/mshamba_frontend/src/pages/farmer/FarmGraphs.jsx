import React from 'react';
import { BarChart3, TrendingUp, Calendar, DollarSign } from 'lucide-react';

const FarmGraphs = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Farm Analytics</h2>
        <p className="text-gray-600">Track your farm's performance with detailed analytics and insights</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Revenue This Year</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">$425K</p>
              <p className="text-sm text-green-600 mt-1">+18.5% vs last year</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Yield Per Acre</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">2,800 lbs</p>
              <p className="text-sm text-green-600 mt-1">+12.3% vs last year</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Production</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">700,000 lbs</p>
              <p className="text-sm text-orange-600 mt-1">+8.7% vs last year</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <BarChart3 className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Operating Costs</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">$285K</p>
              <p className="text-sm text-red-600 mt-1">+5.2% vs last year</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue Trend</h3>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-500">
            <BarChart3 className="h-12 w-12 mx-auto mb-2" />
            <p>Revenue chart would be displayed here</p>
            <p className="text-sm">Integration with charting library needed</p>
          </div>
        </div>
      </div>

      {/* Production & Yield Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Annual Production</h3>
          <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <TrendingUp className="h-10 w-10 mx-auto mb-2" />
              <p>Production chart</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Yield Efficiency</h3>
          <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <BarChart3 className="h-10 w-10 mx-auto mb-2" />
              <p>Efficiency chart</p>
            </div>
          </div>
        </div>
      </div>

      {/* Cost Analysis */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl font-bold text-green-600">42%</span>
            </div>
            <p className="font-medium text-gray-900">Labor Costs</p>
            <p className="text-sm text-gray-500">$119,700</p>
          </div>
          
          <div className="text-center">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl font-bold text-blue-600">28%</span>
            </div>
            <p className="font-medium text-gray-900">Equipment & Fuel</p>
            <p className="text-sm text-gray-500">$79,800</p>
          </div>
          
          <div className="text-center">
            <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl font-bold text-orange-600">30%</span>
            </div>
            <p className="font-medium text-gray-900">Materials & Other</p>
            <p className="text-sm text-gray-500">$85,500</p>
          </div>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Insights</h3>
        <div className="space-y-4">
          <div className="flex items-center p-4 bg-green-50 rounded-lg">
            <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center mr-4">
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Excellent yield performance</p>
              <p className="text-sm text-gray-600">Your per-acre yield is 15% above regional average</p>
            </div>
          </div>

          <div className="flex items-center p-4 bg-blue-50 rounded-lg">
            <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center mr-4">
              <DollarSign className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Revenue growth trending up</p>
              <p className="text-sm text-gray-600">18.5% revenue increase shows strong market positioning</p>
            </div>
          </div>

          <div className="flex items-center p-4 bg-orange-50 rounded-lg">
            <div className="w-8 h-8 bg-orange-200 rounded-full flex items-center justify-center mr-4">
              <Calendar className="h-4 w-4 text-orange-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Optimize operational costs</p>
              <p className="text-sm text-gray-600">Consider efficiency improvements to reduce 5.2% cost increase</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmGraphs;