import FarmModule "lib/farms";
import UserProfileModule "lib/userProfiles";
import Text "mo:base/Text";
import Principal "mo:base/Principal";
import Nat "mo:base/Nat";
import Array "mo:base/Array";
import TF "canister:token_factory";
import Types "lib/types";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter"; // Added import for Iter

actor {

  public type Allocation = TF.Allocation;

  type Farm = FarmModule.Farm;
  type Profile = UserProfileModule.Profile;

  // Stable variables for persistence (manual serialization)
  stable var stableFarmKeys : [Text] = [];
  stable var stableFarmValues : [Farm] = [];
  stable var stableProfileKeys : [Principal] = [];
  stable var stableProfileValues : [Profile] = [];

  // Non-stable variables, initialized from stable memory in post_upgrade
  var farmStore : HashMap.HashMap<Text, Farm> = FarmModule.newFarmStore();
  var profileStore : HashMap.HashMap<Principal, Profile> = UserProfileModule.newProfileStore();

  // ==============================
  // HELPERS
  // ==============================
  func getFarmerProfile(caller: Principal) : ?Profile {
  switch (UserProfileModule.getProfile(profileStore, caller)) {
    case (?(p)) {
      if (p.role == #Farmer) { ?p } else { null }
    };
    case null { null };
  }
};

  // ==============================
  // PROFILES
  // ==============================
  public shared ({ caller }) func createProfile(
    name : Text,
    bio : Text,
    role : UserProfileModule.Role,
    certifications : [Text]
  ) : async Bool {
    UserProfileModule.createProfile(profileStore, caller, name, bio, role, certifications)
  };

  public query func getProfile(owner : Principal) : async ?Profile {
    UserProfileModule.getProfile(profileStore, owner)
  };

  // ==============================
  // FARMS (Farmer-only actions)
  // ==============================
  public shared ({ caller }) func createFarm(
    name : Text,
    description : Text,
    location : Text,
    fundingGoal : Nat
  ) : async FarmModule.Result<Farm> {
    switch (getFarmerProfile(caller)) {
      case (?_) { FarmModule.createFarm(caller, farmStore, name, description, location, fundingGoal) };
      case null { #err("Only farmers can create farms or profile not found") };
    }
  };

  public shared query ({ caller }) func myFarms() : async [Farm] {
    FarmModule.listFarmsByOwner(farmStore, caller)
  };

  public query func listFarms() : async [Farm] {
    FarmModule.listFarms(farmStore)
  };

  // ==============================
  // INVESTMENT (Token Factory Integration)
  // ==============================
  public shared ({ caller }) func openFarmInvestment(
    farmId : Text,
    tokenName : Text,
    tokenSymbol : Text,
    initialSupply : Nat,
    investorAllocs : [Allocation],
    vestingDays : Nat,
    transferFee : Nat,
    extraControllers : [Principal],
    cyclesToSpend : ?Nat
  ) : async FarmModule.Result<Farm> {

    // 1️⃣ Retrieve the farm and ensure it exists & is open
    let farmResult = FarmModule.getFarm(farmId, farmStore);
   switch (farmResult) {
      case (#err(msg)) { return #err(msg) };
      case (#ok(farm)) {
    if (not farm.isOpenForInvestment) {
      return #err("This farm is not open for investment");
    };

        // 2️⃣ Update farm funding and investors
        let investedFarm = switch (FarmModule.investInFarm(caller, farmId, initialSupply, farmStore)) {
          case (#ok(f)) { f };
          case (#err(msg)) { return #err(msg) };
        };

        // 3️⃣ Call Token Factory to create investment tokens
        let _ledgerId = await TF.createFarmLedger(
          tokenName,
          tokenSymbol,
          investedFarm.owner,
          initialSupply,
          investorAllocs,
          null,          // governance placeholder
          vestingDays,
          transferFee,
          Array.append(extraControllers, [Principal.fromText("ulvla-h7777-77774-qaacq-cai")]),
          cyclesToSpend
        );

        // 4️⃣ Return the updated farm
        #ok(investedFarm)
      }
    }
  };

  // ==============================
  // FARMER ACTIONS
  // ==============================
  public shared ({ caller }) func toggleFarmInvestmentStatus(
    farmId : Text,
    newStatus : Bool
  ) : async FarmModule.Result<Farm> {
    switch (FarmModule.getFarm(farmId, farmStore)) {
      case (#err(msg)) { return #err(msg) };
      case (#ok(farm)) {
        if (farm.owner != caller) {
          return #err("Only the farm owner can change investment status");
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