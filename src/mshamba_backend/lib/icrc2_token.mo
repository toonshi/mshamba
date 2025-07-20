import Time "mo:base/Time";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Nat64 "mo:base/Nat64";
import Int "mo:base/Int";
import Float "mo:base/Float";
import HashMap "mo:base/HashMap";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Result "mo:base/Result";
import Option "mo:base/Option";
import Debug "mo:base/Debug";

// Basic ICRC-style types without external dependencies
// We'll implement core functionality using standard Motoko

import Types "types";
import Utils "utils";

module {
  public type Result<T> = Utils.Result<T>;
  public type Farm = Types.Farm;
  
  // ICRC-2 Style Token Types (simplified implementation)
  public type Account = {
    owner: Principal;
    subaccount: ?Blob;
  };
  
  public type Balance = Nat;
  
  public type TransferArgs = {
    from_subaccount: ?Blob;
    to: Account;
    amount: Balance;
    fee: ?Balance;
    memo: ?Blob;
    created_at_time: ?Nat64;
  };
  
  public type TransferResult = {
    #Ok: Nat;
    #Err: TransferError;
  };
  
  public type TransferError = {
    #BadFee: { expected_fee: Balance };
    #BadBurn: { min_burn_amount: Balance };
    #InsufficientFunds: { balance: Balance };
    #TooOld;
    #CreatedInFuture: { ledger_time: Nat64 };
    #Duplicate: { duplicate_of: Nat };
    #TemporarilyUnavailable;
    #GenericError: { error_code: Nat; message: Text };
  };
  
  public type ApproveArgs = {
    from_subaccount: ?Blob;
    spender: Account;
    amount: Balance;
    expected_allowance: ?Balance;
    expires_at: ?Nat64;
    fee: ?Balance;
    memo: ?Blob;
    created_at_time: ?Nat64;
  };
  
  public type ApproveResult = {
    #Ok: Nat;
    #Err: ApproveError;
  };
  
  public type ApproveError = {
    #BadFee: { expected_fee: Balance };
    #InsufficientFunds: { balance: Balance };
    #AllowanceChanged: { current_allowance: Balance };
    #Expired: { ledger_time: Nat64 };
    #TooOld;
    #CreatedInFuture: { ledger_time: Nat64 };
    #Duplicate: { duplicate_of: Nat };
    #TemporarilyUnavailable;
    #GenericError: { error_code: Nat; message: Text };
  };
  
  public type TransferFromArgs = {
    spender_subaccount: ?Blob;
    from: Account;
    to: Account;
    amount: Balance;
    fee: ?Balance;
    memo: ?Blob;
    created_at_time: ?Nat64;
  };
  
  public type TransferFromResult = {
    #Ok: Nat;
    #Err: TransferFromError;
  };
  
  public type TransferFromError = {
    #BadFee: { expected_fee: Balance };
    #BadBurn: { min_burn_amount: Balance };
    #InsufficientFunds: { balance: Balance };
    #InsufficientAllowance: { allowance: Balance };
    #TooOld;
    #CreatedInFuture: { ledger_time: Nat64 };
    #Duplicate: { duplicate_of: Nat };
    #TemporarilyUnavailable;
    #GenericError: { error_code: Nat; message: Text };
  };
  
  public type AllowanceArgs = {
    account: Account;
    spender: Account;
  };
  
  public type Allowance = {
    allowance: Balance;
    expires_at: ?Nat64;
  };

  // Farm Token Metadata
  public type FarmTokenMetadata = {
    farmId: Text;
    farmName: Text;
    symbol: Text;
    totalSupply: Nat;
    decimals: Nat8;
    fee: Nat;
    minting_account: Account;
    created_at: Int;
    valuation: Nat; // Current farm valuation in smallest units
    harvest_yield: Float; // Expected annual yield percentage
    location: Text;
    crop_type: Text;
  };

  // Token Creation Arguments
  public type CreateTokenArgs = {
    farm: Farm;
    initial_supply: Nat;
    decimals: Nat8;
    fee: Nat;
    minting_account: Account;
  };

  // Profit Distribution Record
  public type ProfitDistribution = {
    id: Text;
    farmId: Text;
    totalProfit: Nat;
    distributionDate: Int;
    profitPerToken: Float;
    recipients: [(Account, Nat)]; // Account and amount distributed
  };

  // Token Store
  public type TokenStore = HashMap.HashMap<Text, FarmTokenMetadata>;
  public type DistributionStore = HashMap.HashMap<Text, ProfitDistribution>;

  public func newTokenStore() : TokenStore {
    HashMap.HashMap<Text, FarmTokenMetadata>(100, Text.equal, Text.hash)
  };

  public func newDistributionStore() : DistributionStore {
    HashMap.HashMap<Text, ProfitDistribution>(200, Text.equal, Text.hash)
  };

  // Create farm token metadata
  public func createFarmToken(
    args: CreateTokenArgs,
    tokenStore: TokenStore
  ) : Result<FarmTokenMetadata> {
    let tokenId = args.farm.id;
    
    // Check if token already exists
    switch (tokenStore.get(tokenId)) {
      case (?existing) {
        #err("Token already exists for farm: " # tokenId)
      };
      case null {
        let symbol = generateTokenSymbol(args.farm.name);
        let metadata: FarmTokenMetadata = {
          farmId = tokenId;
          farmName = args.farm.name;
          symbol = symbol;
          totalSupply = args.initial_supply;
          decimals = args.decimals;
          fee = args.fee;
          minting_account = args.minting_account;
          created_at = Time.now();
          valuation = calculateFarmValuation(args.farm);
          harvest_yield = args.farm.expectedYield;
          location = args.farm.location;
          crop_type = args.farm.cropType;
        };
        
        tokenStore.put(tokenId, metadata);
        #ok(metadata)
      };
    }
  };

  // Generate token symbol from farm name
  private func generateTokenSymbol(farmName: Text) : Text {
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

  // Calculate farm valuation based on multiple factors
  private func calculateFarmValuation(farm: Farm) : Nat {
    let baseValuation = farm.sizeInAcres * 50000; // Base: $500 per acre
    let yieldMultiplier = farm.expectedYield / 100.0;
    let locationMultiplier = getLocationMultiplier(farm.location);
    let cropMultiplier = getCropMultiplier(farm.cropType);
    
    let totalValuation = Float.toInt(
      Float.fromInt(baseValuation) * 
      (1.0 + yieldMultiplier) * 
      locationMultiplier * 
      cropMultiplier
    );
    
    Int.abs(totalValuation)
  };

  // Location-based valuation multiplier
  private func getLocationMultiplier(location: Text) : Float {
    let lowerLocation = Text.toLowercase(location);
    if (Text.contains(lowerLocation, #text("nairobi")) or 
        Text.contains(lowerLocation, #text("kiambu")) or
        Text.contains(lowerLocation, #text("nakuru"))) {
      1.5 // Premium locations
    } else if (Text.contains(lowerLocation, #text("mombasa")) or
               Text.contains(lowerLocation, #text("kisumu")) or
               Text.contains(lowerLocation, #text("eldoret"))) {
      1.3 // Good locations
    } else {
      1.0 // Standard locations
    }
  };

  // Crop-based valuation multiplier
  private func getCropMultiplier(cropType: Text) : Float {
    let lowerCrop = Text.toLowercase(cropType);
    if (Text.contains(lowerCrop, #text("coffee")) or
        Text.contains(lowerCrop, #text("tea")) or
        Text.contains(lowerCrop, #text("avocado"))) {
      1.4 // High-value crops
    } else if (Text.contains(lowerCrop, #text("maize")) or
               Text.contains(lowerCrop, #text("wheat")) or
               Text.contains(lowerCrop, #text("beans"))) {
      1.1 // Staple crops
    } else {
      1.0 // Standard crops
    }
  };

  // Update farm valuation
  public func updateFarmValuation(
    farmId: Text,
    newValuation: Nat,
    tokenStore: TokenStore
  ) : Result<FarmTokenMetadata> {
    switch (tokenStore.get(farmId)) {
      case (?metadata) {
        let updatedMetadata = {
          metadata with 
          valuation = newValuation;
        };
        tokenStore.put(farmId, updatedMetadata);
        #ok(updatedMetadata)
      };
      case null {
        #err("Token not found for farm: " # farmId)
      };
    }
  };

  // Calculate token price based on valuation
  public func calculateTokenPrice(
    farmId: Text,
    tokenStore: TokenStore
  ) : Result<Float> {
    switch (tokenStore.get(farmId)) {
      case (?metadata) {
        if (metadata.totalSupply == 0) {
          #err("Total supply is zero")
        } else {
          let pricePerToken = Float.fromInt(metadata.valuation) / Float.fromInt(metadata.totalSupply);
          #ok(pricePerToken)
        };
      };
      case null {
        #err("Token not found for farm: " # farmId)
      };
    }
  };

  // Create profit distribution
  public func createProfitDistribution(
    farmId: Text,
    totalProfit: Nat,
    tokenHolders: [(Account, Nat)], // Account and token balance
    tokenStore: TokenStore,
    distributionStore: DistributionStore
  ) : Result<ProfitDistribution> {
    switch (tokenStore.get(farmId)) {
      case (?metadata) {
        let distributionId = farmId # "-profit-" # Int.toText(Time.now());
        
        // Calculate profit per token
        let profitPerToken = if (metadata.totalSupply > 0) {
          Float.fromInt(totalProfit) / Float.fromInt(metadata.totalSupply)
        } else {
          0.0
        };

        // Calculate distribution amounts for each holder
        let recipients = Array.map<(Account, Nat), (Account, Nat)>(
          tokenHolders,
          func((account, balance)) : (Account, Nat) {
            let distributionAmount = Float.toInt(Float.fromInt(balance) * profitPerToken);
            (account, Int.abs(distributionAmount))
          }
        );

        let distribution: ProfitDistribution = {
          id = distributionId;
          farmId = farmId;
          totalProfit = totalProfit;
          distributionDate = Time.now();
          profitPerToken = profitPerToken;
          recipients = recipients;
        };

        distributionStore.put(distributionId, distribution);
        #ok(distribution)
      };
      case null {
        #err("Token not found for farm: " # farmId)
      };
    }
  };

  // Get token metadata
  public func getTokenMetadata(
    farmId: Text,
    tokenStore: TokenStore
  ) : Result<FarmTokenMetadata> {
    switch (tokenStore.get(farmId)) {
      case (?metadata) { #ok(metadata) };
      case null { #err("Token not found for farm: " # farmId) };
    }
  };

  // Get all farm tokens
  public func getAllTokens(
    tokenStore: TokenStore
  ) : [FarmTokenMetadata] {
    Iter.toArray(tokenStore.vals())
  };

  // Get profit distributions for a farm
  public func getFarmDistributions(
    farmId: Text,
    distributionStore: DistributionStore
  ) : [ProfitDistribution] {
    let distributions = Iter.toArray(distributionStore.vals());
    Array.filter<ProfitDistribution>(
      distributions,
      func(dist) : Bool { dist.farmId == farmId }
    )
  };

  // Market cap calculation
  public func calculateMarketCap(
    farmId: Text,
    tokenStore: TokenStore
  ) : Result<Nat> {
    switch (calculateTokenPrice(farmId, tokenStore)) {
      case (#ok(price)) {
        switch (tokenStore.get(farmId)) {
          case (?metadata) {
            let marketCap = Float.toInt(price * Float.fromInt(metadata.totalSupply));
            #ok(Int.abs(marketCap))
          };
          case null { #err("Token not found") };
        }
      };
      case (#err(msg)) { #err(msg) };
    }
  };

  // Token performance metrics
  public type TokenMetrics = {
    farmId: Text;
    currentPrice: Float;
    marketCap: Nat;
    totalDistributions: Nat;
    averageYield: Float;
    priceChange24h: Float; // Placeholder for future price tracking
  };

  public func getTokenMetrics(
    farmId: Text,
    tokenStore: TokenStore,
    distributionStore: DistributionStore
  ) : Result<TokenMetrics> {
    switch (tokenStore.get(farmId)) {
      case (?metadata) {
        switch (calculateTokenPrice(farmId, tokenStore)) {
          case (#ok(price)) {
            let distributions = getFarmDistributions(farmId, distributionStore);
            let totalDistributions = Array.foldLeft<ProfitDistribution, Nat>(
              distributions,
              0,
              func(acc, dist) { acc + dist.totalProfit }
            );

            let marketCapResult = calculateMarketCap(farmId, tokenStore);
            let marketCap = switch (marketCapResult) {
              case (#ok(cap)) { cap };
              case (#err(_)) { 0 };
            };

            let metrics: TokenMetrics = {
              farmId = farmId;
              currentPrice = price;
              marketCap = marketCap;
              totalDistributions = totalDistributions;
              averageYield = metadata.harvest_yield;
              priceChange24h = 0.0; // Placeholder
            };

            #ok(metrics)
          };
          case (#err(msg)) { #err(msg) };
        }
      };
      case null { #err("Token not found for farm: " # farmId) };
    }
  };
}
