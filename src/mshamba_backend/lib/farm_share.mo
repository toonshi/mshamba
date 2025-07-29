import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Types "types";
import Utils "utils";

module {
  public type FarmShare = Types.FarmShare;
  public type Result<T> = Utils.Result<T>;

  // Composite key generator
  public func makeKey(farmId: Text, owner: Principal) : Text {
    farmId # "#" # Principal.toText(owner)
  };

  // Create new ledger
  public func newLedger() : HashMap.HashMap<Text, FarmShare> {
    HashMap.HashMap<Text, FarmShare>(200, Text.equal, Text.hash)
  };

  // Add or update shares
  public func addShares(
    caller: Principal,
    farmId: Text,
    sharesToAdd: Nat,
    pricePerShare: Nat,
    ledger: HashMap.HashMap<Text, FarmShare>
  ) : Result<FarmShare> {
    let key = makeKey(farmId, caller);
    let entry = ledger.get(key);

    let updated = switch (entry) {
      case (?share) {
        let totalShares = share.sharesOwned + sharesToAdd;
        let newAvg = (
          (share.avgBuyPrice * share.sharesOwned) + (pricePerShare * sharesToAdd)
        ) / totalShares;

        {
          share with
          sharesOwned = totalShares;
          avgBuyPrice = newAvg;
        }
      };
      case null {
        {
          owner = caller;
          farmId = farmId;
          sharesOwned = sharesToAdd;
          avgBuyPrice = pricePerShare;
        }
      };
    };

    ledger.put(key, updated);
    #ok(updated)
  };

  // View specific farm shares
  public func mySharesIn(
    caller: Principal,
    farmId: Text,
    ledger: HashMap.HashMap<Text, FarmShare>
  ) : Result<FarmShare> {
    let key = makeKey(farmId, caller);
    switch (ledger.get(key)) {
      case (?share) #ok(share);
      case null #err("No shares owned");
    }
  };

  // View all shares owned by the caller
  public func myAllShares(
    caller: Principal,
    ledger: HashMap.HashMap<Text, FarmShare>
  ) : [FarmShare] {
    let ownedShares = Iter.filter<(Text, FarmShare)>(
      ledger.entries(),
      func ((_, share)) = share.owner == caller
    );

    Iter.toArray(
      Iter.map<(Text, FarmShare), FarmShare>(
        ownedShares,
        func ((_, share)) = share
      )
    )
  };
}
