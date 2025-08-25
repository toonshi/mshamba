import React from 'react';
import { User, Mail, Phone, DollarSign, Calendar, TrendingUp } from 'lucide-react';

const InvestorsList = () => {
  const investors = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      phone: '(555) 123-4567',
      investment: 25000,
      joinDate: '2023-08-15',
      projects: 2,
      returns: 8.4
    },
    {
      id: 2,
      name: 'Michael Chen',
      email: 'mchen@investco.com',
      phone: '(555) 987-6543',
      investment: 50000,
      joinDate: '2023-06-20',
      projects: 3,
      returns: 9.1
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      email: 'emily.r@gmail.com',
      phone: '(555) 456-7890',
      investment: 15000,
      joinDate: '2023-11-03',
      projects: 1,
      returns: 7.8
    },
    {
      id: 4,
      name: 'David Thompson',
      email: 'dthompson@agrifund.com',
      phone: '(555) 234-5678',
      investment: 75000,
      joinDate: '2023-05-12',
      projects: 4,
      returns: 10.2
    },
    {
      id: 5,
      name: 'Lisa Wang',
      email: 'lisa.wang@email.com',
      phone: '(555) 345-6789',
      investment: 30000,
      joinDate: '2023-09-28',
      projects: 2,
      returns: 8.7
    }
  ];

  const totalInvestment = investors.reduce((sum, investor) => sum + investor.investment, 0);
  const averageReturn = investors.reduce((sum, investor) => sum + investor.returns, 0) / investors.length;

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      {/* Header Stats */}
      <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Investors Overview</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          <div className="bg-green-50 rounded-lg p-3 sm:p-4">
            <div className="flex items-center mb-2">
              <User className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 mr-2" />
              <span className="font-medium text-gray-900 text-xs sm:text-sm lg:text-base">Total Investors</span>
            </div>
            <p className="text-lg sm:text-2xl font-bold text-green-600">{investors.length}</p>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-3 sm:p-4">
            <div className="flex items-center mb-2">
              <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mr-2" />
              <span className="font-medium text-gray-900 text-xs sm:text-sm lg:text-base">Total Investment</span>
            </div>
            <p className="text-lg sm:text-2xl font-bold text-blue-600">${totalInvestment.toLocaleString()}</p>
          </div>
          
          <div className="bg-orange-50 rounded-lg p-3 sm:p-4">
            <div className="flex items-center mb-2">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 mr-2" />
              <span className="font-medium text-gray-900 text-xs sm:text-sm lg:text-base">Avg Return</span>
            </div>
            <p className="text-lg sm:text-2xl font-bold text-orange-600">{averageReturn.toFixed(1)}%</p>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-3 sm:p-4">
            <div className="flex items-center mb-2">
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 mr-2" />
              <span className="font-medium text-gray-900 text-xs sm:text-sm lg:text-base">Active Projects</span>
            </div>
            <p className="text-lg sm:text-2xl font-bold text-purple-600">3</p>
          </div>
        </div>
      </div>

      {/* Investors List - Desktop Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden hidden lg:block">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Current Investors</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Investor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Investment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Projects
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Returns
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Join Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {investors.map((investor) => (
                <tr key={investor.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                        <User className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{investor.name}</div>
                        <div className="text-sm text-gray-500">{investor.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ${investor.investment.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {investor.projects} active
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-green-600">
                      {investor.returns}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(investor.joinDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <button className="text-green-600 hover:text-green-700">
                        <Mail className="h-4 w-4" />
                      </button>
                      <button className="text-blue-600 hover:text-blue-700">
                        <Phone className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Investors List - Mobile Cards */}
      <div className="bg-white rounded-xl shadow-sm border lg:hidden">
        <div className="px-4 sm:px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Current Investors</h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {investors.map((investor) => (
            <div key={investor.id} className="p-4 sm:p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="h-6 w-6 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 truncate">{investor.name}</h4>
                      <p className="text-sm text-gray-500 truncate">{investor.email}</p>
                    </div>
                    <div className="flex space-x-2 ml-2">
                      <button className="text-green-600 hover:text-green-700 p-1">
                        <Mail className="h-4 w-4" />
                      </button>
                      <button className="text-blue-600 hover:text-blue-700 p-1">
                        <Phone className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                    <div>
                      <p className="text-gray-500">Investment</p>
                      <p className="font-medium text-gray-900">${investor.investment.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Projects</p>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {investor.projects} active
                      </span>
                    </div>
                    <div>
                      <p className="text-gray-500">Returns</p>
                      <p className="font-medium text-green-600">{investor.returns}%</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Joined</p>
                      <p className="font-medium text-gray-900">{new Date(investor.joinDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Investor Activity</h3>
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-start sm:items-center justify-between p-3 sm:p-4 bg-green-50 rounded-lg">
            <div className="flex items-start sm:items-center space-x-3">
              <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center flex-shrink-0">
                <DollarSign className="h-4 w-4 text-green-600" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900">David Thompson invested $25,000</p>
                <p className="text-sm text-gray-500 truncate">Almond Grove Expansion Project</p>
              </div>
            </div>
            <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap ml-2">2 hours ago</span>
          </div>

          <div className="flex items-start sm:items-center justify-between p-3 sm:p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start sm:items-center space-x-3">
              <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="h-4 w-4 text-blue-600" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900">New investor joined: Lisa Wang</p>
                <p className="text-sm text-gray-500 truncate">Invested $30,000 in irrigation project</p>
              </div>
            </div>
            <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap ml-2">1 day ago</span>
          </div>

          <div className="flex items-start sm:items-center justify-between p-3 sm:p-4 bg-orange-50 rounded-lg">
            <div className="flex items-start sm:items-center space-x-3">
              <div className="w-8 h-8 bg-orange-200 rounded-full flex items-center justify-center flex-shrink-0">
                <TrendingUp className="h-4 w-4 text-orange-600" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900">Return payment processed</p>
                <p className="text-sm text-gray-500 truncate">$3,200 distributed to Sarah Johnson</p>
              </div>
            </div>
            <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap ml-2">3 days ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestorsList;