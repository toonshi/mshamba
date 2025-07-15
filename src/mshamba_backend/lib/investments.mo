import Time "mo:base/Time";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Int "mo:base/Int";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Array "mo:base/Array";
import Types "types";
import Utils "utils";

actor {
  public type Investment = Types.Investment;
  public type Result<T> = Utils.Result<T>;

  // Store investments: key = investmentId
  var investments = HashMap.HashMap<Text, Investment>(50, Text.equal, Text.hash);

  // Index by user
  var investorIndex = HashMap.HashMap<Principal, [Text]>(50, Principal.equal, Principal.hash);

  // Record an investment
  public shared ({ caller }) func recordInvestment(
    farmId: Text,
    amount: Nat,
    sharesReceived: Nat,
    pricePerShare: Nat
  ) : async Result<Investment> {
    let investmentId = "inv-" # Int.toText(Time.now());

    let newInvestment: Investment = {
      investmentId = investmentId;
      investor = caller;
      farmId = farmId;
      amount = amount;
      sharesReceived = sharesReceived;
      pricePerShare = pricePerShare;
      timestamp = Time.now();
    };

    investments.put(investmentId, newInvestment);

    // Index it under the investor
    let existing = switch (investorIndex.get(caller)) {
      case (?ids) ids;
      case null [];
    };
    investorIndex.put(caller, Array.append(existing, [investmentId]));

    return #ok(newInvestment);
  };

  // Get a specific investment
  public query func getInvestment(id: Text) : async Result<Investment> {
    switch (investments.get(id)) {
      case (?inv) { return #ok(inv); };
      case null { return #err("Investment not found"); };
    }
  };

  // List all investments made by a specific caller
  public query func listMyInvestments() : async [Investment] {
    let ids = switch (investorIndex.get(Principal.fromActor(this))) {
      case (?list) list;
      case null [];
    };
    Array.map<Investment, Investment>(ids, func(id) {
      switch (investments.get(id)) {
        case (?i) i;
        case null {
          // should never happen — just skip
          {
            investmentId = "invalid";
            investor = Principal.fromActor(this);
            farmId = "invalid";
            amount = 0;
            sharesReceived = 0;
            pricePerShare = 0;
            timestamp = 0;
          }
        }
      }
    })
  };
}
