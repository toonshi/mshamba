import FarmModule "lib/farms";
import UserProfileModule "lib/userProfiles";
import Text "mo:base/Text";
import Principal "mo:base/Principal";
import Nat "mo:base/Nat";
import Array "mo:base/Array";

import Types "lib/types";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter"; // Added import for Iter
import Debug "mo:base/Debug";
import Blob "mo:base/Blob";

actor {
  // Environment variable for FARM1_LEDGER_CANISTER_ID
  // This will be set by dfx.json during deployment
  let FARM1_LEDGER_CANISTER_ID_TEXT : Text = actor.getenv("FARM1_LEDGER_CANISTER_ID");
  let FARM1_LEDGER_PRINCIPAL : Principal = Principal.fromText(FARM1_LEDGER_CANISTER_ID_TEXT);

  type Farm = FarmModule.Farm;
  type Profile = UserProfileModule.Profile;

  // Stable variables for persistence (manual serialization)
  stable var stableFarmKeys : [Text] = [];
  stable var stableFarmValues : [FarmModule.Farm] = [];
  stable var stableProfileKeys : [Principal] = [];
  stable var stableProfileValues : [UserProfileModule.Profile] = [];

  // Non-stable variables, initialized from stable memory in post_upgrade
  transient var farmStore : HashMap.HashMap<Text, FarmModule.Farm> = FarmModule.newFarmStore();
  transient var profileStore : HashMap.HashMap<Principal, UserProfileModule.Profile> = UserProfileModule.newProfileStore();

  // ==============================
  // HELPERS
  // ==============================
  func getFarmerProfile(caller: Principal) : ?UserProfileModule.Profile {
    Debug.print("getFarmerProfile called for: " # Principal.toText(caller));
    switch (UserProfileModule.getProfile(profileStore, caller)) {
      case (?(p)) {
        Debug.print("Profile found. Role: " # debug_show(p.role));
        if (p.role == #Farmer) { ?p } else { null }
      };
      case null { Debug.print("Profile not found for: " # Principal.toText(caller)); null };
    }
  };

  // ==============================
  // PROFILES
  // ==============================
  public shared ({ caller }) func createProfile(
    name : Text,
    bio : Text,
    role : UserProfileModule.Role,
    certifications : [Text]
  ) : async Bool {
    Debug.print("createProfile called by: " # Principal.toText(caller));
    Debug.print("Name: " # name # ", Bio: " # bio # ", Role: " # debug_show(role) # ", Certs: " # debug_show(certifications));
    let result = UserProfileModule.createProfile(profileStore, caller, name, bio, role, certifications);
    Debug.print("UserProfileModule.createProfile returned: " # debug_show(result));
    result
  };

  public query func getProfile(owner : Principal) : async ?UserProfileModule.Profile {
    UserProfileModule.getProfile(profileStore, owner)
  };

  // ==============================
  // FARMS (Farmer-only actions)
  // ==============================
  public shared ({ caller }) func createFarm(
    name : Text,
    description : Text,
    location : Text,
    fundingGoal : Nat,
    size: Text,
    crop: Text,
    duration: Nat,
    expectedYield: Text,
    expectedROI: Text,
    farmerName: Text,
    experience: Text,
    phone: Text,
    email: Text,
    imageContent: Blob,
    imageContentType: Text
  ) : async FarmModule.Result<FarmModule.Farm> {
    switch (getFarmerProfile(caller)) {
      case (?_) { FarmModule.createFarm(caller, farmStore, name, description, location, fundingGoal, size, crop, duration, expectedYield, expectedROI, farmerName, experience, phone, email, imageContent, imageContentType, ?FARM1_LEDGER_PRINCIPAL) };
      case null { #err("Only farmers can create farms or profile not found") };
    }
  };

  public shared query ({ caller }) func myFarms() : async [FarmModule.Farm] {
    FarmModule.listFarmsByOwner(farmStore, caller)
  };

  public query func listFarms() : async [FarmModule.Farm] {
    FarmModule.listFarms(farmStore)
  };

  // ==============================
  // INVESTMENT (Token Factory Integration)
  // ==============================


  // ==============================
  // FARMER ACTIONS
  // ==============================
  public shared ({ caller }) func toggleFarmInvestmentStatus(
    farmId : Text,
    newStatus : Bool
  ) : async FarmModule.Result<FarmModule.Farm> {
    switch (FarmModule.getFarm(farmId, farmStore)) {
      case (#err(msg)) { return #err(msg) };
      case (#ok(farm)) {
        if (farm.owner != caller) {
          return #err("Only the farm owner can change investment status");
        };
        let updateResult = FarmModule.updateFarmInvestmentStatus(farmId, farmStore, newStatus);
        switch (updateResult) {
          case (#ok(updatedFarm)) { #ok(updatedFarm) };
          case (#err(msg)) { #err(msg) };
        }
      }
    }
  };

  // ==============================
  // UPGRADE HOOKS
  // ==============================
  public shared func pre_upgrade() : async () {
    stableFarmKeys := Iter.toArray(farmStore.keys());
    stableFarmValues := Iter.toArray(farmStore.vals());
    stableProfileKeys := Iter.toArray(profileStore.keys());
    stableProfileValues := Iter.toArray(profileStore.vals());
  };

  public shared func post_upgrade() : async () {
    farmStore := FarmModule.newFarmStore();
    var i : Nat = 0;
    while (i < Array.size(stableFarmKeys)) {
      farmStore.put(stableFarmKeys[i], stableFarmValues[i]);
      i += 1;
    };

    profileStore := UserProfileModule.newProfileStore();
    var j : Nat = 0;
    while (j < Array.size(stableProfileKeys)) {
      profileStore.put(stableProfileKeys[j], stableProfileValues[j]);
      j += 1;
    };
  };
};