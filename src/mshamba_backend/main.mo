import FarmModule "lib/farms";
import UserProfileModule "lib/userProfiles";
import FarmEscrowModule "lib/farm_escrow";
import EscrowTypes "lib/escrow_types";
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

import TokenFactory "canister:token_factory";

persistent actor {
  type Farm = FarmModule.Farm;
  type Profile = UserProfileModule.Profile;

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
  // INVESTMENT (Token Factory Integration)
  // ==============================


  // ==============================
  // TOKEN LAUNCH
  // ==============================
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

        // Call token_factory to create the ICRC-1 ledger
        let tokenParams = {
          token_name = farm.tokenName;
          token_symbol = farm.tokenSymbol;
          token_logo = farm.tokenLogo;
          decimals = farm.tokenDecimals;
          total_supply = farm.tokenSupply;
          transfer_fee = farm.tokenTransferFee;
          minting_account_owner = farm.owner;
        };

        try {
          let result = await TokenFactory.create_farm_token(tokenParams);
          
          // Handle the Result from token_factory
          switch (result) {
            case (#Ok(ledgerCanisterId)) {
              // Update farm with the new ledger canister
              let updatedFarm : FarmModule.Farm = {
                farm with
                ledgerCanister = ?ledgerCanisterId;
              };
              farmStore.put(farmId, updatedFarm);
              
              Debug.print("Token launched for farm " # farmId # ": " # Principal.toText(ledgerCanisterId));
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