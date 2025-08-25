import Principal "mo:base/Principal";
import Blob "mo:base/Blob";
import Nat "mo:base/Nat";

module {
  public type Account = record { owner : Principal; subaccount : ?Blob };
  public type Allocation = record {
    account : Account;
    amount : Nat;
  };
};