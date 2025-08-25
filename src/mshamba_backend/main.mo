import Farm "lib/farms";
import UserProfile "lib/userProfiles";
import Text "mo:base/Text";
import Principal "mo:base/Principal";
import Nat "mo:base/Nat";
import TF "canister:token_factory";
import Types "lib/types";

actor {

  public type Allocation = TF.Allocation;

   var farmStore = Farm.newFarmStore();
   var profileStore = UserProfile.newProfileStore();

  // ==============================
  // HELPERS
  // ==============================
  func getFarmerProfile(caller: Principal) : ?UserProfile.Profile {
  switch (UserProfile.getProfile(profileStore, caller)) {
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
    role : UserProfile.Role,
    certifications : [Text]
  ) : async Bool {
    UserProfile.createProfile(profileStore, caller, name, bio, role, certifications)
  };

  public query func getProfile(owner : Principal) : async ?UserProfile.Profile {
    UserProfile.getProfile(profileStore, owner)
  };

  // ==============================
  // FARMS (Farmer-only actions)
  // ==============================
  public shared ({ caller }) func createFarm(
    name : Text,
    description : Text,
    location : Text,
    fundingGoal : Nat
  ) : async Farm.Result<Farm.Farm> {
    switch (getFarmerProfile(caller)) {
      case (?_) { Farm.createFarm(caller, farmStore, name, description, location, fundingGoal) };
      case null { #err("Only farmers can create farms or profile not found") };
    }
  };

  public shared query ({ caller }) func myFarms() : async [Farm.Farm] {
    Farm.listFarmsByOwner(farmStore, caller)
  };

  public query func listFarms() : async [Farm.Farm] {
    Farm.listFarms(farmStore)
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
  ) : async Farm.Result<Farm.Farm> {

    // 1️⃣ Retrieve the farm and ensure it exists & is open
    let farmResult = Farm.getFarm(farmId, farmStore);
   switch (farmResult) {
      case (#err(msg)) { return #err(msg) };
      case (#ok(farm)) {
    if (not farm.isOpenForInvestment) {
      return #err("This farm is not open for investment");
    };

        // 2️⃣ Update farm funding and investors
        let investedFarm = switch (Farm.investInFarm(caller, farmId, initialSupply, farmStore)) {
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
          extraControllers # [principal "ulvla-h7777-77774-qaacq-cai"],
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
  ) : async Farm.Result<Farm.Farm> {
    switch (Farm.getFarm(farmId, farmStore)) {
      case (#err(msg)) { return #err(msg) };
      case (#ok(farm)) {
        if (farm.owner != caller) {
          return #err("Only the farm owner can change investment status");
        };
        let updateResult = Farm.updateFarmInvestmentStatus(farmId, farmStore, newStatus);
        switch (updateResult) {
          case (#ok(updatedFarm)) { #ok(updatedFarm) };
          case (#err(msg)) { #err(msg) };
        }
      }
    }
  };
};