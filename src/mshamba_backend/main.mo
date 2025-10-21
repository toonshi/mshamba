import FarmModule "lib/farms";
import UserProfileModule "lib/userProfiles";
import Payment "lib/payment";
import Text "mo:base/Text";
import Principal "mo:base/Principal";
import Nat "mo:base/Nat";
import Array "mo:base/Array";
import Error "mo:base/Error";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Debug "mo:base/Debug";
import Blob "mo:base/Blob";
import Time "mo:base/Time";
import Result "mo:base/Result";

import TokenFactory "canister:token_factory";

persistent actor Self {
  type Farm = FarmModule.Farm;
  type Profile = UserProfileModule.Profile;

  // Feature flag - permanently enabled for mainnet
  stable var ENABLE_TOKEN_LAUNCH : Bool = true;

  // Force enable token launch on upgrade
  system func postupgrade() {
    ENABLE_TOKEN_LAUNCH := true;
  };

  // Stable variables for persistence (manual serialization)
  var stableFarmKeys : [Text] = [];
  var stableFarmValues : [FarmModule.Farm] = [];
  var stableProfileKeys : [Principal] = [];
  var stableProfileValues : [UserProfileModule.Profile] = [];

  // Non-stable variables, initialized from stable memory in post_upgrade
  transient var farmStore : HashMap.HashMap<Text, FarmModule.Farm> = FarmModule.newFarmStore();
  transient var profileStore : HashMap.HashMap<Principal, UserProfileModule.Profile> = UserProfileModule.newProfileStore();

  // ==============================
  // HELPERS
  // ==============================
  func getFarmerProfile(caller: Principal) : ?UserProfileModule.Profile {
    Debug.print("getFarmerProfile called for: " # Principal.toText(caller));
    switch (UserProfileModule.getProfile(profileStore, caller)) {
      case (?(p)) {
        Debug.print("Profile found. Roles: " # debug_show(p.roles));
        if (UserProfileModule.hasRole(p, #Farmer)) { ?p } else { null }
      };
      case null { Debug.print("Profile not found for: " # Principal.toText(caller)); null };
    }
  };

  // ==============================
  // PROFILES
  // ==============================
  public shared ({ caller }) func createProfile(
    name : Text,
    bio : Text,
    roles : [UserProfileModule.Role],
    certifications : [Text]
  ) : async Bool {
    Debug.print("createProfile called by: " # Principal.toText(caller));
    Debug.print("Name: " # name # ", Bio: " # bio # ", Roles: " # debug_show(roles) # ", Certs: " # debug_show(certifications));
    let result = UserProfileModule.createProfile(profileStore, caller, name, bio, roles, certifications);
    Debug.print("UserProfileModule.createProfile returned: " # debug_show(result));
    result
  };

  public query func getProfile(owner : Principal) : async ?UserProfileModule.Profile {
    UserProfileModule.getProfile(profileStore, owner)
  };

  public query func listProfiles() : async [UserProfileModule.Profile] {
    UserProfileModule.listProfiles(profileStore)
  };

  public shared ({ caller }) func addRole(role: UserProfileModule.Role) : async Bool {
    UserProfileModule.addRoleToProfile(profileStore, caller, role)
  };

  // ==============================
  // FARMS (Farmer-only actions)
  // ==============================
  public shared ({ caller }) func createFarm(
    name : Text,
    description : Text,
    location : Text,
    fundingGoal : Nat,
    size: Text,
    crop: Text,
    duration: Nat,
    expectedYield: Text,
    expectedROI: Text,
    farmerName: Text,
    experience: Text,
    phone: Text,
    email: Text,
    imageContent: Blob,
    imageContentType: Text,
    tokenName: Text,
    tokenSymbol: Text,
    tokenSupply: Nat,
    tokenDecimals: Nat8,
    tokenTransferFee: Nat,
    tokenLogo: ?Text,
    tokenPrice: Nat,
    ifoEndDate: ?Int,
    maxInvestmentPerUser: ?Nat
  ) : async FarmModule.Result<FarmModule.Farm> {
    switch (getFarmerProfile(caller)) {
      case (?_) { 
        FarmModule.createFarm(
          caller, farmStore, name, description, location, fundingGoal, 
          size, crop, duration, expectedYield, expectedROI, farmerName, 
          experience, phone, email, imageContent, imageContentType, 
          null, // ledgerCanister will be set when token is launched
          tokenName, tokenSymbol, tokenSupply, tokenDecimals, tokenTransferFee, tokenLogo,
          tokenPrice, ifoEndDate, maxInvestmentPerUser
        ) 
      };
      case null { #err("Only farmers can create farms or profile not found") };
    }
  };

  public shared query ({ caller }) func myFarms() : async [FarmModule.Farm] {
    FarmModule.listFarmsByOwner(farmStore, caller)
  };

  public query func listFarms() : async [FarmModule.Farm] {
    FarmModule.listFarms(farmStore)
  };

  // ==============================
  // INVESTMENT & TOKEN PURCHASE (ckUSDT Payment Integration)
  // ==============================
  
  // Buy farm tokens with ckUSDT payment
  public shared ({ caller }) func buyFarmTokens(
    farmId: Text,
    ckusdtAmount: Nat
  ) : async Result.Result<Payment.TokenPurchase, Text> {
    // 1. Get farm details
    switch (FarmModule.getFarm(farmId, farmStore)) {
      case (#err(msg)) { return #err(msg) };
      case (#ok(farm)) {
        // 2. Verify farm is open for investment
        if (not farm.isOpenForInvestment) {
          return #err("This farm is not currently open for investment");
        };
        
        // 3. Verify token has been launched
        let farmLedgerCanister = switch (farm.ledgerCanister) {
          case null { return #err("Farm token not yet launched") };
          case (?canister) { canister };
        };
        
        // 4. Check if IFO has ended
        switch (farm.ifoEndDate) {
          case (?endDate) {
            if (Time.now() > endDate) {
              return #err("IFO period has ended");
            };
          };
          case null {}; // No end date set, IFO is ongoing
        };
        
        // 5. Calculate token amount based on price
        let tokenAmount = Payment.calculateTokenAmount(
          ckusdtAmount,
          farm.tokenPrice,
          farm.tokenDecimals
        );
        
        Debug.print("Calculated token amount: " # debug_show(tokenAmount) # " for " # debug_show(ckusdtAmount) # " ckUSDT");
        
        // 6. Check if investment exceeds per-user limit
        switch (farm.maxInvestmentPerUser) {
          case (?maxInvestment) {
            if (ckusdtAmount > maxInvestment) {
              return #err("Investment amount exceeds maximum allowed per user");
            };
          };
          case null {}; // No limit
        };
        
        // ICRC-2: Check allowance (investor must have approved spending)
        let ckusdtLedger = Payment.getCkUSDTLedger();
        let backendPrincipal = Principal.fromActor(Self);
        
        let investorAccount : Payment.Account = {
          owner = caller;
          subaccount = null;
        };
        
        let backendAccount : Payment.Account = {
          owner = backendPrincipal;
          subaccount = null;
        };
        
        // Check if investor approved spending
        let allowanceResult = await Payment.checkAllowance(
          ckusdtLedger,
          investorAccount,
          backendAccount
        );
        
        let allowance = switch (allowanceResult) {
          case (#err(msg)) { return #err("Failed to check allowance: " # msg) };
          case (#ok(allow)) { allow };
        };
        
        if (allowance.allowance < ckusdtAmount) {
          return #err("Insufficient allowance. Please approve " # debug_show(ckusdtAmount) # " ckUSDT spending first. Currently approved: " # debug_show(allowance.allowance));
        };
        
        Debug.print("Allowance verified: " # debug_show(allowance.allowance) # " ckUSDT approved");
        
        // ICRC-2: Pull payment from investor to farmer
        let farmerAccount : Payment.Account = {
          owner = farm.owner;
          subaccount = null;
        };
        
        // Build rich memo with farm details (keep under 256 bytes)
        let tokenAmountDisplay = tokenAmount / 100_000_000; // Convert to human-readable
        let ckusdtAmountDisplay = ckusdtAmount / 1_000_000; // ckUSDT has 6 decimals
        let priceDisplay = farm.tokenPrice;
        
        let memo = "Buy " # debug_show(tokenAmountDisplay) # " " # farm.tokenSymbol # 
                   " @$" # debug_show(priceDisplay) # " w/" # debug_show(ckusdtAmountDisplay) # 
                   " USDT | " # farm.name;
        // Example: "Buy 1000 GAFT @$10 w/100 USDT | Green Acres Farm"
        
        let paymentResult = await Payment.pullPayment(
          ckusdtLedger,
          investorAccount,
          farmerAccount,
          ckusdtAmount,
          memo
        );
        
        let paymentBlockIndex = switch (paymentResult) {
          case (#err(msg)) { return #err("Payment failed: " # msg) };
          case (#ok(blockIdx)) { blockIdx };
        };
        
        Debug.print("Payment successful! " # debug_show(ckusdtAmount) # " ckUSDT transferred at block " # debug_show(paymentBlockIndex));
        
        // Transfer farm tokens from IFO escrow to investor
        let tokenTransferResult = await Payment.transferTokensToInvestor(
          farmLedgerCanister,
          backendPrincipal, // Backend holds IFO escrow tokens
          investorAccount,
          tokenAmount
        );
        
        switch (tokenTransferResult) {
          case (#err(msg)) { return #err("Token transfer failed: " # msg) };
          case (#ok(blockIndex)) {
            // 12. Record the purchase
            let purchase : Payment.TokenPurchase = {
              investor = caller;
              farmId = farmId;
              ckusdtAmount = ckusdtAmount;
              tokensReceived = tokenAmount;
              blockIndex = blockIndex;
              timestamp = Time.now();
            };
            
            Debug.print("Purchase successful! Investor " # Principal.toText(caller) # " bought " # debug_show(tokenAmount) # " tokens");
            
            #ok(purchase)
          };
        };
      };
    };
  };
  
  // Get ckUSDT ledger canister ID
  public query func getCkUSDTLedgerCanister() : async Text {
    Payment.ckUSDT_LEDGER_CANISTER
  };
  
  // Get ICP ledger canister ID
  public query func getICPLedgerCanister() : async Text {
    Payment.ICP_LEDGER_CANISTER
  };
  
  // Calculate how many tokens an investor would receive for a given ckUSDT amount
  public query func previewTokenPurchase(
    farmId: Text,
    ckusdtAmount: Nat
  ) : async Result.Result<Nat, Text> {
    switch (FarmModule.getFarm(farmId, farmStore)) {
      case (#err(msg)) { #err(msg) };
      case (#ok(farm)) {
        let tokenAmount = Payment.calculateTokenAmount(
          ckusdtAmount,
          farm.tokenPrice,
          farm.tokenDecimals
        );
        #ok(tokenAmount)
      };
    };
  };
  
  // Calculate how many tokens an investor would receive for a given ICP amount
  // icpPriceUSD is current ICP price in cents (e.g., 1000 = $10.00)
  public query func previewTokenPurchaseWithICP(
    farmId: Text,
    icpAmount: Nat,
    icpPriceUSD: Nat
  ) : async Result.Result<Nat, Text> {
    switch (FarmModule.getFarm(farmId, farmStore)) {
      case (#err(msg)) { #err(msg) };
      case (#ok(farm)) {
        let tokenAmount = Payment.calculateTokenAmountFromICP(
          icpAmount,
          farm.tokenPrice,
          icpPriceUSD,
          farm.tokenDecimals
        );
        #ok(tokenAmount)
      };
    };
  };
  
  // Buy farm tokens with ICP payment
  // icpPriceUSD must be passed by frontend (from price oracle or manual input)
  public shared ({ caller }) func buyFarmTokensWithICP(
    farmId: Text,
    icpAmount: Nat,
    icpPriceUSD: Nat  // ICP price in cents (e.g., 1000 = $10.00)
  ) : async Result.Result<Payment.TokenPurchase, Text> {
    // Validate farm and get details
    switch (FarmModule.getFarm(farmId, farmStore)) {
      case (#err(msg)) { return #err(msg) };
      case (#ok(farm)) {
        // Verify farm is open for investment
        if (not farm.isOpenForInvestment) {
          return #err("This farm is not currently open for investment");
        };
        
        // Verify token has been launched
        let farmLedgerCanister = switch (farm.ledgerCanister) {
          case null { return #err("Farm token not yet launched") };
          case (?canister) { canister };
        };
        
        // Check if IFO has ended
        switch (farm.ifoEndDate) {
          case (?endDate) {
            if (Time.now() > endDate) {
              return #err("IFO period has ended");
            };
          };
          case null {}; // No end date set, IFO is ongoing
        };
        
        // Calculate token amount based on ICP payment
        let tokenAmount = Payment.calculateTokenAmountFromICP(
          icpAmount,
          farm.tokenPrice,
          icpPriceUSD,
          farm.tokenDecimals
        );
        
        Debug.print("Calculated token amount: " # debug_show(tokenAmount) # " for " # debug_show(icpAmount) # " ICP");
        
        // Calculate USD equivalent for investment limit check
        let usdEquivalent = (icpAmount * icpPriceUSD) / 100_000_000;
        
        // Check if investment exceeds per-user limit
        switch (farm.maxInvestmentPerUser) {
          case (?maxInvestment) {
            if (usdEquivalent > maxInvestment) {
              return #err("Investment amount exceeds maximum allowed per user");
            };
          };
          case null {}; // No limit
        };
        
        // ICRC-2: Check allowance (investor must have approved spending)
        let icpLedger = Payment.getICPLedger();
        let backendPrincipal = Principal.fromActor(Self);
        
        let investorAccount : Payment.Account = {
          owner = caller;
          subaccount = null;
        };
        
        let backendAccount : Payment.Account = {
          owner = backendPrincipal;
          subaccount = null;
        };
        
        // Check if investor approved spending
        let allowanceResult = await Payment.checkAllowance(
          icpLedger,
          investorAccount,
          backendAccount
        );
        
        let allowance = switch (allowanceResult) {
          case (#err(msg)) { return #err("Failed to check allowance: " # msg) };
          case (#ok(allow)) { allow };
        };
        
        if (allowance.allowance < icpAmount) {
          return #err("Insufficient allowance. Please approve " # debug_show(icpAmount) # " ICP spending first. Currently approved: " # debug_show(allowance.allowance));
        };
        
        Debug.print("Allowance verified: " # debug_show(allowance.allowance) # " ICP approved");
        
        // ICRC-2: Pull payment from investor to farmer
        let farmerAccount : Payment.Account = {
          owner = farm.owner;
          subaccount = null;
        };
        
        // Build rich memo with farm details (keep under 256 bytes)
        let tokenAmountDisplay = tokenAmount / 100_000_000; // Convert to human-readable
        let icpAmountDisplay = icpAmount / 100_000_000;
        let priceDisplay = farm.tokenPrice;
        
        let memo = "Buy " # debug_show(tokenAmountDisplay) # " " # farm.tokenSymbol # 
                   " @$" # debug_show(priceDisplay) # " w/" # debug_show(icpAmountDisplay) # 
                   " ICP | " # farm.name;
        // Example: "Buy 1000 GAFT @$10 w/100 ICP | Green Acres Farm"
        
        let paymentResult = await Payment.pullPayment(
          icpLedger,
          investorAccount,
          farmerAccount,
          icpAmount,
          memo
        );
        
        let paymentBlockIndex = switch (paymentResult) {
          case (#err(msg)) { return #err("Payment failed: " # msg) };
          case (#ok(blockIdx)) { blockIdx };
        };
        
        Debug.print("Payment successful! " # debug_show(icpAmount) # " ICP transferred at block " # debug_show(paymentBlockIndex));
        
        // Transfer farm tokens from IFO escrow to investor
        let tokenTransferResult = await Payment.transferTokensToInvestor(
          farmLedgerCanister,
          backendPrincipal, // Backend holds IFO escrow tokens
          investorAccount,
          tokenAmount
        );
        
        switch (tokenTransferResult) {
          case (#err(msg)) { return #err("Token transfer failed: " # msg) };
          case (#ok(blockIndex)) {
            // Record the purchase
            let purchase : Payment.TokenPurchase = {
              investor = caller;
              farmId = farmId;
              ckusdtAmount = usdEquivalent; // Store USD equivalent
              tokensReceived = tokenAmount;
              blockIndex = blockIndex;
              timestamp = Time.now();
            };
            
            Debug.print("Purchase successful! Investor " # Principal.toText(caller) # " bought " # debug_show(tokenAmount) # " tokens with ICP");
            
            #ok(purchase)
          };
        };
      };
    };
  };

  // ==============================
  // TOKEN LAUNCH
  // ==============================
  
  public query func isTokenLaunchEnabled() : async Bool {
    ENABLE_TOKEN_LAUNCH
  };
  
  public shared ({ caller }) func launchFarmToken(farmId : Text) : async FarmModule.Result<Principal> {

    switch (FarmModule.getFarm(farmId, farmStore)) {
      case (#err(msg)) { return #err(msg) };
      case (#ok(farm)) {
        // Verify caller is the farm owner
        if (farm.owner != caller) {
          return #err("Only the farm owner can launch the token")
        };
        
        // Check if token already launched
        switch (farm.ledgerCanister) {
          case (?_) { return #err("Token already launched for this farm") };
          case null {};
        };

        // Call token_factory to create the ICRC-1 ledger with proper equity distribution
        // NOTE: For now, using backend's own canister principal for platform & escrow
        // TODO: Replace with dedicated escrow and treasury canisters
        let backendPrincipal = Principal.fromActor(Self); // Use current canister's principal (works on both local & mainnet)
        let platformPrincipal = backendPrincipal;
        let ifoEscrowPrincipal = backendPrincipal; // TODO: Use dedicated IFO escrow canister
        let farmTreasuryPrincipal = farm.owner; // TODO: Create dedicated farm treasury account
        
        let tokenParams = {
          token_name = farm.tokenName;
          token_symbol = farm.tokenSymbol;
          token_logo = farm.tokenLogo;
          decimals = farm.tokenDecimals;
          total_supply = farm.tokenSupply;
          transfer_fee = farm.tokenTransferFee;
          minting_account_owner = farm.owner;  // Farmer receives 75% (vested)
          platform_principal = platformPrincipal;  // Platform receives 5% (vested)
          ifo_escrow_principal = ifoEscrowPrincipal;  // Escrow holds 20% (for investors)
          farm_treasury_principal = farmTreasuryPrincipal;  // Farm business account
        };

        try {
          let result = await TokenFactory.create_farm_token(tokenParams);
          
          // Handle the Result from token_factory
          switch (result) {
            case (#Ok(ledgerCanisterId)) {
              // Update farm with the new ledger canister and vesting start time
              let updatedFarm : FarmModule.Farm = {
                farm with
                ledgerCanister = ?ledgerCanisterId;
                farmTreasuryAccount = ?farmTreasuryPrincipal;
                vestingStartTime = ?Time.now();
              };
              farmStore.put(farmId, updatedFarm);
              
              Debug.print("Token launched for farm " # farmId # ": " # Principal.toText(ledgerCanisterId));
              Debug.print("Equity distribution: Farmer 75%, Platform 5%, IFO 20%");
              #ok(ledgerCanisterId)
            };
            case (#Err(msg)) {
              #err("Token creation failed: " # msg)
            };
          }
        } catch (e) {
          #err("Failed to call token factory: " # Error.message(e))
        }
      }
    }
  };

  // ==============================
  // FARMER ACTIONS
  // ==============================
  public shared ({ caller }) func toggleFarmInvestmentStatus(
    farmId : Text,
    newStatus : Bool
  ) : async FarmModule.Result<FarmModule.Farm> {
    switch (FarmModule.getFarm(farmId, farmStore)) {
      case (#err(msg)) { return #err(msg) };
      case (#ok(farm)) {
        if (farm.owner != caller) {
          return #err("Only the farm owner can change investment status");
        };
        
        // If opening investment, ensure token is launched
        if (newStatus == true) {
          switch (farm.ledgerCanister) {
            case null { 
              return #err("Token must be launched before opening investment. Call launchFarmToken first.") 
            };
            case (?_) {}; // Token exists, proceed
          };
        };
        
        let updateResult = FarmModule.updateFarmInvestmentStatus(farmId, farmStore, newStatus);
        switch (updateResult) {
          case (#ok(updatedFarm)) { #ok(updatedFarm) };
          case (#err(msg)) { #err(msg) };
        }
      }
    }
  };

  // ==============================
  // INVESTOR ACTIONS
  // ==============================
  public shared ({ caller }) func investInFarm(
    farmId : Text,
    amount : Nat
  ) : async FarmModule.Result<FarmModule.Farm> {
    FarmModule.investInFarm(caller, farmId, amount, farmStore)
  };

  public query func listFarmIds() : async [Text] {
    Iter.toArray(farmStore.keys())
  };

  public query func listFarmLedgers() : async [(Text, Text)] {
    var out : [(Text, Text)] = [];
    for ((fid, farm) in farmStore.entries()) {
      switch (farm.ledgerCanister) {
        case (?lc) {
          out := Array.append(out, [(fid, Principal.toText(lc))]);
        };
        case null {};
      };
    };
    out
  };

  public shared ({ caller }) func adminClearAllFarms(secret : Text) : async Nat {
    if (secret != "CONFIRM_NUKE_FARMS") {
      return 0;
    };
    let ids = Iter.toArray(farmStore.keys());
    var removed : Nat = 0;
    for (fid in ids.vals()) {
      ignore farmStore.remove(fid);
      removed += 1;
    };
    removed
  };

  // ==============================
  // UPGRADE HOOKS
  // ==============================
  public shared func pre_upgrade() : async () {
    stableFarmKeys := Iter.toArray(farmStore.keys());
    stableFarmValues := Iter.toArray(farmStore.vals());
    stableProfileKeys := Iter.toArray(profileStore.keys());
    stableProfileValues := Iter.toArray(profileStore.vals());
  };

  public shared func post_upgrade() : async () {
    farmStore := FarmModule.newFarmStore();
    var i : Nat = 0;
    while (i < Array.size(stableFarmKeys)) {
      farmStore.put(stableFarmKeys[i], stableFarmValues[i]);
      i += 1;
    };

    profileStore := UserProfileModule.newProfileStore();
    var j : Nat = 0;
    while (j < Array.size(stableProfileKeys)) {
      profileStore.put(stableProfileKeys[j], stableProfileValues[j]);
      j += 1;
    };
  };
};