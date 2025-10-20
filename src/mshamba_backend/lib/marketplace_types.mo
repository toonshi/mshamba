import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Result "mo:base/Result";

module {
  // User roles in the marketplace
  public type UserRole = {
    #Farmer;
    #Supplier;      // Sells seeds, fertilizer, etc.
    #ServiceProvider; // Transport, labor, etc.
    #Buyer;         // General buyer (investors, etc.)
  };

  // Location data for proximity-based features
  public type Location = {
    latitude: Float;
    longitude: Float;
    address: Text;
    region: Text;
    country: Text;
  };

  // User profile with role and location
  public type UserProfile = {
    userId: Principal;
    role: UserRole;
    name: Text;
    location: ?Location;
    phoneNumber: ?Text;
    verified: Bool;
    rating: Float;
    totalTransactions: Nat;
    createdAt: Time.Time;
  };

  // Marketplace listing categories
  public type ListingCategory = {
    #Seeds;
    #Fertilizers;
    #Pesticides;
    #Tools;
    #Equipment;
    #Transport;
    #Labor;
    #Storage;
    #Processing;
    #Other: Text;
  };

  // A marketplace listing (product or service)
  public type MarketplaceListing = {
    id: Text;
    sellerId: Principal;
    sellerName: Text;
    category: ListingCategory;
    title: Text;
    description: Text;
    priceInCkUSDC: Nat; // Price in smallest units (like cents)
    unit: Text; // "kg", "bag", "hour", "trip", etc.
    quantity: Nat; // Available quantity
    location: Location;
    images: [Text]; // URLs or IPFS hashes
    available: Bool;
    createdAt: Time.Time;
    updatedAt: Time.Time;
  };

  // Transaction status
  public type TransactionStatus = {
    #Pending;
    #Confirmed;
    #Completed;
    #Cancelled;
    #Disputed;
  };

  // Marketplace transaction
  public type MarketplaceTransaction = {
    id: Text;
    buyerId: Principal;
    buyerName: Text;
    sellerId: Principal;
    sellerName: Text;
    listingId: Text;
    listingTitle: Text;
    quantity: Nat;
    totalAmount: Nat; // Total in ckUSDC smallest units
    status: TransactionStatus;
    farmId: ?Text; // If buyer is a farmer, link to their farm
    hederaTransactionId: ?Text; // Link to Hedera HCS verification
    hederaTopicId: ?Text;
    createdAt: Time.Time;
    completedAt: ?Time.Time;
    notes: ?Text;
  };

  // Transaction receipt for Hedera logging
  public type TransactionReceipt = {
    transaction: MarketplaceTransaction;
    listing: MarketplaceListing;
    buyer: UserProfile;
    seller: UserProfile;
  };

  // Search filters
  public type SearchFilters = {
    category: ?ListingCategory;
    maxPrice: ?Nat;
    minPrice: ?Nat;
    location: ?Location;
    radiusKm: ?Nat;
    sellerRole: ?UserRole;
  };

  // Result types
  public type CreateListingResult = Result.Result<MarketplaceListing, Text>;
  public type PurchaseResult = Result.Result<MarketplaceTransaction, Text>;
  public type UserProfileResult = Result.Result<UserProfile, Text>;
  public type ListingsResult = [MarketplaceListing];
}
