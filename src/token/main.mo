import Nat "mo:base/Nat";
import Principal "mo:base/Principal";
import Time "mo:base/Time";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";

actor class MshambaToken(args : {
  token_name : Text;
  token_symbol : Text;
  farmer_principal : Principal;
  initial_supply : Nat;
  transfer_fee : Nat;
  initial_allocations : [{ owner : Principal; allocation : Nat }];
  vesting_schedule : {
    vesting_period_days : Nat;
    start_date : Time.Time;
    total_vested_amount : Nat;
  };
}) = {

  // --- Types inside actor
  type VestingSchedule = {
    vesting_period_days : Nat;
    start_date : Time.Time;
    total_vested_amount : Nat;
  };
  type Allocation = { owner : Principal; allocation : Nat };

  // --- State variables
  stable var tokenName : Text = args.token_name;
  stable var tokenSymbol : Text = args.token_symbol;
  stable var totalSupply : Nat = args.initial_supply;
  stable var farmerPrincipal : Principal = args.farmer_principal;
  stable var transferFee : Nat = args.transfer_fee;

  stable var balancesEntries : [(Principal, Nat)] = [];
  var balances = HashMap.HashMap<Principal, Nat>(10, Principal.equal, Principal.hash);

  stable var vestingSchedule : VestingSchedule = args.vesting_schedule;

  stable var revenueGrowth : Nat = 0;
  stable var yieldImprovement : Nat = 0;

  // Constructor logic
  do {
    for (allocation in args.initial_allocations.vals()) {
      balances.put(allocation.owner, allocation.allocation);
    };
  };

  // Upgrade hooks
  system func preupgrade() {
    balancesEntries := Iter.toArray(balances.entries());
  };

  system func postupgrade() {
    balances := HashMap.fromIter<Principal, Nat>(
      balancesEntries.vals(),
      10,
      Principal.equal,
      Principal.hash
    );
  };

  // --- Queries
  public query func name() : async Text { tokenName };

  public query func symbol() : async Text { tokenSymbol };

  public query func getBalance(owner : Principal) : async Nat {
    switch (balances.get(owner)) {
      case (?balance) balance;
      case null 0;
    }
  };

  // --- State-changing methods
  public shared func transfer(from : Principal, to : Principal, amount : Nat) : async {#ok : Bool; #err : Text} {
    let fromBalance = await getBalance(from);
    if (fromBalance >= amount) {
      balances.put(from, fromBalance - amount);
      let toBalance = await getBalance(to);
      balances.put(to, toBalance + amount);
      #ok(true)
    } else {
      #err("Insufficient balance")
    }
  };

  public shared func controlledMint(amount : Nat) : async {#ok : Bool; #err : Text} {
    if (revenueGrowth >= 20 and yieldImprovement >= 15) {
      totalSupply += amount;
      let farmerBal = await getBalance(farmerPrincipal);
      balances.put(farmerPrincipal, farmerBal + amount);
      #ok(true)
    } else {
      #err("Minting conditions not met")
    }
  };

  public query func getVestedAmount(owner : Principal) : async Nat {
    // Placeholder vesting logic
    0
  };
};
