import React, { useState } from 'react';
import { Wallet, Plus, ArrowUpRight, ArrowDownLeft, Copy, Check, TrendingUp } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export const WalletDashboard = ({ wallet, onDeposit, onWithdraw, onDisconnect }) => {
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [activeTab, setActiveTab] = useState('balance');

  const balances = [
    { currency: 'ICP', amount: 125.50, usdValue: 1506.00, change: '+12.5%' },
    { currency: 'ckBTC', amount: 0.0234, usdValue: 1170.00, change: '+8.2%' },
    { currency: 'USD', amount: 2500.00, usdValue: 2500.00, change: '0%' },
    { currency: 'KES', amount: 45000, usdValue: 350.00, change: '-1.2%' }
  ];

  const farmTokens = [
    { name: 'Green Valley Farm Token', symbol: 'GVFT', amount: 500, value: 2500, apy: '18%' },
    { name: 'Coffee Estate Token', symbol: 'CEFT', amount: 200, value: 1600, apy: '22%' },
    { name: 'Vegetable Farm Token', symbol: 'VEFT', amount: 150, value: 450, apy: '15%' }
  ];

  const transactions = [
    { type: 'invest', farm: 'Green Valley Farm', amount: '$5,000', tokens: '+500 GVFT', date: '2 hours ago' },
    { type: 'profit', farm: 'Coffee Estate', amount: '+$180', tokens: '200 CEFT', date: '1 day ago' },
    { type: 'deposit', farm: 'Wallet', amount: '+$2,500', tokens: '', date: '3 days ago' },
    { type: 'trade', farm: 'Token Exchange', amount: '$750', tokens: '-75 VEFT', date: '1 week ago' }
  ];

  const copyAddress = () => {
    navigator.clipboard.writeText(wallet.address);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const totalBalance = balances.reduce((sum, balance) => sum + balance.usdValue, 0);
  const totalTokenValue = farmTokens.reduce((sum, token) => sum + token.value, 0);

  return (
    <div className="bg-gray-800 rounded-xl p-6">
      {/* Wallet Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold">{wallet.name}</h2>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span>{wallet.address?.slice(0, 8)}...{wallet.address?.slice(-6)}</span>
              <button onClick={copyAddress} className="hover:text-white">
                {copiedAddress ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
        <button 
          onClick={onDisconnect}
          className="text-red-400 hover:text-red-300 text-sm"
        >
          Disconnect
        </button>
      </div>

      {/* Total Portfolio Value */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-1">Total Wallet Balance</div>
          <div className="text-2xl font-bold text-green-400">{formatCurrency(totalBalance)}</div>
        </div>
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-1">Farm Tokens Value</div>
          <div className="text-2xl font-bold text-blue-400">{formatCurrency(totalTokenValue)}</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3 mb-6">
        <button 
          onClick={onDeposit}
          className="flex-1 bg-green-600 hover:bg-green-700 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Deposit</span>
        </button>
        <button 
          onClick={onWithdraw}
          className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
        >
          <ArrowUpRight className="w-4 h-4" />
          <span>Withdraw</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-700 p-1 rounded-lg mb-6">
        <button
          onClick={() => setActiveTab('balance')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'balance' ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          Balances
        </button>
        <button
          onClick={() => setActiveTab('tokens')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'tokens' ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          Farm Tokens
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'history' ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          History
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'balance' && (
        <div className="space-y-3">
          {balances.map((balance) => (
            <div key={balance.currency} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                  {balance.currency.slice(0, 2)}
                </div>
                <div>
                  <div className="font-medium">{balance.amount} {balance.currency}</div>
                  <div className="text-sm text-gray-400">{formatCurrency(balance.usdValue)}</div>
                </div>
              </div>
              <div className={`text-sm font-medium ${
                balance.change.startsWith('+') ? 'text-green-400' : 
                balance.change.startsWith('-') ? 'text-red-400' : 'text-gray-400'
              }`}>
                {balance.change}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'tokens' && (
        <div className="space-y-3">
          {farmTokens.map((token) => (
            <div key={token.symbol} className="p-4 bg-gray-700 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="font-medium">{token.name}</div>
                  <div className="text-sm text-gray-400">{token.amount} {token.symbol}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{formatCurrency(token.value)}</div>
                  <div className="text-sm text-green-400 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {token.apy} APY
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="flex-1 bg-green-600 hover:bg-green-700 py-1 px-3 rounded text-sm transition-colors">
                  Trade
                </button>
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 py-1 px-3 rounded text-sm transition-colors">
                  Sell
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'history' && (
        <div className="space-y-3">
          {transactions.map((tx, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  tx.type === 'invest' ? 'bg-green-600' :
                  tx.type === 'profit' ? 'bg-blue-600' :
                  tx.type === 'deposit' ? 'bg-purple-600' : 'bg-orange-600'
                }`}>
                  {tx.type === 'invest' ? <ArrowDownLeft className="w-4 h-4" /> :
                   tx.type === 'profit' ? <TrendingUp className="w-4 h-4" /> :
                   tx.type === 'deposit' ? <Plus className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                </div>
                <div>
                  <div className="font-medium capitalize">{tx.type}</div>
                  <div className="text-sm text-gray-400">{tx.farm}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">{tx.amount}</div>
                {tx.tokens && <div className="text-sm text-gray-400">{tx.tokens}</div>}
                <div className="text-xs text-gray-500">{tx.date}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};