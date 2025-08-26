import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import * as LucideIcons from 'lucide-react';
import { mshamba_assets } from 'declarations/mshamba_assets'; // Import assets canister
import { mshamba_backend } from 'declarations/mshamba_backend'; // Import backend canister

const InvestorProfile = () => {
  const { profile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [totalInvestment, setTotalInvestment] = useState(0);
  const [investments, setInvestments] = useState([]);
  const [newCrop, setNewCrop] = useState("");

  // Use a separate state for form data to avoid directly mutating context state
  const [formData, setFormData] = useState({ preferredCrops: [] });

  useEffect(() => {
    if (profile) {
      // When profile from context is loaded, populate the form data
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        location: profile.location || '',
        company: profile.company || '',
        investmentCapacity: profile.investmentCapacity || 0,
        riskTolerance: profile.riskTolerance || 'Not set',
        preferredCrops: Array.isArray(profile.preferredCrops) ? profile.preferredCrops : [],
      });

      const fetchProfileImage = async () => {
        if (profile.profilePicture) {
          try {
            const imageData = await mshamba_assets.getImage(profile.profilePicture);
            if (imageData && imageData.length > 0) {
              const blob = new Blob([new Uint8Array(imageData)], { type: 'image/jpeg' });
              const url = URL.createObjectURL(blob);
              setProfileImageUrl(url);
            }
          } catch (error) {
            console.error("Error fetching profile image:", error);
          }
        }
      };

      const fetchInvestments = async () => {
        try {
          const investmentsResult = await mshamba_backend.getMyInvestments();
          setInvestments(investmentsResult);
          const total = investmentsResult.reduce((sum, inv) => sum + Number(inv.amount), 0);
          setTotalInvestment(total);
        } catch (error) {
          console.error("Error fetching investments:", error);
        }
      };

      fetchProfileImage();
      fetchInvestments();
    }
  }, [profile]); // Re-run effects if the profile object changes



  // Handlers
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddCrop = () => {
    if (newCrop.trim() !== "") {
      setFormData({
        ...formData,
        preferredCrops: [...formData.preferredCrops, newCrop],
      });
      setNewCrop("");
    }
  };


  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8">
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 rounded-full flex items-center justify-center mr-4 sm:mr-6 overflow-hidden">
              {profileImageUrl ? (
                <img src={profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <LucideIcons.User className="h-8 w-8 sm:h-10 sm:w-10 text-blue-600" />
              )}
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                {profile?.name || "Your Name"}
              </h2>
              <p className="text-gray-600 text-sm sm:text-base">
                {profile?.company || "Your Company"}
              </p>
              <div className="flex items-center mt-1 sm:mt-2 text-gray-500 text-sm">
                <LucideIcons.MapPin className="h-4 w-4 mr-1" />
                <span>{profile?.location || "Your Location"}</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center justify-center px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
          >
            <LucideIcons.Edit className="h-4 w-4 mr-2" />
            {isEditing ? "Save Profile" : "Edit Profile"}
          </button>
        </div>
      </div>

      {/* Investment Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          label="Total Invested"
          value={`$${totalInvestment.toLocaleString()}`}
          icon={<LucideIcons.DollarSign className="h-6 w-6 text-green-600" />}
          bg="bg-green-100"
        />
      </div>

      {/* Profile Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Info */}
        <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Personal Information
          </h3>
          {isEditing ? (
            <form className="space-y-4">
              {["name", "email", "phone", "location"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <input
                    type="text"
                    name={field}
                    value={formData[field]}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  />
                </div>
              ))}
            </form>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              <InfoRow icon={<LucideIcons.Mail />} value={profile?.email} />
              <InfoRow icon={<LucideIcons.Phone />} value={profile?.phone} />
              <InfoRow icon={<LucideIcons.MapPin />} value={profile?.location} />
            </div>
          )}
        </div>

        {/* Preferences */}
        <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Investment Preferences
          </h3>
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2">Investment Capacity</label>
                <input
                  type="number"
                  name="investmentCapacity"
                  value={formData.investmentCapacity}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg text-sm sm:text-base"
                />
              </div>
              <div>
                <label className="block text-sm mb-2">Risk Tolerance</label>
                <select
                  name="riskTolerance"
                  value={formData.riskTolerance}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg text-sm sm:text-base"
                >
                  <option>Conservative</option>
                  <option>Moderate</option>
                  <option>Aggressive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-2">Preferred Crops</label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={newCrop}
                    onChange={(e) => setNewCrop(e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-lg text-sm sm:text-base"
                  />
                  <button
                    type="button"
                    onClick={handleAddCrop}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p>
                <strong>Capacity:</strong> $
                {typeof formData.investmentCapacity === 'number' ? formData.investmentCapacity.toLocaleString() : '0'}
              </p>
              <p>
                <strong>Risk:</strong> {formData.riskTolerance}
              </p>
              <div className="flex flex-wrap gap-2">
                {formData.preferredCrops.map((crop, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                  >
                    {crop}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Investment History */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            Investment History
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {["Farm ID", "Amount", "Timestamp"].map((col) => (
                  <th key={col} className="px-4 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {investments.map((investment) => (
                <tr key={investment.investmentId} className="hover:bg-gray-50">
                  <td className="px-4 sm:px-6 py-2 sm:py-4">{investment.farmId}</td>
                  <td className="px-4 sm:px-6 py-2 sm:py-4">${Number(investment.amount).toLocaleString()}</td>
                  <td className="px-4 sm:px-6 py-2 sm:py-4">
                    {new Date(Number(investment.timestamp) / 1000000).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Helper components
const StatCard = ({ label, value, icon, bg }) => (
  <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs sm:text-sm text-gray-600">{label}</p>
        <p className="text-xl sm:text-2xl font-bold text-gray-900">{value}</p>
      </div>
      <div className={`${bg} p-2 sm:p-3 rounded-lg`}>{icon}</div>
    </div>
  </div>
);

const InfoRow = ({ icon, value }) => (
  <div className="flex items-center text-sm sm:text-base">
    {React.cloneElement(icon, { className: "h-4 w-4 sm:h-5 sm:w-5 text-gray-400 mr-2 sm:mr-3" })}
    <span className="text-gray-600">{value || "Not provided"}</span>
  </div>
);

export default InvestorProfile;
