import Trie "mo:base/Trie";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Time "mo:base/Time";
import Result "mo:base/Result";
import Debug "mo:base/Debug";
import Principal "mo:base/Principal";

import FarmToken "token/farm_token";

actor class Mshamba() = this {

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

  stable var farms : Trie.Trie<Text, Farm> = Trie.empty();
  stable var investments : Trie.Trie<Text, [Investment]> = Trie.empty();
  stable var farmTokens : Trie.Trie<Text, FarmToken.Token> = Trie.empty();

  public func createFarm(
    name : Text,
    description : Text,
    location : Text,
    fundingGoal : Nat,
    sharePrice : Nat
  ) : async Result.Result<Text, Text> {
    let caller = Principal.toText(Principal.fromActor(this));
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
      owner = Principal.fromText(caller);
    };

    // Store farm
    farms := Trie.put(farms, farmId, farm);

    // Initialize token for the farm
    let token = FarmToken.newToken(farmId);
    farmTokens := Trie.put(farmTokens, farmId, token);

    return #ok(farmId);
  };

  public func getFarm(farmId : Text) : async Result.Result<Farm, Text> {
    switch (Trie.get(farms, farmId)) {
      case (?farm) return #ok(farm);
      case null return #err("Farm not found");
    };
  };

  public func getAllFarms() : async [Farm] {
    Trie.toArray(farms)
    |> Array.map<Farm, Farm>(func((_, farm)) { farm })
  };

  public func investInFarm(farmId : Text, amount : Nat) : async Result.Result<Text, Text> {
    let caller = Principal.fromActor(this);

    // Retrieve the farm
    let maybeFarm = Trie.get(farms, farmId);
    switch maybeFarm {
      case null return #err("Farm not found");
      case (?farm) {
        // Check if investment would exceed goal
        if (farm.totalRaised + amount > farm.fundingGoal) {
          return #err("Investment exceeds funding goal");
        };

        // Update totalRaised
        let updatedFarm = { 
          id = farm.id;
          name = farm.name;
          description = farm.description;
          location = farm.location;
          fundingGoal = farm.fundingGoal;
          totalRaised = farm.totalRaised + amount;
          sharePrice = farm.sharePrice;
          createdAt = farm.createdAt;
          owner = farm.owner;
        };
        farms := Trie.put(farms, farmId, updatedFarm);

        // Record investment
        let investment : Investment = {
          investor = caller;
          farmId = farmId;
          amount = amount;
          timestamp = Time.now();
        };

        let current = switch (Trie.get(investments, farmId)) {
          case (?inv) inv;
          case null [];
        };

        investments := Trie.put(investments, farmId, Array.append(current, [investment]));

        // Mint tokens to investor
        switch (Trie.get(farmTokens, farmId)) {
          case (?token) {
            let tokensToMint = amount / farm.sharePrice;
            let updatedToken = FarmToken.mint(token, caller, tokensToMint);
            farmTokens := Trie.put(farmTokens, farmId, updatedToken);
          };
          case null return #err("Farm token not initialized");
        };

        return #ok("Investment successful");
      };
    };
  };

  public func getFarmInvestments(farmId : Text) : async [Investment] {
    switch (Trie.get(investments, farmId)) {
      case (?inv) inv;
      case null [];
    };
  };

  public func getMyBalance(farmId : Text) : async Result.Result<Nat, Text> {
    let caller = Principal.fromActor(this);
    switch (Trie.get(farmTokens, farmId)) {
      case (?token) return #ok(FarmToken.balanceOf(token, caller));
      case null return #err("No token found for this farm");
    };
  };
};
