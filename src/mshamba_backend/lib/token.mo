import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import HashMap "mo:base/HashMap";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Int "mo:base/Int";
import Time "mo:base/Time";
import Types "types";
import Utils "utils";

actor {
  public type FarmShare = Types.FarmShare;
  public type Result<T> = Utils.Result<T>;

  // Store shares by composite key: farmId#owner
  var ledger = HashMap.HashMap<Text, FarmShare>(200, Text.equal, Text.hash);

  func makeKey(farmId: Text, owner: Principal) : Text {
    farmId # "#" # Principal.toText(owner)
  };

  // Add or update shares for a user
  public shared ({ caller }) func addShares(
    farmId: Text,
    sharesToAdd: Nat,
    pricePerShare: Nat
  ) : async Result<FarmShare> {
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
    return #ok(updated);
  };

  // Query your shareholding in a specific farm
  public query ({ caller }) func mySharesIn(farmId: Text) : async Result<FarmShare> {
    let key = makeKey(farmId, caller);
    switch (ledger.get(key)) {
      case (?share) return #ok(share);
      case null return #err("No shares owned");
    }
  };

  // List all shares held by a user (across all farms)
  public query ({ caller }) func myAllShares() : async [FarmShare] {
    let all = Iter.toArray(HashMap.vals(ledger));
    Array.filter<FarmShare>(all, func (s) { s.owner == caller })
  };
}
