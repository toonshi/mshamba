import React, { useState, useEffect } from 'react';
import { mshamba_backend } from 'declarations/mshamba_backend';
import TradingCharts from './components/TradingCharts';
import './components/TradingCharts.css';
import './App.css';

function App() {
  const [farms, setFarms] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [marketData, setMarketData] = useState({});

  // Fetch farms and market data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('Fetching farms from backend...');
        
        // Get all farms
        const farmsList = await mshamba_backend.listFarms();
        console.log('Raw farms data:', farmsList);
        
        // listFarms returns array directly, not Result type
        if (farmsList && Array.isArray(farmsList)) {
          // Clean and validate farm data with BigInt conversion
          const cleanedFarms = farmsList.map(farm => ({
            ...farm,
            id: farm.farmId || farm.id || 'unknown',
            currentFunding: typeof farm.fundedAmount === 'bigint' ? Number(farm.fundedAmount) : (farm.fundedAmount || 0),
            fundingGoal: typeof farm.fundingGoal === 'bigint' ? Number(farm.fundingGoal) : (farm.fundingGoal || 1),
            sharePrice: typeof farm.sharePrice === 'bigint' ? Number(farm.sharePrice) : (farm.sharePrice || 0),
            totalShares: typeof farm.totalShares === 'bigint' ? Number(farm.totalShares) : (farm.totalShares || 1000000),
            investors: farm.investors || [],
            landSize: typeof farm.landSize === 'bigint' ? Number(farm.landSize) : (farm.landSize || 0),
            cropType: farm.cropType || { Mixed: null }
          }));
          
          console.log('Cleaned farms data:', cleanedFarms);
          setFarms(cleanedFarms);
          
          // Select first farm by default
          if (cleanedFarms.length > 0) {
            setSelectedFarm(cleanedFarms[0]);
            console.log('Selected farm:', cleanedFarms[0]);
            
            // Fetch market data for the selected farm
            await fetchMarketData(cleanedFarms[0].id);
          }
        } else {
          console.error('Invalid farms data:', farmsList);
          setError('Failed to fetch farms: No farms available or invalid response');
        }
      } catch (err) {
        console.error('Backend connection error:', err);
        setError('Error connecting to backend: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch market data for a specific farm
  const fetchMarketData = async (farmId) => {
    try {
      console.log('Fetching market data for farm:', farmId);
      
      // Initialize with safe defaults
      let orderBookData = { buyOrders: [], sellOrders: [] };
      let balance = 0;
      let analytics = null;
      
      try {
        // Get market orders (order book)
        const orderBook = await mshamba_backend.getOrderBook(farmId);
        console.log('Order book data:', orderBook);
        if (orderBook) {
          orderBookData = {
            buyOrders: orderBook.buyOrders || [],
            sellOrders: orderBook.sellOrders || []
          };
        }
      } catch (err) {
        console.warn('Failed to fetch order book:', err);
      }
      
      try {
        // Get token balance info
        const rawBalance = await mshamba_backend.getTokenBalance(farmId);
        balance = typeof rawBalance === 'bigint' ? Number(rawBalance) : (rawBalance || 0);
        console.log('Token balance:', balance);
      } catch (err) {
        console.warn('Failed to fetch token balance:', err);
        balance = 0; // Safe fallback
      }
      
      try {
        // Get farm valuation history (analytics)
        const valuationResult = await mshamba_backend.getFarmValuationHistory(farmId);
        console.log('Valuation result:', valuationResult);
        analytics = 'ok' in valuationResult ? valuationResult.ok : null;
      } catch (err) {
        console.warn('Failed to fetch valuation history:', err);
      }
      
      const marketDataResult = {
        orderBook: orderBookData,
        balance,
        analytics,
        trades: [] // Will be populated with real trade history
      };
      
      console.log('Final market data:', marketDataResult);
      setMarketData(marketDataResult);
    } catch (err) {
      console.error('Error fetching market data:', err);
      // Set safe defaults even on error
      setMarketData({
        orderBook: { buyOrders: [], sellOrders: [] },
        balance: 0,
        analytics: null,
        trades: []
      });
    }
  };

  // Handle farm selection
  const handleFarmSelect = async (farm) => {
    setSelectedFarm(farm);
    await fetchMarketData(farm.id);
  };

  // Create a sample farm for demo purposes
  const createSampleFarm = async () => {
    try {
      const result = await mshamba_backend.createFarm(
        "Demo Organic Farm",
        "A demonstration farm for testing the trading interface with real backend integration.",
        "Nairobi, Kenya",
        25000000000000, // 250,000 ICP in e8s
        15.5,
        { Vegetables: null },
        8,
        true,
        7,
        9,
        3
      );
      
      if ('ok' in result) {
        // Refresh farms list
        const farmsList = await mshamba_backend.listFarms();
        if (farmsList && Array.isArray(farmsList)) {
          setFarms(farmsList);
          setSelectedFarm(result.ok);
          await fetchMarketData(result.ok.id);
        }
      } else {
        setError('Failed to create sample farm: ' + result.err);
      }
    } catch (err) {
      setError('Error creating sample farm: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <h2>Loading Mshamba Platform...</h2>
        <p>Connecting to blockchain and fetching farm data</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>🚨 Connection Error</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="retry-btn">
          Retry Connection
        </button>
        <button onClick={createSampleFarm} className="demo-btn">
          Create Sample Farm
        </button>
      </div>
    );
  }

  return (
    <div className="mshamba-app">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="logo-section">
            <h1>🌾 Mshamba</h1>
            <p>Decentralized Agricultural Investment Platform</p>
          </div>
          <div className="stats-section">
            <div className="stat">
              <span className="stat-value">{farms.length}</span>
              <span className="stat-label">Active Farms</span>
            </div>
            <div className="stat">
              <span className="stat-value">
                {farms.reduce((sum, farm) => sum + (farm.currentFunding || 0), 0) / 100000000}
              </span>
              <span className="stat-label">Total ICP Invested</span>
            </div>
            <div className="stat">
              <span className="stat-value">
                {farms.reduce((sum, farm) => sum + (farm.investors?.length || 0), 0)}
              </span>
              <span className="stat-label">Total Investors</span>
            </div>
          </div>
        </div>
      </header>

      {/* Farm Selector */}
      {farms.length > 0 && (
        <div className="farm-selector">
          <h3>Select Farm to View Trading Data:</h3>
          <div className="farm-grid">
            {farms.map((farm) => (
              <div
                key={farm.id}
                className={`farm-card ${selectedFarm?.id === farm.id ? 'selected' : ''}`}
                onClick={() => handleFarmSelect(farm)}
              >
                <h4>{farm.name}</h4>
                <p className="farm-location">📍 {farm.location}</p>
                <div className="farm-stats">
                  <span>💰 {((farm.sharePrice || 0) / 100000000).toFixed(6)} ICP/share</span>
                  <span>🎯 {(((farm.currentFunding || 0) / (farm.fundingGoal || 1)) * 100).toFixed(1)}% funded</span>
                </div>
                <div className="farm-metrics">
                  <span>🌱 {farm.cropType ? Object.keys(farm.cropType)[0] : 'Mixed'}</span>
                  <span>📏 {farm.landSize || 0} acres</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trading Charts */}
      {selectedFarm ? (
        <div className="trading-charts-wrapper">
          <TradingCharts
            farmId={selectedFarm.id}
            farmData={selectedFarm}
            priceHistory={[]} // Will be populated with real price history
            orderBook={marketData.orderBook || { buyOrders: [], sellOrders: [] }}
            trades={marketData.trades || []}
          />
        </div>
      ) : (
        <div className="no-farm-selected">
          <h3>No Farms Available</h3>
          <p>Create a sample farm to test the trading interface</p>
          <button onClick={createSampleFarm} className="create-farm-btn">
            Create Sample Farm
          </button>
        </div>
      )}

      {/* Footer */}
      <footer className="app-footer">
        <p>🚀 Powered by Internet Computer Protocol (ICP) • Built with Motoko & React</p>
        <p>Real-time blockchain data • Decentralized agricultural tokenization</p>
      </footer>
    </div>
  );
}

export default App;
