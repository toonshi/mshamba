import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Result "mo:base/Result";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Float "mo:base/Float";
import Option "mo:base/Option";
import Debug "mo:base/Debug";
import Int "mo:base/Int";

import MT "./lib/marketplace_types";

actor Marketplace {
  // Stable storage
  private stable var usersEntries : [(Principal, MT.UserProfile)] = [];
  private stable var listingsEntries : [(Text, MT.MarketplaceListing)] = [];
  private stable var transactionsEntries : [(Text, MT.MarketplaceTransaction)] = [];
  private stable var nextListingId : Nat = 1;
  private stable var nextTransactionId : Nat = 1;

  // Runtime state
  private var users = HashMap.HashMap<Principal, MT.UserProfile>(10, Principal.equal, Principal.hash);
  private var listings = HashMap.HashMap<Text, MT.MarketplaceListing>(10, Text.equal, Text.hash);
  private var transactions = HashMap.HashMap<Text, MT.MarketplaceTransaction>(10, Text.equal, Text.hash);

  // Upgrade hooks
  system func preupgrade() {
    usersEntries := Iter.toArray(users.entries());
    listingsEntries := Iter.toArray(listings.entries());
    transactionsEntries := Iter.toArray(transactions.entries());
  };

  system func postupgrade() {
    users := HashMap.fromIter<Principal, MT.UserProfile>(usersEntries.vals(), 10, Principal.equal, Principal.hash);
    listings := HashMap.fromIter<Text, MT.MarketplaceListing>(listingsEntries.vals(), 10, Text.equal, Text.hash);
    transactions := HashMap.fromIter<Text, MT.MarketplaceTransaction>(transactionsEntries.vals(), 10, Text.equal, Text.hash);
    usersEntries := [];
    listingsEntries := [];
    transactionsEntries := [];
  };

  // ============================================
  // USER MANAGEMENT
  // ============================================

  // Register or update user profile
  public shared(msg) func registerUser(
    role: MT.UserRole,
    name: Text,
    location: ?MT.Location,
    phoneNumber: ?Text
  ) : async MT.UserProfileResult {
    let userId = msg.caller;
    
    // Check if user already exists
    let existingUser = users.get(userId);
    
    let profile : MT.UserProfile = switch (existingUser) {
      case (?user) {
        // Update existing user
        {
          userId = userId;
          role = role;
          name = name;
          location = location;
          phoneNumber = phoneNumber;
          verified = user.verified;
          rating = user.rating;
          totalTransactions = user.totalTransactions;
          createdAt = user.createdAt;
        }
      };
      case null {
        // Create new user
        {
          userId = userId;
          role = role;
          name = name;
          location = location;
          phoneNumber = phoneNumber;
          verified = false;
          rating = 5.0;
          totalTransactions = 0;
          createdAt = Time.now();
        }
      };
    };

    users.put(userId, profile);
    #ok(profile)
  };

  // Get user profile
  public query func getUserProfile(userId: Principal) : async ?MT.UserProfile {
    users.get(userId)
  };

  // Get own profile
  public shared query(msg) func getMyProfile() : async ?MT.UserProfile {
    users.get(msg.caller)
  };

  // ============================================
  // LISTING MANAGEMENT
  // ============================================

  // Create a new listing
  public shared(msg) func createListing(
    category: MT.ListingCategory,
    title: Text,
    description: Text,
    priceInCkUSDC: Nat,
    unit: Text,
    quantity: Nat,
    location: MT.Location,
    images: [Text]
  ) : async MT.CreateListingResult {
    
    // Verify user is registered
    let userProfile = switch (users.get(msg.caller)) {
      case (?profile) { profile };
      case null { return #err("User not registered. Please register first.") };
    };

    // Verify user role allows selling
    switch (userProfile.role) {
      case (#Supplier) {};
      case (#ServiceProvider) {};
      case (_) { return #err("Only Suppliers and Service Providers can create listings") };
    };

    let listingId = "LST-" # Nat.toText(nextListingId);
    nextListingId += 1;

    let listing : MT.MarketplaceListing = {
      id = listingId;
      sellerId = msg.caller;
      sellerName = userProfile.name;
      category = category;
      title = title;
      description = description;
      priceInCkUSDC = priceInCkUSDC;
      unit = unit;
      quantity = quantity;
      location = location;
      images = images;
      available = true;
      createdAt = Time.now();
      updatedAt = Time.now();
    };

    listings.put(listingId, listing);
    #ok(listing)
  };

  // Update listing
  public shared(msg) func updateListing(
    listingId: Text,
    priceInCkUSDC: ?Nat,
    quantity: ?Nat,
    available: ?Bool
  ) : async Result.Result<MT.MarketplaceListing, Text> {
    
    let listing = switch (listings.get(listingId)) {
      case (?l) { l };
      case null { return #err("Listing not found") };
    };

    // Verify caller is the seller
    if (listing.sellerId != msg.caller) {
      return #err("Not authorized to update this listing");
    };

    let updatedListing = {
      listing with
      priceInCkUSDC = Option.get(priceInCkUSDC, listing.priceInCkUSDC);
      quantity = Option.get(quantity, listing.quantity);
      available = Option.get(available, listing.available);
      updatedAt = Time.now();
    };

    listings.put(listingId, updatedListing);
    #ok(updatedListing)
  };

  // Get all listings
  public query func getAllListings() : async MT.ListingsResult {
    Iter.toArray(listings.vals())
  };

  // Get listings by category
  public query func getListingsByCategory(category: MT.ListingCategory) : async MT.ListingsResult {
    let filtered = Array.filter<MT.MarketplaceListing>(
      Iter.toArray(listings.vals()),
      func(listing) {
        listing.category == category and listing.available
      }
    );
    filtered
  };

  // Get seller's listings
  public query func getSellerListings(sellerId: Principal) : async MT.ListingsResult {
    let filtered = Array.filter<MT.MarketplaceListing>(
      Iter.toArray(listings.vals()),
      func(listing) {
        listing.sellerId == sellerId
      }
    );
    filtered
  };

  // Get single listing
  public query func getListing(listingId: Text) : async ?MT.MarketplaceListing {
    listings.get(listingId)
  };

  // Calculate distance between two locations (Haversine formula)
  private func calculateDistance(loc1: MT.Location, loc2: MT.Location) : Float {
    let earthRadiusKm = 6371.0;
    let dLat = (loc2.latitude - loc1.latitude) * 3.14159 / 180.0;
    let dLon = (loc2.longitude - loc1.longitude) * 3.14159 / 180.0;
    
    let lat1Rad = loc1.latitude * 3.14159 / 180.0;
    let lat2Rad = loc2.latitude * 3.14159 / 180.0;
    
    let a = Float.sin(dLat / 2.0) * Float.sin(dLat / 2.0) +
            Float.sin(dLon / 2.0) * Float.sin(dLon / 2.0) * 
            Float.cos(lat1Rad) * Float.cos(lat2Rad);
    let c = 2.0 * Float.arctan2(Float.sqrt(a), Float.sqrt(1.0 - a));
    
    earthRadiusKm * c
  };

  // Get nearby listings (within radius)
  public query func getNearbyListings(
    location: MT.Location,
    radiusKm: Nat,
    category: ?MT.ListingCategory
  ) : async MT.ListingsResult {
    let radiusFloat = Float.fromInt(radiusKm);
    
    let filtered = Array.filter<MT.MarketplaceListing>(
      Iter.toArray(listings.vals()),
      func(listing) {
        let distance = calculateDistance(location, listing.location);
        let withinRadius = distance <= radiusFloat;
        let categoryMatch = switch (category) {
          case (?cat) { listing.category == cat };
          case null { true };
        };
        listing.available and withinRadius and categoryMatch
      }
    );
    filtered
  };

  // ============================================
  // TRANSACTIONS
  // ============================================

  // Create a purchase transaction (will be completed after ckUSDC payment)
  public shared(msg) func createPurchase(
    listingId: Text,
    quantity: Nat,
    farmId: ?Text
  ) : async MT.PurchaseResult {
    
    // Get buyer profile
    let buyer = switch (users.get(msg.caller)) {
      case (?profile) { profile };
      case null { return #err("Buyer not registered") };
    };

    // Get listing
    let listing = switch (listings.get(listingId)) {
      case (?l) { l };
      case null { return #err("Listing not found") };
    };

    // Verify listing is available
    if (not listing.available) {
      return #err("Listing is not available");
    };

    // Verify quantity
    if (quantity > listing.quantity) {
      return #err("Requested quantity exceeds available quantity");
    };

    // Get seller profile
    let seller = switch (users.get(listing.sellerId)) {
      case (?profile) { profile };
      case null { return #err("Seller not found") };
    };

    // Calculate total
    let totalAmount = listing.priceInCkUSDC * quantity;

    // Create transaction
    let transactionId = "TXN-" # Nat.toText(nextTransactionId);
    nextTransactionId += 1;

    let transaction : MT.MarketplaceTransaction = {
      id = transactionId;
      buyerId = msg.caller;
      buyerName = buyer.name;
      sellerId = listing.sellerId;
      sellerName = listing.sellerName;
      listingId = listingId;
      listingTitle = listing.title;
      quantity = quantity;
      totalAmount = totalAmount;
      status = #Pending;
      farmId = farmId;
      hederaTransactionId = null;
      hederaTopicId = null;
      createdAt = Time.now();
      completedAt = null;
      notes = null;
    };

    transactions.put(transactionId, transaction);

    // Update listing quantity
    let updatedListing = {
      listing with
      quantity = listing.quantity - quantity;
      available = (listing.quantity - quantity) > 0;
      updatedAt = Time.now();
    };
    listings.put(listingId, updatedListing);

    #ok(transaction)
  };

  // Confirm transaction after payment
  public shared(msg) func confirmTransaction(transactionId: Text) : async Result.Result<MT.MarketplaceTransaction, Text> {
    let transaction = switch (transactions.get(transactionId)) {
      case (?txn) { txn };
      case null { return #err("Transaction not found") };
    };

    // Only buyer can confirm (after successful payment)
    if (transaction.buyerId != msg.caller) {
      return #err("Not authorized");
    };

    let updatedTransaction = {
      transaction with
      status = #Confirmed;
    };

    transactions.put(transactionId, updatedTransaction);

    // Update user transaction counts
    updateUserTransactionCount(transaction.buyerId);
    updateUserTransactionCount(transaction.sellerId);

    #ok(updatedTransaction)
  };

  // Update transaction with Hedera data
  public shared(msg) func updateTransactionHederaData(
    transactionId: Text,
    hederaTransactionId: Text,
    hederaTopicId: Text
  ) : async Result.Result<MT.MarketplaceTransaction, Text> {
    let transaction = switch (transactions.get(transactionId)) {
      case (?txn) { txn };
      case null { return #err("Transaction not found") };
    };

    // Only buyer or seller can update
    if (transaction.buyerId != msg.caller and transaction.sellerId != msg.caller) {
      return #err("Not authorized");
    };

    let updatedTransaction = {
      transaction with
      hederaTransactionId = ?hederaTransactionId;
      hederaTopicId = ?hederaTopicId;
      status = #Completed;
      completedAt = ?Time.now();
    };

    transactions.put(transactionId, updatedTransaction);
    #ok(updatedTransaction)
  };

  // Get user's transactions
  public shared query(msg) func getMyTransactions() : async [MT.MarketplaceTransaction] {
    let filtered = Array.filter<MT.MarketplaceTransaction>(
      Iter.toArray(transactions.vals()),
      func(txn) {
        txn.buyerId == msg.caller or txn.sellerId == msg.caller
      }
    );
    filtered
  };

  // Get specific transaction
  public query func getTransaction(transactionId: Text) : async ?MT.MarketplaceTransaction {
    transactions.get(transactionId)
  };

  // Helper function to update user transaction count
  private func updateUserTransactionCount(userId: Principal) {
    switch (users.get(userId)) {
      case (?user) {
        let updatedUser = {
          user with
          totalTransactions = user.totalTransactions + 1;
        };
        users.put(userId, updatedUser);
      };
      case null {};
    };
  };

  // ============================================
  // ADMIN / STATS
  // ============================================

  public query func getMarketplaceStats() : async {
    totalUsers: Nat;
    totalListings: Nat;
    totalTransactions: Nat;
    activeListings: Nat;
  } {
    let activeListings = Array.filter<MT.MarketplaceListing>(
      Iter.toArray(listings.vals()),
      func(listing) { listing.available }
    );

    {
      totalUsers = users.size();
      totalListings = listings.size();
      totalTransactions = transactions.size();
      activeListings = activeListings.size();
    }
  };
}
