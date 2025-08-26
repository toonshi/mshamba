import Farm "lib/farms";
import UserProfile "lib/userProfiles";
import Text "mo:base/Text";
import Principal "mo:base/Principal";
import Nat "mo:base/Nat";
import Array "mo:base/Array";
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
    fundingGoal : Nat,
    image: Text, // New parameter
    crop: Text, // New parameter
    size: Text, // New parameter
    minInvestment: Nat, // New parameter
    duration: Nat // New parameter
  ) : async Farm.Result<Farm.Farm> {
    switch (getFarmerProfile(caller)) {
      case (?_) { Farm.createFarm(caller, farmStore, name, description, location, fundingGoal, image, crop, size, minInvestment, duration) };
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
          Array.append(extraControllers, [Principal.fromText("ulvla-h7777-77774-qaacq-cai")]),
          cyclesToSpend
        );

        // 4️⃣ Return the updated farm
        #ok(investedFarm)
      }
    }
  };

  // ==============================
  // INVESTOR ACTIONS
  // ==============================
  public shared ({ caller }) func handleInvest(
    farmId : Text,
    amount : Nat
  ) : async Farm.Result<Farm.Farm> {
    // 1. Retrieve the farm and ensure it exists & is open for investment
    let farmResult = Farm.getFarm(farmId, farmStore);
    switch (farmResult) {
      case (#err(msg)) { return #err(msg) };
      case (#ok(farm)) {
        if (not farm.isOpenForInvestment) {
          return #err("This farm is not open for investment");
        };

        // 2. Ensure the farm has a deployed ledger canister
        let ledgerId = switch (farm.ledgerCanister) {
          case (?id) { id };
          case null { return #err("Farm does not have a deployed ledger canister yet.") };
        };

        // 3. Call the token canister to transfer tokens from caller to farm's ledger
        //    NOTE: This assumes the token canister has a 'transfer' function
        //    and that the caller has enough balance in that token.
        //    This part needs careful implementation based on the token standard (e.g., ICRC-1)
        //    For now, we'll simulate the transfer and focus on updating the farm's state.
        //    This is a simplification and needs to be replaced with actual token transfer.

        // 4. Update farm funding and investors (using the internal investInFarm from lib/farms.mo)
        let updateResult = Farm.investInFarm(caller, farmId, amount, farmStore);
        switch (updateResult) {
          case (#ok(updatedFarm)) { #ok(updatedFarm) };
          case (#err(msg)) { #err(msg) };
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