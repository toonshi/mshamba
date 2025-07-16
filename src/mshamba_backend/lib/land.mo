import Text "mo:base/Text";
import Float "mo:base/Float";
import Time "mo:base/Time";
import Int "mo:base/Int";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Types "types";
import Utils "utils";

module {
  public type LandListing = Types.LandListing;
  public type Result<T> = Utils.Result<T>;

  // Create new land listing store
  public func newLandStore() : HashMap.HashMap<Text, LandListing> {
    HashMap.HashMap<Text, LandListing>(100, Text.equal, Text.hash)
  };

  // Register new land
  public func registerLand(
    caller: Principal,
    lands: HashMap.HashMap<Text, LandListing>,
    location: Text,
    sizeInAcres: Float,
    leaseRatePerMonth: Nat
  ) : Result<LandListing> {
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
    #ok(listing)
  };

  // View land by ID
  public func getLand(
    landId: Text,
    lands: HashMap.HashMap<Text, LandListing>
  ) : Result<LandListing> {
    switch (lands.get(landId)) {
      case (?land) #ok(land);
      case null #err("Land not found");
    }
  };

  // List all available land
  public func listAvailableLand(
    lands: HashMap.HashMap<Text, LandListing>
  ) : [LandListing] {
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

  // List land owned by a principal
  public func listOwnedLand(
    lands: HashMap.HashMap<Text, LandListing>,
    caller: Principal
  ) : [LandListing] {
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

  // Mark land as leased
  public func markAsLeased(
    caller: Principal,
    landId: Text,
    lands: HashMap.HashMap<Text, LandListing>
  ) : Result<LandListing> {
    switch (lands.get(landId)) {
      case (?land) {
        if (land.owner != caller) {
          return #err("Only the owner can update this listing");
        };
        let updated = { land with isAvailable = false };
        lands.put(landId, updated);
        #ok(updated)
      };
      case null #err("Land not found");
    }
  };
}
