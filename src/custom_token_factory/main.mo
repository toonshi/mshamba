import Principal "mo:base/Principal";
import Nat "mo:base/Nat";
import Blob "mo:base/Blob";
import Canister "mo:base/ExperimentalCycles";
import Result "mo:base/Result";
import Candid "mo:base/ExperimentalCycles";
import Types "types";

actor {

  // Placeholder for ICRC-1 Ledger WASM bytes
  let ICRC1_LEDGER_WASM : Blob = Blob.fromArray([]); // Replace with actual WASM bytes
  // Placeholder for ICRC-1 Index WASM bytes
  let ICRC1_INDEX_WASM : Blob = Blob.fromArray([]); // Replace with actual WASM bytes
  // Placeholder for ICRC-1 Archive WASM bytes
  let ICRC1_ARCHIVE_WASM : Blob = Blob.fromArray([]); // Replace with actual WASM bytes

    

  public shared ({ caller }) func createFarmLedger(
    tokenName : Text,
    tokenSymbol : Text,
    initialSupply : Nat,
    investorAllocs : [Allocation],
    vestingDays : Nat, // Not directly used for ICRC-1 deployment, but part of original signature
    transferFee : Nat,
    extraControllers : [Principal],
    cyclesToSpend : ?Nat
  ) : async Result.Result<Principal, Text> {

    // 1. Generate new canister IDs
    let ledgerId = await Canister.create();
    let indexId = await Canister.create();
    let archiveId = await Canister.create();

    // Get this canister's principal to set as controller
    let selfPrincipal = Principal.fromActor(this);

    // 2. Deploy the ICRC-1 Archive canister
    let archiveInitArg = Candid.encode("(principal, nat64, opt nat64, opt nat64)", (selfPrincipal, 2000, opt 1000, opt 4_000_000_000_000)); // trigger_threshold, num_blocks_to_archive, cycles_for_archive_creation
    let archiveInstallResult = await Canister.install_code(archiveId, ICRC1_ARCHIVE_WASM, archiveInitArg);
    switch (archiveInstallResult) {
      case (#ok(_)) { () };
      case (#err(err)) { return #err("Failed to install archive canister: " # err.message) };
    };

    // 3. Deploy the ICRC-1 Index canister
    let indexInitArg = Candid.encode("(opt variant { Init = record { ledger_id = principal } })", opt variant { Init = record { ledger_id = ledgerId } });
    let indexInstallResult = await Canister.install_code(indexId, ICRC1_INDEX_WASM, indexInitArg);
    switch (indexInstallResult) {
      case (#ok(_)) { () };
      case (#err(err)) { return #err("Failed to install index canister: " # err.message) };
    };

    // 4. Deploy the ICRC-1 Ledger canister
    let ledgerInitArg = Candid.encode("(variant { Init = record { minting_account = record { owner = principal; subaccount = null }; transfer_fee = nat; token_symbol = text; token_name = text; metadata = vec record { text; variant { Nat : nat; Int : int; Text : text; Blob : blob } }; initial_balances = vec record { record { owner = principal; subaccount = null }; nat }; archive_options = record { num_blocks_to_archive = nat64; trigger_threshold = nat64; controller_id = principal; more_controller_ids = opt vec principal }; index_principal = opt principal } })",
      variant { Init = record {
        minting_account = record { owner = caller; subaccount = null }; // Minter is the caller
        transfer_fee = transferFee;
        token_symbol = tokenSymbol;
        token_name = tokenName;
        metadata = vec {};
        initial_balances = vec { record { record { owner = caller; subaccount = null }; initialSupply } };
        archive_options = record {
          num_blocks_to_archive = 1000;
          trigger_threshold = 2000;
          controller_id = archiveId; // Archive canister is the controller
          more_controller_ids = opt vec { selfPrincipal }; // Add custom_token_factory as controller
        };
        index_principal = opt indexId;
      } }
    );

    let ledgerInstallResult = await Canister.install_code(ledgerId, ICRC1_LEDGER_WASM, ledgerInitArg);
    switch (ledgerInstallResult) {
      case (#ok(_)) { #ok(ledgerId) };
      case (#err(err)) { return #err("Failed to install ledger canister: " # err.message) };
    };
  };

  public func greet() : async Text {
    "Hello from custom_token_factory!"
  };
}
