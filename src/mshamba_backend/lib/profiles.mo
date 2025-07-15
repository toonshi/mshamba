import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Int "mo:base/Int";
import HashMap "mo:base/HashMap";
import Array "mo:base/Array";
import Types "types";
import Utils "utils";
import Iter "mo:base/Iter";

actor {
  public type UserProfile = Types.UserProfile;
  public type Role = Types.Role;
  public type Result<T> = Utils.Result<T>;

  // Store users by Principal
  var users = HashMap.HashMap<Principal, UserProfile>(100, Principal.equal, Principal.hash);

  // Register or update a user profile
  public shared ({ caller }) func upsertProfile(
    name: Text,
    email: Text,
    role: Role,
    bio: Text,
    location: Text
  ) : async Result<UserProfile> {
    let profileId = "user-" # Int.toText(Time.now());

    let newProfile: UserProfile = {
      id = profileId;
      name = name;
      email = email;
      role = role;
      wallet = caller;
      bio = bio;
      location = location;
      joinedAt = Time.now();
    };

    users.put(caller, newProfile);
    return #ok(newProfile);
  };

  // Get the profile of the caller
  public query ({ caller }) func myProfile() : async Result<UserProfile> {
    switch (users.get(caller)) {
      case (?profile) return #ok(profile);
      case null return #err("Profile not found");
    }
  };

  // Get profile of any Principal (admin access)
  public query func getProfileOf(p: Principal) : async Result<UserProfile> {
    switch (users.get(p)) {
      case (?profile) return #ok(profile);
      case null return #err("User not found");
    }
  };

  // List all user profiles (optional: add role-based filters later)
  public query func listUsers() : async [UserProfile] {
    Iter.toArray<UserProfile>(users.vals())
  };
}
