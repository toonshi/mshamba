import React, { useState, useEffect } from 'react';
import { Search, MapPin, DollarSign, Clock, Mail, Sprout } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth'; // Adjust path as necessary

// Helper function to convert Blob (Uint8Array) to a base64 data URL
const blobToBase64 = (blob, contentType) => {
  if (!blob || blob.length === 0) {
    return null;
  }
  const binary = Array.from(new Uint8Array(blob))
    .map(byte => String.fromCharCode(byte))
    .join('');
  return `data:${contentType};base64,${btoa(binary)}`;
};

const FarmCard = ({ farm, onInvest, onEmailOwner }) => {
  const actualPercentage = (farm.targetAmount && farm.targetAmount > 0)
    ? (farm.currentAmount / farm.targetAmount) * 100
    : 0;

  let barWidth = actualPercentage;
  if (actualPercentage === 0 && farm.targetAmount > 0) {
    barWidth = 20; // Set to 20% for unfunded farms with a target
  }
  barWidth = Math.min(barWidth, 100); // Ensure it doesn't exceed 100%
  
  const getStatusColor = (percentage) => {
    if (percentage >= 100) return 'text-blue-600 bg-blue-100';
    if (percentage >= 75) return 'text-green-600 bg-green-100';
    if (percentage >= 50) return 'text-orange-600 bg-orange-100';
    if (percentage === 0) return 'text-gray-600 bg-gray-100'; // Neutral for truly unfunded
    return 'text-red-600 bg-red-100';
  };

  const getStatusText = (percentage) => {
    if (percentage >= 100) return 'Fully Funded';
    if (percentage >= 75) return 'Almost Funded';
    if (percentage >= 50) return 'Half Funded';
    if (percentage === 0) return 'Seeking Investment'; // Explicitly for truly unfunded
    return 'Seeking Investment';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img
          src={farm.image || 'https://images.pexels.com/photos/2132250/pexels-photo-2132250.jpeg?auto=compress&cs=tinysrgb&w=400'}
          alt={farm.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(actualPercentage)}`}>
            {getStatusText(actualPercentage)}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-1">{farm.name}</h3>
            <div className="flex items-center text-gray-600 text-sm">
              <MapPin className="h-4 w-4 mr-1" />
              {farm.location}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div className="flex items-center">
            <Sprout className="h-4 w-4 text-green-600 mr-2" />
            <span className="text-gray-600">{farm.size} • {farm.crop}</span>
          </div>
          <div className="flex items-center">             
               
  <span className="text-gray-600">Min: KSH {farm.minInvestment?.toLocaleString('en-KE') || 'N/A'}</span>           
</div>         
</div>          

{farm.targetAmount && (           
  <div className="mb-4">             
    <div className="flex justify-between text-sm text-gray-600 mb-2">               
      <span>Funding Progress</span>               
      <span>KSH {(farm.currentAmount || 0).toLocaleString('en-KE')} of KSH {farm.targetAmount.toLocaleString('en-KE')}</span>             
    </div>             
    <div className="w-full bg-gray-200 rounded-full h-2">               
      <div                  
        className="bg-green-600 h-2 rounded-full"                  
        style={{ width: `${barWidth}%` }}               
      ></div>             
    </div>             
    {actualPercentage > 0 && <div className="text-xs text-gray-500 mt-1">{actualPercentage.toFixed(0)}% funded</div>}           
  </div>         
)}          

<div className="grid grid-cols-2 gap-4 mb-4 text-sm">           
  <div className="text-center">             
    <div className="flex items-center justify-center mb-1">               
                 
    </div>             
    <p className="font-medium text-gray-900">KSH {farm.minInvestment?.toLocaleString('en-KE') || 'N/A'}</p>             
    <p className="text-gray-500">Min. Investment</p>           
  </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Clock className="h-4 w-4 text-orange-600" />
            </div>
            <p className="font-medium text-gray-900">{farm.duration || 'N/A'}m</p>
            <p className="text-gray-500">Duration</p>
          </div>
        </div>

        <div className="flex space-x-3">
          <button 
            onClick={() => onInvest(farm)}
            className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            Invest Now
          </button>
          <button 
            onClick={() => onEmailOwner(farm)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
          >
            <Mail className="h-4 w-4 mr-1" />
            Email
          </button>
        </div>
      </div>
    </div>
  );
};

const Farms = () => {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const { actor, isPlugConnected, plugPrincipal, plugActor, connectPlugWallet } = useAuth();

  // Mainnet ledger canister IDs provided by the user
  const mainnetLedgerCanisterIds = {
    "Green Valley Maize Farm": "osevl-taaaa-aaaac-a4bca-cai",
    "Highland Coffee Plantation": "ovft7-6yaaa-aaaac-a4bcq-cai",
    "Sunrise Vegetable Gardens": "o4gyd-iqaaa-aaaac-a4bda-cai",
    "Tropical Fruit Orchard": "o3h6x-fiaaa-aaaac-a4bdq-cai",
    // Add more mappings if needed for other dummy farms or backend farms
  };

  const dummyFarms = [
    {
      id: "dummy-1",
      name: "Green Valley Maize Farm",
      location: "Nakuru, Kenya",
      crop: "Maize",
      size: "10 acres",
      minInvestment: 5000,
      duration: 8,
      targetAmount: 50000,
      currentAmount: 15000,
      createdAt: new Date("2024-01-15").getTime(),
      image: "https://images.pexels.com/photos/2132250/pexels-photo-2132250.jpeg?auto=compress&cs=tinysrgb&w=400"
    },
    {
      id: "dummy-2",
      name: "Highland Coffee Plantation",
      location: "Kiambu, Kenya",
      crop: "Coffee",
      size: "15 acres",
      minInvestment: 8000,
      duration: 12,
      targetAmount: 80000,
      currentAmount: 35000,
      createdAt: new Date("2024-01-10").getTime(),
      image: "https://images.pexels.com/photos/894695/pexels-photo-894695.jpeg?auto=compress&cs=tinysrgb&w=400"
    },
    {
      id: "dummy-3",
      name: "Sunrise Vegetable Gardens",
      location: "Meru, Kenya",
      crop: "Vegetables",
      size: "5 acres",
      minInvestment: 3000,
      duration: 6,
      targetAmount: 25000,
      currentAmount: 8000,
      createdAt: new Date("2024-01-20").getTime(),
      image: "https://images.pexels.com/photos/1459339/pexels-photo-1459339.jpeg?auto=compress&cs=tinysrgb&w=400"
    },
    {
      id: "dummy-4",
      name: "Tropical Fruit Orchard",
      location: "Machakos, Kenya",
      crop: "Fruits",
      size: "20 acres",
      minInvestment: 10000,
      duration: 10,
      targetAmount: 100000,
      currentAmount: 75000,
      createdAt: new Date("2024-01-05").getTime(),
      image: "https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=400"
    },
    {
      id: "dummy-5",
      name: "Golden Wheat Fields",
      location: "Uasin Gishu, Kenya",
      crop: "Maize",
      size: "25 acres",
      minInvestment: 12000,
      duration: 7,
      targetAmount: 120000,
      currentAmount: 45000,
      createdAt: new Date("2024-01-25").getTime(),
      image: "https://images.pexels.com/photos/265216/pexels-photo-265216.jpeg?auto=compress&cs=tinysrgb&w=400"
    }
  ];

  useEffect(() => {
    const fetchFarms = async () => {
      if (!actor) {
        setLoading(false);
        setFarms(dummyFarms);
        return;
      }

      try {
        setLoading(true);
        const backendFarms = await actor.listFarms();
        
        const processedFarms = backendFarms.map(farm => {
          const dummyFarm = dummyFarms.find(d => d.name === farm.name) || {};
          
          const imageUrl = farm.imageContent && farm.imageContentType
            ? blobToBase64(farm.imageContent, farm.imageContentType)
            : dummyFarm.image || 'https://images.pexels.com/photos/2132250/pexels-photo-2132250.jpeg?auto=compress&cs=tinysrgb&w=400';

          return {
            id: farm.farmId || dummyFarm.id,
            name: farm.name || dummyFarm.name,
            location: farm.location || dummyFarm.location,
            crop: farm.crop || dummyFarm.crop,
            size: farm.size || dummyFarm.size,
            minInvestment: Number(farm.minInvestment) || dummyFarm.minInvestment,
            duration: Number(farm.duration) || dummyFarm.duration,
            targetAmount: Number(farm.fundingGoal) || dummyFarm.targetAmount,
            currentAmount: Number(farm.fundedAmount) || dummyFarm.currentAmount,
            createdAt: Number(farm.createdAt) || dummyFarm.createdAt,
            image: imageUrl,
            description: farm.description || dummyFarm.description,
            expectedYield: farm.expectedYield || dummyFarm.expectedYield,
            expectedROI: farm.expectedROI || dummyFarm.expectedROI,
            farmerName: farm.farmerName || dummyFarm.farmerName,
            experience: farm.experience || dummyFarm.experience,
            phone: farm.phone || dummyFarm.phone,
            email: farm.email || dummyFarm.email,
            // Add other fields as necessary, falling back to dummy data
          };
        });
        
        // Combine processed backend farms with any dummy farms that weren't matched
        const finalFarms = [...processedFarms];
        dummyFarms.forEach(dFarm => {
          if (!processedFarms.some(bFarm => bFarm.name === dFarm.name)) {
            finalFarms.push(dFarm);
          }
        });

        setFarms(finalFarms);
      } catch (error) {
        console.error('Error fetching farms:', error);
        setFarms(dummyFarms); // Fallback to dummy farms on error
      } finally {
        setLoading(false);
      }
    };

    fetchFarms();
  }, [actor]);

  const filters = [
    { value: 'all', label: 'All Farms' },
    { value: 'maize', label: 'Maize' },
    { value: 'coffee', label: 'Coffee' },
    { value: 'vegetables', label: 'Vegetables' },
    { value: 'fruits', label: 'Fruits' },
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest Listed' },
    { value: 'investment', label: 'Lowest Investment' },
  ];

  const filteredFarms = farms.filter(farm => {
    const matchesSearch = farm.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         farm.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         farm.crop?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || 
                         farm.crop?.toLowerCase().includes(selectedFilter.toLowerCase());
    
    return matchesSearch && matchesFilter;
  });

  const sortedFarms = [...filteredFarms].sort((a, b) => {
    switch (sortBy) {
      case 'investment':
        return (a.minInvestment || 0) - (b.minInvestment || 0);
      case 'newest':
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      default:
        return 0;
    }
  });

  const handleInvest = async (farm) => {
    if (!isPlugConnected) {
      alert("Please connect your Plug Wallet first.");
      await connectPlugWallet(); // Attempt to connect if not already
      return;
    }

    if (!plugActor || !plugPrincipal) {
      alert("Plug Wallet actor not available. Please try connecting again.");
      return;
    }

    // Determine the ledger canister ID for the farm
    let ledgerCanisterId = farm.ledgerCanister ? farm.ledgerCanister.toText() : null;

    // Fallback to hardcoded mainnet IDs for dummy farms or if not set in backend
    if (!ledgerCanisterId && mainnetLedgerCanisterIds[farm.name]) {
      ledgerCanisterId = mainnetLedgerCanisterIds[farm.name];
    }

    if (!ledgerCanisterId) {
      alert("Could not determine ledger canister for this farm.");
      return;
    }

    // Prompt user for investment amount
    const investmentAmountStr = prompt(`How much would you like to invest in ${farm.name}? (Min: KSH ${farm.minInvestment})`);
    if (!investmentAmountStr) return;

    const investmentAmount = BigInt(parseInt(investmentAmountStr, 10));

    if (isNaN(Number(investmentAmount)) || investmentAmount < farm.minInvestment) {
      alert(`Please enter a valid amount, at least KSH ${farm.minInvestment}.`);
      return;
    }

    try {
      // Assuming the farm owner is the recipient of the investment
      // You might need to get the actual farm owner's principal from the farm object
      // For now, let's assume a placeholder recipient or the farm's owner if available
      const recipientPrincipal = farm.owner ? farm.owner : plugPrincipal; // Placeholder: send to self if owner not available

      const transferArgs = {
        to: { owner: recipientPrincipal, subaccount: [] },
        amount: investmentAmount,
        fee: [], // Optional: let the ledger determine the fee
        memo: [],
        from_subaccount: [],
        created_at_time: [],
      };

      // The plugActor is created for icrc1_ledger, so it should have icrc1_transfer
      const result = await plugActor.icrc1_transfer(transferArgs);

      if (result.Ok) {
        alert(`Successfully invested ${investmentAmountStr} in ${farm.name}! Transaction ID: ${result.Ok}`);
        // Optionally, refresh farm data or update UI
      } else if (result.Err) {
        alert(`Investment failed: ${Object.keys(result.Err)[0]}`);
        console.error("ICRC-1 Transfer Error:", result.Err);
      }
    } catch (error) {
      console.error('Error investing in farm:', error);
      alert('Error processing investment. Please try again.' + error.message);
    }
  };

  const handleEmailOwner = async (farm) => {
    try {
      // TODO: Implement email functionality with backend
      // await backendActor.sendEmailToFarmOwner(farm.id, message);
      console.log('Emailing farm owner:', farm);
      alert(`Email to ${farm.name} owner initiated. This will be connected to the backend.`);
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Error sending email. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border p-6">
              <div className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded mb-4"></div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
            <Sprout className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Browse All Farms</h1>
            <p className="text-gray-600">Discover profitable agricultural investment opportunities</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search farms, locations, crops..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="bg-white border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            {filters.map(filter => (
              <option key={filter.value} value={filter.value}>{filter.label}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center space-x-2 mb-2">
            <MapPin className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-gray-600">Total Farms</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{sortedFarms.length}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-sm font-medium text-gray-600">Min Investment</span>
          </div>
          <div className="text-2xl font-bold text-purple-600">
  {farms.length > 0 
    ? `KSH ${Math.min(...farms.map(farm => farm.minInvestment || Infinity)).toLocaleString('en-KE')}`
    : 'N/A'
  }
</div>

        </div>
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="w-5 h-5 text-orange-600" />
            <span className="text-sm font-medium text-gray-600">Avg. Duration</span>
          </div>
          <div className="text-2xl font-bold text-orange-600">
            {farms.length > 0 
              ? `${(farms.reduce((sum, farm) => sum + (farm.duration || 0), 0) / farms.length).toFixed(1)}m`
              : 'N/A'
            }
          </div>
        </div>
      </div>

      {/* Farm Listings */}
      {sortedFarms.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {sortedFarms.map((farm) => (
            <FarmCard
              key={farm.id}
              farm={farm}
              onInvest={handleInvest}
              onEmailOwner={handleEmailOwner}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border p-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No farms available</h3>
            <p className="text-gray-600">
              {farms.length === 0 
                ? 'No farms have been listed yet. Check back later for new opportunities.'
                : 'Try adjusting your search criteria or filters to find more farms.'
              }
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Farms;