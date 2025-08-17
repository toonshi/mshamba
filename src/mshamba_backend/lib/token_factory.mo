// src/investment_manager/main.mo
import Principal "mo:base/Principal";
import Nat "mo:base/Nat";
import TF "../../factory/main";

// This module contains the logic for creating investments.
module {

  // The TF.Allocation type is needed here for the function signature.
  public type Allocation = TF.Allocation;

  // This function encapsulates the entire logic for opening an investment.
  // It is now a shared function within this module.
  public shared(caller) func openInvestment(
    tokenName: Text,
    tokenSymbol: Text,
    farmerId: Principal,
    initialSupply: Nat,
    investorAllocs: [Allocation]
  ) : async Principal {

    // Point to the deployed TokenFactory canister
    let factory = actor("uxrrr-q7777-77774-qaaaq-cai") : actor {
      createFarmLedger : (
        Text, Text, Principal, Nat, [TF.Allocation], ?Principal,
        Nat, Nat, [Principal], ?Nat
      ) -> async Principal;
    };
    
    // Example: fixed values until you build your calculator
    let vestingDays: Nat = 365;
    let transferFee: Nat = 10_000;
    let extraControllers: [Principal] = [];
    let cyclesToSpend: ?Nat = null;

    // Delegate to the factory
    let newLedger = await factory.createFarmLedger(
      tokenName,
      tokenSymbol,
      farmerId,
      initialSupply,
      investorAllocs,
      null,
      vestingDays,
      transferFee,
      extraControllers,
      cyclesToSpend
    );

    return newLedger;
  };
}
