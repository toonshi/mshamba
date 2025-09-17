import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DollarSign, Users, Calendar, Target, Mail, UploadCloud } from 'lucide-react'; // Added UploadCloud icon
import { mshamba_backend } from 'declarations/mshamba_backend';

// import { Filevault } from 'declarations/Filevault'; // Import Filevault actor
import toast from 'react-hot-toast';

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
  const [currentInvestments, setCurrentInvestments] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null); // New state for selected file
  const [uploadedDocuments, setUploadedDocuments] = useState([]); // New state for uploaded documents

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
            toast.error(`Error fetching farm details: ${result.err}`);
            navigate('/farmer/dashboard'); // Redirect if farm not found
          }
        } catch (error) {
          console.error("Error fetching farm details:", error);
          toast.error("An unexpected error occurred while fetching farm details.");
          navigate('/farmer/dashboard');
        }
      }
    };
    const fetchInvestments = async () => {
      if (farmId) {
        try {
          const result = await mshamba_backend.getFarmInvestments(farmId);
          if (result.ok) {
            setCurrentInvestments(result.ok);
          } else {
            toast.error(`Error fetching investments: ${result.err}`);
          }
        } catch (error) {
          console.error("Error fetching investments:", error);
          toast.error("An unexpected error occurred while fetching investments.");
        }
      }
    };
    fetchFarmDetails();
    fetchInvestments();
  }, [farmId, navigate]);

  const handleInputChange = (e) => {
    setInvestmentData({
      ...investmentData,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveDraft = () => {
    setCurrentInvestments([...currentInvestments, { ...investmentData, status: 'Draft' }]);
    setInvestmentData({
      title: '',
      description: '',
      targetAmount: '',
      minimumInvestment: '',
      duration: '',
      purpose: ''
    });
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  /*
  const handleUploadDocument = async () => {
    if (!selectedFile || !farmId) {
      toast.error("Please select a file and ensure farm ID is available.");
      return;
    }

    const fileName = selectedFile.name;
    const fileType = selectedFile.type || 'application/octet-stream';
    const chunkSize = 1024 * 1024; // 1MB chunk size
    let offset = 0;
    let index = 0;

    toast.loading(`Uploading ${fileName}...`);

    try {
      // Check if file already exists (optional, but good for UX)
      const fileExists = await Filevault.checkFileExists(fileName);
      if (fileExists) {
        toast.dismiss();
        toast.error(`File "${fileName}" already exists. Please rename or delete the existing one.`);
        return;
      }

      while (offset < selectedFile.size) {
        const chunk = selectedFile.slice(offset, offset + chunkSize);
        const blob = new Blob([chunk], { type: fileType });
        const arrayBuffer = await blob.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);

        await Filevault.uploadFileChunk(fileName, uint8Array, index, fileType);

        offset += chunkSize;
        index += 1;
        toast.loading(`Uploading ${fileName}... Chunk ${index} of ${Math.ceil(selectedFile.size / chunkSize)}`);
      }

      // After successful upload to Filevault, associate with farm in mshamba_backend
      const result = await mshamba_backend.addFarmDocument(farmId, fileName);

      if (result.ok) {
        toast.dismiss();
        toast.success(`Document "${fileName}" uploaded and linked to farm successfully!`);
        setUploadedDocuments(prev => [...prev, fileName]);
        setSelectedFile(null); // Clear selected file
      } else {
        toast.dismiss();
        toast.error(`Failed to link document to farm: ${result.err}`);
      }

    } catch (error) {
      toast.dismiss();
      console.error("Error uploading document:", error);
      toast.error(`An error occurred during document upload: ${error.message}`);
    }
  };
  */

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!farmId) {
      toast.error("Error: Farm ID is missing. Please navigate from a specific farm.");
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
        toast.success(`Investment opportunity "${investmentData.title}" published successfully! Ledger ID: ${result.ok.toText()}`);
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
        toast.error(`Failed to publish investment: ${result.err}`);
      }
    } catch (error) {
      console.error("Error publishing investment:", error);
      toast.error("An unexpected error occurred while publishing investment.");
    }
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

          {/* Document Upload Section */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Supporting Documents</h3>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-green-50 file:text-green-700
                  hover:file:bg-green-100"
              />
              <button
                type="button"
                onClick={handleUploadDocument}
                disabled={!selectedFile}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <UploadCloud className="h-5 w-5 mr-2" /> Upload Document
              </button>
            </div>
            {uploadedDocuments.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Uploaded Documents:</p>
                <ul className="list-disc list-inside text-gray-600">
                  {uploadedDocuments.map((docName, index) => (
                    <li key={index}>{docName}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            <button type="button" onClick={handleSaveDraft} className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
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
