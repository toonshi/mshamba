import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Float "mo:base/Float";
import Nat "mo:base/Nat";
import Farms "lib/farms";
import Profiles "lib/profiles";
import Land "lib/land";
import Token "lib/token";
import Investments "lib/investments";
import Types "lib/types";
import Utils "lib/utils";

actor Mshamba {

  // ------ MODULE STATE ------
  var farmStore = Farms.newFarmStore();
  var profileStore = Profiles.newProfileStore();
  var landStore = Land.newLandStore();
  var tokenLedger = Token.newLedger();
  var investments = Investments.newInvestmentStore();
  var investorIndex = Investments.newInvestorIndex();

  // ------ PROFILES ------
  public shared ({ caller }) func upsertProfile(
    name: Text,
    email: Text,
    role: Types.Role,
    bio: Text,
    location: Text
  ) : async Utils.Result<Types.UserProfile> {
    Profiles.upsertProfile(caller, name, email, role, bio, location, profileStore)
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
    Farms.createFarm(caller, name, description, location, fundingGoal, totalShares, sharePrice, farmStore)
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
    Land.registerLand(caller, location, sizeInAcres, leaseRatePerMonth, landStore)
  };

  public query func getLand(landId: Text) : async Utils.Result<Types.LandListing> {
    Land.getLand(landId, landStore)
  };

  public query func listAvailableLand() : async [Types.LandListing] {
    Land.listAvailableLand(landStore)
  };

  public query ({ caller }) func myLand() : async [Types.LandListing] {
    Land.myLand(caller, landStore)
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
    Investments.recordInvestment(caller, farmId, amount, sharesReceived, pricePerShare, investments, investorIndex)
  };

  public query func getInvestment(id: Text) : async Utils.Result<Types.Investment> {
    Investments.getInvestment(id, investments)
  };

  public query ({ caller }) func listMyInvestments() : async [Types.Investment] {
    Investments.listMyInvestments(caller, investments, investorIndex)
  };
};
