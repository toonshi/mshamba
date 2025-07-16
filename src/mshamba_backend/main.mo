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
    totalShares: Nat,
    sharePrice: Nat
  ) : async Utils.Result<Types.Farm> {
    Farms.createFarm(caller, farmStore, name, description, location, fundingGoal, totalShares, sharePrice)
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
    Farms.investInFarm(caller, farmId, amount, farmStore)
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
};
