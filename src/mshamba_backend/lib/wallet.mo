import Array "mo:base/Array";
import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Nat "mo:base/Nat";
import Int "mo:base/Int";
import Types "./types";
import HashMap "mo:base/HashMap";
import Debug "mo:base/Debug";
import Error "mo:base/Error";
import Nat64 "mo:base/Nat64";
import Result "mo:base/Result";
import Text "mo:base/Text";

module {

  // Wallet module implementation
  // ICP token configuration (1 ICP = 100,000,000 e8s)
  private let ICP_E8S_PER_ICP : Nat64 = 100_000_000;
  
  // Helper function to get current time in milliseconds as Int
  private func currentTimeMillis() : Int {
    Time.now() / 1_000_000 // Convert to milliseconds
  };
  
  // Helper function to create a transaction ID from a timestamp
  private func createTransactionId(walletId: Principal, timestamp: Int) : Text {
    Principal.toText(walletId) # "_" # Int.toText(timestamp)
  };

  // Create or get an existing wallet for a user
  public func getOrCreateWallet(
    wallets: HashMap.HashMap<Principal, Types.Wallet>,
    user: Principal
  ) : Types.WalletResult {
    switch (wallets.get(user)) {
      case (?wallet) { #ok(wallet) };
      case (null) {
        let newWallet : Types.Wallet = {
          id = user;
          balance = 0;
          transactions = [];
          createdAt = currentTimeMillis();
        };
        wallets.put(user, newWallet);
        #ok(newWallet);
      };
    }
  };

  // Deposit ICP tokens to a wallet
  public func depositICP(
    wallets: HashMap.HashMap<Principal, Types.Wallet>,
    user: Principal,
    amount: Nat64,
    description: Text
  ) : Types.WalletResult {
    switch (getOrCreateWallet(wallets, user)) {
      case (#err(msg)) { #err(msg) };
      case (#ok(wallet)) {
        let amountNat = Nat64.toNat(amount);
        let updatedWallet = {
          wallet with
          balance = wallet.balance + amountNat;
          transactions = Array.append(wallet.transactions, [{
            id = createTransactionId(user, currentTimeMillis());
            timestamp = currentTimeMillis();
            transactionType = #deposit;
            from = user; // In a real implementation, this would be the sender's principal
            to = user;
            amount = amountNat;
            description = description;
          }]);
        };
        wallets.put(user, updatedWallet);
        #ok(updatedWallet);
      };
    }
  };

  // Withdraw ICP tokens from a wallet
  public func withdrawICP(
    wallets: HashMap.HashMap<Principal, Types.Wallet>,
    user: Principal,
    amount: Nat64,
    description: Text
  ) : Types.WalletResult {
    switch (wallets.get(user)) {
      case (null) { #err("Wallet not found") };
      case (?wallet) {
        let amountNat = Nat64.toNat(amount);
        if (wallet.balance < amountNat) {
          return #err("Insufficient balance");
        };
        
        let updatedWallet = {
          wallet with
          balance = wallet.balance - amountNat;
          transactions = Array.append(wallet.transactions, [{
            id = createTransactionId(user, currentTimeMillis());
            timestamp = currentTimeMillis();
            transactionType = #withdrawal;
            from = user;
            to = user; // In a real implementation, this would be the recipient's principal
            amount = amountNat;
            description = description;
          }]);
        };
        wallets.put(user, updatedWallet);
        #ok(updatedWallet);
      };
    }
  };
  
  // Transfer tokens between users (internal to the platform)
  public func transfer(
    wallets: HashMap.HashMap<Principal, Types.Wallet>,
    fromUser: Principal,
    toUser: Principal,
    amount: Nat,
    description: Text
  ) : Types.WalletResult {
    switch (getOrCreateWallet(wallets, fromUser), getOrCreateWallet(wallets, toUser)) {
      case (#err(msg), _) { #err("Error getting sender wallet: " # msg) };
      case (_, #err(msg)) { #err("Error getting recipient wallet: " # msg) };
      case (#ok(fromWallet), #ok(toWallet)) {
        if (fromWallet.balance < amount) {
          return #err("Insufficient balance");
        };
        
        // Update sender's wallet
        let updatedFromBalance = fromWallet.balance - amount;
        let updatedFromTransactions = Array.append(fromWallet.transactions, [{
          id = createTransactionId(fromUser, currentTimeMillis());
          timestamp = currentTimeMillis();
          transactionType = #transferOut;
          from = fromUser;
          to = toUser;
          amount = amount;
          description = description;
        }]);
        let updatedFromWallet = {
          fromWallet with
          balance = updatedFromBalance;
          transactions = updatedFromTransactions;
        };
        
        // Update recipient's wallet
        let updatedToBalance = toWallet.balance + amount;
        let updatedToTransactions = Array.append(toWallet.transactions, [{
          id = createTransactionId(toUser, currentTimeMillis());
          timestamp = currentTimeMillis();
          transactionType = #transferIn;
          from = fromUser;
          to = toUser;
          amount = amount;
          description = description;
        }]);
        let updatedToWallet = {
          toWallet with
          balance = updatedToBalance;
          transactions = updatedToTransactions;
        };
        
        // Update both wallets in the HashMap
        wallets.put(fromUser, updatedFromWallet);
        wallets.put(toUser, updatedToWallet);
        
        // Return success with the updated from wallet
        #ok(updatedFromWallet);
      };
    }
  };

  // Lock tokens for investment (temporarily hold them)
  public func lockTokens(
    wallets: HashMap.HashMap<Principal, Types.Wallet>,
    user: Principal,
    amount: Nat
  ) : Result.Result<(), Text> {
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

  // Get transaction history for a wallet
  public func getTransactionHistory(
    wallets: HashMap.HashMap<Principal, Types.Wallet>,
    user: Principal
  ) : Types.WalletResult {
    switch (wallets.get(user)) {
      case (?wallet) { #ok(wallet) };
      case (null) { #err("Wallet not found") };
    }
  };

  // Get total number of wallets (for admin purposes)
  public func getTotalWallets(
    wallets: HashMap.HashMap<Principal, Types.Wallet>
  ) : Nat {
    wallets.size()
  };

  // Helper function to record a transaction
  private func recordTransaction(
    wallet: Types.Wallet,
    transactionType: Types.TransactionType,
    amount: Nat,
    from: Principal,
    to: Principal,
    description: Text
  ): Types.Wallet {
    let transaction: Types.Transaction = {
      id = createTransactionId(wallet.id, currentTimeMillis());
      timestamp = currentTimeMillis();
      transactionType = transactionType;
      from = from;
      to = to;
      amount = amount;
      description = description;
    };
    let updatedTransactions = Array.append(wallet.transactions, [transaction]);
    { wallet with transactions = updatedTransactions }
  };

};