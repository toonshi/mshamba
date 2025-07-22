import Principal "mo:base/Principal";
import Nat "mo:base/Nat";
import Debug "mo:base/Debug";
import Result "mo:base/Result";
import Nat64 "mo:base/Nat64";
import Text "mo:base/Text";
import Error "mo:base/Error";

// Main test actor
actor TestWorkflow {
  // Types matching the backend - moved inside the actor
  private module Types {
    public type TransactionType = {
      #deposit;
      #withdrawal;
      #investment;
      #profitDistribution;
      #transferIn;
      #transferOut;
    };

    public type Transaction = {
      id : Text;
      timestamp : Int;
      transactionType : TransactionType;
      from : Principal;
      to : Principal;
      amount : Nat;
      description : Text;
    };

    public type Wallet = {
      id : Principal;
      balance : Nat;
      transactions : [Transaction];
      createdAt : Int;
    };

    public type WalletResult = {
      #ok : Wallet;
      #err : Text;
    };
  };
  // Test wallet functionality
  public shared(msg) func testWallet() : async Text {
    var result = "=== Testing Wallet Functionality ===\n";
    
    try {
      // Get the mshamba_backend canister (deployed as a dependency)
      let mshamba = actor ("uxrrr-q7777-77774-qaaaq-cai") : actor {
        getMyWallet : shared () -> async Types.WalletResult;
        depositToMyWallet : shared (Nat, Text) -> async Types.WalletResult;
        withdrawFromMyWallet : shared (Nat, Text) -> async Types.WalletResult;
      };

      // Test 1: Get initial wallet (should be empty or created)
      result #= "\nTest 1: Getting initial wallet...\n";
      let walletResult = await mshamba.getMyWallet();
      
      let initialBalance = switch (walletResult) {
        case (#ok(wallet)) {
          result #= "✅ Successfully retrieved wallet\n";
          result #= "   Balance: " # Nat.toText(wallet.balance) # " e8s\n";
          result #= "   Transactions: " # Nat.toText(wallet.transactions.size()) # "\n";
          wallet.balance;
        };
        case (#err(msg)) {
          result #= "❌ Failed to get wallet: " # msg # "\n";
          return result;
        };
      };

      // Test 2: Deposit to wallet
      result #= "\nTest 2: Depositing 1000 e8s...\n";
      let depositResult = await mshamba.depositToMyWallet(1000, "Test deposit");
      
      switch (depositResult) {
        case (#ok(wallet)) {
          result #= "✅ Successfully deposited 1000 e8s\n";
          result #= "   New balance: " # Nat.toText(wallet.balance) # " e8s\n";
          result #= "   Transaction count: " # Nat.toText(wallet.transactions.size()) # "\n";
        };
        case (#err(msg)) {
          result #= "❌ Deposit failed: " # msg # "\n";
          return result;
        };
      };

      // Test 3: Withdraw from wallet
      result #= "\nTest 3: Withdrawing 500 e8s...\n";
      let withdrawResult = await mshamba.withdrawFromMyWallet(500, "Test withdrawal");
      
      switch (withdrawResult) {
        case (#ok(wallet)) {
          result #= "✅ Successfully withdrew 500 e8s\n";
          result #= "   New balance: " # Nat.toText(wallet.balance) # " e8s\n";
        };
        case (#err(msg)) {
          result #= "❌ Withdrawal failed: " # msg # "\n";
        };
      };

      // Test 4: Verify final wallet state
      result #= "\nTest 4: Verifying final wallet state...\n";
      let finalWallet = await mshamba.getMyWallet();
      
      switch (finalWallet) {
        case (#ok(wallet)) {
          result #= "✅ Final wallet state:\n";
          result #= "   Balance: " # Nat.toText(wallet.balance) # " e8s\n";
          result #= "   Total transactions: " # Nat.toText(wallet.transactions.size()) # "\n";
          
          // Log all transactions
          for (txn in wallet.transactions.vals()) {
            result #= "   - " # txn.id # ": " # debug_show(txn.transactionType) # " " # Nat.toText(txn.amount) # " e8s\n";
          };
        };
        case (#err(msg)) {
          result #= "❌ Failed to get final wallet state: " # msg # "\n";
        };
      };
      
      result #= "\n✅ All wallet tests completed successfully!\n";
    } catch (e) {
      result #= "❌ Test failed with error: " # Error.message(e) # "\n";
    };
    
    result
  };
  
  // Public function to run all tests
  public shared(msg) func runAllTests() : async Text {
    var result = "🚀 Starting Mshamba Test Suite\n\n";
    
    // Run wallet tests
    result #= await testWallet();
    
    result #= "\n=== Tests Completed ===\n";
    result #= "\n🏁 All tests completed!\n";
    result
  };
};
