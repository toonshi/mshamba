import Time "mo:base/Time";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Float "mo:base/Float";
import HashMap "mo:base/HashMap";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Types "types";
import Utils "utils";

module {
  public type FarmToken = Types.FarmToken;
  public type TokenTransfer = Types.TokenTransfer;
  public type TokenStandard = Types.TokenStandard;
  public type Result<T> = Utils.Result<T>;

  public type Token = {
  farmId: Text;
  balances: HashMap.HashMap<(Principal, Text), Nat>;
  tokens: HashMap.HashMap<Text, FarmToken>;
  transfers: HashMap.HashMap<Text, TokenTransfer>;
};

// This is the function your main.mo expects
public func newToken(farmId: Text) : Token {
  {
    farmId = farmId;
    balances = newBalanceStore();
    tokens = newTokenStore();
    transfers = newTransferStore();
  }
};


  // Token storage factories
  public func newTokenStore() : HashMap.HashMap<Text, FarmToken> {
    HashMap.HashMap<Text, FarmToken>(100, Text.equal, Text.hash)
  };

  public func newBalanceStore() : HashMap.HashMap<(Principal, Text), Nat> {
    HashMap.HashMap<(Principal, Text), Nat>(100, 
      func(a: (Principal, Text), b: (Principal, Text)) : Bool { 
        Principal.equal(a.0, b.0) and Text.equal(a.1, b.1) 
      },
      func(key: (Principal, Text)) : Nat32 { 
        Principal.hash(key.0) + Text.hash(key.1) 
      }
    )
  };

  public func newTransferStore() : HashMap.HashMap<Text, TokenTransfer> {
    HashMap.HashMap<Text, TokenTransfer>(200, Text.equal, Text.hash)
  };

  // Mint new farm tokens when investment is made
  public func mintFarmTokens(
    farmId: Text,
    investor: Principal,
    amount: Nat,
    sharePrice: Nat,
    tokens: HashMap.HashMap<Text, FarmToken>,
    balances: HashMap.HashMap<(Principal, Text), Nat>
  ) : Result<FarmToken> {
    let tokenId = farmId # "-" # Int.toText(Time.now());
    let tokenAmount = amount / sharePrice; // Calculate number of tokens
    
    let farmToken: FarmToken = {
      tokenId = tokenId;
      farmId = farmId;
      owner = investor;
      amount = tokenAmount;
      tokenStandard = #ICRC1;
      metadata = [
        ("name", "Mshamba Farm Token"),
        ("symbol", "MFT-" # farmId),
        ("decimals", "8"),
        ("farm_id", farmId),
        ("minted_at", Int.toText(Time.now()))
      ];
      createdAt = Time.now();
      lastTransfer = Time.now();
    };

    tokens.put(tokenId, farmToken);
    
    // Update balance
    let balanceKey = (investor, farmId);
    let currentBalance = switch (balances.get(balanceKey)) {
      case (?balance) balance;
      case null 0;
    };
    balances.put(balanceKey, currentBalance + tokenAmount);

    #ok(farmToken)
  };

  // Transfer tokens between users (for secondary market)
  public func transferTokens(
    from: Principal,
    to: Principal,
    farmId: Text,
    amount: Nat,
    pricePerToken: ?Nat,
    balances: HashMap.HashMap<(Principal, Text), Nat>,
    transfers: HashMap.HashMap<Text, TokenTransfer>
  ) : Result<TokenTransfer> {
    let fromKey = (from, farmId);
    let toKey = (to, farmId);
    
    // Check sender balance
    let senderBalance = switch (balances.get(fromKey)) {
      case (?balance) balance;
      case null 0;
    };
    
    if (senderBalance < amount) {
      return #err("Insufficient token balance");
    };
    
    // Execute transfer
    balances.put(fromKey, senderBalance - amount);
    
    let receiverBalance = switch (balances.get(toKey)) {
      case (?balance) balance;
      case null 0;
    };
    balances.put(toKey, receiverBalance + amount);
    
    // Record transfer
    let transferId = "transfer-" # Int.toText(Time.now());
    let transfer: TokenTransfer = {
      transferId = transferId;
      tokenId = farmId; // Using farmId as token identifier
      from = from;
      to = to;
      amount = amount;
      pricePerToken = pricePerToken;
      timestamp = Time.now();
      transferType = switch (pricePerToken) {
        case (?_) #MarketSale;
        case null #Direct;
      };
    };
    
    transfers.put(transferId, transfer);
    #ok(transfer)
  };

  // Get token balance for a user and farm
  public func getTokenBalance(
    user: Principal,
    farmId: Text,
    balances: HashMap.HashMap<(Principal, Text), Nat>
  ) : Nat {
    switch (balances.get((user, farmId))) {
      case (?balance) {
        // Ensure balance is within safe range to prevent overflow
        if (balance > 1000000000000000) { // 1 quadrillion max
          0 // Return 0 if balance is suspiciously high
        } else {
          balance
        }
      };
      case null 0;
    }
  };

  // Get all tokens owned by a user
  public func getUserTokens(
    user: Principal,
    balances: HashMap.HashMap<(Principal, Text), Nat>
  ) : [(Text, Nat)] {
    let userTokens = Iter.filter<((Principal, Text), Nat)>(
      balances.entries(),
      func((key, _)) = Principal.equal(key.0, user)
    );
    
    Array.map<((Principal, Text), Nat), (Text, Nat)>(
      Iter.toArray(userTokens),
      func((key, balance)) = (key.1, balance)
    )
  };

  // Get total token supply for a farm
  public func getTotalSupply(
    farmId: Text,
    balances: HashMap.HashMap<(Principal, Text), Nat>
  ) : Nat {
    let farmTokens = Iter.filter<((Principal, Text), Nat)>(
      balances.entries(),
      func((key, _)) = Text.equal(key.1, farmId)
    );
    
    let farmTokensArray = Iter.toArray(farmTokens);
    Array.foldLeft<((Principal, Text), Nat), Nat>(
      farmTokensArray,
      0,
      func(acc, (_, balance)) = acc + balance
    )
  };

  // Get token holders for a farm
  public func getTokenHolders(
    farmId: Text,
    balances: HashMap.HashMap<(Principal, Text), Nat>
  ) : [(Principal, Nat)] {
    let farmTokens = Iter.filter<((Principal, Text), Nat)>(
      balances.entries(),
      func((key, balance)) = Text.equal(key.1, farmId) and balance > 0
    );
    
    Array.map<((Principal, Text), Nat), (Principal, Nat)>(
      Iter.toArray(farmTokens),
      func((key, balance)) = (key.0, balance)
    )
  };

  // Calculate ownership percentage
  public func getOwnershipPercentage(
    user: Principal,
    farmId: Text,
    balances: HashMap.HashMap<(Principal, Text), Nat>
  ) : Float {
    let userBalance = getTokenBalance(user, farmId, balances);
    let totalSupply = getTotalSupply(farmId, balances);
    
    if (totalSupply == 0) return 0.0;
    
    Float.fromInt(userBalance) / Float.fromInt(totalSupply) * 100.0
  };

  // Get transfer history for a farm
  public func getFarmTransferHistory(
    farmId: Text,
    transfers: HashMap.HashMap<Text, TokenTransfer>
  ) : [TokenTransfer] {
    let farmTransfers = Iter.filter<(Text, TokenTransfer)>(
      transfers.entries(),
      func((_, transfer)) = Text.equal(transfer.tokenId, farmId)
    );
    
    Array.map<(Text, TokenTransfer), TokenTransfer>(
      Iter.toArray(farmTransfers),
      func((_, transfer)) = transfer
    )
  };

  // ICRC-1 Standard Functions (simplified implementation)
  
  public func icrc1_name() : Text { "Mshamba Farm Token" };
  public func icrc1_symbol() : Text { "MFT" };
  public func icrc1_decimals() : Nat8 { 8 };
  
  public func icrc1_total_supply(
    farmId: Text,
    balances: HashMap.HashMap<(Principal, Text), Nat>
  ) : Nat {
    getTotalSupply(farmId, balances)
  };
  
  public func icrc1_balance_of(
    account: Principal,
    farmId: Text,
    balances: HashMap.HashMap<(Principal, Text), Nat>
  ) : Nat {
    getTokenBalance(account, farmId, balances)
  };
  
  public func icrc1_transfer(
    from: Principal,
    to: Principal,
    farmId: Text,
    amount: Nat,
    balances: HashMap.HashMap<(Principal, Text), Nat>,
    transfers: HashMap.HashMap<Text, TokenTransfer>
  ) : Result<TokenTransfer> {
    transferTokens(from, to, farmId, amount, null, balances, transfers)
  };
}