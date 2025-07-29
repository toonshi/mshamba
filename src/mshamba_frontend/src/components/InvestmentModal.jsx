import React, { useState } from 'react';
import { DollarSign, Coins, TrendingUp, Clock, Shield } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export const InvestmentModal = ({ farm, isOpen, onClose, onInvest, walletBalance }) => {
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [isProcessing, setIsProcessing] = useState(false);

  const currencies = [
    { symbol: 'USD', balance: 2500, rate: 1 },
    { symbol: 'ICP', balance: 125.50, rate: 12 },
    { symbol: 'ckBTC', balance: 0.0234, rate: 50000 },
    { symbol: 'KES', balance: 45000, rate: 0.0078 }
  ];

  const selectedCurrencyData = currencies.find(c => c.symbol === selectedCurrency);
  const usdAmount = parseFloat(investmentAmount) * selectedCurrencyData?.rate || 0;
  const tokensToReceive = Math.floor(usdAmount / 10); // 1 token = $10
  const projectedReturns = usdAmount * (parseFloat(farm.expectedReturn) / 100);

  const handleInvest = async () => {
    if (!investmentAmount || parseFloat(investmentAmount) <= 0) return;
    
    setIsProcessing(true);
    
    // Simulate investment process
    setTimeout(() => {
      onInvest({
        farmId: farm.id,
        amount: parseFloat(investmentAmount),
        currency: selectedCurrency,
        usdValue: usdAmount,
        tokens: tokensToReceive
      });
      setIsProcessing(false);
      onClose();
      setInvestmentAmount('');
    }, 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Invest in {farm.name}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            ✕
          </button>
        </div>

        {/* Farm Summary */}
        <div className="bg-gray-700 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className={`w-10 h-10 ${farm.color} rounded-lg flex items-center justify-center`}>
              <farm.icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-semibold">{farm.name}</div>
              <div className="text-sm text-gray-400">{farm.location}</div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-gray-400">Expected ROI</div>
              <div className="font-medium text-green-400">{farm.expectedReturn}</div>
            </div>
            <div>
              <div className="text-gray-400">Duration</div>
              <div className="font-medium">{farm.duration}</div>
            </div>
            <div>
              <div className="text-gray-400">Min. Investment</div>
              <div className="font-medium">{farm.minInvestment}</div>
            </div>
          </div>
        </div>

        {/* Currency Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Select Currency</label>
          <div className="grid grid-cols-2 gap-2">
            {currencies.map((currency) => (
              <button
                key={currency.symbol}
                onClick={() => setSelectedCurrency(currency.symbol)}
                className={`p-3 rounded-lg border transition-colors ${
                  selectedCurrency === currency.symbol
                    ? 'border-green-500 bg-green-600 bg-opacity-20'
                    : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                }`}
              >
                <div className="font-medium">{currency.symbol}</div>
                <div className="text-sm text-gray-400">
                  Balance: {currency.balance} {currency.symbol}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Investment Amount */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Investment Amount</label>
          <div className="relative">
            <input
              type="number"
              value={investmentAmount}
              onChange={(e) => setInvestmentAmount(e.target.value)}
              placeholder={`Enter amount in ${selectedCurrency}`}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500"
            />
            <div className="absolute right-3 top-3 text-gray-400">
              {selectedCurrency}
            </div>
          </div>
          {usdAmount > 0 && (
            <div className="text-sm text-gray-400 mt-1">
              ≈ {formatCurrency(usdAmount)} USD
            </div>
          )}
        </div>

        {/* Investment Summary */}
        {usdAmount > 0 && (
          <div className="bg-gray-700 rounded-lg p-4 mb-6">
            <h3 className="font-medium mb-3 flex items-center">
              <Coins className="w-4 h-4 mr-2" />
              Investment Summary
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Investment Amount:</span>
                <span>{formatCurrency(usdAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Farm Tokens to Receive:</span>
                <span className="text-green-400">{tokensToReceive} {farm.name.split(' ')[0].toUpperCase()}T</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Projected Returns ({farm.expectedReturn}):</span>
                <span className="text-green-400">+{formatCurrency(projectedReturns)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Investment Period:</span>
                <span>{farm.duration}</span>
              </div>
            </div>
          </div>
        )}

        {/* Investment Benefits */}
        <div className="bg-gray-700 rounded-lg p-4 mb-6">
          <h3 className="font-medium mb-3">Investment Benefits</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span>Receive farm tokens representing your investment share</span>
            </div>
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-green-400" />
              <span>Earn profits based on actual farm performance</span>
            </div>
            <div className="flex items-center space-x-2">
              <Coins className="w-4 h-4 text-green-400" />
              <span>Trade tokens with other investors anytime</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-green-400" />
              <span>Transparent tracking and regular updates</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-600 hover:bg-gray-500 py-3 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleInvest}
            disabled={!investmentAmount || parseFloat(investmentAmount) <= 0 || isProcessing}
            className="flex-1 bg-green-600 hover:bg-green-700 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isProcessing ? (
              <>
                <div className="spinner"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <DollarSign className="w-4 h-4" />
                <span>Invest Now</span>
              </>
            )}
          </button>
        </div>

        {/* Risk Disclaimer */}
        <div className="mt-4 p-3 bg-yellow-600 bg-opacity-20 border border-yellow-600 rounded-lg">
          <div className="text-sm text-yellow-200">
            <strong>Risk Disclaimer:</strong> Agricultural investments carry inherent risks including weather, market conditions, and crop performance. Past performance does not guarantee future results.
          </div>
        </div>
      </div>
    </div>
  );
};