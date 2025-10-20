import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Nat "mo:base/Nat";
import Debug "mo:base/Debug";
import Error "mo:base/Error";

module {
  // ckUSDC Ledger Canister on ICP Mainnet
  public let CKUSDC_LEDGER = "xevnm-gaaaa-aaaar-qafnq-cai"; // ckUSDC mainnet canister
  
  // For testnet/local development, use a different canister
  public let CKUSDC_TESTNET = "mxzaz-hqaaa-aaaar-qaada-cai"; // Replace with actual testnet

  // ICRC-1 Standard types
  public type Account = {
    owner : Principal;
    subaccount : ?Blob;
  };

  public type TransferArgs = {
    from_subaccount : ?Blob;
    to : Account;
    amount : Nat;
    fee : ?Nat;
    memo : ?Blob;
    created_at_time : ?Nat64;
  };

  public type TransferError = {
    #BadFee : { expected_fee : Nat };
    #BadBurn : { min_burn_amount : Nat };
    #InsufficientFunds : { balance : Nat };
    #TooOld;
    #CreatedInFuture : { ledger_time : Nat64 };
    #Duplicate : { duplicate_of : Nat };
    #TemporarilyUnavailable;
    #GenericError : { error_code : Nat; message : Text };
  };

  public type TransferResult = Result.Result<Nat, TransferError>;

  // Interface for ckUSDC ledger canister
  public type ICRC1Ledger = actor {
    icrc1_transfer : shared (TransferArgs) -> async TransferResult;
    icrc1_balance_of : shared query (Account) -> async Nat;
    icrc1_fee : shared query () -> async Nat;
  };

  // Get ckUSDC ledger actor
  public func getLedger(useTestnet: Bool) : ICRC1Ledger {
    let canisterId = if (useTestnet) { CKUSDC_TESTNET } else { CKUSDC_LEDGER };
    actor (canisterId) : ICRC1Ledger
  };

  // Transfer ckUSDC from one account to another
  public func transferCkUSDC(
    from: Principal,
    to: Principal,
    amount: Nat,
    memo: ?Blob,
    useTestnet: Bool
  ) : async Result.Result<Nat, Text> {
    let ledger = getLedger(useTestnet);

    let transferArgs : TransferArgs = {
      from_subaccount = null;
      to = {
        owner = to;
        subaccount = null;
      };
      amount = amount;
      fee = null; // Use default fee
      memo = memo;
      created_at_time = null;
    };

    try {
      let result = await ledger.icrc1_transfer(transferArgs);
      
      switch (result) {
        case (#Ok(blockIndex)) {
          #ok(blockIndex)
        };
        case (#Err(error)) {
          let errorMsg = switch (error) {
            case (#InsufficientFunds({ balance })) {
              "Insufficient funds. Balance: " # Nat.toText(balance)
            };
            case (#BadFee({ expected_fee })) {
              "Bad fee. Expected: " # Nat.toText(expected_fee)
            };
            case (#TooOld) { "Transaction too old" };
            case (#CreatedInFuture(_)) { "Transaction created in future" };
            case (#Duplicate({ duplicate_of })) {
              "Duplicate transaction: " # Nat.toText(duplicate_of)
            };
            case (#TemporarilyUnavailable) { "Service temporarily unavailable" };
            case (#GenericError({ message; error_code })) {
              "Error " # Nat.toText(error_code) # ": " # message
            };
            case (#BadBurn(_)) { "Bad burn amount" };
          };
          #err(errorMsg)
        };
      };
    } catch (e) {
      #err("Transfer failed: " # Error.message(e))
    }
  };

  // Check balance
  public func getBalance(owner: Principal, useTestnet: Bool) : async Nat {
    let ledger = getLedger(useTestnet);
    let account : Account = {
      owner = owner;
      subaccount = null;
    };
    await ledger.icrc1_balance_of(account)
  };

  // Get transfer fee
  public func getFee(useTestnet: Bool) : async Nat {
    let ledger = getLedger(useTestnet);
    await ledger.icrc1_fee()
  };

  // Convert human-readable amount to smallest units
  // Example: 15.50 USDC = 15_500_000 (6 decimals)
  public func usdcToSmallestUnits(usdcAmount: Float) : Nat {
    let decimals = 6; // ckUSDC has 6 decimal places
    let multiplier = 10 ** decimals;
    Int.abs(Float.toInt(usdcAmount * Float.fromInt(multiplier)))
  };

  // Convert smallest units to human-readable amount
  public func smallestUnitsToUsdc(units: Nat) : Float {
    let decimals = 6;
    let divisor = 10 ** decimals;
    Float.fromInt(units) / Float.fromInt(divisor)
  };
}
