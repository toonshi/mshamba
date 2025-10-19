// Payment Module - ckUSDT Integration for Farm Token Purchases
import Principal "mo:base/Principal";
import Nat "mo:base/Nat";
import Result "mo:base/Result";
import Debug "mo:base/Debug";
import Error "mo:base/Error";

module {
    // ckUSDT Ledger on ICP Mainnet
    public let ckUSDT_LEDGER_CANISTER = "cngnf-vqaaa-aaaar-qag4q-cai";
    
    // ICRC-1 Types for payment verification
    public type Account = {
        owner: Principal;
        subaccount: ?Blob;
    };
    
    public type TransferArgs = {
        from_subaccount: ?Blob;
        to: Account;
        amount: Nat;
        fee: ?Nat;
        memo: ?Blob;
        created_at_time: ?Nat64;
    };
    
    public type TransferResult = {
        #Ok: Nat;  // Block index
        #Err: TransferError;
    };
    
    public type TransferError = {
        #BadFee: { expected_fee: Nat };
        #BadBurn: { min_burn_amount: Nat };
        #InsufficientFunds: { balance: Nat };
        #TooOld;
        #CreatedInFuture: { ledger_time: Nat64 };
        #Duplicate: { duplicate_of: Nat };
        #TemporarilyUnavailable;
        #GenericError: { error_code: Nat; message: Text };
    };
    
    // ICRC-1 Ledger Interface
    public type ICRC1Ledger = actor {
        icrc1_transfer: shared (TransferArgs) -> async TransferResult;
        icrc1_balance_of: shared query (Account) -> async Nat;
        icrc1_fee: shared query () -> async Nat;
    };
    
    // Purchase record
    public type TokenPurchase = {
        investor: Principal;
        farmId: Text;
        ckusdtAmount: Nat;  // Amount paid in ckUSDT (6 decimals)
        tokensReceived: Nat;  // Farm tokens received
        blockIndex: Nat;  // ckUSDT transfer block index
        timestamp: Int;
    };
    
    // Get ckUSDT ledger actor
    public func getLedger() : ICRC1Ledger {
        actor(ckUSDT_LEDGER_CANISTER) : ICRC1Ledger
    };
    
    // Verify investor has sufficient ckUSDT balance
    public func checkBalance(investor: Principal, requiredAmount: Nat) : async Result.Result<Bool, Text> {
        try {
            let ledger = getLedger();
            let balance = await ledger.icrc1_balance_of({
                owner = investor;
                subaccount = null;
            });
            
            if (balance >= requiredAmount) {
                #ok(true)
            } else {
                #err("Insufficient ckUSDT balance. Have: " # debug_show(balance) # ", Need: " # debug_show(requiredAmount))
            }
        } catch (e) {
            #err("Failed to check balance: " # Error.message(e))
        }
    };
    
    // Get ckUSDT transfer fee
    public func getTransferFee() : async Result.Result<Nat, Text> {
        try {
            let ledger = getLedger();
            let fee = await ledger.icrc1_fee();
            #ok(fee)
        } catch (e) {
            #err("Failed to get transfer fee: " # Error.message(e))
        }
    };
    
    // Calculate token amount based on price
    // ckUSDT has 6 decimals, farm tokens typically have 8
    public func calculateTokenAmount(ckusdtAmount: Nat, tokenPriceInCents: Nat, tokenDecimals: Nat8) : Nat {
        // tokenPriceInCents is in USD cents (e.g., 10 = $0.10)
        // ckUSDT amount is in e6 (1 ckUSDT = 1_000_000)
        // Formula: tokens = (ckusdtAmount * 100) / tokenPriceInCents
        
        // Calculate tokens in e6 base
        let tokensE6 = (ckusdtAmount * 100) / tokenPriceInCents;
        
        // Adjust for token decimals
        if (tokenDecimals == 6) {
            tokensE6
        } else if (tokenDecimals == 8) {
            tokensE6 * 100  // Scale up by 2 decimals
        } else {
            tokensE6  // Default fallback
        }
    };
    
    // Transfer farm tokens from escrow to investor
    public func transferTokensToInvestor(
        farmLedgerCanister: Principal,
        _escrowPrincipal: Principal,
        investorAccount: Account,
        tokenAmount: Nat
    ) : async Result.Result<Nat, Text> {
        try {
            let farmLedger : ICRC1Ledger = actor(Principal.toText(farmLedgerCanister));
            
            let transferArgs : TransferArgs = {
                from_subaccount = null;
                to = investorAccount;
                amount = tokenAmount;
                fee = null;  // Use default
                memo = null;
                created_at_time = null;
            };
            
            // Note: This requires the backend canister to be authorized to transfer from escrow
            let result = await farmLedger.icrc1_transfer(transferArgs);
            
            switch (result) {
                case (#Ok(blockIndex)) {
                    Debug.print("Transferred " # debug_show(tokenAmount) # " tokens to investor at block " # debug_show(blockIndex));
                    #ok(blockIndex)
                };
                case (#Err(error)) {
                    #err("Token transfer failed: " # debug_show(error))
                };
            }
        } catch (e) {
            #err("Failed to transfer tokens: " # Error.message(e))
        }
    };
}
