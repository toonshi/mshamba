import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Upload,
  MapPin,
  DollarSign,
  Sprout,
  User,
  Clock,
  TrendingUp,
  FileText,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { CreateFarmForm } from '../../components/CreateFarmForm';


export const FarmListing = ({ onBack }) => {
  const [farms, setFarms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { isAuthenticated, actor, login, logout } = useAuth();

  useEffect(() => {
    if (actor) {
      fetchFarms();
    }
  }, [actor]);

  const fetchFarms = async () => {
    setIsLoading(true);
    try {
      const userFarms = await actor.myFarms();
      setFarms(userFarms);
    } catch (err) {
      setError("Failed to fetch farms.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddFarm = async (formData) => {
    if (!actor) {
      console.error("Actor not ready");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const result = await actor.createFarm(
        formData.name,
        formData.description,
        formData.location,
        formData.fundingGoal
      );
      if (result.ok) {
        setFarms([...farms, result.ok]);
      } else {
        setError(result.err);
        console.error("Backend error creating farm:", result.err);
      }
    } catch (err) {
      setError("An error occurred while creating the farm.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 w-full">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {!isAuthenticated ? (
          <div className="text-center">
            <p className="mb-4">Please login to create and view your farms.</p>
            <button onClick={login} className="bg-green-600 text-white font-semibold rounded-lg px-4 py-2 hover:bg-green-700">Login with Internet Identity</button>
          </div>
        ) : (
          <>
            <CreateFarmForm onSubmit={handleAddFarm} isLoading={isLoading} />
            {error && <div className="text-red-500 text-center mb-4">{error}</div>}
            {/* Farm List */}
            <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6 lg:p-8">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800">Your Farms</h2>
              {isLoading && <p>Loading farms...</p>}
              {farms.length === 0 && !isLoading && (
                <p className="text-gray-500 text-sm sm:text-base">No farms added yet. Fill out the form above to get started!</p>
              )}
              <div className="space-y-4">
                {farms.map((farm, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow-sm border"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      <div className="lg:col-span-2">
                        <h3 className="font-semibold text-lg sm:text-xl text-gray-800 mb-2">
                          {farm.name}
                        </h3>
                        <div className="space-y-1 text-sm sm:text-base text-gray-600">
                          <p className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2 text-green-600" />
                            {farm.location}
                          </p>
                          {farm.owner && (
                            <p className="flex items-center">
                              <User className="w-4 h-4 mr-2 text-green-600" />
                              {farm.owner.toText()}
                            </p>
                          )}
                          {farm.description && (
                            <p className="text-gray-500 mt-2">{farm.description}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 text-sm">
                        {farm.cropType && (
                          <div className="bg-green-50 p-2 rounded border-l-4 border-green-400">
                            <p className="text-green-700 font-medium">Crop</p>
                            <p className="text-green-600">{farm.cropType}</p>
                          </div>
                        )}
                        {farm.size && (
                          <div className="bg-blue-50 p-2 rounded border-l-4 border-blue-400">
                            <p className="text-blue-700 font-medium">Size</p>
                            <p className="text-blue-600">{farm.size}</p>
                          </div>
                        )}
                        {farm.fundingGoal && (
                          <div className="bg-yellow-50 p-2 rounded border-l-4 border-yellow-400">
                            <p className="text-yellow-700 font-medium">Investment</p>
                            <p className="text-yellow-600">${farm.fundingGoal.toString()}</p>
                          </div>
                        )}
                        {farm.expectedROI && (
                          <div className="bg-purple-50 p-2 rounded border-l-4 border-purple-400">
                            <p className="text-purple-700 font-medium">Expected ROI</p>
                            <p className="text-purple-600">{farm.expectedROI}%</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FarmListing;