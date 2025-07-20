import React, { useState, useEffect } from 'react';
import { mshamba_backend } from 'declarations/mshamba_backend';
import './SupplyChainDashboard.css';

const SupplyChainDashboard = () => {
  const [activeTab, setActiveTab] = useState('browse');
  const [supplyOfferings, setSupplyOfferings] = useState([]);
  const [demandRequests, setDemandRequests] = useState([]);
  const [myOfferings, setMyOfferings] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSupplyChainData();
  }, []);

  const fetchSupplyChainData = async () => {
    try {
      setLoading(true);
      const [offerings, requests] = await Promise.all([
        mshamba_backend.getActiveSupplyOfferings(),
        mshamba_backend.getActiveDemandRequests()
      ]);
      
      setSupplyOfferings(offerings || []);
      setDemandRequests(requests || []);
    } catch (error) {
      console.error('Error fetching supply chain data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSupplyTypeLabel = (supplyType) => {
    const typeKey = Object.keys(supplyType)[0];
    return typeKey.charAt(0).toUpperCase() + typeKey.slice(1);
  };

  const getStatusColor = (isActive) => {
    return isActive ? '#10b981' : '#6b7280';
  };

  const getPriceDisplay = (pricing) => {
    const priceType = Object.keys(pricing)[0];
    const value = pricing[priceType];
    
    switch (priceType) {
      case 'Fixed':
        return `KSh ${value.toLocaleString()}`;
      case 'Hourly':
        return `KSh ${value.toLocaleString()}/hr`;
      case 'Daily':
        return `KSh ${value.toLocaleString()}/day`;
      case 'PerUnit':
        return `KSh ${value.toLocaleString()}/unit`;
      case 'Percentage':
        return `${value}%`;
      case 'Negotiable':
        return 'Negotiable';
      default:
        return 'Price on request';
    }
  };

  const getUrgencyColor = (urgency) => {
    const urgencyKey = Object.keys(urgency)[0];
    switch (urgencyKey) {
      case 'Critical':
        return '#ef4444';
      case 'High':
        return '#f97316';
      case 'Medium':
        return '#eab308';
      case 'Low':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const filteredOfferings = supplyOfferings.filter(offering => {
    const matchesFilter = filter === 'all' || getSupplyTypeLabel(offering.supplyType).toLowerCase() === filter;
    const matchesSearch = offering.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         offering.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         offering.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const filteredRequests = demandRequests.filter(request => {
    const matchesFilter = filter === 'all' || getSupplyTypeLabel(request.supplyType).toLowerCase() === filter;
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="supply-chain-dashboard">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading supply chain network...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="supply-chain-dashboard">
      <div className="dashboard-header">
        <h1>Supply Chain Network</h1>
        <p>Connect with agricultural service providers and find what your farm needs</p>
      </div>

      <div className="dashboard-nav">
        <button 
          className={`nav-tab ${activeTab === 'browse' ? 'active' : ''}`}
          onClick={() => setActiveTab('browse')}
        >
          Browse Services
        </button>
        <button 
          className={`nav-tab ${activeTab === 'requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('requests')}
        >
          Farm Requests
        </button>
        <button 
          className={`nav-tab ${activeTab === 'my-listings' ? 'active' : ''}`}
          onClick={() => setActiveTab('my-listings')}
        >
          My Listings
        </button>
      </div>

      <div className="dashboard-controls">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search services, locations, or descriptions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-controls">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Categories</option>
            <option value="transport">Transport</option>
            <option value="machinery">Machinery</option>
            <option value="skill">Skills</option>
            <option value="input">Inputs</option>
            <option value="storage">Storage</option>
            <option value="processing">Processing</option>
            <option value="packaging">Packaging</option>
            <option value="marketing">Marketing</option>
          </select>
        </div>
      </div>

      <div className="dashboard-content">
        {activeTab === 'browse' && (
          <div className="cards-grid">
            {filteredOfferings.map((offering) => (
              <div key={offering.id} className="supply-card">
                <div className="card-header">
                  <div className="card-title">
                    <span className="supply-type">{getSupplyTypeLabel(offering.supplyType)}</span>
                    <h3>{offering.title}</h3>
                  </div>
                  <div 
                    className="status-indicator"
                    style={{ backgroundColor: getStatusColor(offering.isActive) }}
                  ></div>
                </div>
                
                <div className="card-content">
                  <p className="description">{offering.description}</p>
                  <div className="card-details">
                    <div className="detail-item">
                      <span className="label">Location</span>
                      <span className="value">{offering.location}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Availability</span>
                      <span className="value">{offering.availability}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Price</span>
                      <span className="value price">{getPriceDisplay(offering.pricing)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="card-actions">
                  <button className="btn-secondary">Message</button>
                  <button className="btn-primary">View Details</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="cards-grid">
            {filteredRequests.map((request) => (
              <div key={request.id} className="demand-card">
                <div className="card-header">
                  <div className="card-title">
                    <span className="supply-type">{getSupplyTypeLabel(request.supplyType)}</span>
                    <h3>{request.title}</h3>
                  </div>
                  <div className="urgency-status">
                    <div 
                      className="urgency-indicator"
                      style={{ backgroundColor: getUrgencyColor(request.urgency) }}
                    ></div>
                    <span className="urgency-text">
                      {Object.keys(request.urgency)[0]}
                    </span>
                  </div>
                </div>
                
                <div className="card-content">
                  <p className="description">{request.description}</p>
                  <div className="card-details">
                    <div className="detail-item">
                      <span className="label">Location</span>
                      <span className="value">{request.location}</span>
                    </div>
                    {request.budget && (
                      <div className="detail-item">
                        <span className="label">Budget</span>
                        <span className="value price">{getPriceDisplay(request.budget)}</span>
                      </div>
                    )}
                    {request.deadline && (
                      <div className="detail-item">
                        <span className="label">Deadline</span>
                        <span className="value">
                          {new Date(Number(request.deadline) / 1000000).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="card-actions">
                  <button className="btn-secondary">Message Farm</button>
                  <button className="btn-primary">Submit Proposal</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'my-listings' && (
          <div className="my-listings">
            <div className="empty-state">
              <h3>No listings yet</h3>
              <p>Create your first supply offering or demand request to get started</p>
              <button className="btn-primary">Create Listing</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplyChainDashboard;
