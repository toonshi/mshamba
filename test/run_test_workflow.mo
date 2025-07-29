import Principal "mo:base/Principal";
import Debug "mo:base/Debug";

// Import the test workflow
import TestWorkflow "test_workflow";

actor {
  public func run() : async Text {
    // Get the mshamba_backend canister (deployed as a dependency)
    let mshambaBackend = actor ("rrkah-fqaaa-aaaaa-aaaaq-cai") : actor {
      // Define the minimal interface needed for testing
      upsertProfile : (Text, Text, {#Investor; #Farmer; #LandOwner; #SupplyPartner; #Admin}, Text, Text) -> async {
        #ok : {
          id : Text;
          name : Text;
          userType : {#Investor; #Farmer; #LandOwner; #SupplyPartner; #Admin};
          bio : Text;
          avatar : Text;
          createdAt : Int;
          updatedAt : Int;
        };
        #err : Text;
      };
      getMyWallet : () -> async {
        #ok : {
          id : Text;
          owner : Principal;
          balance : Nat;
          lockedBalance : Nat;
          transactions : [{
            id : Text;
            amount : Nat;
            transactionType : {#Deposit; #Withdrawal; #Transfer; #Lock; #Unlock};
            description : Text;
            timestamp : Int;
            status : {#Pending; #Completed; #Failed};
          }];
          createdAt : Int;
          updatedAt : Int;
        };
        #err : Text;
      };
      depositToMyWallet : (Nat, Text) -> async {
        #ok : {
          id : Text;
          owner : Principal;
          balance : Nat;
          lockedBalance : Nat;
          transactions : [{
            id : Text;
            amount : Nat;
            transactionType : {#Deposit; #Withdrawal; #Transfer; #Lock; #Unlock};
            description : Text;
            timestamp : Int;
            status : {#Pending; #Completed; #Failed};
          }];
          createdAt : Int;
          updatedAt : Int;
        };
        #err : Text;
      };
      withdrawFromMyWallet : (Nat, Text) -> async {
        #ok : {
          id : Text;
          owner : Principal;
          balance : Nat;
          lockedBalance : Nat;
          transactions : [{
            id : Text;
            amount : Nat;
            transactionType : {#Deposit; #Withdrawal; #Transfer; #Lock; #Unlock};
            description : Text;
            timestamp : Int;
            status : {#Pending; #Completed; #Failed};
          }];
          createdAt : Int;
          updatedAt : Int;
        };
        #err : Text;
      };
      transferToUser : (Principal, Nat, Text) -> async {
        #ok : Bool;
        #err : Text;
      };
      createFarm : (Text, Text, Text, Nat, Nat, Nat) -> async {
        #ok : {
          id : Text;
          name : Text;
          description : Text;
          location : Text;
          size : Nat;
          valuation : Nat;
          availableShares : Nat;
          totalShares : Nat;
          owner : Principal;
          status : {#Active; #Inactive; #SoldOut; #Completed};
          createdAt : Int;
          updatedAt : Int;
        };
        #err : Text;
      };
      investInFarm : (Text, Nat) -> async {
        #ok : ();
        #err : Text;
      };
      getTokenBalance : (Text) -> async Nat;
      transferTokens : (Text, Principal, Nat) -> async {
        #ok : ();
        #err : Text;
      };
      getSystemStatus : () -> async Text;
    };

    // Create a new test instance with the mshamba backend
    let testWorkflow = await TestWorkflow.Tester(mshambaBackend);
    
    // Run the tests and return the results
    await testWorkflow.runTests()
  };
};
