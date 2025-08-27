import React, { useEffect, useState, useCallback } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { mshamba_backend } from 'declarations/mshamba_backend';
import { Sprout, TrendingUp, User, Edit, Search, ArrowRight, Download, Rocket } from 'lucide-react';
import { CreateFarmForm } from '../components/CreateFarmForm';
import { useNavigate, useLocation } from 'react-router-dom';

const Dashboard = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [myFarms, setMyFarms] = useState([]);
  const [allFarms, setAllFarms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingFarm, setIsCreatingFarm] = useState(false);
  const [filter, setFilter] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Read ?type=farmer or ?type=investor from URL
  const queryParams = new URLSearchParams(location.search);
  const userType = queryParams.get("type");

  const fetchMyFarms = useCallback(async () => {
    const userFarms = await mshamba_backend.myFarms();
    setMyFarms(userFarms);
  }, []);

  const fetchAllFarms = useCallback(async () => {
    const farms = await mshamba_backend.listFarms();
    setAllFarms(farms);
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const authClient = await AuthClient.create();
        const identity = authClient.getIdentity();
        const principal = identity.getPrincipal();
        const profileResult = await mshamba_backend.getProfile(principal);
        console.log("Profile Result:", profileResult);

        if (profileResult.Ok !== null && profileResult.Ok !== undefined) {
          const profile = profileResult.Ok;
          setUserProfile(profile);
          if (Object.keys(profile.role)[0] === 'Farmer') {
            fetchMyFarms();
          } else {
            fetchAllFarms();
          }
        } else {
          console.error("Failed to fetch profile:", profileResult.Err);
          navigate('/create-profile'); // Redirect to create profile page
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        navigate('/create-profile'); // Also redirect here in case of an error fetching profile
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [fetchMyFarms, fetchAllFarms, navigate]);

  const handleCreateFarm = async (farmData) => {
    setIsCreatingFarm(true);
    try {
      const result = await mshamba_backend.createFarm(
        farmData.name,
        farmData.description,
        farmData.location,
        farmData.fundingGoal
      );
      if (result.Ok) {
        fetchMyFarms(); // Refresh the list of farms
      } else {
        console.error("Failed to create farm:", result.Err);
      }
    } catch (error) {
      console.error("Error creating farm:", error);
    } finally {
      setIsCreatingFarm(false);
    }
  };

  const handleToggleInvestmentStatus = async (farmId, newStatus) => {
    try {
      const result = await mshamba_backend.toggleFarmInvestmentStatus(farmId, newStatus);
      if (result.Ok) {
        fetchMyFarms(); // Refresh the list of farms to show updated status
      } else {
        console.error("Failed to toggle investment status:", result.Err);
      }
    } catch (error) {
      console.error("Error toggling investment status:", error);
    }
  };

  const handleDownloadAuditReport = (farmId) => {
    alert(`Downloading audit report for farm ${farmId}. (Placeholder)`);
    // In a real app, this would trigger an API call to get the report and download it.
  };

  const handleLaunchInvestment = (farmId) => {
    navigate(`/farmer/setup-investment/${farmId}`);
  };

  const filteredFarms = allFarms.filter(farm => 
    farm.name.toLowerCase().includes(filter.toLowerCase()) ||
    farm.location.toLowerCase().includes(filter.toLowerCase())
  );

  const renderRoleIcon = () => {
    if (!userProfile) return null;
    const role = Object.keys(userProfile.role)[0];
    return role === 'Farmer' ? 
      <Sprout className="w-8 h-8 text-green-500" /> : 
      <TrendingUp className="w-8 h-8 text-blue-500" />;
  };

  if (isLoading) {
    return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Loading...</div>;
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p>Redirecting to profile creation...</p>
      </div>
    );
  }

  const isFarmer = Object.keys(userProfile.role)[0] === 'Farmer';

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center">
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </button>
        </header>

        <div className="bg-gray-800 shadow-lg rounded-xl p-6 mb-8">
          <div className="flex items-center mb-6">
            <div className="mr-4">
              {renderRoleIcon()}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{userProfile.name}</h2>
              <p className="text-gray-400">{Object.keys(userProfile.role)[0]}</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Bio</h3>
            <p className="text-gray-300 mb-6">{userProfile.bio || 'No bio provided.'}</p>

            <h3 className="text-lg font-semibold mb-2">Skills</h3>
            {userProfile.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {userProfile.skills.map((skill, index) => (
                  <span key={index} className="bg-gray-700 text-gray-200 px-3 py-1 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No skills listed.</p>
            )}
          </div>
        </div>

        {isFarmer && (
          <div>
            <CreateFarmForm onSubmit={handleCreateFarm} isLoading={isCreatingFarm} />
            
            <div className="bg-gray-800 shadow-lg rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-4">My Farms</h2>
              {myFarms.length > 0 ? (
                <div className="space-y-4">
                  {myFarms.map((farm) => (
                    <div key={farm.id} className="bg-gray-700 p-4 rounded-lg">
                      <h3 className="text-xl font-bold">{farm.name}</h3>
                      <p className="text-gray-400">{farm.location}</p>
                      <p className="mt-2">{farm.description}</p>
                      <p className="mt-4 text-green-400 font-semibold">Funding Goal: {Number(farm.fundingGoal)} USD</p>
                      
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-sm font-medium text-gray-300">Open for Investment:</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            value="" 
                            className="sr-only peer"
                            checked={farm.isOpenForInvestment}
                            onChange={(e) => handleToggleInvestmentStatus(farm.farmId, e.target.checked)}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      <div className="flex space-x-2 mt-4">
                        <button 
                          onClick={() => handleDownloadAuditReport(farm.id)}
                          className="flex-1 py-2 px-4 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm flex items-center justify-center"
                        >
                          <Download className="w-4 h-4 mr-2" /> Audit Report
                        </button>
                        <button 
                          onClick={() => handleLaunchInvestment(farm.id)}
                          className="flex-1 py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm flex items-center justify-center"
                        >
                          <Rocket className="w-4 h-4 mr-2" /> Launch
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>You haven't created any farms yet.</p>
              )}
            </div>
          </div>
        )}

        {!isFarmer && (
           <div className="bg-gray-800 shadow-lg rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-4">Available Farms</h2>
              
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text"
                  placeholder="Filter by name or location..."
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 pl-10 pr-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {filteredFarms.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {filteredFarms.map((farm) => (
                    <div key={farm.id} className="bg-gray-700 p-4 rounded-lg flex flex-col">
                        <div className="flex-grow">
                            <h3 className="text-xl font-bold">{farm.name}</h3>
                            <p className="text-gray-400">{farm.location}</p>
                            <p className="mt-2">{farm.description}</p>
                        </div>
                        <div className="mt-auto">
                            <p className="mt-4 text-green-400 font-semibold">Funding Goal: {Number(farm.fundingGoal)} USD</p>
                            <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center">
                                View Details <ArrowRight className="w-4 h-4 ml-2" />
                            </button>
                        </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No farms match your filter.</p>
              )}
            </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;
