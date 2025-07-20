import Time "mo:base/Time";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Int "mo:base/Int";
import Float "mo:base/Float";
import HashMap "mo:base/HashMap";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Result "mo:base/Result";
import Option "mo:base/Option";
import Debug "mo:base/Debug";

import Types "types";
import Utils "utils";
import ICRC2Token "../farm_token";

module {
  public type Result<T> = Utils.Result<T>;
  public type Farm = Types.Farm;

  // Token Factory Types
  public type TokenCanisterInfo = {
    farmId: Text;
    canisterId: Principal;
    name: Text;
    symbol: Text;
    totalSupply: Nat;
    created_at: Int;
    status: TokenStatus;
  };

  public type TokenStatus = {
    #Active;
    #Paused;
    #Deprecated;
  };

  public type CreateTokenRequest = {
    farm: Farm;
    initialSupply: Nat;
    decimals: Nat8;
    fee: Nat;
    logo: ?Text;
  };

  public type TokenRegistry = HashMap.HashMap<Text, TokenCanisterInfo>;
  public type InvestmentRecord = {
    id: Text;
    farmId: Text;
    investor: Principal;
    amount: Nat;
    tokensReceived: Nat;
    timestamp: Int;
    tokenPrice: Float;
  };

  public type InvestmentStore = HashMap.HashMap<Text, InvestmentRecord>;

  // Factory functions
  public func newTokenRegistry() : TokenRegistry {
    HashMap.HashMap<Text, TokenCanisterInfo>(100, Text.equal, Text.hash)
  };

  public func newInvestmentStore() : InvestmentStore {
    HashMap.HashMap<Text, InvestmentRecord>(500, Text.equal, Text.hash)
  };

  // Generate token symbol from farm name
  public func generateTokenSymbol(farmName: Text) : Text {
    let words = Text.split(farmName, #char(' '));
    var symbol = "";
    var count = 0;
    
    for (word in words) {
      if (count < 3 and Text.size(word) > 0) {
        let firstChar = Text.toUppercase(Text.take(word, 1));
        symbol := symbol # firstChar;
        count += 1;
      };
    };
    
    if (Text.size(symbol) == 0) {
      symbol := "FARM";
    };
    
    symbol # "T" // Add 'T' for Token
  };

  // Calculate farm valuation using enhanced algorithm
  public func calculateFarmValuation(farm: Farm) : Nat {
    let baseValuation = farm.sizeInAcres * 50000; // Base: $500 per acre in cents
    let yieldMultiplier = farm.expectedYield / 100.0;
    let locationMultiplier = getLocationMultiplier(farm.location);
    let cropMultiplier = getCropMultiplier(farm.cropType);
    
    // Additional factors
    let sustainabilityBonus = if (Text.contains(Text.toLowercase(farm.description), #text("organic")) or
                                 Text.contains(Text.toLowercase(farm.description), #text("sustainable"))) {
      1.2
    } else {
      1.0
    };

    let totalValuation = Float.toInt(
      Float.fromInt(baseValuation) * 
      (1.0 + yieldMultiplier) * 
      locationMultiplier * 
      cropMultiplier *
      sustainabilityBonus
    );
    
    Int.abs(totalValuation)
  };

  // Location-based valuation multiplier (Kenya-specific)
  private func getLocationMultiplier(location: Text) : Float {
    let lowerLocation = Text.toLowercase(location);
    if (Text.contains(lowerLocation, #text("nairobi")) or 
        Text.contains(lowerLocation, #text("kiambu")) or
        Text.contains(lowerLocation, #text("nakuru"))) {
      1.5 // Premium locations - high market access
    } else if (Text.contains(lowerLocation, #text("mombasa")) or
               Text.contains(lowerLocation, #text("kisumu")) or
               Text.contains(lowerLocation, #text("eldoret")) or
               Text.contains(lowerLocation, #text("thika"))) {
      1.3 // Good locations - decent market access
    } else if (Text.contains(lowerLocation, #text("meru")) or
               Text.contains(lowerLocation, #text("nyeri")) or
               Text.contains(lowerLocation, #text("embu"))) {
      1.2 // Agricultural regions
    } else {
      1.0 // Standard locations
    }
  };

  // Crop-based valuation multiplier (Kenya-specific)
  private func getCropMultiplier(cropType: Text) : Float {
    let lowerCrop = Text.toLowercase(cropType);
    if (Text.contains(lowerCrop, #text("coffee")) or
        Text.contains(lowerCrop, #text("tea")) or
        Text.contains(lowerCrop, #text("avocado")) or
        Text.contains(lowerCrop, #text("macadamia"))) {
      1.4 // High-value export crops
    } else if (Text.contains(lowerCrop, #text("flowers")) or
               Text.contains(lowerCrop, #text("roses")) or
               Text.contains(lowerCrop, #text("carnations"))) {
      1.6 // Premium floriculture
    } else if (Text.contains(lowerCrop, #text("maize")) or
               Text.contains(lowerCrop, #text("wheat")) or
               Text.contains(lowerCrop, #text("beans")) or
               Text.contains(lowerCrop, #text("rice"))) {
      1.1 // Staple crops
    } else if (Text.contains(lowerCrop, #text("vegetables")) or
               Text.contains(lowerCrop, #text("tomatoes")) or
               Text.contains(lowerCrop, #text("onions"))) {
      1.25 // Vegetables
    } else {
      1.0 // Standard crops
    }
  };

  // Calculate initial token supply based on valuation
  public func calculateInitialSupply(valuation: Nat, targetTokenPrice: Nat) : Nat {
    if (targetTokenPrice == 0) {
      1000000 // Default 1M tokens
    } else {
      valuation / targetTokenPrice
    }
  };

  // Register a new token canister
  public func registerToken(
    farmId: Text,
    canisterId: Principal,
    name: Text,
    symbol: Text,
    totalSupply: Nat,
    registry: TokenRegistry
  ) : Result<TokenCanisterInfo> {
    switch (registry.get(farmId)) {
      case (?existing) {
        #err("Token already exists for farm: " # farmId)
      };
      case null {
        let tokenInfo: TokenCanisterInfo = {
          farmId = farmId;
          canisterId = canisterId;
          name = name;
          symbol = symbol;
          totalSupply = totalSupply;
          created_at = Time.now();
          status = #Active;
        };
        
        registry.put(farmId, tokenInfo);
        #ok(tokenInfo)
      };
    }
  };

  // Record investment transaction
  public func recordInvestment(
    farmId: Text,
    investor: Principal,
    amount: Nat,
    tokensReceived: Nat,
    tokenPrice: Float,
    investmentStore: InvestmentStore
  ) : Result<InvestmentRecord> {
    let investmentId = farmId # "-" # Principal.toText(investor) # "-" # Int.toText(Time.now());
    
    let investment: InvestmentRecord = {
      id = investmentId;
      farmId = farmId;
      investor = investor;
      amount = amount;
      tokensReceived = tokensReceived;
      timestamp = Time.now();
      tokenPrice = tokenPrice;
    };

    investmentStore.put(investmentId, investment);
    #ok(investment)
  };

  // Get token info
  public func getTokenInfo(
    farmId: Text,
    registry: TokenRegistry
  ) : Result<TokenCanisterInfo> {
    switch (registry.get(farmId)) {
      case (?info) { #ok(info) };
      case null { #err("Token not found for farm: " # farmId) };
    }
  };

  // Get all registered tokens
  public func getAllTokens(registry: TokenRegistry) : [TokenCanisterInfo] {
    Iter.toArray(registry.vals())
  };

  // Get investments for a farm
  public func getFarmInvestments(
    farmId: Text,
    investmentStore: InvestmentStore
  ) : [InvestmentRecord] {
    let investments = Iter.toArray(investmentStore.vals());
    Array.filter<InvestmentRecord>(
      investments,
      func(inv) : Bool { inv.farmId == farmId }
    )
  };

  // Get investments by investor
  public func getInvestorInvestments(
    investor: Principal,
    investmentStore: InvestmentStore
  ) : [InvestmentRecord] {
    let investments = Iter.toArray(investmentStore.vals());
    Array.filter<InvestmentRecord>(
      investments,
      func(inv) : Bool { inv.investor == investor }
    )
  };

  // Calculate total investment in a farm
  public func getTotalFarmInvestment(
    farmId: Text,
    investmentStore: InvestmentStore
  ) : Nat {
    let investments = getFarmInvestments(farmId, investmentStore);
    Array.foldLeft<InvestmentRecord, Nat>(
      investments,
      0,
      func(acc, inv) { acc + inv.amount }
    )
  };

  // Calculate investor's total investment
  public func getInvestorTotalInvestment(
    investor: Principal,
    investmentStore: InvestmentStore
  ) : Nat {
    let investments = getInvestorInvestments(investor, investmentStore);
    Array.foldLeft<InvestmentRecord, Nat>(
      investments,
      0,
      func(acc, inv) { acc + inv.amount }
    )
  };

  // Update token status
  public func updateTokenStatus(
    farmId: Text,
    status: TokenStatus,
    registry: TokenRegistry
  ) : Result<TokenCanisterInfo> {
    switch (registry.get(farmId)) {
      case (?info) {
        let updatedInfo = {
          info with status = status;
        };
        registry.put(farmId, updatedInfo);
        #ok(updatedInfo)
      };
      case null {
        #err("Token not found for farm: " # farmId)
      };
    }
  };

  // Token analytics
  public type TokenAnalytics = {
    totalTokens: Nat;
    totalInvestments: Nat;
    totalValueLocked: Nat;
    averageTokenPrice: Float;
    topPerformingFarms: [Text];
  };

  public func getTokenAnalytics(
    registry: TokenRegistry,
    investmentStore: InvestmentStore
  ) : TokenAnalytics {
    let tokens = getAllTokens(registry);
    let investments = Iter.toArray(investmentStore.vals());
    
    let totalInvestments = Array.size(investments);
    let totalValueLocked = Array.foldLeft<InvestmentRecord, Nat>(
      investments,
      0,
      func(acc, inv) { acc + inv.amount }
    );

    let averageTokenPrice = if (totalInvestments > 0) {
      let totalPriceSum = Array.foldLeft<InvestmentRecord, Float>(
        investments,
        0.0,
        func(acc, inv) { acc + inv.tokenPrice }
      );
      totalPriceSum / Float.fromInt(totalInvestments)
    } else {
      0.0
    };

    {
      totalTokens = Array.size(tokens);
      totalInvestments = totalInvestments;
      totalValueLocked = totalValueLocked;
      averageTokenPrice = averageTokenPrice;
      topPerformingFarms = []; // Placeholder for future implementation
    }
  };
}
