import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  BarChart3,
  Coins,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Target,
  Activity
} from 'lucide-react';

const TokenDashboard = ({ actor, principal }) => {
  const [tokens, setTokens] = useState([]);
  const [selectedToken, setSelectedToken] = useState(null);
  const [tokenMetrics, setTokenMetrics] = useState({});
  const [investments, setInvestments] = useState([]);
  const [profitDistributions, setProfitDistributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form states
  const [createTokenForm, setCreateTokenForm] = useState({
    farmId: '',
    initialSupply: '',
    decimals: '8',
    fee: '10000',
    logo: ''
  });

  const [investmentForm, setInvestmentForm] = useState({
    farmId: '',
    amount: '',
    investor: ''
  });

  useEffect(() => {
    if (actor) {
      loadTokenData();
    }
  }, [actor]);

  const loadTokenData = async () => {
    try {
      setLoading(true);
      
      // Load all farm tokens
      const tokensResult = await actor.getAllFarmTokens();
      setTokens(tokensResult);

      // Load token analytics
      const analyticsResult = await actor.getTokenAnalytics();
      setTokenMetrics(analyticsResult);

      // Load user investments if principal is available
      if (principal) {
        const investmentsResult = await actor.getInvestorInvestments(principal);
        setInvestments(investmentsResult);
      }

      setError(null);
    } catch (err) {
      console.error('Error loading token data:', err);
      setError('Failed to load token data');
    } finally {
      setLoading(false);
    }
  };

  const loadTokenDetails = async (farmId) => {
    try {
      const [metricsResult, distributionsResult] = await Promise.all([
        actor.getTokenMetrics(farmId),
        actor.getFarmProfitDistributions(farmId)
      ]);

      if (metricsResult.ok) {
        setSelectedToken(metricsResult.ok);
      }
      setProfitDistributions(distributionsResult);
    } catch (err) {
      console.error('Error loading token details:', err);
    }
  };

  const handleCreateToken = async (e) => {
    e.preventDefault();
    try {
      const result = await actor.createFarmToken(
        createTokenForm.farmId,
        createTokenForm.initialSupply ? [parseInt(createTokenForm.initialSupply)] : [],
        createTokenForm.decimals ? [parseInt(createTokenForm.decimals)] : [],
        createTokenForm.fee ? [parseInt(createTokenForm.fee)] : [],
        createTokenForm.logo ? [createTokenForm.logo] : []
      );

      if (result.ok) {
        alert('Token created successfully!');
        setCreateTokenForm({
          farmId: '',
          initialSupply: '',
          decimals: '8',
          fee: '10000',
          logo: ''
        });
        loadTokenData();
      } else {
        alert('Error creating token: ' + result.err);
      }
    } catch (err) {
      console.error('Error creating token:', err);
      alert('Failed to create token');
    }
  };

  const handleRecordInvestment = async (e) => {
    e.preventDefault();
    try {
      const result = await actor.recordTokenInvestment(
        investmentForm.farmId,
        principal,
        parseInt(investmentForm.amount),
        parseInt(investmentForm.tokensReceived || '0')
      );

      if (result.ok) {
        alert('Investment recorded successfully!');
        setInvestmentForm({
          farmId: '',
          amount: '',
          tokensReceived: ''
        });
        loadTokenData();
      } else {
        alert('Error recording investment: ' + result.err);
      }
    } catch (err) {
      console.error('Error recording investment:', err);
      alert('Failed to record investment');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(amount / 100); // Assuming amounts are in cents
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num);
  };

  const TokenCard = ({ token }) => (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow" 
          onClick={() => loadTokenDetails(token.farmId)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{token.farmName}</CardTitle>
        <Badge variant="secondary">{token.symbol}</Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Total Supply</span>
            <span className="text-sm font-medium">{formatNumber(token.totalSupply)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Valuation</span>
            <span className="text-sm font-medium">{formatCurrency(token.valuation)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Expected Yield</span>
            <span className="text-sm font-medium text-green-600">
              {token.harvest_yield.toFixed(1)}%
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Location</span>
            <span className="text-sm">{token.location}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
        <Button onClick={loadTokenData} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Token Dashboard</h1>
        <Button onClick={loadTokenData} variant="outline">
          <Activity className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tokens</CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tokenMetrics.totalTokens || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Investments</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tokenMetrics.totalInvestments || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value Locked</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(tokenMetrics.totalValueLocked || 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Token Price</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(tokenMetrics.averageTokenPrice || 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="tokens" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tokens">Farm Tokens</TabsTrigger>
          <TabsTrigger value="investments">My Investments</TabsTrigger>
          <TabsTrigger value="create">Create Token</TabsTrigger>
          <TabsTrigger value="invest">Record Investment</TabsTrigger>
        </TabsList>

        <TabsContent value="tokens" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tokens.map((token) => (
              <TokenCard key={token.farmId} token={token} />
            ))}
          </div>

          {tokens.length === 0 && (
            <div className="text-center py-8">
              <Coins className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No tokens found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Create your first farm token to get started.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="investments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Investments</CardTitle>
            </CardHeader>
            <CardContent>
              {investments.length > 0 ? (
                <div className="space-y-4">
                  {investments.map((investment) => (
                    <div key={investment.id} className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{investment.farmId}</h4>
                        <p className="text-sm text-gray-600">
                          {formatNumber(investment.tokensReceived)} tokens
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(investment.amount)}</p>
                        <p className="text-sm text-gray-600">
                          @ {formatCurrency(investment.tokenPrice)}/token
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Wallet className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No investments found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Start investing in farm tokens to see them here.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create Farm Token</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateToken} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Farm ID</label>
                  <Input
                    value={createTokenForm.farmId}
                    onChange={(e) => setCreateTokenForm({...createTokenForm, farmId: e.target.value})}
                    placeholder="Enter farm ID"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Initial Supply (optional)</label>
                  <Input
                    type="number"
                    value={createTokenForm.initialSupply}
                    onChange={(e) => setCreateTokenForm({...createTokenForm, initialSupply: e.target.value})}
                    placeholder="Leave empty for auto-calculation"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Decimals</label>
                  <Input
                    type="number"
                    value={createTokenForm.decimals}
                    onChange={(e) => setCreateTokenForm({...createTokenForm, decimals: e.target.value})}
                    min="0"
                    max="18"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Fee (smallest units)</label>
                  <Input
                    type="number"
                    value={createTokenForm.fee}
                    onChange={(e) => setCreateTokenForm({...createTokenForm, fee: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Logo URL (optional)</label>
                  <Input
                    value={createTokenForm.logo}
                    onChange={(e) => setCreateTokenForm({...createTokenForm, logo: e.target.value})}
                    placeholder="https://..."
                  />
                </div>
                <Button type="submit" className="w-full">
                  Create Token
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invest" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Record Investment</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRecordInvestment} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Farm ID</label>
                  <Input
                    value={investmentForm.farmId}
                    onChange={(e) => setInvestmentForm({...investmentForm, farmId: e.target.value})}
                    placeholder="Enter farm ID"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Investment Amount (KES cents)</label>
                  <Input
                    type="number"
                    value={investmentForm.amount}
                    onChange={(e) => setInvestmentForm({...investmentForm, amount: e.target.value})}
                    placeholder="Amount in cents (e.g., 10000 = KES 100)"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Tokens Received</label>
                  <Input
                    type="number"
                    value={investmentForm.tokensReceived}
                    onChange={(e) => setInvestmentForm({...investmentForm, tokensReceived: e.target.value})}
                    placeholder="Number of tokens received"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Record Investment
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Token Details Modal/Panel */}
      {selectedToken && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>{selectedToken.farmId} Token Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium">Token Information</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Current Price:</span>
                    <span className="font-medium">{formatCurrency(selectedToken.currentPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Market Cap:</span>
                    <span className="font-medium">{formatCurrency(selectedToken.marketCap)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Supply:</span>
                    <span className="font-medium">{formatNumber(selectedToken.totalSupply)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Holders:</span>
                    <span className="font-medium">{selectedToken.holders}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium">Profit Distributions</h4>
                {profitDistributions.length > 0 ? (
                  <div className="space-y-2">
                    {profitDistributions.slice(0, 5).map((dist) => (
                      <div key={dist.id} className="flex justify-between text-sm">
                        <span>{new Date(Number(dist.distributionDate) / 1000000).toLocaleDateString()}</span>
                        <span className="font-medium text-green-600">
                          {formatCurrency(dist.totalProfit)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">No profit distributions yet</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TokenDashboard;
