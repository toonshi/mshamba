import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Float "mo:base/Float";
import Nat "mo:base/Nat";

import Iter "mo:base/Iter";
import Int "mo:base/Int";
import Time "mo:base/Time";
import Array "mo:base/Array";
import Farms "lib/farms";
import Profiles "lib/profiles";
import Land "lib/land";
import Token "lib/token";
import Investments "lib/investments";
import Valuation "lib/valuation";
import Tokens "lib/tokens";
import Profits "lib/profits";
import Market "lib/market";
import SupplyChain "lib/supplychain";
import TokenFactory "lib/token_factory";
import ICRC2Token "lib/icrc2_token";
import Types "lib/types";
import Utils "lib/utils";

actor Mshamba {

  // Define the admin principal (replace this with your own principal if needed)
  let ADMIN_PRINCIPAL : Principal = Principal.fromText("hs5dy-t6kyo-rfoks-5rxfh-ataev-s3m2l-m45nl-gvfc4-omu7s-uyink-zae");

  // ------ MODULE STATE ------
  // In-memory stores
  var farmStore = Farms.newFarmStore();
  var profileStore = Profiles.newProfileStore();
  var landStore = Land.newLandStore();
  var tokenLedger = Token.newLedger();
  var investments = Investments.newInvestmentStore();
  var investorIndex = Investments.newInvestorIndex();
  
  // Enhanced tokenization stores
  var tokenStore = Tokens.newTokenStore();
  var tokenBalances = Tokens.newBalanceStore();
  var tokenTransfers = Tokens.newTransferStore();
  var profitDistributions = Profits.newDistributionStore();
  var harvestReports = Profits.newHarvestStore();
  var marketOrders = Market.newOrderStore();
  var marketTrades = Market.newTradeStore();

  // Supply chain stores
  var supplyOfferings = SupplyChain.newSupplyOfferingStore();
  var demandRequests = SupplyChain.newDemandRequestStore();
  var supplyChainMessages = SupplyChain.newMessageStore();

  // ICRC-2 Token system stores
  var tokenRegistry = TokenFactory.newTokenRegistry();
  var investmentRecords = TokenFactory.newInvestmentStore();
  var icrc2TokenStore = ICRC2Token.newTokenStore();
  var icrc2DistributionStore = ICRC2Token.newDistributionStore();

  // Stable arrays for persistence
  stable var farmStoreStable : [Types.Farm] = [];
  stable var profileStoreStable : [Types.UserProfile] = [];

  system func preupgrade() {
    farmStoreStable := Iter.toArray(farmStore.vals());
    profileStoreStable := Iter.toArray(profileStore.vals());
    // TODO: Repeat for other stores
  };
  system func postupgrade() {
    farmStore := Farms.newFarmStore();
    for (farm in farmStoreStable.vals()) {
      farmStore.put(farm.farmId, farm);
    };
    farmStoreStable := [];
    profileStore := Profiles.newProfileStore();
    for (profile in profileStoreStable.vals()) {
      profileStore.put(profile.wallet, profile);
    };
    profileStoreStable := [];
    // TODO: Repeat for other stores
  };

  // ------ PROFILES ------
  public shared ({ caller }) func upsertProfile(
    name: Text,
    email: Text,
    role: Types.Role,
    bio: Text,
    location: Text
  ) : async Utils.Result<Types.UserProfile> {
    Profiles.upsertProfile(caller, profileStore, name, email, role, bio, location)
  };

  public query ({ caller }) func myProfile() : async Utils.Result<Types.UserProfile> {
    Profiles.myProfile(caller, profileStore)
  };

  public query func getProfileOf(p: Principal) : async Utils.Result<Types.UserProfile> {
    Profiles.getProfileOf(p, profileStore)
  };

  public query func listUsers() : async [Types.UserProfile] {
    Profiles.listUsers(profileStore)
  };

  // ------ FARMS ------
  public shared ({ caller }) func createFarm(
    name: Text,
    description: Text,
    location: Text,
    fundingGoal: Nat,
    landSize: Float,
    cropType: Types.CropType,
    soilQuality: Nat,
    waterAccess: Bool,
    infrastructure: Nat,
    marketAccess: Nat,
    climateRisk: Nat
  ) : async Utils.Result<Types.Farm> {
    // Calculate automated valuation
    let valuationResult = Valuation.calculateFarmValuation(
      landSize, cropType, location, soilQuality, waterAccess,
      infrastructure, marketAccess, null, climateRisk
    );
    
    switch (valuationResult) {
      case (#err(msg)) #err("Valuation failed: " # msg);
      case (#ok(metrics)) {
        // Create farm with calculated share price
        let totalShares = 1_000_000; // Standard 1M shares
        Farms.createFarm(caller, farmStore, name, description, location, 
                        fundingGoal, totalShares, metrics.sharePrice)
      };
    }
  };

  public query func getFarm(farmId: Text) : async Utils.Result<Types.Farm> {
    Farms.getFarm(farmId, farmStore)
  };

  public query func listFarms() : async [Types.Farm] {
    Farms.listFarms(farmStore)
  };

  public shared ({ caller }) func investInFarm(
    farmId: Text,
    amount: Nat
  ) : async Utils.Result<Types.Farm> {
    // First update the farm with investment
    let farmResult = Farms.investInFarm(caller, farmId, amount, farmStore);
    
    switch (farmResult) {
      case (#err(msg)) #err(msg);
      case (#ok(farm)) {
        // Mint tokens for the investor
        let tokenResult = Tokens.mintFarmTokens(
          farmId, caller, amount, farm.sharePrice, tokenStore, tokenBalances
        );
        
        switch (tokenResult) {
          case (#err(msg)) #err("Token minting failed: " # msg);
          case (#ok(_)) {
            // Record the investment
            let sharesReceived = amount / farm.sharePrice;
            ignore Investments.recordInvestment(
              caller, farmId, amount, sharesReceived, farm.sharePrice, 
              investments, investorIndex
            );
            #ok(farm)
          };
        }
      };
    }
  };

  // ------ LAND ------
  public shared ({ caller }) func registerLand(
    location: Text,
    sizeInAcres: Float,
    leaseRatePerMonth: Nat
  ) : async Utils.Result<Types.LandListing> {
    Land.registerLand(caller, landStore, location, sizeInAcres, leaseRatePerMonth)
  };

  public query func getLand(landId: Text) : async Utils.Result<Types.LandListing> {
    Land.getLand(landId, landStore)
  };

  public query func listAvailableLand() : async [Types.LandListing] {
    Land.listAvailableLand(landStore)
  };

  public query ({ caller }) func myLand() : async [Types.LandListing] {
    Land.listOwnedLand(landStore, caller)
  };

  public shared ({ caller }) func markAsLeased(
    landId: Text
  ) : async Utils.Result<Types.LandListing> {
    Land.markAsLeased(caller, landId, landStore)
  };

  // ------ SHARES ------
  public shared ({ caller }) func addShares(
    farmId: Text,
    sharesToAdd: Nat,
    pricePerShare: Nat
  ) : async Utils.Result<Types.FarmShare> {
    Token.addShares(caller, farmId, sharesToAdd, pricePerShare, tokenLedger)
  };

  public query ({ caller }) func mySharesIn(farmId: Text) : async Utils.Result<Types.FarmShare> {
    Token.mySharesIn(caller, farmId, tokenLedger)
  };

  public query ({ caller }) func myAllShares() : async [Types.FarmShare] {
    Token.myAllShares(caller, tokenLedger)
  };

  // ------ INVESTMENTS ------
  public shared ({ caller }) func recordInvestment(
    farmId: Text,
    amount: Nat,
    sharesReceived: Nat,
    pricePerShare: Nat
  ) : async Utils.Result<Types.Investment> {
    let result = Investments.recordInvestment(caller, farmId, amount, sharesReceived, pricePerShare, investments, investorIndex);
    // Automatic valuation update after investment
    switch (farmStore.get(farmId)) {
      case (?farm) {
        let now: Int = Time.now();
        let value = farm.sharePrice * farm.totalShares;
        let updatedHistory = Array.append(farm.valuationHistory, [ (now, value) ]);
        let updatedFarm = { farm with valuationHistory = updatedHistory };
        farmStore.put(farmId, updatedFarm);
      };
      case null ()
    };
    result
  };

  public query func getInvestment(id: Text) : async Utils.Result<Types.Investment> {
    Investments.getInvestment(id, investments)
  };

  public query ({ caller }) func listMyInvestments() : async [Types.Investment] {
    Investments.listMyInvestments(caller, investments, investorIndex)
  };

  // Admin/global: List all investments by any principal
  public query func listInvestmentsByInvestor(investor: Principal) : async [Types.Investment] {
    Investments.listInvestmentsByInvestor(investor, investments, investorIndex)
  };


  // ------ FINANCE CHARTS / VALUATION HISTORY ------
  public shared ({ caller }) func recordFarmValuation(farmId: Text, value: Nat) : async Utils.Result<Types.Farm> {
    if (caller != ADMIN_PRINCIPAL) {
      return #err("Only admin can record farm valuation");
    };
    let now: Int = Time.now();
    switch (farmStore.get(farmId)) {
      case (null) return #err("Farm not found");
      case (?farm) {
        let updatedHistory = Array.append(farm.valuationHistory, [ (now, value) ]);
        let updatedFarm = {
          farm with valuationHistory = updatedHistory
        };
        farmStore.put(farmId, updatedFarm);
        #ok(updatedFarm)
      }
    }
  };


  public query func getFarmValuationHistory(farmId: Text) : async Utils.Result<[(Int, Nat)]> {
    switch (farmStore.get(farmId)) {
      case (null) return #err("Farm not found");
      case (?farm) #ok(farm.valuationHistory)
    }
  };

  // ------ ENHANCED TOKENIZATION ------
  
  // Token functions
  public query ({ caller }) func getTokenBalance(farmId: Text) : async Nat {
    Tokens.getTokenBalance(caller, farmId, tokenBalances)
  };
  
  public query ({ caller }) func getUserTokens() : async [(Text, Nat)] {
    Tokens.getUserTokens(caller, tokenBalances)
  };
  
  public shared ({ caller }) func transferTokens(
    to: Principal,
    farmId: Text,
    amount: Nat
  ) : async Utils.Result<Types.TokenTransfer> {
    Tokens.transferTokens(caller, to, farmId, amount, null, tokenBalances, tokenTransfers)
  };
  
  public query func getTotalSupply(farmId: Text) : async Nat {
    Tokens.getTotalSupply(farmId, tokenBalances)
  };
  
  public query func getTokenHolders(farmId: Text) : async [(Principal, Nat)] {
    Tokens.getTokenHolders(farmId, tokenBalances)
  };

  // ------ ICRC-2 TOKEN ENDPOINTS ------

  // Create ICRC-2 token for a farm
  public func createFarmToken(
    farmId: Text,
    initialSupply: ?Nat,
    decimals: ?Nat8,
    fee: ?Nat,
    logo: ?Text
  ) : async Utils.Result<ICRC2Token.FarmTokenMetadata> {
    let caller = Principal.fromActor(this);
    
    switch (farmStore.get(farmId)) {
      case (?farm) {
        // Check if token already exists
        switch (icrc2TokenStore.get(farmId)) {
          case (?existing) {
            #err("Token already exists for farm: " # farmId)
          };
          case null {
            let valuation = TokenFactory.calculateFarmValuation(farm);
            let supply = switch (initialSupply) {
              case (?s) { s };
              case null { TokenFactory.calculateInitialSupply(valuation, 100) }; // Default $1 per token
            };
            
            let tokenArgs: ICRC2Token.CreateTokenArgs = {
              farm = farm;
              initial_supply = supply;
              decimals = Option.get(decimals, 8);
              fee = Option.get(fee, 10000); // 0.0001 tokens
              minting_account = {
                owner = caller;
                subaccount = null;
              };
            };
            
            ICRC2Token.createFarmToken(tokenArgs, icrc2TokenStore)
          };
        }
      };
      case null {
        #err("Farm not found: " # farmId)
      };
    }
  };

  // Get token metadata
  public query func getTokenMetadata(farmId: Text) : async Utils.Result<ICRC2Token.FarmTokenMetadata> {
    ICRC2Token.getTokenMetadata(farmId, icrc2TokenStore)
  };

  // Get all farm tokens
  public query func getAllFarmTokens() : async [ICRC2Token.FarmTokenMetadata] {
    ICRC2Token.getAllTokens(icrc2TokenStore)
  };

  // Calculate token price
  public query func getTokenPrice(farmId: Text) : async Utils.Result<Float> {
    ICRC2Token.calculateTokenPrice(farmId, icrc2TokenStore)
  };

  // Get token metrics for dashboard
  public query func getTokenMetrics(farmId: Text) : async Utils.Result<ICRC2Token.TokenMetrics> {
    ICRC2Token.getTokenMetrics(farmId, icrc2TokenStore, icrc2DistributionStore)
  };

  // Update farm valuation
  public func updateFarmValuation(
    farmId: Text,
    newValuation: Nat
  ) : async Utils.Result<ICRC2Token.FarmTokenMetadata> {
    // Only admin can update valuations
    let caller = Principal.fromActor(this);
    if (caller != ADMIN_PRINCIPAL) {
      return #err("Unauthorized: Only admin can update valuations");
    };
    
    ICRC2Token.updateFarmValuation(farmId, newValuation, icrc2TokenStore)
  };

  // Create profit distribution
  public func distributeFarmProfits(
    farmId: Text,
    totalProfit: Nat,
    tokenHolders: [(ICRC2Token.Account, Nat)]
  ) : async Utils.Result<ICRC2Token.ProfitDistribution> {
    let caller = Principal.fromActor(this);
    
    // Verify caller is farm owner or admin
    switch (farmStore.get(farmId)) {
      case (?farm) {
        if (farm.owner != caller and caller != ADMIN_PRINCIPAL) {
          return #err("Unauthorized: Only farm owner or admin can distribute profits");
        };
        
        ICRC2Token.createProfitDistribution(
          farmId,
          totalProfit,
          tokenHolders,
          icrc2TokenStore,
          icrc2DistributionStore
        )
      };
      case null {
        #err("Farm not found: " # farmId)
      };
    }
  };

  // Get profit distributions for a farm
  public query func getFarmProfitDistributions(farmId: Text) : async [ICRC2Token.ProfitDistribution] {
    ICRC2Token.getFarmDistributions(farmId, icrc2DistributionStore)
  };

  // Investment tracking functions
  public func recordTokenInvestment(
    farmId: Text,
    investor: Principal,
    amount: Nat,
    tokensReceived: Nat
  ) : async Utils.Result<TokenFactory.InvestmentRecord> {
    switch (ICRC2Token.calculateTokenPrice(farmId, icrc2TokenStore)) {
      case (#ok(tokenPrice)) {
        TokenFactory.recordInvestment(
          farmId,
          investor,
          amount,
          tokensReceived,
          tokenPrice,
          investmentRecords
        )
      };
      case (#err(msg)) {
        #err("Failed to get token price: " # msg)
      };
    }
  };

  // Get investments for a farm
  public query func getFarmInvestments(farmId: Text) : async [TokenFactory.InvestmentRecord] {
    TokenFactory.getFarmInvestments(farmId, investmentRecords)
  };

  // Get investor's investments
  public query func getInvestorInvestments(investor: Principal) : async [TokenFactory.InvestmentRecord] {
    TokenFactory.getInvestorInvestments(investor, investmentRecords)
  };

  // Get token analytics
  public query func getTokenAnalytics() : async TokenFactory.TokenAnalytics {
    TokenFactory.getTokenAnalytics(tokenRegistry, investmentRecords)
  };

  // Calculate market cap
  public query func getFarmMarketCap(farmId: Text) : async Utils.Result<Nat> {
    ICRC2Token.calculateMarketCap(farmId, icrc2TokenStore)
  };
  
  // Profit distribution functions
  public shared ({ caller }) func recordHarvest(
    farmId: Text,
    totalYield: Float,
    totalRevenue: Nat,
    expenses: Nat,
    qualityGrade: Text,
    landSize: Float
  ) : async Utils.Result<Types.HarvestReport> {
    Profits.recordHarvest(farmId, caller, totalYield, totalRevenue, expenses, 
                         qualityGrade, landSize, harvestReports)
  };
  
  public shared ({ caller }) func createProfitDistribution(
    farmId: Text,
    harvestReportId: Text,
    farmerShare: Float
  ) : async Utils.Result<Types.ProfitDistribution> {
    switch (harvestReports.get(harvestReportId)) {
      case (?report) {
        Profits.createProfitDistribution(farmId, report, farmerShare, 
                                       tokenBalances, profitDistributions)
      };
      case null #err("Harvest report not found");
    }
  };
  
  public shared ({ caller }) func executeProfitDistribution(
    distributionId: Text
  ) : async Utils.Result<Types.ProfitDistribution> {
    Profits.executeProfitDistribution(distributionId, profitDistributions, 
                                    tokenBalances, tokenTransfers)
  };
  
  public query func getFarmProfitHistory(farmId: Text) : async [Types.ProfitDistribution] {
    Profits.getFarmProfitHistory(farmId, profitDistributions)
  };
  
  public query ({ caller }) func getInvestorProfitHistory() : async [(Text, Nat)] {
    Profits.getInvestorProfitHistory(caller, profitDistributions)
  };
  
  // Secondary market functions
  public shared ({ caller }) func createMarketOrder(
    farmId: Text,
    orderType: Types.OrderType,
    quantity: Nat,
    pricePerShare: Nat
  ) : async Utils.Result<Types.TradeOrder> {
    Market.createOrder(caller, farmId, orderType, quantity, pricePerShare, 
                      tokenBalances, marketOrders)
  };
  
  public shared ({ caller }) func cancelOrder(orderId: Text) : async Utils.Result<Types.TradeOrder> {
    Market.cancelOrder(orderId, caller, marketOrders)
  };
  
  public func matchOrders(farmId: Text) : async [Types.TradeMatch] {
    Market.matchOrders(farmId, marketOrders, marketTrades, tokenBalances, tokenTransfers)
  };
  
  public query func getOrderBook(farmId: Text) : async {buyOrders: [Types.TradeOrder]; sellOrders: [Types.TradeOrder]} {
    Market.getOrderBook(farmId, marketOrders)
  };
  
  public query func getMarketPrice(farmId: Text) : async ?Nat {
    Market.getMarketPrice(farmId, marketTrades)
  };
  
  public query ({ caller }) func getUserOrders() : async [Types.TradeOrder] {
    Market.getUserOrders(caller, marketOrders)
  };
  
  public query ({ caller }) func getUserTrades() : async [Types.TradeMatch] {
    Market.getUserTrades(caller, marketTrades)
  };
  
  // Farm valuation functions
  public func calculateFarmValuation(
    landSize: Float,
    cropType: Types.CropType,
    location: Text,
    soilQuality: Nat,
    waterAccess: Bool,
    infrastructure: Nat,
    marketAccess: Nat,
    climateRisk: Nat
  ) : async Utils.Result<Types.ValuationMetrics> {
    Valuation.calculateFarmValuation(landSize, cropType, location, soilQuality, 
                                   waterAccess, infrastructure, marketAccess, 
                                   null, climateRisk)
  };
  
  public query func getValuationTrend(farmId: Text) : async Text {
    switch (farmStore.get(farmId)) {
      case (?farm) Valuation.getValuationTrend(farm.valuationHistory);
      case null "farm_not_found";
    }
  };


};
