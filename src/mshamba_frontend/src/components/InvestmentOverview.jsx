import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis } from 'recharts';

export const InvestmentOverview = ({
  data,
  activeTimeframe,
  timeframes,
  onTimeframeChange
}) => {
  return (
    <div className="bg-gray-800 rounded-xl p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex space-x-8">
          <div>
            <div className="text-sm text-gray-400 mb-1">Total Investment Returns</div>
            <div className="text-3xl font-bold text-green-400">$45,670.00</div>
          </div>
          <div>
            <div className="text-sm text-gray-400 mb-1">Average ROI</div>
            <div className="text-3xl font-bold text-green-400">19.5%</div>
          </div>
          <div>
            <div className="text-sm text-gray-400 mb-1">Active Farms</div>
            <div className="text-3xl font-bold">12</div>
          </div>
        </div>

        {/* Timeframe Buttons */}
        <div className="flex space-x-2">
          {timeframes.map((timeframe) => (
            <button
              key={timeframe}
              onClick={() => onTimeframeChange(timeframe)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTimeframe === timeframe
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-700 text-gray-400 hover:text-white hover:bg-gray-600'
              }`}
            >
              {timeframe}
            </button>
          ))}
        </div>
      </div>

      {/* Investment Returns Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="investmentGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
            />
            <YAxis hide />
            <Area
              type="monotone"
              dataKey="returns"
              stroke="#10B981"
              strokeWidth={2}
              fill="url(#investmentGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};