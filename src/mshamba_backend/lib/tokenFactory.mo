
import Principal "mo:base/Principal";
import Nat "mo:base/Nat";
import TF "../../factory/main";

module {
  public type Allocation = TF.Allocation;

  public shared({caller}) func openInvestment(
    tokenName: Text,
    tokenSymbol: Text,
    farmerId: Principal,
    initialSupply: Nat,
    investorAllocs: [Allocation],
    vestingDays: Nat,
    transferFee: Nat,
    extraControllers: [Principal],
    cyclesToSpend: ?Nat
  ) : async Principal {
    
    // Factory canister reference (replace with your deployed ID)
    let factory = actor("uxrrr-q7777-77774-qaaaq-cai") : actor {
      createFarmLedger : (
        Text, Text, Principal, Nat, [TF.Allocation], ?Principal,
        Nat, Nat, [Principal], ?Nat
      ) -> async Principal;
    };

    // Delegate to factory
    let newLedger = await factory.createFarmLedger(
      tokenName,
      tokenSymbol,
      farmerId,
      initialSupply,
      investorAllocs,
      null,             // governance placeholder
      vestingDays,
      transferFee,
      extraControllers,
      cyclesToSpend
    );

    return newLedger;
  };
}
