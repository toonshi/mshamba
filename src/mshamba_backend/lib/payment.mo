// Payment Module - ckUSDT Integration for Farm Token Purchases
import Principal "mo:base/Principal";
import Nat "mo:base/Nat";
import Nat64 "mo:base/Nat64";
import Result "mo:base/Result";
import Debug "mo:base/Debug";
import Error "mo:base/Error";
import Text "mo:base/Text";
import Time "mo:base/Time";
import LocalICPLedger "canister:local_icp_ledger";

module {
    // Ledger Canisters on ICP Mainnet
    public let ckUSDT_LEDGER_CANISTER = "cngnf-vqaaa-aaaar-qag4q-cai";  // ckUSDT (6 decimals)
    public let ICP_LEDGER_CANISTER = "ryjl3-tyaaa-aaaaa-aaaba-cai";      // ICP (8 decimals)
    
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
    
    // ICRC-2 Types for approve/transfer_from
    public type ApproveArgs = {
        from_subaccount: ?Blob;
        spender: Account;
        amount: Nat;
        expected_allowance: ?Nat;
        expires_at: ?Nat64;
        fee: ?Nat;
        memo: ?Blob;
        created_at_time: ?Nat64;
    };
    
    public type ApproveResult = {
        #Ok: Nat;  // Block index
        #Err: ApproveError;
    };
    
    public type ApproveError = {
        #BadFee: { expected_fee: Nat };
        #InsufficientFunds: { balance: Nat };
        #AllowanceChanged: { current_allowance: Nat };
        #Expired: { ledger_time: Nat64 };
        #TooOld;
        #CreatedInFuture: { ledger_time: Nat64 };
        #Duplicate: { duplicate_of: Nat };
        #TemporarilyUnavailable;
        #GenericError: { error_code: Nat; message: Text };
    };
    
    public type TransferFromArgs = {
        spender_subaccount: ?Blob;
        from: Account;
        to: Account;
        amount: Nat;
        fee: ?Nat;
        memo: ?Blob;
        created_at_time: ?Nat64;
    };
    
    public type TransferFromResult = {
        #Ok: Nat;  // Block index
        #Err: TransferFromError;
    };
    
    public type TransferFromError = {
        #BadFee: { expected_fee: Nat };
        #BadBurn: { min_burn_amount: Nat };
        #InsufficientFunds: { balance: Nat };
        #InsufficientAllowance: { allowance: Nat };
        #TooOld;
        #CreatedInFuture: { ledger_time: Nat64 };
        #Duplicate: { duplicate_of: Nat };
        #TemporarilyUnavailable;
        #GenericError: { error_code: Nat; message: Text };
    };
    
    public type AllowanceArgs = {
        account: Account;
        spender: Account;
    };
    
    public type Allowance = {
        allowance: Nat;
        expires_at: ?Nat64;
    };
    
    // ICRC-1 + ICRC-2 Ledger Interface
    public type ICRC1Ledger = actor {
        icrc1_transfer: shared (TransferArgs) -> async TransferResult;
        icrc1_balance_of: shared query (Account) -> async Nat;
        icrc1_fee: shared query () -> async Nat;
        
        // ICRC-2 functions
        icrc2_approve: shared (ApproveArgs) -> async ApproveResult;
        icrc2_transfer_from: shared (TransferFromArgs) -> async TransferFromResult;
        icrc2_allowance: shared query (AllowanceArgs) -> async Allowance;
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
    public func getCkUSDTLedger(is_local : ?Bool) : ICRC1Ledger {
        let local = switch (is_local) {
            case (?l) { l };
            case null { false };
        };
        if (local) {
            LocalICPLedger
        } else {
            actor(ckUSDT_LEDGER_CANISTER) : ICRC1Ledger
        }
    };
    
    // Get ICP ledger actor
    public func getICPLedger(is_local : ?Bool) : ICRC1Ledger {
        let local = switch (is_local) {
            case (?l) { l };
            case null { false };
        };
        if (local) {
            LocalICPLedger
        } else {
            actor(ICP_LEDGER_CANISTER) : ICRC1Ledger
        }
    };
    
    // For backwards compatibility
    public func getLedger() : ICRC1Ledger {
        getCkUSDTLedger()
    };
    
    // Verify investor has sufficient balance on a specific ledger
    public func checkBalanceOnLedger(ledger: ICRC1Ledger, investor: Principal, requiredAmount: Nat, assetName: Text) : async Result.Result<Bool, Text> {
        try {
            let balance = await ledger.icrc1_balance_of({
                owner = investor;
                subaccount = null;
            });
            
             if (balance >= requiredAmount) {
                #ok(true)
            }
             else {
                #err("Insufficient " # assetName # " balance. Have: " # debug_show(balance) # ", Need: " # debug_show(requiredAmount))
            }
        } catch (e) {
            #err("Failed to check balance: " # Error.message(e))
        }
    };
    
    // Verify investor has sufficient ckUSDT balance
    public func checkBalance(investor: Principal, requiredAmount: Nat) : async Result.Result<Bool, Text> {
        await checkBalanceOnLedger(getCkUSDTLedger(), investor, requiredAmount, "ckUSDT")
    };
    
    // Verify investor has sufficient ICP balance
    public func checkICPBalance(investor: Principal, requiredAmount: Nat) : async Result.Result<Bool, Text> {
        await checkBalanceOnLedger(getICPLedger(null), investor, requiredAmount, "ICP")
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
    
    // Calculate token amount from ckUSDT payment
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
    
    // Calculate token amount from ICP payment
    // ICP has 8 decimals, farm tokens typically have 8
    // icpPriceUSD is in cents (e.g., 1000 = $10.00 per ICP)
    public func calculateTokenAmountFromICP(icpAmount: Nat, tokenPriceInCents: Nat, icpPriceUSD: Nat, tokenDecimals: Nat8) : Nat {
        // Step 1: Convert ICP amount to USD value in cents
        // icpAmount is in e8 (8 decimals), icpPriceUSD is in cents
        // usdValueCents = (icpAmount * icpPriceUSD) / 100_000_000
        let usdValueCents = (icpAmount * icpPriceUSD) / 100_000_000;
        
        // Step 2: Calculate how many tokens this USD buys
        // We want the result in the token's native decimal format
        // For 8 decimal tokens: need to scale up from cents to e8
        if (tokenDecimals == 8) {
            // usdValueCents is in cents (no decimals)
            // tokenPriceInCents is in cents per token
            // Result: (usdValueCents / tokenPriceInCents) * 10^8
            // Reorder to avoid precision loss: (usdValueCents * 10^8) / tokenPriceInCents
            (usdValueCents * 100_000_000) / tokenPriceInCents
        } else if (tokenDecimals == 6) {
            // Scale to 6 decimals: (usdValueCents * 10^6) / tokenPriceInCents
            (usdValueCents * 1_000_000) / tokenPriceInCents
        } else {
            // No decimals: just divide
            usdValueCents / tokenPriceInCents
        }
    };
    
    // Check ICRC-2 allowance
    public func checkAllowance(
        ledger: ICRC1Ledger,
        owner: Account,
        spender: Account
    ) : async Result.Result<Allowance, Text> {
        try {
            let allowance = await ledger.icrc2_allowance({
                account = owner;
                spender = spender;
            });
            #ok(allowance)
        } catch (e) {
            #err("Failed to check allowance: " # Error.message(e))
        }
    };
    
    // Pull payment using ICRC-2 transfer_from
    public func pullPayment(
        ledger: ICRC1Ledger,
        from: Account,
        to: Account,
        amount: Nat,
        memo: Text
    ) : async Result.Result<Nat, Text> {
        try {
            let transferFromArgs : TransferFromArgs = {
                spender_subaccount = null;
                from = from;
                to = to;
                amount = amount;
                fee = null;  // Use default
                memo = ?Text.encodeUtf8(memo);
                created_at_time = ?Nat64.fromIntWrap(Time.now());
            };
            
            let result = await ledger.icrc2_transfer_from(transferFromArgs);
            
            switch (result) {
                case (#Ok(blockIndex)) {
                    #ok(blockIndex)
                };
                case (#Err(#InsufficientAllowance(details))) {
                    #err("Insufficient allowance. Approved: " # debug_show(details.allowance) # ", Needed: " # debug_show(amount))
                };
                case (#Err(#InsufficientFunds(details))) {
                    #err("Insufficient funds. Balance: " # debug_show(details.balance))
                };
                case (#Err(error)) {
                    #err("Payment transfer failed: " # debug_show(error))
                };
            }
        } catch (e) {
            #err("Failed to pull payment: " # Error.message(e))
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
                created_at_time = ?Nat64.fromIntWrap(Time.now());
            };
            
            // Note: This requires the backend canister to be authorized to transfer from escrow
            let result = await farmLedger.icrc1_transfer(transferArgs);
            
            switch (result) {
                case (#Ok(blockIndex)) {
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
