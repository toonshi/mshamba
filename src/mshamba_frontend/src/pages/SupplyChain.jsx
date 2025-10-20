import React, { useState } from 'react';
import { ArrowLeft, Package, Truck, MapPin, Clock, CheckCircle, AlertCircle, Eye, QrCode, Shield } from 'lucide-react';
import { logToHedera, HederaEvents } from '../utils/hederaService';
import { HederaVerificationBadge } from '../components/HederaVerification';

export const SupplyChain = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('tracking');
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [verifyingStage, setVerifyingStage] = useState(null); // Format: "shipmentId-stageIndex"

  const [shipments, setShipments] = useState([
    {
      id: 'SH001',
      farmName: 'Green Valley Farm',
      product: 'Maize',
      quantity: '2,500 kg',
      status: 'In Transit',
      origin: 'Nakuru, Kenya',
      destination: 'Nairobi Market',
      estimatedDelivery: '2024-12-20',
      currentLocation: 'Naivasha Checkpoint',
      progress: 65,
      stages: [
        { name: 'Harvested', completed: true, date: '2024-12-15', location: 'Green Valley Farm' },
        { name: 'Quality Check', completed: true, date: '2024-12-16', location: 'Farm Processing Center' },
        { name: 'Packaging', completed: true, date: '2024-12-17', location: 'Packaging Facility' },
        { name: 'In Transit', completed: false, date: '2024-12-18', location: 'Naivasha Checkpoint' },
        { name: 'Delivered', completed: false, date: '2024-12-20', location: 'Nairobi Market' }
      ]
    },
    {
      id: 'SH002',
      farmName: 'Sunrise Coffee Estate',
      product: 'Coffee Beans',
      quantity: '500 kg',
      status: 'Delivered',
      origin: 'Kiambu, Kenya',
      destination: 'Export Terminal',
      estimatedDelivery: '2024-12-18',
      currentLocation: 'Export Terminal',
      progress: 100,
      stages: [
        { name: 'Harvested', completed: true, date: '2024-12-10', location: 'Sunrise Coffee Estate' },
        { name: 'Processing', completed: true, date: '2024-12-12', location: 'Coffee Processing Plant' },
        { name: 'Quality Grading', completed: true, date: '2024-12-14', location: 'Quality Control Center' },
        { name: 'Export Ready', completed: true, date: '2024-12-16', location: 'Export Terminal' },
        { name: 'Delivered', completed: true, date: '2024-12-18', location: 'Export Terminal' }
      ]
    },
    {
      id: 'SH003',
      farmName: 'Fresh Harvest Gardens',
      product: 'Mixed Vegetables',
      quantity: '1,200 kg',
      status: 'Processing',
      origin: 'Meru, Kenya',
      destination: 'Supermarket Chain',
      estimatedDelivery: '2024-12-22',
      currentLocation: 'Processing Center',
      progress: 30,
      stages: [
        { name: 'Harvested', completed: true, date: '2024-12-18', location: 'Fresh Harvest Gardens' },
        { name: 'Sorting', completed: true, date: '2024-12-19', location: 'Farm Sorting Center' },
        { name: 'Processing', completed: false, date: '2024-12-20', location: 'Processing Center' },
        { name: 'Packaging', completed: false, date: '2024-12-21', location: 'Packaging Facility' },
        { name: 'Delivered', completed: false, date: '2024-12-22', location: 'Supermarket Chain' }
      ]
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'text-green-400 bg-green-400 bg-opacity-20';
      case 'In Transit': return 'text-blue-400 bg-blue-400 bg-opacity-20';
      case 'Processing': return 'text-yellow-400 bg-yellow-400 bg-opacity-20';
      case 'Delayed': return 'text-red-400 bg-red-400 bg-opacity-20';
      default: return 'text-gray-400 bg-gray-400 bg-opacity-20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered': return <CheckCircle className="w-5 h-5" />;
      case 'In Transit': return <Truck className="w-5 h-5" />;
      case 'Processing': return <Package className="w-5 h-5" />;
      case 'Delayed': return <AlertCircle className="w-5 h-5" />;
      default: return <Package className="w-5 h-5" />;
    }
  };

  // Function to verify a stage on Hedera
  const verifyStageOnHedera = async (shipmentId, stageIndex) => {
    const verifyKey = `${shipmentId}-${stageIndex}`;
    setVerifyingStage(verifyKey);

    try {
      // Find the shipment and stage
      const shipment = shipments.find(s => s.id === shipmentId);
      const stage = shipment.stages[stageIndex];

      // Create appropriate Hedera event based on stage name
      let hederaEvent;
      const farmId = `FARM_${shipment.farmName.replace(/\s+/g, '_').toUpperCase()}`;
      
      if (stage.name === 'Harvested') {
        hederaEvent = HederaEvents.harvest(
          farmId,
          shipment.farmName,
          shipment.product,
          shipment.quantity,
          'Standard',
          stage.date
        );
      } else if (stage.name.includes('Quality')) {
        hederaEvent = HederaEvents.qualityCheck(
          farmId,
          shipment.farmName,
          shipmentId,
          'PASSED',
          'Quality Inspector',
          `${shipment.product} quality inspection completed`
        );
      } else if (stage.name === 'Packaging') {
        hederaEvent = HederaEvents.packaging(
          farmId,
          shipment.farmName,
          shipmentId,
          shipment.quantity,
          'Standard',
          stage.location
        );
      } else if (stage.name === 'In Transit' || stage.name.includes('Transit')) {
        hederaEvent = HederaEvents.shipmentStarted(
          farmId,
          shipment.farmName,
          shipmentId,
          shipment.origin,
          shipment.destination,
          'Transport Company',
          shipment.estimatedDelivery
        );
      } else if (stage.name === 'Delivered') {
        hederaEvent = HederaEvents.shipmentDelivered(
          farmId,
          shipment.farmName,
          shipmentId,
          'Warehouse Manager',
          'Good condition'
        );
      } else {
        // Generic event for other stages
        hederaEvent = {
          eventType: 'SHIPMENT_UPDATE',
          farmId,
          farmName: shipment.farmName,
          shipmentId,
          stage: stage.name,
          location: stage.location,
          date: stage.date,
          product: shipment.product,
          quantity: shipment.quantity,
        };
      }

      // Log to Hedera
      const result = await logToHedera(hederaEvent);
      console.log('✅ Stage verified on Hedera:', result.explorerUrl);

      // Update the stage with Hedera data
      setShipments(prev => prev.map(s => {
        if (s.id === shipmentId) {
          const updatedStages = [...s.stages];
          updatedStages[stageIndex] = {
            ...updatedStages[stageIndex],
            hederaData: result
          };
          return { ...s, stages: updatedStages };
        }
        return s;
      }));

    } catch (error) {
      console.error('❌ Failed to verify stage on Hedera:', error);
      alert(`Failed to verify on Hedera: ${error.message}`);
    } finally {
      setVerifyingStage(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white w-full">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <button 
            onClick={onBack}
            className="flex items-center space-x-2 text-green-400 hover:text-green-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
        </div>

        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Supply Chain Tracking</h1>
              <p className="text-gray-400">Track your agricultural products from farm to market</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-800 rounded-xl p-6">
              <div className="flex items-center space-x-2 mb-2">
                <Package className="w-5 h-5 text-green-400" />
                <span className="text-sm text-gray-400">Total Shipments</span>
              </div>
              <div className="text-2xl font-bold">247</div>
              <div className="text-sm text-green-400">+12 this week</div>
            </div>
            <div className="bg-gray-800 rounded-xl p-6">
              <div className="flex items-center space-x-2 mb-2">
                <Truck className="w-5 h-5 text-blue-400" />
                <span className="text-sm text-gray-400">In Transit</span>
              </div>
              <div className="text-2xl font-bold text-blue-400">18</div>
              <div className="text-sm text-blue-400">Active shipments</div>
            </div>
            <div className="bg-gray-800 rounded-xl p-6">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-sm text-gray-400">Delivered</span>
              </div>
              <div className="text-2xl font-bold text-green-400">229</div>
              <div className="text-sm text-green-400">98.5% success rate</div>
            </div>
            <div className="bg-gray-800 rounded-xl p-6">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-5 h-5 text-purple-400" />
                <span className="text-sm text-gray-400">Avg. Delivery</span>
              </div>
              <div className="text-2xl font-bold text-purple-400">3.2 days</div>
              <div className="text-sm text-purple-400">From farm to market</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg mb-8">
          <button
            onClick={() => setActiveTab('tracking')}
            className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'tracking' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Live Tracking
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'analytics' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Analytics
          </button>
          <button
            onClick={() => setActiveTab('quality')}
            className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'quality' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Quality Control
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'tracking' && (
          <div className="space-y-6">
            {shipments.map((shipment) => (
              <div key={shipment.id} className="bg-gray-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                      {getStatusIcon(shipment.status)}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{shipment.farmName}</h3>
                      <p className="text-gray-400">{shipment.product} • {shipment.quantity}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(shipment.status)}`}>
                      {shipment.status}
                    </div>
                    <button 
                      onClick={() => setSelectedShipment(selectedShipment === shipment.id ? null : shipment.id)}
                      className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Track</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Origin</div>
                    <div className="font-medium">{shipment.origin}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Destination</div>
                    <div className="font-medium">{shipment.destination}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Current Location</div>
                    <div className="font-medium text-blue-400">{shipment.currentLocation}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Est. Delivery</div>
                    <div className="font-medium">{new Date(shipment.estimatedDelivery).toLocaleDateString()}</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span>Progress</span>
                    <span>{shipment.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${shipment.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Detailed Tracking */}
                {selectedShipment === shipment.id && (
                  <div className="mt-6 pt-6 border-t border-gray-700">
                    <h4 className="text-lg font-semibold mb-4">Tracking Timeline</h4>
                    <div className="space-y-4">
                      {shipment.stages.map((stage, index) => {
                        const verifyKey = `${shipment.id}-${index}`;
                        const isVerifying = verifyingStage === verifyKey;
                        
                        return (
                          <div key={index} className="space-y-2">
                            <div className="flex items-center space-x-4">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                stage.completed ? 'bg-green-600' : 'bg-gray-600'
                              }`}>
                                {stage.completed ? (
                                  <CheckCircle className="w-4 h-4 text-white" />
                                ) : (
                                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                )}
                              </div>
                              <div className="flex-1">
                                <div className={`font-medium ${stage.completed ? 'text-white' : 'text-gray-400'}`}>
                                  {stage.name}
                                </div>
                                <div className="text-sm text-gray-400">
                                  {stage.location} • {stage.date}
                                </div>
                              </div>
                              
                              {/* Hedera Verification Button/Badge */}
                              <div className="flex items-center space-x-2">
                                {stage.hederaData ? (
                                  <a
                                    href={stage.hederaData.explorerUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center space-x-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-full text-xs transition-colors"
                                    title="View on HashScan"
                                  >
                                    <Shield className="w-3 h-3" />
                                    <span>Verified</span>
                                  </a>
                                ) : stage.completed ? (
                                  <button
                                    onClick={() => verifyStageOnHedera(shipment.id, index)}
                                    disabled={isVerifying}
                                    className="flex items-center space-x-1 px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-full text-xs transition-colors disabled:opacity-50"
                                  >
                                    <Shield className="w-3 h-3" />
                                    <span>{isVerifying ? 'Verifying...' : 'Verify on Hedera'}</span>
                                  </button>
                                ) : null}
                              </div>
                            </div>
                            
                            {/* Show full Hedera badge for verified stages */}
                            {stage.hederaData && (
                              <div className="ml-12 mt-2">
                                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
                                  <div className="flex items-start space-x-2">
                                    <Shield className="w-4 h-4 text-blue-400 mt-0.5" />
                                    <div className="flex-1 text-xs">
                                      <div className="text-blue-300 font-semibold mb-1">Verified on Hedera</div>
                                      <div className="text-gray-400 space-y-0.5">
                                        <div>Timestamp: {stage.hederaData.consensusTimestamp}</div>
                                        <div className="truncate">TX: {stage.hederaData.transactionId}</div>
                                      </div>
                                      <a
                                        href={stage.hederaData.explorerUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-400 hover:text-blue-300 inline-flex items-center space-x-1 mt-1"
                                      >
                                        <span>View on Explorer</span>
                                        <span>→</span>
                                      </a>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-6">Delivery Performance</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>On-time Deliveries</span>
                  <span className="text-green-400 font-semibold">94.2%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Average Delivery Time</span>
                  <span className="text-blue-400 font-semibold">3.2 days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Customer Satisfaction</span>
                  <span className="text-purple-400 font-semibold">4.8/5</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-6">Product Categories</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Grains & Cereals</span>
                  <span className="text-green-400 font-semibold">45%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Vegetables</span>
                  <span className="text-blue-400 font-semibold">30%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Coffee & Tea</span>
                  <span className="text-yellow-400 font-semibold">25%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'quality' && (
          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-6">Quality Control Dashboard</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <div className="text-2xl font-bold text-green-400">98.5%</div>
                <div className="text-gray-400">Quality Pass Rate</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <QrCode className="w-8 h-8 text-white" />
                </div>
                <div className="text-2xl font-bold text-blue-400">100%</div>
                <div className="text-gray-400">Traceability Coverage</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-white" />
                </div>
                <div className="text-2xl font-bold text-purple-400">247</div>
                <div className="text-gray-400">Products Certified</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};