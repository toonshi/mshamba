//types
module {
  // User & Roles (Unified for Farm Management + Marketplace)
  public type Role = {
    #Investor;
    #Farmer;
    #Supplier;        // Marketplace: Sells seeds, fertilizers, tools
    #ServiceProvider; // Marketplace: Transport, labor, storage
    #Buyer;           // Marketplace: General buyer
    // #LandOwner;
    // #SupplyPartner;
    // #Admin;
  };

  // Location data for proximity-based marketplace features
  public type Location = {
    latitude: Float;
    longitude: Float;
    address: Text;
    region: Text;
    country: Text;
  };

  // Unified User Profile (Farm + Marketplace)
  public type UserProfile = {
    id : Text;
    userId: Principal;
    name : Text;
    email : Text;
    role : Role;
    wallet : Principal;
    bio : Text;
    location : Text;          // Simple location string (legacy)
    gpsLocation: ?Location;   // GPS coordinates for marketplace
    phoneNumber: ?Text;       // For marketplace contact
    verified: Bool;           // Marketplace verification status
    rating: Float;            // Marketplace seller/buyer rating
    totalTransactions: Nat;   // Marketplace transaction count
    joinedAt : Int;
    
  };

  //  Farm Project

  public type FarmStatus = {
    #Registered;
    #Funded;
    #Trading;
    #Closed;
  };

public type FarmInvestor = {
  investor: Principal;
  amount: Nat;
  shares: Nat;
  timestamp: Int;
};

public type Farm = {
  farmId: Text;
  name: Text;
  owner: Principal;
  description: Text;
  location: Text;
  fundingGoal: Nat;
  fundedAmount: Nat;
  totalShares: Nat;
  sharePrice: Nat;
  createdAt: Int;
  status: FarmStatus;
  investors: [FarmInvestor];
  valuationHistory: [Nat];
  sharePriceHistory: [Nat];
  ledgerCanister: ?Principal;
  isOpenForInvestment: Bool;
  imageContent: Blob; // Image content as Blob
  imageContentType: Text; // e.g., "image/jpeg", "image/png"
  crop: Text;
  size: Text;
  duration: Nat; // in months
  minInvestment: Nat;
  expectedYield: Text;
  expectedROI: Text;
  farmerName: Text;
  experience: Text;
  phone: Text;
  email: Text;
  // Token parameters for dynamic ICRC-1 token creation
  tokenName: Text;
  tokenSymbol: Text;
  tokenSupply: Nat;
  tokenDecimals: Nat8;
  tokenTransferFee: Nat;
  tokenLogo: ?Text;
  // Four-Wallet System: Escrow and IFO
  hasEscrow: Bool;              // Whether farm has escrow initialized
  tokenPrice: Nat;              // Price per token in e8s (for IFO)
  ifoEndDate: ?Int;             // IFO deadline timestamp
  maxInvestmentPerUser: ?Nat;   // Optional cap per investor
  // Equity Structure & Token Allocation
  farmTreasuryAccount: ?Principal;  // Farm business entity account (holds operating capital)
  farmerEquityPercent: Nat;         // Farmer's equity % (default: 75%)
  platformEquityPercent: Nat;       // Platform's equity % (default: 5%)
  ifoEquityPercent: Nat;            // IFO/Investor equity % (default: 20%)
  farmerTokensAllocated: Nat;       // Tokens allocated to farmer (vested)
  platformTokensAllocated: Nat;     // Tokens allocated to platform (vested)
  ifoTokensAllocated: Nat;          // Tokens allocated for IFO (in escrow)
  vestingStartTime: ?Int;           // When vesting started
  farmerMonthlySalary: Nat;         // Farmer's monthly management fee (in KES e8s)
};


  // Wallet Types
  public type TransactionType = {
    #deposit;
    #withdrawal;
    #investment;
    #profitDistribution;
    #transferIn;
    #transferOut;
  };

  public type Transaction = {
    id : Text;
    timestamp : Int;
    transactionType : TransactionType;
    from : Principal;
    to : Principal;
    amount : Nat;
    description : Text;
  };

 
  public type Investment = {
    investmentId : Text;
    investor : Principal;
    farmId : Text;
    amount : Nat;
    sharesReceived : Nat;
    pricePerShare : Nat;
    timestamp : Int;
  };

  //  Share Ownership

  public type FarmShare = {
    owner : Principal;
    farmId : Text;
    sharesOwned : Nat;
    avgBuyPrice : Nat; // Optional for PnL tracking
  };

  //Trade Orders for Secondary Market

  public type OrderType = {
    #Buy;
    #Sell;
  };

  public type OrderStatus = {
    #Open;
    #Matched;
    #Cancelled;
  };

  public type TradeOrder = {
    orderId : Text;
    user : Principal;
    farmId : Text;
    orderType : OrderType;
    quantity : Nat;
    pricePerShare : Nat;
    timestamp : Int;
    status : OrderStatus;
  };

  public type TradeMatch = {
    tradeId : Text;
    farmId : Text;
    buyer : Principal;
    seller : Principal;
    quantity : Nat;
    pricePerShare : Nat;
    timestamp : Int;
  };

  
  // Enhanced Valuation System
  
  public type CropType = {
    #Vegetables;
    #Grains;
    #Fruits;
    #Livestock;
    #Cash_Crops;
  };

  public type ValuationFactors = {
    landSize : Float;
    cropType : CropType;
    soilQuality : Nat;      // 1-10 scale
    waterAccess : Bool;
    infrastructure : Nat;   // 1-10 scale
    marketAccess : Nat;     // 1-10 scale
    climateRisk : Nat;      // 1-10 scale
  };

  public type ValuationMetrics = {
    totalValuation : Nat;
    sharePrice : Nat;
    qualityScore : Float;
    calculatedAt : Int;
    factors : ValuationFactors;
  };

  // Enhanced Farm Token System
  
  public type TokenStandard = {
    #ICRC1;  // ICP token standard
    #Custom; // Custom implementation
  };


 
  // Profit Distribution System
  
  public type ProfitDistribution = {
    distributionId : Text;
    farmId : Text;
    totalProfit : Nat;
    distributionDate : Int;
    profitPerShare : Nat;
    recipients : [(Principal, Nat)]; // (investor, amount)
    status : {
      #Pending;
      #Distributed;
      #Failed;
    };
  };

  public type HarvestReport = {
    reportId : Text;
    farmId : Text;
    harvestDate : Int;
    totalYield : Float;
    totalRevenue : Nat;
    expenses : Nat;
    netProfit : Nat;
    yieldPerAcre : Float;
    qualityGrade : Text;
  };

  public type HttpRequest = {
    method: Text;
    url: Text;
    headers: [(Text, Text)];
    body: Blob;
  };

  public type HttpResponse = {
    status_code: Nat;
    headers: [(Text, Text)];
    body: Blob;
  };

  public type Result<T> = { #ok : T; #err : Text };

  // ============================================
  // MARKETPLACE TYPES
  // ============================================

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
    priceInCkUSDC: Nat; // Price in smallest units (6 decimals)
    unit: Text; // "kg", "bag", "hour", "trip", etc.
    quantity: Nat; // Available quantity
    location: Location;
    images: [Text]; // URLs or IPFS hashes
    available: Bool;
    createdAt: Int;
    updatedAt: Int;
  };

  // Marketplace transaction status
  public type MarketplaceStatus = {
    #Pending;
    #Confirmed;
    #Completed;
    #Cancelled;
    #Disputed;
  };

  // Marketplace transaction (links to farms automatically)
  public type MarketplaceTransaction = {
    id: Text;
    buyerId: Principal;
    buyerName: Text;
    sellerId: Principal;
    sellerName: Text;
    listingId: Text;
    listingTitle: Text;
    category: ListingCategory;
    quantity: Nat;
    totalAmount: Nat; // Total in ckUSDC smallest units
    status: MarketplaceStatus;
    farmId: ?Text; // AUTO-LINKED to buyer's farm
    hederaTransactionId: ?Text; // Hedera HCS verification
    hederaTopicId: ?Text;
    createdAt: Int;
    completedAt: ?Int;
    notes: ?Text;
  };

  // Farm Record (extended to include marketplace purchases)
  public type FarmRecordSource = {
    #Manual;           // Manually entered by farmer
    #Marketplace;      // Auto-created from marketplace purchase
  };

  public type FarmRecord = {
    id: Text;
    farmId: Text;
    eventType: Text; // "INPUT_PURCHASED", "LABOR_ACTIVITY", etc.
    category: Text;
    description: Text;
    amount: Nat;
    quantity: ?Nat;
    unit: ?Text;
    supplier: ?Text;
    source: FarmRecordSource;
    marketplaceTransactionId: ?Text; // Link to marketplace transaction
    hederaTransactionId: ?Text;
    hederaTopicId: ?Text;
    createdAt: Int;
    notes: ?Text;
  };
}
 
