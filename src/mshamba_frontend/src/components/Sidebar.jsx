import React from 'react';
import { Sprout, DollarSign, TrendingUp, Wheat, Wallet } from 'lucide-react';

export const Sidebar = ({
  myInvestments,
  onListFarm,
  onBrowseInvestments,
  onMarketAnalysis,
  onSupplyChain,
  onChat,
  onFarmerRecords,
  onConnectWallet,
  wallet
}) => {
  return (
    <div className="space-y-6">
      {/* Wallet Section */}
      {!wallet ? (
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Connect Wallet</h3>
          <div className="text-sm text-gray-400 mb-4">
            Connect your wallet to start investing in farms and receive tokens
          </div>
          <button 
            onClick={onConnectWallet}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
          >
            <Wallet className="w-4 h-4" />
            <span>Connect Wallet</span>
          </button>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <Wallet className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="font-medium">{wallet.name}</div>
              <div className="text-sm text-gray-400">Connected</div>
            </div>
          </div>
          <div className="text-sm text-green-400 font-medium">
            Total Balance: $6,526.00
          </div>
        </div>
      )}
      {/* Quick Actions */}
      <div className="bg-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="space-y-3">
          <button 
            onClick={onListFarm}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
          >
            <Sprout className="w-4 h-4" />
            <span>List Your Farm</span>
          </button>
          <button 
            onClick={onBrowseInvestments}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
          >
            <DollarSign className="w-4 h-4" />
            <span>Browse Investments</span>
          </button>
          <button 
            onClick={onMarketAnalysis}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
          >
            <TrendingUp className="w-4 h-4" />
            <span>Market Analysis</span>
          </button>
          <button 
            onClick={onSupplyChain}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
          >
            <TrendingUp className="w-4 h-4" />
            <span>Supply Chain</span>
          </button>
          <button 
            onClick={onFarmerRecords}
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
          >
            <TrendingUp className="w-4 h-4" />
            <span>Farm Records</span>
          </button>
        </div>
      </div>

      {/* Investment Opportunities */}
      <div className="bg-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-2">Featured Opportunity</h3>
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-4 mb-4">
          <div className="flex items-center space-x-3 mb-2">
            <Wheat className="w-6 h-6 text-white" />
            <div>
              <div className="font-semibold text-white">Premium Maize Farm</div>
              <div className="text-green-100 text-sm">Nakuru County</div>
            </div>
          </div>
          <div className="text-green-100 text-sm mb-3">
            High-yield maize farming with guaranteed 25% ROI in 6 months
          </div>
          <button className="w-full bg-white text-green-700 py-2 rounded font-medium hover:bg-gray-100 transition-colors">
            Invest $10,000
          </button>
        </div>
      </div>

      {/* My Investments */}
      <div className="bg-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">My Investments</h3>
        <div className="space-y-3">
          {myInvestments.map((investment, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
              <div>
                <div className="font-medium text-sm">{investment.name}</div>
                <div className="text-gray-400 text-xs">{investment.amount}</div>
              </div>
              <div className="text-right">
                <div className="text-green-400 text-sm font-medium">{investment.returns}</div>
                <div className="text-gray-400 text-xs">{investment.status}</div>
              </div>
            </div>
          ))}
        </div>
        <button 
          onClick={() => alert('View All Investments clicked')}
          className="w-full mt-4 text-green-400 hover:text-green-300 text-sm font-medium transition-colors"
        >
          View All Investments →
        </button>
      </div>

      {/* Market Stats */}
      <div className="bg-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Market Overview</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Maize Price</span>
            <span className="text-green-400 font-medium">KSh 45/kg ↑</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Coffee Price</span>
            <span className="text-green-400 font-medium">KSh 120/kg ↑</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Bean Price</span>
            <span className="text-red-400 font-medium">KSh 80/kg ↓</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Active Farmers</span>
            <span className="text-white font-medium">2,847</span>
          </div>
        </div>
      </div>
    </div>
  );
};