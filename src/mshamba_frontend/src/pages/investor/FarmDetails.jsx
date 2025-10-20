import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Sprout, Clock, DollarSign, Users, Coins, Calendar, Mail, Award } from 'lucide-react';
import { EscrowIcon, GrowthIcon, YieldIcon } from '../../components/FinancialIcons';
import { useAuth } from '../../hooks/useAuth';

const FarmDetails = () => {
  const { farmId } = useParams();
  const navigate = useNavigate();
  const { actor } = useAuth();
  const [farm, setFarm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showInvestModal, setShowInvestModal] = useState(false);
  const [investAmount, setInvestAmount] = useState('');
  const [investing, setInvesting] = useState(false);

  useEffect(() => {
    fetchFarmDetails();
  }, [farmId, actor]);

  const fetchFarmDetails = async () => {
    if (!actor) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const farms = await actor.listFarms();
      const foundFarm = farms.find(f => f.farmId === farmId);
      
      if (foundFarm) {
        // Process farm data
        const imageUrl = foundFarm.imageContent && foundFarm.imageContentType
          ? blobToBase64(foundFarm.imageContent, foundFarm.imageContentType)
          : 'https://images.pexels.com/photos/2132250/pexels-photo-2132250.jpeg?auto=compress&cs=tinysrgb&w=400';

        setFarm({
          id: foundFarm.farmId,
          name: foundFarm.name,
          location: foundFarm.location,
          crop: foundFarm.crop,
          size: foundFarm.size,
          minInvestment: Number(foundFarm.minInvestment),
          duration: Number(foundFarm.duration),
          targetAmount: Number(foundFarm.fundingGoal),
          currentAmount: Number(foundFarm.fundedAmount),
          image: imageUrl,
          description: foundFarm.description,
          expectedYield: foundFarm.expectedYield,
          expectedROI: foundFarm.expectedROI,
          farmerName: foundFarm.farmerName,
          experience: foundFarm.experience,
          phone: foundFarm.phone,
          email: foundFarm.email,
          investors: foundFarm.investors || [],
          // Four-Wallet System fields
          tokenName: foundFarm.tokenName,
          tokenSymbol: foundFarm.tokenSymbol,
          tokenPrice: foundFarm.tokenPrice,
          ifoEndDate: foundFarm.ifoEndDate ? foundFarm.ifoEndDate[0] : null,
          maxInvestmentPerUser: foundFarm.maxInvestmentPerUser ? foundFarm.maxInvestmentPerUser[0] : null,
          hasEscrow: foundFarm.hasEscrow || false,
          ledgerCanister: foundFarm.ledgerCanister ? foundFarm.ledgerCanister[0] : null,
        });
      }
    } catch (error) {
      console.error('Error fetching farm details:', error);
    } finally {
      setLoading(false);
    }
  };

  const blobToBase64 = (blob, contentType) => {
    if (!blob || blob.length === 0) return null;
    const binary = Array.from(new Uint8Array(blob))
      .map(byte => String.fromCharCode(byte))
      .join('');
    return `data:${contentType};base64,${btoa(binary)}`;
  };

  const formatTokenPrice = (price) => {
    if (!price) return 'N/A';
    return (Number(price) / 100000000).toFixed(4);
  };

  const formatIFODate = (timestamp) => {
    if (!timestamp) return null;
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const getDaysRemaining = (timestamp) => {
    if (!timestamp) return null;
    const endDate = new Date(Number(timestamp) / 1000000);
    const now = new Date();
    const diff = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const getProgressPercentage = () => {
    if (!farm || !farm.targetAmount) return 0;
    return (farm.currentAmount / farm.targetAmount) * 100;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading farm details...</p>
        </div>
      </div>
    );
  }

  if (!farm) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Farm Not Found</h2>
          <button onClick={() => navigate('/investor/dashboard/farms')} className="text-green-600 hover:text-green-700">
            ← Back to Farms
          </button>
        </div>
      </div>
    );
  }

  const hasIFO = farm.tokenPrice && farm.ifoEndDate;
  const daysRemaining = getDaysRemaining(farm.ifoEndDate);
  const progress = getProgressPercentage();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button 
            onClick={() => navigate('/investor/dashboard/farms')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-2"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Farms
          </button>
          <h1 className="text-3xl font-bold text-gray-900">{farm.name}</h1>
          <div className="flex items-center text-gray-600 mt-1">
            <MapPin className="w-4 h-4 mr-1" />
            {farm.location}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Image */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <img src={farm.image} alt={farm.name} className="w-full h-96 object-cover" />
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Farm</h2>
              <p className="text-gray-700 leading-relaxed">{farm.description}</p>
            </div>

            {/* Farm Details */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Farm Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start">
                  <Sprout className="w-5 h-5 text-green-600 mr-3 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Crop</p>
                    <p className="font-semibold text-gray-900">{farm.crop}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-blue-600 mr-3 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Size</p>
                    <p className="font-semibold text-gray-900">{farm.size}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock className="w-5 h-5 text-orange-600 mr-3 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="font-semibold text-gray-900">{farm.duration} months</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <YieldIcon className="w-5 h-5 text-purple-600 mr-3 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Expected Yield</p>
                    <p className="font-semibold text-gray-900">{farm.expectedYield}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Award className="w-5 h-5 text-yellow-600 mr-3 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Expected ROI</p>
                    <p className="font-semibold text-green-600">{farm.expectedROI}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Users className="w-5 h-5 text-indigo-600 mr-3 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Total Investors</p>
                    <p className="font-semibold text-gray-900">{farm.investors.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Four-Wallet System: Token & IFO Details */}
            {hasIFO && (
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Coins className="w-6 h-6 text-gray-700" />
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Token & IFO Information</h2>
                    <p className="text-gray-600 text-sm">Initial Farm Offering Details</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Token Name</p>
                    <p className="text-lg font-semibold text-gray-900">{farm.tokenName}</p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Token Symbol</p>
                    <p className="text-lg font-semibold text-gray-900">{farm.tokenSymbol}</p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Token Price</p>
                    <p className="text-xl font-semibold text-gray-900">{formatTokenPrice(farm.tokenPrice)} ICP</p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">IFO Deadline</p>
                    <p className="text-lg font-semibold text-gray-900">{formatIFODate(farm.ifoEndDate)}</p>
                    {daysRemaining > 0 && (
                      <p className="text-sm text-gray-600 mt-1">{daysRemaining} days remaining</p>
                    )}
                  </div>
                  {farm.maxInvestmentPerUser && (
                    <div className="border border-gray-200 rounded-lg p-4 col-span-2">
                      <p className="text-sm text-gray-600 mb-1">Maximum Investment per User</p>
                      <p className="text-lg font-semibold text-gray-900">KSH {Number(farm.maxInvestmentPerUser).toLocaleString('en-KE')}</p>
                    </div>
                  )}
                </div>

                {/* Escrow Status */}
                <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <EscrowIcon className="w-6 h-6 text-gray-700" />
                    <div>
                      <p className="font-semibold text-gray-900">Secure Escrow</p>
                      <p className="text-sm text-gray-600">Milestone-based fund release</p>
                    </div>
                  </div>
                  <span className={`px-4 py-2 rounded-lg text-sm font-medium border ${
                    farm.hasEscrow 
                      ? 'bg-green-50 text-green-700 border-green-200' 
                      : 'bg-gray-50 text-gray-700 border-gray-200'
                  }`}>
                    {farm.hasEscrow ? '✓ Active' : 'Not Initialized'}
                  </span>
                </div>
              </div>
            )}

            {/* Farmer Info */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Farmer Information</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-semibold text-gray-900">{farm.farmerName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Experience</p>
                  <p className="font-semibold text-gray-900">{farm.experience}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Contact</p>
                  <p className="font-semibold text-gray-900">{farm.phone} • {farm.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Investment Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Investment Details</h3>
              
              {/* Funding Progress */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Funding Progress</span>
                  <span className="font-bold text-gray-900">{progress.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-green-600 h-3 rounded-full transition-all"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>KSH {farm.currentAmount.toLocaleString('en-KE')}</span>
                  <span>Goal: KSH {farm.targetAmount.toLocaleString('en-KE')}</span>
                </div>
              </div>

              {/* Key Stats */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Min. Investment</span>
                  <span className="font-bold text-gray-900">KSH {farm.minInvestment.toLocaleString('en-KE')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Expected ROI</span>
                  <span className="font-bold text-green-600">{farm.expectedROI}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-bold text-gray-900">{farm.duration} months</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button 
                  onClick={() => setShowInvestModal(true)}
                  className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Invest Now
                </button>
                <button className="w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2">
                  <Mail className="w-4 h-4" />
                  Contact Farmer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Investment Modal */}
      {showInvestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Invest in {farm.name}</h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Investment Amount (KSH)
                </label>
                <input
                  type="number"
                  value={investAmount}
                  onChange={(e) => setInvestAmount(e.target.value)}
                  placeholder={`Min: ${farm.minInvestment.toLocaleString('en-KE')}`}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">You will receive:</p>
                <p className="text-lg font-bold text-green-600">
                  {investAmount ? Math.floor((Number(investAmount) * 100000000) / Number(farm.tokenPrice)).toLocaleString() : '0'} {farm.tokenSymbol}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowInvestModal(false);
                  setInvestAmount('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={investing}
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!investAmount || Number(investAmount) < farm.minInvestment) {
                    alert(`Minimum investment is KSH ${farm.minInvestment.toLocaleString('en-KE')}`);
                    return;
                  }
                  
                  setInvesting(true);
                  try {
                    console.log('=== INVESTMENT ATTEMPT ===');
                    console.log('Farm ID:', farmId);
                    console.log('Amount:', Number(investAmount));
                    console.log('Farm is open for investment:', farm);
                    
                    const result = await actor.investInFarm(farmId, Number(investAmount));
                    console.log('Investment result:', result);
                    
                    if ('ok' in result) {
                      console.log('✅ Investment SUCCESS!');
                      console.log('Updated farm:', result.ok);
                      console.log('Total investors now:', result.ok.investors.length);
                      
                      alert('✅ Investment successful! 🎉\n\nAmount: KSH ' + Number(investAmount).toLocaleString('en-KE') + '\n\nCheck browser console for details.\nGo to "My Account" to see your portfolio!');
                      setShowInvestModal(false);
                      setInvestAmount('');
                      await fetchFarmDetails(); // Refresh data
                      setTimeout(() => {
                        window.location.reload(); // Force refresh to show updated data
                      }, 1000);
                    } else {
                      console.error('❌ Investment FAILED:', result.err);
                      alert('❌ Investment failed: ' + result.err);
                    }
                  } catch (error) {
                    console.error('❌ Investment ERROR:', error);
                    console.error('Error details:', error.message, error.stack);
                    alert('❌ Investment failed: ' + (error.message || 'Unknown error. Please check console.'));
                  } finally {
                    setInvesting(false);
                  }
                }}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                disabled={investing}
              >
                {investing ? 'Investing...' : 'Confirm Investment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmDetails;
