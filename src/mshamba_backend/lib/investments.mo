import Time "mo:base/Time";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Int "mo:base/Int";
import HashMap "mo:base/HashMap";
// import Iter "mo:base/Iter";
import Array "mo:base/Array";
import Types "types";
import Utils "utils";

module {
  public type Investment = Types.Investment;
  public type Result<T> = Utils.Result<T>;

  // Factory for investment map
  public func newInvestmentStore() : HashMap.HashMap<Text, Investment> {
    HashMap.HashMap<Text, Investment>(50, Text.equal, Text.hash)
  };

  // Factory for index of investments by user
  public func newInvestorIndex() : HashMap.HashMap<Principal, [Text]> {
    HashMap.HashMap<Principal, [Text]>(50, Principal.equal, Principal.hash)
  };

  // Record a new investment
  public func recordInvestment(
    caller: Principal,
    farmId: Text,
    amount: Nat,
    sharesReceived: Nat,
    pricePerShare: Nat,
    investments: HashMap.HashMap<Text, Investment>,
    investorIndex: HashMap.HashMap<Principal, [Text]>
  ) : Result<Investment> {
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

    let existing = switch (investorIndex.get(caller)) {
      case (?ids) ids;
      case null [];
    };
    investorIndex.put(caller, Array.append(existing, [investmentId]));

    #ok(newInvestment)
  };

  // Retrieve a single investment by ID
  public func getInvestment(
    id: Text,
    investments: HashMap.HashMap<Text, Investment>
  ) : Result<Investment> {
    switch (investments.get(id)) {
      case (?inv) #ok(inv);
      case null #err("Investment not found");
    }
  };

  // List all investments made by a user
public func listMyInvestments(
  caller: Principal,
  investments: HashMap.HashMap<Text, Investment>,
  investorIndex: HashMap.HashMap<Principal, [Text]>
) : [Investment] {
  let ids = switch (investorIndex.get(caller)) {
    case (?list) list;
    case null [];
  };

  Array.mapFilter<Text, Investment>(
    ids,
    func(id: Text): ?Investment {
      investments.get(id)
    }
  )
};

// List all investments by any principal (for admin/global analytics)
public func listInvestmentsByInvestor(
  investor: Principal,
  investments: HashMap.HashMap<Text, Investment>,
  investorIndex: HashMap.HashMap<Principal, [Text]>
) : [Investment] {
  let ids = switch (investorIndex.get(investor)) {
    case (?list) list;
    case null [];
  };
  Array.mapFilter<Text, Investment>(
    ids,
    func(id: Text): ?Investment {
      investments.get(id)
    }
  )
}

}
