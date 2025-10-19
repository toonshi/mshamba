import React, { useState, useEffect, useCallback } from 'react';
import { Wallet, TrendingUp, TrendingDown, Eye, EyeOff, RefreshCw, PieChart, Clock, ArrowUpRight, ArrowDownLeft, Download } from 'lucide-react';
import { LineChart, Line, PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const MyAccount = () => {
  const { actor, principal, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [hideBalances, setHideBalances] = useState(false);
  const [investments, setInvestments] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [totalInvested, setTotalInvested] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  const [transactions, setTransactions] = useState([]);

  const fetchAccountData = useCallback(async () => {
    console.log('fetchAccountData called. Actor:', !!actor, 'Principal:', !!principal, 'Authenticated:', isAuthenticated);
    
    if (!actor || !principal) {
      console.warn('Waiting for authentication... Actor:', !!actor, 'Principal:', !!principal);
      // Don't set loading to false yet, we're waiting for auth
      return;
    }

    setLoading(true);
    try {
      // Get all farms
      const farms = await actor.listFarms();
      
      console.log('=== INVESTMENT DEBUG ===');
      console.log('My Principal:', principal.toText());
      console.log('Total Farms:', farms.length);
      console.log('Farms with investors:', farms.filter(f => f.investors && f.investors.length > 0).length);
      
      // Debug: Show all investors in all farms
      farms.forEach(farm => {
        if (farm.investors && farm.investors.length > 0) {
          console.log(`Farm "${farm.name}" has ${farm.investors.length} investors:`);
          farm.investors.forEach(inv => {
            console.log(`  - Investor: ${inv.investor.toText()}, Amount: ${inv.amount}, Shares: ${inv.shares}`);
            console.log(`  - Match: ${inv.investor.toText() === principal.toText()}`);
          });
        }
      });
      
      // Filter farms where user has invested
      const userInvestments = farms
        .filter(farm => {
          return farm.investors && farm.investors.some(inv => 
            inv.investor.toText() === principal.toText()
          );
        })
        .map(farm => {
          const userInvestment = farm.investors.find(inv => 
            inv.investor.toText() === principal.toText()
          );
          
          const invested = Number(userInvestment?.amount || 0);
          const tokensHeld = Number(userInvestment?.shares || 0);
          
          // Simulate token price growth (5-15% gain for demo)
          const growthRate = 1 + (Math.random() * 0.10 + 0.05);
          const currentValue = invested * growthRate;
          const gains = currentValue - invested;
          const roi = invested > 0 ? ((gains / invested) * 100).toFixed(2) : 0;

          return {
            farmId: farm.farmId,
            farmName: farm.name,
            location: farm.location,
            crop: farm.crop,
            invested: invested,
            currentValue: currentValue,
            gains: gains,
            roi: roi,
            tokensHeld: tokensHeld,
            tokenSymbol: farm.tokenSymbol,
            status: farm.status,
            farmerName: farm.farmerName,
            duration: farm.duration,
            expectedROI: farm.expectedROI,
          };
        });

      console.log('Found', userInvestments.length, 'investments for this user');
      if (userInvestments.length === 0) {
        console.warn('⚠️ No investments found! Possible issues:');
        console.warn('1. Farm is not open for investment');
        console.warn('2. Investment transaction failed');
        console.warn('3. Principal mismatch');
        console.warn('4. Canister was recently reinstalled (data lost)');
      }

      setInvestments(userInvestments);
      
      // Calculate totals
      const invested = userInvestments.reduce((sum, inv) => sum + inv.invested, 0);
      const currentValue = userInvestments.reduce((sum, inv) => sum + inv.currentValue, 0);
      
      setTotalInvested(invested);
      setTotalBalance(currentValue);
      
      // Generate transaction history
      const txHistory = userInvestments.flatMap(inv => ([
        {
          id: `invest-${inv.farmId}`,
          type: 'deposit',
          farmName: inv.farmName,
          amount: inv.invested,
          tokens: inv.tokensHeld,
          tokenSymbol: inv.tokenSymbol,
          date: Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
          status: 'completed'
        }
      ])).sort((a, b) => b.date - a.date);
      
      setTransactions(txHistory);
    } catch (error) {
      console.error('Error fetching account data:', error);
    } finally {
      setLoading(false);
    }
  }, [actor, principal]);

  useEffect(() => {
    fetchAccountData();
  }, [fetchAccountData]);

  const formatAmount = (amount) => {
    if (hideBalances) return '****';
    return `KSH ${amount.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const totalGains = totalBalance - totalInvested;
  const totalROI = totalInvested > 0 ? ((totalGains / totalInvested) * 100).toFixed(2) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-3" />
          <p className="text-gray-600">Loading account...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
              <p className="text-gray-600">Portfolio overview and investments</p>
              {principal && (
                <p className="text-xs text-gray-500 mt-1 font-mono">Principal: {principal.toText()}</p>
              )}
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setHideBalances(!hideBalances)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {hideBalances ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span className="text-sm">{hideBalances ? 'Show' : 'Hide'}</span>
            </button>
            <button
              onClick={fetchAccountData}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="text-sm">Refresh</span>
            </button>
          </div>
        </div>

        {/* Account Balance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Balance */}
          <div className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Total Balance</span>
              <Wallet className="w-5 h-5 text-gray-400" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {formatAmount(totalBalance)}
            </div>
            <div className="flex items-center gap-2">
              {totalGains >= 0 ? (
                <TrendingUp className="w-4 h-4 text-green-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600" />
              )}
              <span className={`text-sm font-medium ${totalGains >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {hideBalances ? '****' : `${totalGains >= 0 ? '+' : ''}${totalGains.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              </span>
              <span className="text-sm text-gray-500">
                ({totalROI}%)
              </span>
            </div>
          </div>

          {/* Total Invested */}
          <div className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Total Invested</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {formatAmount(totalInvested)}
            </div>
            <div className="text-sm text-gray-500">
              Across {investments.length} {investments.length === 1 ? 'farm' : 'farms'}
            </div>
          </div>

          {/* Total Gains */}
          <div className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Total Gains/Loss</span>
            </div>
            <div className={`text-3xl font-bold mb-1 ${totalGains >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {hideBalances ? '****' : `${totalGains >= 0 ? '+' : ''}${formatAmount(totalGains).replace('KSH ', 'KSH ')}`}
            </div>
            <div className="text-sm text-gray-500">
              ROI: {totalROI}%
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'overview'
                ? 'border-b-2 border-green-600 text-green-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'portfolio'
                ? 'border-b-2 border-green-600 text-green-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Portfolio Chart
          </button>
          <button
            onClick={() => setActiveTab('allocation')}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'allocation'
                ? 'border-b-2 border-green-600 text-green-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Asset Allocation
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'transactions'
                ? 'border-b-2 border-green-600 text-green-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Transactions
          </button>
          <button
            onClick={() => setActiveTab('wallet')}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'wallet'
                ? 'border-b-2 border-green-600 text-green-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Wallet
          </button>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && investments.length > 0 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Estimated Earnings */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <h3 className="font-semibold text-gray-900">Estimated Earnings</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Expected Annual Return</span>
                      <span className="font-semibold text-gray-900">
                        {formatAmount(totalInvested * 0.25)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Next Dividend (Est.)</span>
                      <span className="font-semibold text-green-600">
                        {formatAmount(totalBalance * 0.03)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Expected Date</span>
                      <span className="font-semibold text-gray-900">
                        {new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <PieChart className="w-5 h-5 text-gray-700" />
                    <h3 className="font-semibold text-gray-900">Quick Stats</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Active Investments</span>
                      <span className="font-semibold text-gray-900">{investments.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Best Performer</span>
                      <span className="font-semibold text-green-600">
                        +{Math.max(...investments.map(i => parseFloat(i.roi))).toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Transactions</span>
                      <span className="font-semibold text-gray-900">{transactions.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Portfolio Chart Tab */}
          {activeTab === 'portfolio' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Portfolio Value Over Time</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={(() => {
                      const data = [];
                      const now = Date.now();
                      for (let i = 30; i >= 0; i--) {
                        const date = new Date(now - i * 24 * 60 * 60 * 1000);
                        const value = totalInvested + (totalGains / 30) * (30 - i);
                        data.push({
                          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                          value: value
                        });
                      }
                      return data;
                    })()}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                    <YAxis stroke="#6b7280" fontSize={12} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                      formatter={(value) => `KSH ${value.toLocaleString('en-KE', { minimumFractionDigits: 2 })}`}
                    />
                    <Line type="monotone" dataKey="value" stroke="#16a34a" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Asset Allocation Tab */}
          {activeTab === 'allocation' && investments.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Asset Allocation</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-80 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPie>
                      <Pie
                        data={investments.map(inv => ({
                          name: inv.farmName,
                          value: inv.currentValue
                        }))}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {investments.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={`hsl(${index * 360 / investments.length}, 70%, 50%)`} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => `KSH ${value.toLocaleString('en-KE', { minimumFractionDigits: 2 })}`}
                      />
                    </RechartsPie>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-3">
                  {investments.map((inv, index) => (
                    <div key={inv.farmId} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: `hsl(${index * 360 / investments.length}, 70%, 50%)` }}
                        />
                        <div>
                          <p className="font-medium text-gray-900">{inv.farmName}</p>
                          <p className="text-xs text-gray-600">{inv.crop}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {formatAmount(inv.currentValue)}
                        </p>
                        <p className="text-xs text-gray-600">
                          {((inv.currentValue / totalBalance) * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Transactions Tab */}
          {activeTab === 'transactions' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Transaction History</h3>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
              {transactions.length === 0 ? (
                <div className="text-center py-12">
                  <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No transactions yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {transactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          tx.type === 'deposit' ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          {tx.type === 'deposit' ? (
                            <ArrowDownLeft className="w-5 h-5 text-green-600" />
                          ) : (
                            <ArrowUpRight className="w-5 h-5 text-red-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{tx.type === 'deposit' ? 'Investment' : 'Withdrawal'}</p>
                          <p className="text-sm text-gray-600">{tx.farmName}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${tx.type === 'deposit' ? 'text-green-600' : 'text-red-600'}`}>
                          {tx.type === 'deposit' ? '+' : '-'}{formatAmount(tx.amount)}
                        </p>
                        <p className="text-xs text-gray-600">
                          {tx.tokens.toLocaleString()} {tx.tokenSymbol}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(tx.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Wallet Tab */}
          {activeTab === 'wallet' && (
            <div className="space-y-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Wallet className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">ICP Wallet Integration</h3>
                <p className="text-gray-600 mb-6">Connect your ICP wallet to deposit or withdraw funds</p>
                <div className="flex gap-4 justify-center">
                  <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2">
                    <ArrowDownLeft className="w-4 h-4" />
                    Deposit ICP
                  </button>
                  <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center gap-2">
                    <ArrowUpRight className="w-4 h-4" />
                    Withdraw
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Available Balance</p>
                  <p className="text-2xl font-bold text-gray-900">{formatAmount(0)}</p>
                  <p className="text-xs text-gray-500 mt-1">ICP Wallet</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">In Farms</p>
                  <p className="text-2xl font-bold text-green-600">{formatAmount(totalBalance)}</p>
                  <p className="text-xs text-gray-500 mt-1">Locked in investments</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">{formatAmount(0)}</p>
                  <p className="text-xs text-gray-500 mt-1">Processing transactions</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* My Investments */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">My Investments</h2>
          <p className="text-sm text-gray-600 mt-1">Track your farm investments and performance</p>
        </div>

        {investments.length === 0 ? (
          <div className="p-12 text-center">
            <Wallet className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Investments Yet</h3>
            <p className="text-gray-600 mb-6">Start investing in farms to see your portfolio here</p>
            <button
              onClick={() => navigate('/investor/dashboard/farms')}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Browse Farms
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {investments.map((investment) => (
              <div
                key={investment.farmId}
                className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => navigate(`/investor/farm/${investment.farmId}`)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {investment.farmName}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {investment.location} • {investment.crop} • {investment.farmerName}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600 mb-1">Current Value</div>
                    <div className="text-xl font-bold text-gray-900">
                      {formatAmount(investment.currentValue)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Invested</div>
                    <div className="text-sm font-semibold text-gray-900">
                      {formatAmount(investment.invested)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Tokens Held</div>
                    <div className="text-sm font-semibold text-gray-900">
                      {hideBalances ? '****' : investment.tokensHeld.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">{investment.tokenSymbol}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Gains/Loss</div>
                    <div className={`text-sm font-semibold ${investment.gains >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {hideBalances ? '****' : `${investment.gains >= 0 ? '+' : ''}${investment.gains.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">ROI</div>
                    <div className={`text-sm font-semibold ${investment.roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {investment.roi}%
                    </div>
                    <div className="text-xs text-gray-500">Expected: {investment.expectedROI}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    Duration: {investment.duration} months
                  </div>
                  <button className="text-sm text-gray-700 hover:text-gray-900 font-medium">
                    View Details →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAccount;
