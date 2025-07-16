import Farms "farms";
import Profiles "lib/profiles";
import Land "lib/land";
import Token "lib/token";
import Types "lib/types";
import Utils "lib/utils";

actor Mshamba {

  // ----- Profiles -----
  public shared ({ caller }) func upsertProfile(
    name: Text,
    email: Text,
    role: Types.Role,
    bio: Text,
    location: Text
  ) : async Utils.Result<Types.UserProfile> {
    await Profiles.upsertProfile({ caller })(name, email, role, bio, location)
  };

  public query ({ caller }) func myProfile() : async Utils.Result<Types.UserProfile> {
    Profiles.myProfile({ caller })
  };

  public query func getProfileOf(p: Principal) : async Utils.Result<Types.UserProfile> {
    Profiles.getProfileOf(p)
  };

  public query func listUsers() : async [Types.UserProfile] {
    Profiles.listUsers()
  };

  // ----- Farms -----
  public shared ({ caller }) func createFarm(
    name: Text,
    description: Text,
    location: Text,
    fundingGoal: Nat,
    totalShares: Nat,
    sharePrice: Nat
  ) : async Utils.Result<Types.Farm> {
    await Farms.createFarm({ caller })(name, description, location, fundingGoal, totalShares, sharePrice)
  };

  public query func getFarm(farmId: Text) : async Utils.Result<Types.Farm> {
    Farms.getFarm(farmId)
  };

  public query func listFarms() : async [Types.Farm] {
    Farms.listFarms()
  };

  public shared ({ caller }) func investInFarm(farmId: Text, amount: Nat) : async Utils.Result<Types.Farm> {
    await Farms.investInFarm({ caller })(farmId, amount)
  };

  // ----- Land Listings -----
  public shared ({ caller }) func registerLand(
    location: Text,
    sizeInAcres: Float,
    leaseRatePerMonth: Nat
  ) : async Utils.Result<Types.LandListing> {
    await Land.registerLand({ caller })(location, sizeInAcres, leaseRatePerMonth)
  };

  public query func getLand(landId: Text) : async Utils.Result<Types.LandListing> {
    Land.getLand(landId)
  };

  public query func listAvailableLand() : async [Types.LandListing] {
    Land.listAvailableLand()
  };

  public query ({ caller }) func myLand() : async [Types.LandListing] {
    Land.myLand({ caller })
  };

  public shared ({ caller }) func markAsLeased(landId: Text) : async Utils.Result<Types.LandListing> {
    await Land.markAsLeased({ caller })(landId)
  };

  // ----- Share Tokens -----
  public shared ({ caller }) func addShares(
    farmId: Text,
    sharesToAdd: Nat,
    pricePerShare: Nat
  ) : async Utils.Result<Types.FarmShare> {
    await Token.addShares({ caller })(farmId, sharesToAdd, pricePerShare)
  };

  public query ({ caller }) func mySharesIn(farmId: Text) : async Utils.Result<Types.FarmShare> {
    Token.mySharesIn({ caller })(farmId)
  };

  public query ({ caller }) func myAllShares() : async [Types.FarmShare] {
    Token.myAllShares({ caller })
  };

}
