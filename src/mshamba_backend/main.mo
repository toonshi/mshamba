import Principal "mo:base/Principal";
import token_factory "lib/token_factory";

actor MshambaBackend {
  
  // Import the Token Factory module from the token_factory library.
  public shared({caller}) func openInvestment(
    tokenName: Text,
    tokenSymbol: Text,
    initialSupply: Nat,
    investorAllocs: [token_factory.Allocation]
  ) : async Principal {

    // Delegate the call to the external library.
    let newLedger = await token_factory.openInvestment(
      tokenName,
      tokenSymbol,
      caller,
      initialSupply,
      investorAllocs
    );

    return newLedger;
  };
}
