import React, { useState, useEffect } from 'react';
import { ShoppingCart, MapPin, Search, Filter, Package, Truck, Sprout, Shield, Star } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { logToHedera, HederaEvents } from '../utils/hederaService';

export const Marketplace = () => {
  const { actor } = useAuth();
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  const categories = [
    { id: 'all', name: 'All Items', icon: Package },
    { id: 'Seeds', name: 'Seeds', icon: Sprout },
    { id: 'Fertilizers', name: 'Fertilizers', icon: Package },
    { id: 'Tools', name: 'Tools', icon: Package },
    { id: 'Transport', name: 'Transport', icon: Truck },
  ];

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.log('Location access denied:', error);
        }
      );
    }
  }, []);

  // Fetch listings
  useEffect(() => {
    loadListings();
  }, [actor]);

  const loadListings = async () => {
    if (!actor) return;
    
    try {
      setLoading(true);
      // For now, use getAllListings. Later we can use getNearbyListings with user location
      const result = await actor.getAllListings();
      setListings(result);
      setFilteredListings(result);
    } catch (error) {
      console.error('Error loading listings:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter listings
  useEffect(() => {
    let filtered = listings;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(listing => {
        const category = Object.keys(listing.category)[0];
        return category === selectedCategory;
      });
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(listing =>
        listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredListings(filtered);
  }, [searchTerm, selectedCategory, listings]);

  // Handle purchase
  const handlePurchase = async (listing) => {
    if (!actor) {
      alert('Please sign in to make a purchase');
      return;
    }

    const quantity = 1; // For MVP, always buy 1 unit
    const confirmed = window.confirm(
      `Purchase ${listing.title} for ${(listing.priceInCkUSDC / 1_000_000).toFixed(2)} ckUSDC?`
    );

    if (!confirmed) return;

    setPurchasing(listing.id);

    try {
      // Step 1: Create purchase transaction
      const txnResult = await actor.createPurchase(listing.id, quantity, null);
      
      if ('err' in txnResult) {
        throw new Error(txnResult.err);
      }

      const transaction = txnResult.ok;
      console.log('Transaction created:', transaction);

      // Step 2: TODO - Process ckUSDC payment here
      // For MVP, we'll skip the actual payment and move to Hedera logging

      // Step 3: Log to Hedera
      const category = Object.keys(listing.category)[0];
      const hederaEvent = HederaEvents.inputPurchase(
        'MARKETPLACE',
        'Marketplace Purchase',
        category,
        listing.title,
        listing.priceInCkUSDC,
        new Date().toISOString(),
        listing.sellerName
      );

      const hederaResult = await logToHedera(hederaEvent);
      console.log('Verified on Hedera:', hederaResult.explorerUrl);

      // Step 4: Update transaction with Hedera data
      const updateResult = await actor.updateTransactionHederaData(
        transaction.id,
        hederaResult.transactionId,
        hederaResult.topicId
      );

      if ('ok' in updateResult) {
        alert(`✅ Purchase successful!\n\nVerified on Hedera:\n${hederaResult.explorerUrl}`);
        loadListings(); // Refresh listings
      }

    } catch (error) {
      console.error('Purchase failed:', error);
      alert('Purchase failed: ' + error.message);
    } finally {
      setPurchasing(null);
    }
  };

  // Calculate distance (simplified)
  const calculateDistance = (listing) => {
    if (!userLocation || !listing.location) return null;
    
    // Haversine formula (simplified)
    const R = 6371; // Earth's radius in km
    const dLat = (listing.location.latitude - userLocation.latitude) * Math.PI / 180;
    const dLon = (listing.location.longitude - userLocation.longitude) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(userLocation.latitude * Math.PI / 180) * Math.cos(listing.location.latitude * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    return distance.toFixed(1);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Marketplace</h1>
          <p className="text-gray-400">Buy farm inputs and services with ckUSDC</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search products or services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {categories.map(category => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                <Icon size={18} />
                <span>{category.name}</span>
              </button>
            );
          })}
        </div>

        {/* Listings Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading marketplace...</p>
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No listings found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => {
              const category = Object.keys(listing.category)[0];
              const distance = calculateDistance(listing);
              
              return (
                <div
                  key={listing.id}
                  className="bg-gray-800 rounded-xl overflow-hidden hover:ring-2 hover:ring-green-500 transition-all"
                >
                  {/* Image placeholder */}
                  <div className="bg-gray-700 h-48 flex items-center justify-center">
                    <Package className="w-16 h-16 text-gray-600" />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold">{listing.title}</h3>
                      <span className="px-2 py-1 bg-green-600 text-xs rounded-full">
                        {category}
                      </span>
                    </div>

                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {listing.description}
                    </p>

                    {/* Seller */}
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold">{listing.sellerName[0]}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{listing.sellerName}</p>
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                          <span className="text-xs text-gray-400">4.5</span>
                        </div>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-center space-x-2 mb-4 text-sm text-gray-400">
                      <MapPin size={16} />
                      <span>{listing.location.region}</span>
                      {distance && (
                        <span className="text-green-400">• {distance} km away</span>
                      )}
                    </div>

                    {/* Price and Action */}
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-2xl font-bold text-green-400">
                          {(listing.priceInCkUSDC / 1_000_000).toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-400">
                          ckUSDC per {listing.unit}
                        </div>
                      </div>

                      <button
                        onClick={() => handlePurchase(listing)}
                        disabled={!listing.available || purchasing === listing.id}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                          listing.available && purchasing !== listing.id
                            ? 'bg-green-600 hover:bg-green-700 text-white'
                            : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {purchasing === listing.id ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Buying...</span>
                          </>
                        ) : (
                          <>
                            <ShoppingCart size={18} />
                            <span>Buy</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Stock */}
                    <div className="mt-3 text-xs text-gray-400">
                      {listing.quantity} {listing.unit} available
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Hedera Badge Info */}
        <div className="mt-12 bg-blue-900/20 border border-blue-500/30 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <Shield className="w-6 h-6 text-blue-400 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-blue-300 mb-2">All Purchases Verified on Hedera</h3>
              <p className="text-gray-400 text-sm">
                Every transaction is automatically logged to Hedera's public ledger with an immutable timestamp. 
                This creates a transparent audit trail that anyone can verify on HashScan.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
