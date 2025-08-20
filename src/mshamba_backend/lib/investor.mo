import IM "tokenFactory";
import Principal "mo:base/Principal";

module {
  public type Investment = {
    investor: Principal;
    farmId: Text;
    amount: Nat;
    tokenCanister: Principal;
  };

  // here you can later expand with investor portfolio tracking
  public func investInFarm(
    caller: Principal,
    farmId: Text,
    tokenCanister: Principal,
    amount: Nat
  ) : async Result<Investment, Text> {
    // TODO: Call token canister (mint / transfer logic)
    // Placeholder return
    #ok({
      investor = caller;
      farmId = farmId;
      amount = amount;
      tokenCanister = tokenCanister;
    });
  };
};
