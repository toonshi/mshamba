import Farm "lib/farms";
import IM "lib/tokenFactory"; // (kept for future openInvestment)
import UserProfile "lib/userProfiles";
import Text "mo:base/Text";
import Principal "mo:base/Principal";
import Iter "mo:base/Iter";

actor  {
  stable var farmStore = Farm.newFarmStore();
  stable var profileStore = UserProfile.newProfileStore();

  // ==============================
  // PROFILES
  // ==============================
  /// Create Profile (Farmer or Investor)
  public shared ({ caller }) func createProfile(
    name : Text,
    bio : Text,
    role : UserProfile.Role,
    certifications : [Text]
  ) : async Bool {
    UserProfile.createProfile(profileStore, caller, name, bio, role, certifications)
  };

  /// Fetch profile by Principal
  public query func getProfile(owner : Principal) : async ?UserProfile.Profile {
    UserProfile.getProfile(profileStore, owner)
  };

  // ==============================
  // FARMS (Farmer-only actions)
  // ==============================
  /// Create a new farm (only if caller is a Farmer)
  public shared ({ caller }) func createFarm(
    name : Text,
    description : Text,
    location : Text,
    fundingGoal : Nat
  ) : async Farm.Result<Farm.Farm> {
    switch (UserProfile.getProfile(profileStore, caller)) {
      case (?(p)) {
        if (p.role == #Farmer) {
          Farm.createFarm(caller, farmStore, name, description, location, fundingGoal)
        } else {
          #err("Only farmers can create farms")
        }
      };
      case null { #err("Profile not found. Create a farmer profile first") };
    }
  };

  /// Query farms belonging to the caller (Farmer only)
  public shared query ({ caller }) func myFarms() : async [Farm.Farm] {
    let allFarms = Farm.listFarms(farmStore);
    Iter.toArray(
      Iter.filter<Farm.Farm>(
        Iter.fromArray(allFarms),
        func (f : Farm.Farm) : Bool { f.owner == caller }
      )
    )
  };

  //  Open investment — uncomment when you wire token factory
  // public shared ({ caller }) func openInvestment(
  //   farmId : Text,
  //   tokenName : Text,
  //   tokenSymbol : Text,
  //   initialSupply : Nat,
  //   investorAllocs : [IM.Allocation]
  // ) : async Farm.Result<Farm.Farm> {
  //   await Farm.openFarmInvestment(
  //     caller,
  //     farmStore,
  //     farmId,
  //     tokenName,
  //     tokenSymbol,
  //     initialSupply,
  //     investorAllocs
  //   )
  // };

  // List all farms
  public query func listFarms() : async [Farm.Farm] {
    Farm.listFarms(farmStore)
  };
}
