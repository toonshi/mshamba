import React, { useEffect, useState } from "react";
import { TrendingUp, BarChart3, DollarSign, Calendar } from "lucide-react";

// Reusable Card
const StatCard = ({ title, value, change, icon: Icon, color }) => (
  <div className="bg-white rounded-xl shadow-sm border p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className={`text-sm ${color}`}>{change}</p>
      </div>
      <div className={`p-3 rounded-lg bg-${color.replace("text-", "")}100`}>
        <Icon className={`h-6 w-6 ${color}`} />
      </div>
    </div>
  </div>
);

// Reusable Table Row
const CropRow = ({ crop, price, change, roi, volume, risk }) => (
  <tr>
    <td className="px-4 py-4">
      <div className="font-medium text-gray-900">{crop.name}</div>
      <div className="text-sm text-gray-500">{crop.desc}</div>
    </td>
    <td className="px-4 py-4 text-gray-900">{price}</td>
    <td className="px-4 py-4">
      <span className={change.startsWith("+") ? "text-green-600" : "text-red-600"}>
        {change}
      </span>
    </td>
    <td className="px-4 py-4 font-medium text-gray-900">{roi}</td>
    <td className="px-4 py-4 text-gray-900">{volume}</td>
    <td className="px-4 py-4">
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
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Market Analysis</h2>
        <p className="text-gray-600">Comprehensive analysis of agricultural investment trends and opportunities</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <StatCard key={i} {...s} />
        ))}
      </div>

      {/* Crop Performance */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Crop Performance Analysis</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {["Crop Type", "Market Price", "Price Change", "Avg ROI", "Investment Volume", "Risk Level"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-sm font-medium text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {crops.map((c, i) => (
                <CropRow key={i} {...c} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MarketAnalysis;
