// File: token/FarmToken.mo

import Principal "mo:base/Principal";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Iter "mo:base/Iter";

module {
  
  public type Token = {
    farmId : Text;
    totalSupply : Nat;
    balances : Trie<Principal, Nat>
  };

  public func newToken(farmId : Text) : Token {
    {
      farmId = farmId;
      totalSupply = 0;
      balances = Trie.empty<Principal, Nat>()
    }
  };

  public func mint(
    token : Token,
    to : Principal,
    amount : Nat
  ) : Token {
    let newBalance = switch (Trie.get(token.balances, to)) {
      case null => amount;
      case (?prev) => prev + amount;
    };

    {
      farmId = token.farmId;
      totalSupply = token.totalSupply + amount;
      balances = Trie.put(token.balances, to, newBalance);
    }
  };

  public func transfer(
    token : Token,
    from : Principal,
    to : Principal,
    amount : Nat
  ) : Result<Token, Text> {
    switch (Trie.get(token.balances, from)) {
      case null => #err("Insufficient balance");
      case (?balance) =>
        if (balance < amount) {
          #err("Insufficient balance");
        } else {
          let updatedBalances = Trie.put(token.balances, from, balance - amount);
          let toBalance = switch (Trie.get(updatedBalances, to)) {
            case null => amount;
            case (?prev) => prev + amount;
          };
          let finalBalances = Trie.put(updatedBalances, to, toBalance);

          #ok({
            farmId = token.farmId;
            totalSupply = token.totalSupply;
            balances = finalBalances
          });
        }
    }
  };

  public func balanceOf(token : Token, owner : Principal) : Nat {
    switch (Trie.get(token.balances, owner)) {
      case null => 0;
      case (?amount) => amount;
    }
  };

  public func totalSupply(token : Token) : Nat {
    token.totalSupply
  };

  public func holders(token : Token) : [(Principal, Nat)] {
    Iter.toArray(token.balances.entries())
  };

  // Trie definition
  type Trie<K, V> = { entries: () -> Iter.Iter<(K, V)>; get: (K) -> ?V; put: (K, V) -> Trie<K, V> };
  module Trie {
    public func empty<K, V>() : Trie<K, V> {
      object {
        public func entries() : Iter.Iter<(K, V)> = Iter.empty();
        public func get(_ : K) : ?V = null;
        public func put(k : K, v : V) : Trie<K, V> =
          object {
            public func entries() : Iter.Iter<(K, V)> = Iter.fromArray([(k, v)]);
            public func get(q : K) : ?V = if (q == k) ?v else null;
            public func put(_ : K, _ : V) : Trie<K, V> = this; // Not persistent for now
          }
      }
    }
  };

  public type Result<T, E> = { #ok : T; #err : E };

}
