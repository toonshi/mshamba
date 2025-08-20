import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  TrendingUp,
  Calendar,
  Edit,
  Plus,
} from "lucide-react";

const InvestorProfile = () => {
  const [isEditing, setIsEditing] = useState(false);

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    company: "",
    investmentCapacity: "",
    riskTolerance: "Moderate",
    preferredCrops: [],
  });

  const [newCrop, setNewCrop] = useState("");
  const [investments, setInvestments] = useState([]);
  const [newInvestment, setNewInvestment] = useState({
    farmName: "",
    amount: "",
    date: "",
    status: "Active",
    expectedReturn: "",
    currentValue: "",
  });

  // Stats
  const totalInvested = investments.reduce((sum, inv) => sum + Number(inv.amount), 0);
  const totalCurrentValue = investments.reduce(
    (sum, inv) => sum + Number(inv.currentValue),
    0
  );
  const totalReturns = totalCurrentValue - totalInvested;
  const averageReturn =
    investments.length > 0
      ? ((totalCurrentValue / totalInvested - 1) * 100).toFixed(1)
      : 0;

  // Handlers
  const handleInputChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddCrop = () => {
    if (newCrop.trim() !== "") {
      setProfileData({
        ...profileData,
        preferredCrops: [...profileData.preferredCrops, newCrop],
      });
      setNewCrop("");
    }
  };

  const handleInvestmentChange = (e) => {
    setNewInvestment({
      ...newInvestment,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddInvestment = (e) => {
    e.preventDefault();
    setInvestments([
      ...investments,
      { ...newInvestment, id: Date.now() },
    ]);
    setNewInvestment({
      farmName: "",
      amount: "",
      date: "",
      status: "Active",
      expectedReturn: "",
      currentValue: "",
    });
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mr-6">
              <User className="h-10 w-10 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {profileData.name || "Your Name"}
              </h2>
              <p className="text-gray-600">
                {profileData.company || "Your Company"}
              </p>
              <div className="flex items-center mt-2 text-gray-500">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{profileData.location || "Your Location"}</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Edit className="h-4 w-4 mr-2" />
            {isEditing ? "Save Profile" : "Edit Profile"}
          </button>
        </div>
      </div>

      {/* Investment Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          label="Total Invested"
          value={`$${totalInvested.toLocaleString()}`}
          icon={<DollarSign className="h-6 w-6 text-green-600" />}
          bg="bg-green-100"
        />
        <StatCard
          label="Current Value"
          value={`$${totalCurrentValue.toLocaleString()}`}
          icon={<TrendingUp className="h-6 w-6 text-blue-600" />}
          bg="bg-blue-100"
        />
        <StatCard
          label="Total Returns"
          value={`$${totalReturns.toLocaleString()}`}
          icon={<TrendingUp className="h-6 w-6 text-green-600" />}
          bg="bg-green-100"
        />
        <StatCard
          label="Avg Return"
          value={`${averageReturn}%`}
          icon={<Calendar className="h-6 w-6 text-blue-600" />}
          bg="bg-blue-100"
        />
      </div>

      {/* Profile Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Info */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
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
                    value={profileData[field]}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
            </form>
          ) : (
            <div className="space-y-4">
              <InfoRow icon={<Mail />} value={profileData.email} />
              <InfoRow icon={<Phone />} value={profileData.phone} />
              <InfoRow icon={<MapPin />} value={profileData.location} />
            </div>
          )}
        </div>

        {/* Preferences */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
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
                  value={profileData.investmentCapacity}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm mb-2">Risk Tolerance</label>
                <select
                  name="riskTolerance"
                  value={profileData.riskTolerance}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option>Conservative</option>
                  <option>Moderate</option>
                  <option>Aggressive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-2">Preferred Crops</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCrop}
                    onChange={(e) => setNewCrop(e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={handleAddCrop}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg"
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
                {profileData.investmentCapacity.toLocaleString()}
              </p>
              <p>
                <strong>Risk:</strong> {profileData.riskTolerance}
              </p>
              <div className="flex flex-wrap gap-2">
                {profileData.preferredCrops.map((crop, idx) => (
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
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">
            Investment History
          </h3>
          <button
            onClick={() => document.getElementById("add-investment-form").scrollIntoView({ behavior: "smooth" })}
            className="flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded-lg"
          >
            <Plus className="h-4 w-4 mr-1" /> Add Investment
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {["Farm", "Investment", "Current Value", "Return", "Status", "Date"].map((col) => (
                  <th key={col} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {investments.map((investment) => (
                <tr key={investment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{investment.farmName}</td>
                  <td className="px-6 py-4">${Number(investment.amount).toLocaleString()}</td>
                  <td className="px-6 py-4">${Number(investment.currentValue).toLocaleString()}</td>
                  <td className="px-6 py-4 text-green-600">
                    +{(((investment.currentValue / investment.amount) - 1) * 100).toFixed(1)}%
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${investment.status === "Active" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}`}>
                      {investment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">{new Date(investment.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Investment Form */}
      <div id="add-investment-form" className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Investment</h3>
        <form onSubmit={handleAddInvestment} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {["farmName", "amount", "currentValue", "expectedReturn", "date"].map((field) => (
            <input
              key={field}
              type={field === "date" ? "date" : "text"}
              name={field}
              placeholder={field}
              value={newInvestment[field]}
              onChange={handleInvestmentChange}
              className="px-3 py-2 border rounded-lg"
            />
          ))}
          <select
            name="status"
            value={newInvestment.status}
            onChange={handleInvestmentChange}
            className="px-3 py-2 border rounded-lg"
          >
            <option>Active</option>
            <option>Completed</option>
          </select>
          <button
            type="submit"
            className="col-span-2 px-4 py-2 bg-green-600 text-white rounded-lg"
          >
            Add Investment
          </button>
        </form>
      </div>
    </div>
  );
};

// Helper components
const StatCard = ({ label, value, icon, bg }) => (
  <div className="bg-white rounded-xl shadow-sm border p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
      <div className={`${bg} p-3 rounded-lg`}>{icon}</div>
    </div>
  </div>
);

const InfoRow = ({ icon, value }) => (
  <div className="flex items-center">
    {React.cloneElement(icon, { className: "h-5 w-5 text-gray-400 mr-3" })}
    <span className="text-gray-600">{value || "Not provided"}</span>
  </div>
);

export default InvestorProfile;
