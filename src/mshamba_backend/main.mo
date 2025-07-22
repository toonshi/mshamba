import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Float "mo:base/Float";
import Nat "mo:base/Nat";
import Nat64 "mo:base/Nat64";

import Iter "mo:base/Iter";
import Int "mo:base/Int";
import Time "mo:base/Time";
import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Result "mo:base/Result";
import Types "./lib/types";
import Utils "./lib/utils";
import Farms "./lib/farms";
import Profiles "./lib/profiles";
import Land "./lib/land";
import Token "./lib/token";
import Investments "./lib/investments";
import Valuation "./lib/valuation";
import Tokens "./lib/tokens";
import Profits "./lib/profits";
import Market "./lib/market";
import Wallet "./lib/wallet";

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

  // Stable arrays for persistence
  stable var farmStoreStable : [Types.Farm] = [];
  stable var profileStoreStable : [Types.UserProfile] = [];
  
  // Wallet store
  private var walletStore = HashMap.HashMap<Principal, Types.Wallet>(1, Principal.equal, Principal.hash);

  system func preupgrade() {
    farmStoreStable := Iter.toArray(farmStore.vals());
    // Note: Wallet state is not persisted across upgrades in this implementation
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
    // Re-initialize wallet store after upgrade
    walletStore := HashMap.HashMap<Principal, Types.Wallet>(1, Principal.equal, Principal.hash);
    // TODO: Repeat for other stores
  };

  // ------ WALLET ------
  public shared({ caller }) func getMyWallet() : async Types.WalletResult {
    switch (Wallet.getOrCreateWallet(walletStore, caller)) {
      case (#ok(wallet)) { #ok(wallet) };
      case (#err(msg)) { #err("Failed to get wallet: " # msg) };
    }
  };

  public shared({ caller }) func depositToMyWallet(amount: Nat, description: Text) : async Types.WalletResult {
    switch (Wallet.depositICP(walletStore, caller, Nat64.fromNat(amount), description)) {
      case (#ok(wallet)) { #ok(wallet) };
      case (#err(msg)) { #err("Deposit failed: " # msg) };
    }
  };

  public shared({ caller }) func withdrawFromMyWallet(amount: Nat, description: Text) : async Types.WalletResult {
    switch (Wallet.withdrawICP(walletStore, caller, Nat64.fromNat(amount), description)) {
      case (#ok(wallet)) { #ok(wallet) };
      case (#err(msg)) { #err("Withdrawal failed: " # msg) };
    }
  };

  // ------ PROFILES ------
  public shared ({ caller }) func upsertProfile(
    name: Text,
    email: Text,
    role: Types.Role,
    bio: Text,
    location: Text
  ) : async Utils.Result<Types.UserProfile> {
    // Ensure user has a wallet when creating/updating profile
    ignore await getMyWallet();
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
