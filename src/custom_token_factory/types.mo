import Principal "mo:base/Principal";
import Blob "mo:base/Blob";
import Nat "mo:base/Nat";

module {
  type Account = record { owner : Principal; subaccount : Blob };
  type Allocation = record {
    account : Account;
    amount : Nat;
  };
};