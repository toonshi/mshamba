import React, { useEffect, useState } from "react";
import { TrendingUp, BarChart3, DollarSign, Calendar } from "lucide-react";

// Reusable Card
const StatCard = ({ title, value, change, icon: Icon, color }) => (
  <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
    <div className="flex items-center justify-between">
      <div className="flex-1 min-w-0">
        <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">{title}</p>
        <p className="text-lg sm:text-2xl font-bold text-gray-900 mt-1">{value}</p>
        <p className={`text-xs sm:text-sm mt-1 ${color} truncate`}>{change}</p>
      </div>
      <div className={`p-2 sm:p-3 rounded-lg bg-${color.replace("text-", "")}100 flex-shrink-0 ml-3`}>
        <Icon className={`h-4 w-4 sm:h-6 sm:w-6 ${color}`} />
      </div>
    </div>
  </div>
);

// Mobile Card View for Crops
const CropCard = ({ crop, price, change, roi, volume, risk }) => (
  <div className="bg-white rounded-lg border shadow-sm p-4">
    <div className="flex items-start justify-between mb-3">
      <div className="flex-1">
        <h4 className="font-semibold text-gray-900 text-sm">{crop.name}</h4>
        <p className="text-xs text-gray-500">{crop.desc}</p>
      </div>
      <span
        className={`px-2 py-1 rounded-full text-xs flex-shrink-0 ml-2 ${
          risk === "Low"
            ? "bg-green-100 text-green-800"
            : risk === "Medium"
            ? "bg-yellow-100 text-yellow-800"
            : "bg-red-100 text-red-800"
        }`}
      >
        {risk}
      </span>
    </div>
    
    <div className="grid grid-cols-2 gap-3 text-sm">
      <div>
        <span className="text-gray-500 block text-xs">Market Price</span>
        <span className="font-medium text-gray-900">{price}</span>
      </div>
      <div>
        <span className="text-gray-500 block text-xs">Price Change</span>
        <span className={change.startsWith("+") ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
          {change}
        </span>
      </div>
      <div>
        <span className="text-gray-500 block text-xs">Avg ROI</span>
        <span className="font-medium text-gray-900">{roi}</span>
      </div>
      <div>
        <span className="text-gray-500 block text-xs">Investment Volume</span>
        <span className="font-medium text-gray-900">{volume}</span>
      </div>
    </div>
  </div>
);

// Reusable Table Row
const CropRow = ({ crop, price, change, roi, volume, risk }) => (
  <tr className="hover:bg-gray-50">
    <td className="px-3 lg:px-4 py-4">
      <div className="font-medium text-gray-900 text-sm">{crop.name}</div>
      <div className="text-xs text-gray-500">{crop.desc}</div>
    </td>
    <td className="px-3 lg:px-4 py-4 text-gray-900 text-sm">{price}</td>
    <td className="px-3 lg:px-4 py-4 text-sm">
      <span className={change.startsWith("+") ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
        {change}
      </span>
    </td>
    <td className="px-3 lg:px-4 py-4 font-medium text-gray-900 text-sm">{roi}</td>
    <td className="px-3 lg:px-4 py-4 text-gray-900 text-sm">{volume}</td>
    <td className="px-3 lg:px-4 py-4">
      <span
        className={`px-2 py-1 rounded-full text-xs ${
          risk === "Low"
            ? "bg-green-100 text-green-800"
            : risk === "Medium"
            ? "bg-yellow-100 text-yellow-800"
            : "bg-red-100 text-red-800"
        }`}
      >
        {risk}
      </span>
    </td>
  </tr>
);

const MarketAnalysis = () => {
  const [stats, setStats] = useState([]);
  const [crops, setCrops] = useState([]);

  // Simulate backend fetch
  useEffect(() => {
    // Replace with API calls later
    setStats([
      { title: "Market Size", value: "$24.8B", change: "+12.5% YoY", icon: DollarSign, color: "text-green-600" },
      { title: "Active Investments", value: "1,247", change: "+18% this month", icon: BarChart3, color: "text-blue-600" },
      { title: "Avg ROI", value: "9.4%", change: "+1.2% vs last year", icon: TrendingUp, color: "text-orange-600" },
      { title: "Success Rate", value: "94.2%", change: "Projects completed", icon: Calendar, color: "text-purple-600" }
    ]);

    setCrops([
      { crop: { name: "Almonds", desc: "Premium varieties" }, price: "$2.85/lb", change: "+8.2%", roi: "9.8%", volume: "$4.2M", risk: "Low" },
      { crop: { name: "Wine Grapes", desc: "Premium regions" }, price: "$1,850/ton", change: "+15.4%", roi: "12.1%", volume: "$2.8M", risk: "Medium" },
      { crop: { name: "Citrus", desc: "Oranges & lemons" }, price: "$0.95/lb", change: "-3.1%", roi: "7.9%", volume: "$1.9M", risk: "Low" },
      { crop: { name: "Walnuts", desc: "English varieties" }, price: "$1.45/lb", change: "+6.7%", roi: "10.3%", volume: "$3.1M", risk: "Low" }
    ]);
  }, []);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Market Analysis</h2>
        <p className="text-sm sm:text-base text-gray-600">
          Comprehensive analysis of agricultural investment trends and opportunities
        </p>
      </div>

      {/* Stats Grid - Responsive from 1 column on mobile to 4 columns on large screens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((s, i) => (
          <StatCard key={i} {...s} />
        ))}
      </div>

      {/* Crop Performance - Mobile Cards + Desktop Table */}
      <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
          Crop Performance Analysis
        </h3>
        
        {/* Mobile View - Card Layout */}
        <div className="block sm:hidden space-y-4">
          {crops.map((c, i) => (
            <CropCard key={i} {...c} />
          ))}
        </div>
        
        {/* Tablet/Desktop View - Table Layout */}
        <div className="hidden sm:block">
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {[
                      "Crop Type", 
                      "Market Price", 
                      "Price Change", 
                      "Avg ROI", 
                      "Investment Volume", 
                      "Risk Level"
                    ].map((h) => (
                      <th key={h} className="px-3 lg:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {crops.map((c, i) => (
                    <CropRow key={i} {...c} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketAnalysis;