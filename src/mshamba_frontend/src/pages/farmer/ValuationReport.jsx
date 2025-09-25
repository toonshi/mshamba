import React, { useEffect, useState } from 'react';
import { DollarSign, FileText, Calendar, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const tokenAllocation = [
  { name: 'Investors', value: 50 },
  { name: 'Founders', value: 20 },
  { name: 'Reserves', value: 15 },
  { name: 'Advisors', value: 10 },
  { name: 'Marketing', value: 5 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA336A'];

const ValuationReport = () => {
  const [valuationStatus, setValuationStatus] = useState('Pending');
  const [valuationData, setValuationData] = useState(null);

  // Simulate fetching report from backend
  const fetchValuationReport = async () => {
    try {
      const data = {
        initialSupply: '1,000,000 TOK',
        initialPrice: 'KSH 65.00 / token',
        vestingSchedule: '6 months cliff, 24 months linear',
        launchTimeline: 'Q1 2025',
      };
      setValuationData(data);
      setValuationStatus('Complete');
    } catch (error) {
      console.error('Error fetching valuation report:', error);
    }
  };

  useEffect(() => {
    fetchValuationReport();
  }, []);

  const downloadValuationReport = () => {
    alert('Downloading full valuation report...');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Farm Valuation Report</h2>
        <p className="text-gray-600">
          Professional assessment of your farm's current market value
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Status:{' '}
          <span
            className={
              valuationStatus === 'Complete'
                ? 'text-green-600'
                : 'text-orange-600'
            }
          >
            {valuationStatus}
          </span>
        </p>
      </div>

      {/* Token Settings & Rationale */}
      {valuationStatus === 'Complete' && valuationData && (
        <div className="bg-white rounded-xl shadow-sm border p-6 space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Token Settings & Rationale
          </h3>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-sm border p-4">
              <div className="flex items-center mb-2">
                <p className="text-sm font-medium text-gray-600">Initial Supply</p>
              </div>
              <p className="text-gray-900 font-bold">{valuationData.initialSupply}</p>
              <p className="text-sm text-gray-500">
                Matches target funding & circulating supply expectations
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-4">
              <div className="flex items-center mb-2">
                <TrendingUp className="h-6 w-6 text-green-600 mr-2" />
                <p className="text-sm font-medium text-gray-600">Initial Price</p>
              </div>
              <p className="text-gray-900 font-bold">{valuationData.initialPrice}</p>
              <p className="text-sm text-gray-500">
                Optimized to attract early investors while preserving farm value
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-4">
              <div className="flex items-center mb-2">
                <FileText className="h-6 w-6 text-orange-600 mr-2" />
                <p className="text-sm font-medium text-gray-600">Vesting Schedule</p>
              </div>
              <p className="text-gray-900 font-bold">{valuationData.vestingSchedule}</p>
              <p className="text-sm text-gray-500">
                Ensures stability and gradual release for investors
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-4">
              <div className="flex items-center mb-2">
                <Calendar className="h-6 w-6 text-purple-600 mr-2" />
                <p className="text-sm font-medium text-gray-600">Launch Timeline</p>
              </div>
              <p className="text-gray-900 font-bold">{valuationData.launchTimeline}</p>
              <p className="text-sm text-gray-500">
                Aligned with marketing campaign & investor readiness
              </p>
            </div>
          </div>

          {/* Tokenomics Pie Chart */}
          <div className="bg-gray-50 border rounded p-4 sm:p-6 flex justify-center">
            <div className="w-full h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={tokenAllocation}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius="70%"
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {tokenAllocation.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="bg-white rounded-xl shadow-sm border p-6 flex flex-col sm:flex-row flex-wrap gap-4">
        <button
          onClick={() => alert('Requesting new appraisal...')}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors w-full sm:w-auto"
        >
          Request New Appraisal
        </button>
        <button
          onClick={downloadValuationReport}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto"
        >
          Download Full Report
        </button>
        <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors w-full sm:w-auto">
          Share with Investors
        </button>
      </div>
    </div>
  );
};

export default ValuationReport;
