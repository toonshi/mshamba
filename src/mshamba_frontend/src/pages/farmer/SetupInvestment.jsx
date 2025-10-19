import React, { useState, useEffect } from 'react';
import { Rocket, ToggleLeft, ToggleRight, Coins, Calendar, Users, Target, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const SetupInvestment = () => {
  const { actor } = useAuth();
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    fetchMyFarms();
  }, [actor]);

  const fetchMyFarms = async () => {
    if (!actor) return;
    try {
      setLoading(true);
      const myFarms = await actor.myFarms();
      setFarms(myFarms);
    } catch (error) {
      console.error('Error fetching farms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLaunchToken = async (farmId, farmName) => {
    if (!confirm(`Launch token for ${farmName}? This will cost ~2T cycles.`)) return;

    setActionLoading({ ...actionLoading, [farmId]: 'launching' });
    try {
      const result = await actor.launchFarmToken(farmId);
      
      if ('ok' in result) {
        alert(`✅ Token launched successfully!\n\nLedger Canister: ${result.ok.toText()}`);
        await fetchMyFarms(); // Refresh
      } else {
        alert(`❌ Token launch failed: ${result.err}`);
      }
    } catch (error) {
      console.error('Launch token error:', error);
      alert(`❌ Error: ${error.message}`);
    } finally {
      setActionLoading({ ...actionLoading, [farmId]: null });
    }
  };

  const handleToggleInvestment = async (farmId, farmName, currentStatus) => {
    const action = currentStatus ? 'close' : 'open';
    if (!confirm(`${action.toUpperCase()} investment for ${farmName}?`)) return;

    setActionLoading({ ...actionLoading, [farmId]: 'toggling' });
    try {
      const result = await actor.toggleFarmInvestmentStatus(farmId, !currentStatus);
      
      if ('ok' in result) {
        alert(`✅ Investment ${action}ed successfully!`);
        await fetchMyFarms(); // Refresh
      } else {
        alert(`❌ Failed to ${action} investment: ${result.err}`);
      }
    } catch (error) {
      console.error('Toggle investment error:', error);
      alert(`❌ Error: ${error.message}`);
    } finally {
      setActionLoading({ ...actionLoading, [farmId]: null });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your farms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Setup Investment Opportunities</h2>
        <p className="text-gray-600">Launch tokens and open your farms for investment</p>
      </div>

      {/* Farms List */}
      {farms.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
          <p className="text-gray-500 text-lg">No farms yet. Create a farm first!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {farms.map((farm) => {
            const hasToken = farm.ledgerCanister && farm.ledgerCanister.length > 0;
            const isOpen = farm.isOpenForInvestment;
            const isLoading = actionLoading[farm.farmId];

            return (
              <div key={farm.farmId} className="bg-white rounded-xl shadow-sm border p-6">
                {/* Farm Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{farm.name}</h3>
                    <p className="text-gray-600">{farm.location} • {farm.crop}</p>
                  </div>
                  <div className="flex gap-2">
                    {hasToken ? (
                      <span className="flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Token Launched
                      </span>
                    ) : (
                      <span className="flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                        <XCircle className="h-4 w-4 mr-1" />
                        No Token
                      </span>
                    )}
                    {isOpen && (
                      <span className="flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        Open for Investment
                      </span>
                    )}
                  </div>
                </div>

                {/* Token Details */}
                {hasToken && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Token Name</p>
                      <p className="font-semibold">{farm.tokenName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Symbol</p>
                      <p className="font-semibold">{farm.tokenSymbol}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Supply</p>
                      <p className="font-semibold">{(Number(farm.tokenSupply) / 100000000).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Token Price</p>
                      <p className="font-semibold">KSH {Number(farm.tokenPrice).toLocaleString()}</p>
                    </div>
                  </div>
                )}

                {/* Investment Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-xs text-gray-500">Target</p>
                      <p className="font-semibold">KSH {Number(farm.fundingGoal).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Coins className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-xs text-gray-500">Raised</p>
                      <p className="font-semibold">KSH {Number(farm.fundedAmount).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="text-xs text-gray-500">Investors</p>
                      <p className="font-semibold">{farm.investors.length}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-orange-600" />
                    <div>
                      <p className="text-xs text-gray-500">Duration</p>
                      <p className="font-semibold">{Number(farm.duration)} months</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t">
                  {!hasToken ? (
                    <button
                      onClick={() => handleLaunchToken(farm.farmId, farm.name)}
                      disabled={isLoading === 'launching'}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Rocket className="h-4 w-4" />
                      {isLoading === 'launching' ? 'Launching Token...' : 'Launch Token'}
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => handleToggleInvestment(farm.farmId, farm.name, isOpen)}
                        disabled={isLoading === 'toggling'}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                          isOpen
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {isOpen ? (
                          <>
                            <ToggleRight className="h-4 w-4" />
                            {isLoading === 'toggling' ? 'Closing...' : 'Close Investment'}
                          </>
                        ) : (
                          <>
                            <ToggleLeft className="h-4 w-4" />
                            {isLoading === 'toggling' ? 'Opening...' : 'Open for Investment'}
                          </>
                        )}
                      </button>
                      
                      {farm.ledgerCanister && farm.ledgerCanister.length > 0 && (
                        <a
                          href={`http://127.0.0.1:4943/?canisterId=ulvla-h7777-77774-qaacq-cai&id=${farm.ledgerCanister[0].toText()}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          <Coins className="h-4 w-4" />
                          View Token Canister
                        </a>
                      )}
                    </>
                  )}
                </div>

                {/* Help Text */}
                {!hasToken && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Next Step:</strong> Launch your farm token to enable investments. This creates an ICRC-1 token that investors will receive.
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SetupInvestment;
