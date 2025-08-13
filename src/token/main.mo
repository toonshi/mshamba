import Nat         "mo:base/Nat";
import Int         "mo:base/Int";
import Time        "mo:base/Time";
import Principal   "mo:base/Principal";
import HashMap     "mo:base/HashMap";
import Iter        "mo:base/Iter";
import Debug       "mo:base/Debug";

// ------- Actor Class (Token) -------
actor class MshambaToken(args : {
  token_name       : Text;
  token_symbol     : Text;
  farmer_principal : Principal;
  initial_supply   : Nat;
  transfer_fee     : Nat;
  initial_allocations : [{ owner : Principal; allocation : Nat }];

  // Phase 1: reserve lives internally, not as an external address
  reserve_amount   : Nat;

  vesting_schedule : {
    vesting_period_days : Nat;
    start_date          : Time.Time;
  };

  // Principal allowed to: move reserve + toggle KPI boosts
  governance_principal : ?Principal;
}) = {

  // -------- Types --------
  type Allocation = { owner : Principal; allocation : Nat };
  type Vesting    = { total_locked : Nat; claimed : Nat };

  // -------- Stable State --------
  stable var tokenName     : Text       = args.token_name;
  stable var tokenSymbol   : Text       = args.token_symbol;
  stable var totalSupply   : Nat        = args.initial_supply;
  stable var transferFee   : Nat        = args.transfer_fee;
  stable var farmer        : Principal  = args.farmer_principal;

  // Balances
  stable var balancesEntries : [(Principal, Nat)] = [];
  var balances = HashMap.HashMap<Principal, Nat>(32, Principal.equal, Principal.hash);

  // Reserve vault
  stable var reserveBalance : Nat = args.reserve_amount;

  // Vesting: we vest ONLY the farmer’s allocation in Phase 1
  stable var vestingSchedule_days : Nat       = args.vesting_schedule.vesting_period_days;
  stable var vestingStart         : Time.Time = args.vesting_schedule.start_date;
  stable var farmerVesting : Vesting = {
    total_locked = 0; // filled in constructor
    claimed      = 0;
  };

  // KPI gates (settable by governance)
  stable var kpiRevenueGrowth : Nat = 0; // %
  stable var kpiYieldImprove  : Nat = 0; // %
  stable var kpiBoostActive   : Bool = false;

  // Governance principal
  stable var governance : ?Principal = args.governance_principal;

  // -------- Constructor logic --------
  do {
    // initialize balances (farmer + investors)
    var farmerInitial : Nat = 0;

    for (a in args.initial_allocations.vals()) {
      let prev = switch (balances.get(a.owner)) { case (?x) x; case null 0 };
      balances.put(a.owner, prev + a.allocation);
      if (a.owner == farmer) { farmerInitial += a.allocation };
    };

    // lock 100% of the farmer’s initial allocation for vesting
    if (farmerInitial > 0) {
      let current = switch (balances.get(farmer)) { case (?x) x; case null 0 };
      if (current != farmerInitial) {
        Debug.trap("Invariant failed: farmer allocation mismatch");
      };
      balances.put(farmer, 0);
      farmerVesting := { total_locked = farmerInitial; claimed = 0 };
    };
  };

  // -------- Upgrade hooks --------
  system func preupgrade() {
    balancesEntries := Iter.toArray(balances.entries());
  };
  system func postupgrade() {
    balances := HashMap.fromIter<Principal, Nat>(
      balancesEntries.vals(), 32, Principal.equal, Principal.hash
    );
  };

  // -------- Queries --------
  public query func name()   : async Text { tokenName };
  public query func symbol() : async Text { tokenSymbol };
  public query func total_supply() : async Nat { totalSupply };

  public query func balance_of(owner : Principal) : async Nat {
    switch (balances.get(owner)) { case (?b) b; case null 0 };
  };

  public query func reserve_balance() : async Nat { reserveBalance };

  // How much farmer COULD claim now (based on time + KPI boost) minus already claimed
  public query func farmer_vested_available_now() : async Nat {
    vestedAvailableNow()
  };

  // -------- Transfers (simple, no fee charging in Phase 1) --------
  public shared ({ caller }) func transfer(to : Principal, amount : Nat) : async { #ok : Bool; #err : Text } {
    let from = caller;
    let fromBal = await balance_of(from);
    if (fromBal < amount) return #err("Insufficient balance");

    balances.put(from, fromBal - amount);
    let toBal = await balance_of(to);
    balances.put(to, toBal + amount);
    #ok(true)
  };

  // -------- Reserve vault (governance-gated) --------
  public shared ({ caller }) func spend_reserve(to : Principal, amount : Nat) : async { #ok : Bool; #err : Text } {
    if (not isGovernance(caller)) return #err("Unauthorized: governance only");
    if (reserveBalance < amount) return #err("Reserve: insufficient");

    reserveBalance -= amount;
    let toBal = await balance_of(to);
    balances.put(to, toBal + amount);
    #ok(true)
  };

  // -------- Governance helpers --------
  func isGovernance(p : Principal) : Bool {
    switch (governance) { case (?g) g == p; case null false }
  };

  public shared ({ caller }) func set_governance(p : Principal) : async { #ok : Bool; #err : Text } {
    // allow only current governance (or, if unset, the farmer) to set this
    let canSet =
      switch (governance) {
        case (?g) g == caller;
        case null  caller == farmer;
      };
    if (not canSet) return #err("Unauthorized");
    governance := ?p;
    #ok(true)
  };

  // -------- KPI updates (only governance) --------
  public shared ({ caller }) func update_kpis(revenueGrowthPct : Nat, yieldImprovePct : Nat, activateBoost : Bool)
    : async { #ok : Bool; #err : Text } {
    if (not isGovernance(caller)) return #err("Unauthorized: governance only");
    kpiRevenueGrowth := revenueGrowthPct;
    kpiYieldImprove  := yieldImprovePct;
    // whitepaper thresholds: revenue >20%, yield >15% → allow boost
    kpiBoostActive := activateBoost and (revenueGrowthPct >= 20 and yieldImprovePct >= 15);
    #ok(true)
  };

  // -------- Vesting (farmer) --------
  // Uses Int arithmetic and returns Nat via Int.abs when positive.
  func vestedAvailableNow() : Nat {
    let now = Time.now();

    // If vesting period is zero → everything unlocked (less any already claimed)
    if (vestingSchedule_days == 0) { 
      return farmerVesting.total_locked - farmerVesting.claimed;
    };

    // elapsed in nanoseconds (Int)
    let elapsed_ns : Int = now - vestingStart;
    if (elapsed_ns <= 0) return 0;

    let day_ns : Int = 86_400_000_000_000; // 24h in ns
    let elapsed_days : Int = elapsed_ns / day_ns;

    // period_days as Int (Nat <: Int so usable directly)
    let period_days_int : Int = vestingSchedule_days;

    // base linear fraction (0..100) as Int
    let baseFractionNum : Int =
      if (elapsed_days >= period_days_int) 100
      else (elapsed_days * 100) / period_days_int;

    // KPI boost adds +10 percentage points (capped to 100)
    let boostedFractionNum : Int =
      if (kpiBoostActive and baseFractionNum < 100) {
        let x = baseFractionNum + 10;
        if (x > 100) 100 else x
      } else baseFractionNum;

    // compute entitled amount as Int (Nat used as Int automatically)
    let totalEntitledInt : Int = (farmerVesting.total_locked * boostedFractionNum) / 100;
    let claimedInt : Int = farmerVesting.claimed;

    let diffInt : Int = totalEntitledInt - claimedInt;
    if (diffInt <= 0) 0 else Int.abs(diffInt) // Int.abs returns Nat
  };

  public shared ({ caller }) func claim_vested() : async { #ok : Nat; #err : Text } {
    if (caller != farmer) return #err("Only farmer can claim vested tokens");
    let claimable = vestedAvailableNow();
    if (claimable == 0) return #err("Nothing to claim yet");
    farmerVesting := { 
      total_locked = farmerVesting.total_locked; 
      claimed = farmerVesting.claimed + claimable 
    };

    let cur = await balance_of(farmer);
    balances.put(farmer, cur + claimable);
    #ok(claimable)
  };
}
