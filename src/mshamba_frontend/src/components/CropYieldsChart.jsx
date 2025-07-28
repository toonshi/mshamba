import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';

export const CropYieldsChart = ({ data }) => {
  return (
    <div className="bg-gray-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-6">Crop Yield Performance</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis 
              dataKey="crop" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
            />
            <YAxis hide />
            <Bar dataKey="yield" fill="#10B981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="target" fill="#374151" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center justify-center space-x-6 mt-4 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span className="text-gray-400">Actual Yield</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gray-600 rounded"></div>
          <span className="text-gray-400">Target Yield</span>
        </div>
      </div>
    </div>
  );
};