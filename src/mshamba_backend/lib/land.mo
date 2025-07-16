// import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Float "mo:base/Float";
import Time "mo:base/Time";
import Int "mo:base/Int";
import HashMap "mo:base/HashMap";
// import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Types "types";
import Utils "utils";

actor {
  public type LandListing = Types.LandListing;
  public type Result<T> = Utils.Result<T>;

  // Land storage: key = landId
  var lands = HashMap.HashMap<Text, LandListing>(100, Text.equal, Text.hash);

  // Register a piece of land
  public shared ({ caller }) func registerLand(
    location: Text,
    sizeInAcres: Float,
    leaseRatePerMonth: Nat
  ) : async Result<LandListing> {
    let landId = "land-" # Int.toText(Time.now());

    let listing: LandListing = {
      landId = landId;
      owner = caller;
      location = location;
      sizeInAcres = sizeInAcres;
      leaseRatePerMonth = leaseRatePerMonth;
      isAvailable = true;
      listedAt = Time.now();
    };

    lands.put(landId, listing);
    return #ok(listing);
  };

  // View a land listing by ID
  public query func getLand(landId: Text) : async Result<LandListing> {
    switch (lands.get(landId)) {
      case (?land) return #ok(land);
      case null return #err("Land not found");
    }
  };

  // List all available land
  public query func listAvailableLand() : async [LandListing] {
    let available = Iter.filter<(Text, LandListing)>(
      lands.entries(),
      func ((_, l)) = l.isAvailable
    );

    Iter.toArray(
      Iter.map<(Text, LandListing), LandListing>(
        available,
        func ((_, l)) = l
      )
    )
  };

  // List all land owned by the current user
  public query ({ caller }) func myLand() : async [LandListing] {
    let mine = Iter.filter<(Text, LandListing)>(
      lands.entries(),
      func ((_, l)) = l.owner == caller
    );

    Iter.toArray(
      Iter.map<(Text, LandListing), LandListing>(
        mine,
        func ((_, l)) = l
      )
    )
  };

  // Mark land as leased (not available)
  public shared ({ caller }) func markAsLeased(landId: Text) : async Result<LandListing> {
    switch (lands.get(landId)) {
      case (?land) {
        if (land.owner != caller) {
          return #err("Only the owner can update this listing");
        };

        let updated = { land with isAvailable = false };
        lands.put(landId, updated);
        return #ok(updated);
      };
      case null return #err("Land not found");
    }
  };
}
