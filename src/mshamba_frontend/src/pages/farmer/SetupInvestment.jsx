import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DollarSign, Users, Calendar, Target, Mail } from 'lucide-react';
import { mshamba_backend } from 'declarations/mshamba_backend';

const SetupInvestment = () => {
  const { farmId } = useParams();
  const navigate = useNavigate();
  const [investmentData, setInvestmentData] = useState({
    title: '',
    description: '',
    targetAmount: '',
    minimumInvestment: '',
    duration: '',
    purpose: ''
  });
  const [farmName, setFarmName] = useState('');
  const [currentInvestments, setCurrentInvestments] = useState([]); // Keep for local display if needed

  useEffect(() => {
    const fetchFarmDetails = async () => {
      if (farmId) {
        try {
          const result = await mshamba_backend.getFarm(farmId);
          if (result.ok) {
            setFarmName(result.ok.name);
            setInvestmentData(prev => ({
              ...prev,
              title: `Investment for ${result.ok.name}`,
              description: `Funding opportunity for ${result.ok.name}.`
            }));
          } else {
            alert(`Error fetching farm details: ${result.err}`);
            navigate('/farmer/dashboard'); // Redirect if farm not found
          }
        } catch (error) {
          console.error("Error fetching farm details:", error);
          alert("An unexpected error occurred while fetching farm details.");
          navigate('/farmer/dashboard');
        }
      }
    };
    fetchFarmDetails();
  }, [farmId, navigate]);

  const handleInputChange = (e) => {
    setInvestmentData({
      ...investmentData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!farmId) {
      alert("Error: Farm ID is missing. Please navigate from a specific farm.");
      return;
    }

    // Generate token symbol (e.g., first 3 letters of title, uppercase)
    const tokenSymbol = investmentData.title.substring(0, 3).toUpperCase();

    try {
      // Convert Nat values
      const initialSupplyNat = BigInt(investmentData.targetAmount);
      const transferFeeNat = BigInt(10_000); // Default transfer fee
      const vestingDaysNat = BigInt(365); // Default vesting days

      const result = await mshamba_backend.openFarmInvestment(
        farmId,
        investmentData.title, // tokenName
        tokenSymbol,
        initialSupplyNat,
        [], // investorAllocs (empty for now)
        null, // governance (null for now)
        vestingDaysNat,
        transferFeeNat,
        [], // extraControllers (empty for now)
        null // cyclesToSpend (null for default)
      );

      if (result.ok) {
        alert(`Investment opportunity "${investmentData.title}" published successfully! Ledger ID: ${result.ok.toText()}`);
        // Clear form and navigate back to farmer dashboard
        setInvestmentData({
          title: '',
          description: '',
          targetAmount: '',
          minimumInvestment: '',
          duration: '',
          purpose: ''
        });
        navigate('/farmer/dashboard');
      } else {
        alert(`Failed to publish investment: ${result.err}`);
      }
    } catch (error) {
      console.error("Error publishing investment:", error);
      alert("An unexpected error occurred while publishing investment.");
    }
  };

  const openInvestment = (index) => {
    // This function is for local state management, not directly related to backend openFarmInvestment
    alert(`Launching investment: ${currentInvestments[index].title}`);
    const updated = [...currentInvestments];
    updated[index].status = 'Live';
    setCurrentInvestments(updated);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">

      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Setup Investment Opportunity</h2>
        <p className="text-gray-600">Create a new investment opportunity for your farm project</p>
      </div>

      {/* Investment Form */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <form onSubmit={handleSubmit} className="space-y-6">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Investment Title</label>
              <input
                type="text"
                name="title"
                value={investmentData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., Almond Grove Expansion Project"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Investment Purpose</label>
              <select
                name="purpose"
                value={investmentData.purpose}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              >
                <option value="">Select Purpose</option>
                <option value="expansion">Farm Expansion</option>
                <option value="equipment">New Equipment</option>
                <option value="irrigation">Irrigation System</option>
                <option value="organic">Organic Certification</option>
                <option value="storage">Storage Facilities</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Project Description</label>
            <textarea
              name="description"
              value={investmentData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Describe your investment project, goals, and how funds will be used..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Target Amount ($)</label>
              <input
                type="number"
                name="targetAmount"
                value={investmentData.targetAmount}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="50000"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Investment ($)</label>
              <input
                type="number"
                name="minimumInvestment"
                value={investmentData.minimumInvestment}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="1000"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration (months)</label>
              <input
                type="number"
                name="duration"
                value={investmentData.duration}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="24"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button type="button" className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
              Save Draft
            </button>
            <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
              Publish Investment
            </button>
          </div>
        </form>
      </div>

      {/* Current Investments */}
      <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Current Investment Opportunities</h3>

        {currentInvestments.length === 0 && <p className="text-gray-600">No investments yet.</p>}

        {currentInvestments.map((inv, index) => (
          <div key={index} className="border p-4 rounded-lg space-y-3">
            {/* Header */}
            <div className="flex justify-between items-center">
              <h4 className="font-medium">{inv.title || 'Untitled'}</h4>
              <span className={`px-2 py-1 text-xs rounded-full ${inv.status === 'Live' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {inv.status}
              </span>
            </div>

            {/* Token Settings */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-gray-600">
              <div className="flex items-center"><Target className="h-4 w-4 mr-1"/>Target: ${inv.targetAmount || 0}</div>
              <div className="flex items-center"><Users className="h-4 w-4 mr-1"/>Min Investment: ${inv.minimumInvestment || 0}</div>
              <div className="flex items-center"><Calendar className="h-4 w-4 mr-1"/>Duration: {inv.duration || 0} mo</div>
            </div>

            {/* Tokenomics Report */}
            <div className="mt-2 p-3 bg-gray-50 border rounded text-gray-700">
              <h5 className="font-semibold mb-1">Tokenomics Report</h5>
              <p>Purpose: {inv.purpose || '-'}</p>
              <p>Additional details: Placeholder for future API integration.</p>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2 mt-2">
              <button
                onClick={() => openInvestment(index)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Open Investment
              </button>

              <a
                href="mailto:investor@example.com"
                className="flex items-center bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 text-gray-700"
              >
                <Mail className="h-4 w-4 mr-1"/> Review / Ask Questions
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SetupInvestment;
