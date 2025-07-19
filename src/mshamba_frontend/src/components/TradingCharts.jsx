import React, { useState, useEffect, useRef } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

const TradingCharts = ({ farmId, farmData, priceHistory, orderBook, trades }) => {
  const [activeTimeframe, setActiveTimeframe] = useState('1D');
  const [chartType, setChartType] = useState('price');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const chartContainerRef = useRef(null);

  // Timeframe options
  const timeframes = ['1H', '4H', '1D', '1W', '1M', '3M', '1Y', 'ALL'];

  // Chart type options
  const chartTypes = [
    { key: 'price', label: 'Price', icon: '📈' },
    { key: 'volume', label: 'Volume', icon: '📊' },
    { key: 'orderbook', label: 'Order Book', icon: '📋' },
    { key: 'distribution', label: 'Holdings', icon: '🥧' }
  ];

  // Generate mock price data (in production, this would come from your backend)
  const generatePriceData = (timeframe) => {
    const now = Date.now();
    const intervals = {
      '1H': { count: 60, interval: 60000 }, // 1 minute intervals
      '4H': { count: 48, interval: 300000 }, // 5 minute intervals
      '1D': { count: 24, interval: 3600000 }, // 1 hour intervals
      '1W': { count: 7, interval: 86400000 }, // 1 day intervals
      '1M': { count: 30, interval: 86400000 }, // 1 day intervals
      '3M': { count: 90, interval: 86400000 }, // 1 day intervals
      '1Y': { count: 365, interval: 86400000 }, // 1 day intervals
      'ALL': { count: 730, interval: 86400000 } // 1 day intervals
    };

    const { count, interval } = intervals[timeframe];
    const basePrice = farmData?.sharePrice || 5018;
    const data = [];

    for (let i = count; i >= 0; i--) {
      const timestamp = now - (i * interval);
      const volatility = 0.05; // 5% volatility
      const trend = Math.sin(i / 10) * 0.02; // Slight upward trend
      const randomChange = (Math.random() - 0.5) * volatility;
      const price = basePrice * (1 + trend + randomChange);
      
      data.push({
        timestamp,
        price: Math.max(price, basePrice * 0.8), // Floor at 80% of base
        volume: Math.floor(Math.random() * 50000) + 10000,
        high: price * 1.02,
        low: price * 0.98,
        open: price * (0.99 + Math.random() * 0.02),
        close: price
      });
    }

    return data;
  };

  const priceData = generatePriceData(activeTimeframe);

  // Price Chart Configuration
  const priceChartData = {
    labels: priceData.map(d => {
      const date = new Date(d.timestamp);
      if (activeTimeframe === '1H' || activeTimeframe === '4H') {
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      } else if (activeTimeframe === '1D' || activeTimeframe === '1W') {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      } else {
        return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      }
    }),
    datasets: [
      {
        label: 'Price (ICP)',
        data: priceData.map(d => (d.price / 100000000).toFixed(6)), // Convert from e8s
        borderColor: '#00D2FF',
        backgroundColor: 'rgba(0, 210, 255, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.1,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: '#00D2FF',
        pointHoverBorderColor: '#ffffff',
        pointHoverBorderWidth: 2
      }
    ]
  };

  // Volume Chart Configuration
  const volumeChartData = {
    labels: priceData.map(d => {
      const date = new Date(d.timestamp);
      if (activeTimeframe === '1H' || activeTimeframe === '4H') {
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      } else {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }
    }),
    datasets: [
      {
        label: 'Volume',
        data: priceData.map(d => d.volume),
        backgroundColor: priceData.map((d, i) => {
          if (i === 0) return '#00D2FF';
          return d.close >= priceData[i-1].close ? '#00FF88' : '#FF4757';
        }),
        borderColor: 'transparent',
        borderWidth: 0
      }
    ]
  };

  // Order Book Data
  const orderBookData = {
    labels: ['Buy Orders', 'Sell Orders'],
    datasets: [
      {
        data: [
          orderBook?.buyOrders?.length || 12,
          orderBook?.sellOrders?.length || 8
        ],
        backgroundColor: ['#00FF88', '#FF4757'],
        borderColor: ['#00CC6A', '#E63946'],
        borderWidth: 2
      }
    ]
  };

  // Holdings Distribution (mock data)
  const holdingsData = {
    labels: ['Top 10 Holders', 'Medium Holders', 'Small Holders', 'Available'],
    datasets: [
      {
        data: [25, 35, 30, 10],
        backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'],
        borderColor: '#ffffff',
        borderWidth: 2
      }
    ]
  };

  // Chart Options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index'
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#00D2FF',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: function(context) {
            return `${farmData?.name || 'Farm Token'}`;
          },
          label: function(context) {
            if (chartType === 'price') {
              return `Price: ${context.parsed.y} ICP`;
            } else if (chartType === 'volume') {
              return `Volume: ${context.parsed.y.toLocaleString()} tokens`;
            }
            return context.label;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false
        },
        ticks: {
          color: '#8E8E93',
          maxTicksLimit: 8
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false
        },
        ticks: {
          color: '#8E8E93',
          callback: function(value) {
            if (chartType === 'price') {
              return `${value} ICP`;
            } else if (chartType === 'volume') {
              return `${(value / 1000).toFixed(0)}K`;
            }
            return value;
          }
        }
      }
    }
  };

  // Calculate key metrics
  const currentPrice = priceData[priceData.length - 1]?.price || 0;
  const previousPrice = priceData[priceData.length - 2]?.price || currentPrice;
  const priceChange = currentPrice - previousPrice;
  const priceChangePercent = ((priceChange / previousPrice) * 100).toFixed(2);
  const volume24h = priceData.slice(-24).reduce((sum, d) => sum + d.volume, 0);
  const marketCap = (currentPrice * (farmData?.totalShares || 1000000)) / 100000000;

  return (
    <div className={`trading-charts ${isFullscreen ? 'fullscreen' : ''}`} ref={chartContainerRef}>
      {/* Header */}
      <div className="chart-header">
        <div className="farm-info">
          <div className="farm-title">
            <h2>{farmData?.name || 'Farm Token'}</h2>
            <span className="farm-id">#{farmId}</span>
          </div>
          <div className="price-info">
            <div className="current-price">
              {(currentPrice / 100000000).toFixed(6)} ICP
            </div>
            <div className={`price-change ${priceChange >= 0 ? 'positive' : 'negative'}`}>
              {priceChange >= 0 ? '+' : ''}{priceChangePercent}%
            </div>
          </div>
        </div>
        
        <div className="chart-controls">
          <div className="chart-type-selector">
            {chartTypes.map(type => (
              <button
                key={type.key}
                className={`chart-type-btn ${chartType === type.key ? 'active' : ''}`}
                onClick={() => setChartType(type.key)}
              >
                <span className="icon">{type.icon}</span>
                {type.label}
              </button>
            ))}
          </div>
          
          <button 
            className="fullscreen-btn"
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            {isFullscreen ? '⤓' : '⤢'}
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="key-metrics">
        <div className="metric">
          <span className="label">Market Cap</span>
          <span className="value">{marketCap.toFixed(2)} ICP</span>
        </div>
        <div className="metric">
          <span className="label">24h Volume</span>
          <span className="value">{(volume24h / 1000).toFixed(0)}K</span>
        </div>
        <div className="metric">
          <span className="label">Total Supply</span>
          <span className="value">{((farmData?.totalShares || 1000000) / 1000000).toFixed(1)}M</span>
        </div>
        <div className="metric">
          <span className="label">Holders</span>
          <span className="value">{farmData?.investors?.length || 0}</span>
        </div>
      </div>

      {/* Timeframe Selector */}
      {(chartType === 'price' || chartType === 'volume') && (
        <div className="timeframe-selector">
          {timeframes.map(tf => (
            <button
              key={tf}
              className={`timeframe-btn ${activeTimeframe === tf ? 'active' : ''}`}
              onClick={() => setActiveTimeframe(tf)}
            >
              {tf}
            </button>
          ))}
        </div>
      )}

      {/* Chart Container */}
      <div className="chart-container">
        {chartType === 'price' && (
          <Line data={priceChartData} options={chartOptions} />
        )}
        
        {chartType === 'volume' && (
          <Bar data={volumeChartData} options={chartOptions} />
        )}
        
        {chartType === 'orderbook' && (
          <div className="orderbook-container">
            <div className="orderbook-chart">
              <Doughnut 
                data={orderBookData} 
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    legend: {
                      display: true,
                      position: 'bottom',
                      labels: {
                        color: '#8E8E93',
                        usePointStyle: true,
                        padding: 20
                      }
                    }
                  }
                }}
              />
            </div>
            <div className="orderbook-details">
              <div className="order-section">
                <h4 className="buy-orders">Buy Orders ({orderBook?.buyOrders?.length || 12})</h4>
                <div className="order-list">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="order-row buy">
                      <span className="price">{(currentPrice * (0.95 - i * 0.01) / 100000000).toFixed(6)}</span>
                      <span className="amount">{Math.floor(Math.random() * 10000) + 1000}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="order-section">
                <h4 className="sell-orders">Sell Orders ({orderBook?.sellOrders?.length || 8})</h4>
                <div className="order-list">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="order-row sell">
                      <span className="price">{(currentPrice * (1.05 + i * 0.01) / 100000000).toFixed(6)}</span>
                      <span className="amount">{Math.floor(Math.random() * 8000) + 500}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {chartType === 'distribution' && (
          <div className="distribution-container">
            <div className="distribution-chart">
              <Doughnut 
                data={holdingsData}
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    legend: {
                      display: true,
                      position: 'right',
                      labels: {
                        color: '#8E8E93',
                        usePointStyle: true,
                        padding: 15
                      }
                    }
                  }
                }}
              />
            </div>
            <div className="distribution-stats">
              <div className="stat-row">
                <span className="label">Top 10 Holders</span>
                <span className="value">25%</span>
                <span className="tokens">250K tokens</span>
              </div>
              <div className="stat-row">
                <span className="label">Medium Holders (11-100)</span>
                <span className="value">35%</span>
                <span className="tokens">350K tokens</span>
              </div>
              <div className="stat-row">
                <span className="label">Small Holders (100+)</span>
                <span className="value">30%</span>
                <span className="tokens">300K tokens</span>
              </div>
              <div className="stat-row">
                <span className="label">Available for Sale</span>
                <span className="value">10%</span>
                <span className="tokens">100K tokens</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Recent Trades */}
      <div className="recent-trades">
        <h3>Recent Trades</h3>
        <div className="trades-list">
          <div className="trades-header">
            <span>Time</span>
            <span>Price</span>
            <span>Amount</span>
            <span>Total</span>
          </div>
          {[...Array(8)].map((_, i) => {
            const tradePrice = currentPrice * (0.98 + Math.random() * 0.04);
            const amount = Math.floor(Math.random() * 5000) + 100;
            const total = (tradePrice * amount) / 100000000;
            const isPositive = Math.random() > 0.5;
            
            return (
              <div key={i} className={`trade-row ${isPositive ? 'positive' : 'negative'}`}>
                <span className="time">
                  {new Date(Date.now() - i * 300000).toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
                <span className="price">{(tradePrice / 100000000).toFixed(6)}</span>
                <span className="amount">{amount.toLocaleString()}</span>
                <span className="total">{total.toFixed(4)} ICP</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TradingCharts;
