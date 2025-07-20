import Time "mo:base/Time";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Nat64 "mo:base/Nat64";
import Int "mo:base/Int";
import Float "mo:base/Float";
import HashMap "mo:base/HashMap";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Result "mo:base/Result";
import Option "mo:base/Option";
import Debug "mo:base/Debug";

// Simplified ICRC-2 style implementation using standard Motoko

// Farm Token Canister - Individual ICRC-2 token for each farm
actor class FarmToken(
  init_args: {
    farmId: Text;
    farmName: Text;
    symbol: Text;
    decimals: Nat8;
    fee: Nat;
    initial_supply: Nat;
    minting_account: Principal;
    logo: ?Text;
  }
) = this {

  // ICRC-1 initialization
  let default_icrc1_args : ICRC1.InitArgs = {
    name = ?init_args.farmName;
    symbol = ?init_args.symbol;
    logo = init_args.logo;
    decimals = ?init_args.decimals;
    fee = ?#Fixed(init_args.fee);
    minting_account = ?{
      owner = init_args.minting_account;
      subaccount = null;
    };
    max_supply = null;
    min_burn_amount = ?10_000;
    max_memo = ?64;
    advanced_settings = null;
    metadata = null;
    fee_collector = null;
    transaction_window = null;
    permitted_drift = null;
    max_accounts = ?100_000;
    settle_to_accounts = ?99_000;
  };

  // ICRC-2 initialization  
  let default_icrc2_args : ICRC2.InitArgs = {
    max_approvals_per_account = ?10_000;
    max_allowance = ?#TotalSupply;
    fee = ?#ICRC1;
    advanced_settings = null;
    max_approvals = ?10_000_000;
    settle_to_approvals = ?9_000_000;
  };

  // Initialize ICRC-1 state
  stable var icrc1_migration_state = ICRC1.init(
    ICRC1.initialState(), 
    #v0_1_0(#id), 
    ?default_icrc1_args, 
    init_args.minting_account
  );

  // Initialize ICRC-2 state  
  stable var icrc2_migration_state = ICRC2.init(
    ICRC2.initialState(),
    #v0_1_0(#id), 
    ?default_icrc2_args,
    init_args.minting_account
  );

  // ICRC-1 instance
  private var _icrc1 : ?ICRC1.ICRC1 = null;

  private func get_icrc1_environment() : ICRC1.Environment {
    {
      get_time = null;
      get_fee = null;
      add_ledger_transaction = null;
      can_transfer = null;
    }
  };

  func icrc1() : ICRC1.ICRC1 {
    switch(_icrc1) {
      case(null) {
        let initclass : ICRC1.ICRC1 = ICRC1.ICRC1(
          ?icrc1_migration_state, 
          Principal.fromActor(this), 
          get_icrc1_environment()
        );
        _icrc1 := ?initclass;
        initclass;
      };
      case(?val) val;
    }
  };

  // ICRC-2 instance
  private var _icrc2 : ?ICRC2.ICRC2 = null;

  private func get_icrc2_environment() : ICRC2.Environment {
    {
      icrc1 = icrc1();
      get_fee = null;
    }
  };

  func icrc2() : ICRC2.ICRC2 {
    switch(_icrc2) {
      case(null) {
        let initclass : ICRC2.ICRC2 = ICRC2.ICRC2(
          ?icrc2_migration_state, 
          Principal.fromActor(this), 
          get_icrc2_environment()
        );
        _icrc2 := ?initclass;
        initclass;
      };
      case(?val) val;
    }
  };

  // Farm-specific metadata
  public type FarmMetadata = {
    farmId: Text;
    location: Text;
    cropType: Text;
    sizeInAcres: Nat;
    expectedYield: Float;
    valuation: Nat;
    created_at: Int;
  };

  stable var farm_metadata : FarmMetadata = {
    farmId = init_args.farmId;
    location = "";
    cropType = "";
    sizeInAcres = 0;
    expectedYield = 0.0;
    valuation = 0;
    created_at = Time.now();
  };

  // Profit distribution tracking
  public type ProfitDistribution = {
    id: Text;
    totalProfit: Nat;
    distributionDate: Int;
    profitPerToken: Float;
  };

  stable var profit_distributions : [ProfitDistribution] = [];

  // System functions for upgrade
  system func preupgrade() {
    icrc1_migration_state := icrc1().migrate();
    icrc2_migration_state := icrc2().migrate();
  };

  system func postupgrade() {
    icrc1_migration_state := ICRC1.init(
      ICRC1.initialState(), 
      #v0_1_0(#id), 
      ?default_icrc1_args, 
      init_args.minting_account
    );
    icrc2_migration_state := ICRC2.init(
      ICRC2.initialState(),
      #v0_1_0(#id), 
      ?default_icrc2_args,
      init_args.minting_account
    );
    ignore icrc1();
    ignore icrc2();
  };

  // ICRC-1 Standard Functions
  public query func icrc1_name() : async Text {
    icrc1().name()
  };

  public query func icrc1_symbol() : async Text {
    icrc1().symbol()
  };

  public query func icrc1_decimals() : async Nat8 {
    icrc1().decimals()
  };

  public query func icrc1_fee() : async ICRC1.Balance {
    icrc1().fee()
  };

  public query func icrc1_metadata() : async [ICRC1.MetaDatum] {
    icrc1().metadata()
  };

  public query func icrc1_total_supply() : async ICRC1.Balance {
    icrc1().total_supply()
  };

  public query func icrc1_minting_account() : async ?ICRC1.Account {
    ?icrc1().minting_account()
  };

  public query func icrc1_balance_of(args: ICRC1.Account) : async ICRC1.Balance {
    icrc1().balance_of(args)
  };

  public func icrc1_transfer(args: ICRC1.TransferArgs) : async ICRC1.TransferResult {
    await* icrc1().transfer_tokens(args)
  };

  public query func icrc1_supported_standards() : async [ICRC1.SupportedStandard] {
    icrc1().supported_standards()
  };

  // ICRC-2 Standard Functions
  public func icrc2_approve(args: ICRC2.ApproveArgs) : async ICRC2.ApproveResult {
    await* icrc2().approve_tokens(args)
  };

  public func icrc2_transfer_from(args: ICRC2.TransferFromArgs) : async ICRC2.TransferFromResult {
    await* icrc2().transfer_tokens_from(args)
  };

  public query func icrc2_allowance(args: ICRC2.AllowanceArgs) : async ICRC2.Allowance {
    icrc2().allowance(args.spender, args.account, null)
  };

  // Farm-specific functions
  public func updateFarmMetadata(metadata: FarmMetadata) : async () {
    // Only minting account can update metadata
    let caller = Principal.fromActor(this);
    assert(caller == init_args.minting_account);
    farm_metadata := metadata;
  };

  public query func getFarmMetadata() : async FarmMetadata {
    farm_metadata
  };

  // Mint tokens for new investments
  public func mintTokens(to: ICRC1.Account, amount: ICRC1.Balance) : async ICRC1.TransferResult {
    await* icrc1().mint_tokens(to, amount)
  };

  // Burn tokens
  public func burnTokens(args: ICRC1.BurnArgs) : async ICRC1.TransferResult {
    await* icrc1().burn_tokens(args)
  };

  // Distribute profits to token holders
  public func distributeProfits(totalProfit: Nat) : async Text {
    let distributionId = init_args.farmId # "-profit-" # Int.toText(Time.now());
    let totalSupply = icrc1().total_supply();
    
    let profitPerToken = if (totalSupply > 0) {
      Float.fromInt(totalProfit) / Float.fromInt(totalSupply)
    } else {
      0.0
    };

    let distribution: ProfitDistribution = {
      id = distributionId;
      totalProfit = totalProfit;
      distributionDate = Time.now();
      profitPerToken = profitPerToken;
    };

    profit_distributions := Array.append(profit_distributions, [distribution]);
    distributionId
  };

  // Get profit distributions
  public query func getProfitDistributions() : async [ProfitDistribution] {
    profit_distributions
  };

  // Calculate token price based on valuation
  public query func getTokenPrice() : async Float {
    let totalSupply = icrc1().total_supply();
    if (totalSupply > 0) {
      Float.fromInt(farm_metadata.valuation) / Float.fromInt(totalSupply)
    } else {
      0.0
    }
  };

  // Get market cap
  public query func getMarketCap() : async Nat {
    let price = await getTokenPrice();
    let totalSupply = icrc1().total_supply();
    Float.toInt(price * Float.fromInt(totalSupply))
  };

  // Token metrics for dashboard
  public type TokenMetrics = {
    farmId: Text;
    name: Text;
    symbol: Text;
    totalSupply: Nat;
    currentPrice: Float;
    marketCap: Nat;
    totalDistributions: Nat;
    averageYield: Float;
    holders: Nat;
  };

  public query func getTokenMetrics() : async TokenMetrics {
    let price = await getTokenPrice();
    let marketCap = await getMarketCap();
    let totalDistributions = Array.foldLeft<ProfitDistribution, Nat>(
      profit_distributions,
      0,
      func(acc, dist) { acc + dist.totalProfit }
    );

    {
      farmId = farm_metadata.farmId;
      name = icrc1().name();
      symbol = icrc1().symbol();
      totalSupply = icrc1().total_supply();
      currentPrice = price;
      marketCap = marketCap;
      totalDistributions = totalDistributions;
      averageYield = farm_metadata.expectedYield;
      holders = 0; // Placeholder - would need to track unique holders
    }
  };

  // Get all token holders (for profit distribution)
  public query func getTokenHolders() : async [(ICRC1.Account, ICRC1.Balance)] {
    // This would need to be implemented by tracking all accounts with balances
    // For now, return empty array - in production, you'd maintain a holder registry
    []
  };
}
