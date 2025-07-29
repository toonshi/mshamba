import Trie "mo:base/Trie";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Time "mo:base/Time";
import Result "mo:base/Result";
// import Debug "mo:base/Debug";
import Principal "mo:base/Principal";
import Int "mo:base/Int";
import Array "mo:base/Array";

import FarmToken "lib/farm_tokens";

persistent actor class Mshamba() = this {

  type Farm = {
    id : Text;
    name : Text;
    description : Text;
    location : Text;
    fundingGoal : Nat;
    totalRaised : Nat;
    sharePrice : Nat;
    createdAt : Int;
    owner : Principal;
  };

  type Investment = {
    investor : Principal;
    farmId : Text;
    amount : Nat;
    timestamp : Int;
  };

  transient var farms : Trie.Trie<Text, Farm> = Trie.empty();
  transient var investments : Trie.Trie<Text, [Investment]> = Trie.empty();
  transient var farmTokens : Trie.Trie<Text, FarmToken.Token> = Trie.empty();

  public shared({ caller }) func createFarm(
    name : Text,
    description : Text,
    location : Text,
    fundingGoal : Nat,
    sharePrice : Nat
  ) : async Result.Result<Text, Text> {
    let farmId = "farm-" # Int.toText(Time.now());
    let farm : Farm = {
      id = farmId;
      name = name;
      description = description;
      location = location;
      fundingGoal = fundingGoal;
      totalRaised = 0;
      sharePrice = sharePrice;
      createdAt = Time.now();
      owner = caller;
    };

    let key = { key = farmId; hash = Text.hash(farmId) };
    let (updatedFarms, _) = Trie.put(farms, key, Text.equal, farm);
    farms := updatedFarms;

    // Initialize token for the farm
    let token = FarmToken.newToken(farmId);
    let (updatedTokens, _) = Trie.put(farmTokens, key, Text.equal, token);
    farmTokens := updatedTokens;

    return #ok(farmId);
  };

  public query func getFarm(farmId : Text) : async Result.Result<Farm, Text> {
    let key = { key = farmId; hash = Text.hash(farmId) };
    switch (Trie.get(farms, key, Text.equal)) {
      case (?farm) #ok(farm);
      case null #err("Farm not found");
    }
  };

  public query func getAllFarms() : async [Farm] {
    Trie.toArray<Text, Farm, Farm>(farms, func (_, farm) { farm })
  };

  public shared({ caller }) func investInFarm(farmId : Text, amount : Nat) : async Result.Result<Text, Text> {
    let key = { key = farmId; hash = Text.hash(farmId) };

    switch (Trie.get(farms, key, Text.equal)) {
      case null return #err("Farm not found");
      case (?farm) {
        if (farm.totalRaised + amount > farm.fundingGoal) {
          return #err("Investment exceeds funding goal");
        };

        if (farm.sharePrice == 0) {
          return #err("Invalid share price");
        };

        let updatedFarm = { farm with totalRaised = farm.totalRaised + amount };
        let (newFarms, _) = Trie.put(farms, key, Text.equal, updatedFarm);
        farms := newFarms;

        let investment : Investment = {
          investor = caller;
          farmId = farmId;
          amount = amount;
          timestamp = Time.now();
        };

        let invKey = { key = farmId; hash = Text.hash(farmId) };
        let current = switch (Trie.get(investments, invKey, Text.equal)) {
          case (?inv) inv;
          case null [];
        };
        let (newInvTrie, _) = Trie.put(investments, invKey, Text.equal, Array.append(current, [investment]));
        investments := newInvTrie;

        switch (Trie.get(farmTokens, key, Text.equal)) {
          case null return #err("Farm token not initialized");
          case (?token) {
            switch (FarmToken.mintFarmTokens(
              farmId,
              caller,
              amount,
              farm.sharePrice,
              token.tokens,
              token.balances
            )) {
              case (#ok(_)) {
                let (updatedTokensTrie, _) = Trie.put(farmTokens, key, Text.equal, token);
                farmTokens := updatedTokensTrie;
              };
              case (#err(e)) return #err("Token mint failed: " # e);
            };
          };
        };

        return #ok("Investment successful");
      };
    };
  };

  public query func getFarmInvestments(farmId : Text) : async [Investment] {
    let key = { key = farmId; hash = Text.hash(farmId) };
    switch (Trie.get(investments, key, Text.equal)) {
      case (?inv) inv;
      case null [];
    }
  };

  public shared({ caller }) func getMyBalance(farmId : Text) : async Result.Result<Nat, Text> {
    let key = { key = farmId; hash = Text.hash(farmId) };
    switch (Trie.get(farmTokens, key, Text.equal)) {
      case (?token) {
        let balance = FarmToken.getTokenBalance(caller, farmId, token.balances);
        #ok(balance);
      };
      case null #err("No token found for this farm");
    }
  };
};
