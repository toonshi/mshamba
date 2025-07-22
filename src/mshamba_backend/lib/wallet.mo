import Array "mo:base/Array";
import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Nat "mo:base/Nat";
import Int "mo:base/Int";
import Types "./types";
import Result "./utils";
import HashMap "mo:base/HashMap";
import Debug "mo:base/Debug";
import Error "mo:base/Error";
import Nat64 "mo:base/Nat64";
import Float "mo:base/Float";
import Int64 "mo:base/Int64";

// Custom Result type that can handle two type parameters
module Result2 = {
    public type Result2<T, E> = {
        #ok : T;
        #err : E;
    };
};

// Named module to properly export functions
module Wallet {
    // ICP token configuration (1 ICP = 100,000,000 e8s)
    private let ICP_E8S_PER_ICP : Nat64 = 100_000_000;
    
    // Helper function to get current time in milliseconds as Int
    private func currentTimeMillis(): Int {
        Time.now() / 1_000_000 // Convert to milliseconds
    };
    
    // Helper function to convert Nat64 to Nat for operations that require Nat
    private func toNat(n: Nat64): Nat {
        Nat64.toNat(n)
    };
    
    // Helper function to convert Nat to Nat64
    private func toNat64(n: Nat): Nat64 {
        Nat64.fromNat(n)
    };
    
    // Helper function to create a transaction ID from a timestamp
    private func createTransactionId(walletId: Principal, timestamp: Int): Text {
        Principal.toText(walletId) # "_" # Int.toText(timestamp)
    };

    // Create a new wallet for a user
    public func createWallet(
        user: Principal
    ): Types.Wallet {
        let now = currentTimeMillis();
        let newWallet: Types.Wallet = {
            id = user;
            balance = 0;
            transactions = [];
            createdAt = now; // now is already Int
        };
        newWallet
    };

    // Get or create a user's wallet
    public func getOrCreateWallet(
        wallets: HashMap.HashMap<Principal, Types.Wallet>,
        user: Principal
    ): Types.Wallet {
        switch (wallets.get(user)) {
            case (?wallet) { wallet };
            case (null) {
                let newWallet = createWallet(user);
                // Note: We can't modify the HashMap here as it's not mutable
                // The caller needs to handle putting the wallet in the map
                newWallet
            };
        }
    };

    // Record a transaction (returns a new wallet with the transaction added)
    private func recordTransaction(
        wallet: Types.Wallet,
        transactionType: Types.TransactionType,
        amount: Nat,
        from: Principal,
        to: Principal,
        description: Text
    ): Types.Wallet {
        let now = currentTimeMillis();
        let newTransaction: Types.Transaction = {
            id = createTransactionId(wallet.id, now);
            timestamp = now; // now is already Int
            transactionType = transactionType;
            from = from;
            to = to;
            amount = amount;
            description = description;
        };
        
        let updatedTransactions = Array.append(wallet.transactions, [newTransaction]);
        {
            id = wallet.id;
            balance = wallet.balance;
            transactions = updatedTransactions;
            createdAt = wallet.createdAt;
        }
    };

    // Deposit ICP tokens into a wallet
    public func depositICP(
        wallets: HashMap.HashMap<Principal, Types.Wallet>,
        user: Principal,
        amount: Nat64, // Amount in e8s (ICP's smallest unit)
        description: Text
    ): Result2.Result2<Types.Wallet, Text> {
        // In a real implementation, this would verify the ICP transfer from the user's wallet
        // For MVP, we'll simulate the deposit
        let wallet = getOrCreateWallet(wallets, user);
        
        // Safe addition (Nat + Nat is safe in Motoko)
        let updatedBalance = wallet.balance + Nat64.toNat(amount);
        
        let updatedWallet = recordTransaction(wallet, #deposit, Nat64.toNat(amount), user, user, description);
        let finalWallet = { updatedWallet with balance = updatedBalance };
        
        // Return the updated wallet - the caller needs to update the HashMap
        #ok(finalWallet)
    };

    // Withdraw ICP tokens from a wallet
    public func withdrawICP(
        wallets: HashMap.HashMap<Principal, Types.Wallet>,
        user: Principal,
        amount: Nat64, // Amount in e8s (ICP's smallest unit)
        toAddress: Text, // ICP address to withdraw to
        description: Text
    ): Result2.Result2<Types.Wallet, Text> {
        // Get or create the wallet (consistent with deposit behavior)
        let wallet = getOrCreateWallet(wallets, user);
        
        let amountNat = Nat64.toNat(amount);
        if (wallet.balance < amountNat) {
            return #err("Insufficient balance.");
        };
        
        // In a real implementation, this would initiate an ICP transfer
        // For MVP, we'll just update the balance
        // Safe subtraction since we've already checked the balance
        let updatedBalance = wallet.balance - amountNat;
        let updatedWallet = recordTransaction(wallet, #withdrawal, amountNat, user, user, description);
        let finalWallet = { updatedWallet with balance = updatedBalance };
        
        // Return the updated wallet - the caller needs to update the HashMap
        #ok(finalWallet)
    };

    // Get wallet balance
    public func getBalance(
        wallets: HashMap.HashMap<Principal, Types.Wallet>,
        user: Principal
    ): Result2.Result2<Nat, Text> {
        switch (wallets.get(user)) {
            case (?wallet) { #ok(wallet.balance) };
            case (null) { #err("Wallet not found.") };
        }
    };
    


    // Transfer tokens between users (internal to the platform)
    public func transfer(
        wallets: HashMap.HashMap<Principal, Types.Wallet>,
        fromUser: Principal,
        toUser: Principal,
        amount: Nat,
        description: Text
    ): Result2.Result2<(Types.Wallet, Types.Wallet), Text> {
        switch (wallets.get(fromUser), wallets.get(toUser)) {
            case (?fromWallet, ?toWallet) {
                if (fromWallet.balance < amount) {
                    return #err("Insufficient balance");
                };
                
                // Update sender's wallet
                let updatedFromBalance = fromWallet.balance - amount;
                let updatedFromWallet = recordTransaction(fromWallet, #withdrawal, amount, fromUser, toUser, description);
                let finalFromWallet = { updatedFromWallet with balance = updatedFromBalance };
                
                // Update recipient's wallet
                let updatedToBalance = toWallet.balance + amount;
                let updatedToWallet = recordTransaction(toWallet, #deposit, amount, fromUser, toUser, description);
                let finalToWallet = { updatedToWallet with balance = updatedToBalance };
                
                // Return both updated wallets - the caller needs to update the HashMap
                #ok((finalFromWallet, finalToWallet))
            };
            case (null, _) { #err("Sender wallet not found") };
            case (_, null) { #err("Recipient wallet not found") };
        }
    };

    // Lock tokens for investment (temporarily hold them)
    public func lockTokens(
        wallets: HashMap.HashMap<Principal, Types.Wallet>,
        user: Principal,
        amount: Nat
    ): Result2.Result2<(), Text> {
        // This would be implemented to lock tokens for pending transactions
        // For MVP, we'll just check the balance
        switch (wallets.get(user)) {
            case (?wallet) {
                if (wallet.balance < amount) {
                    #err("Insufficient balance")
                } else {
                    #ok(())
                }
            };
            case (null) { #err("Wallet not found") };
        }
    };


};