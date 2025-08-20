import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Int "mo:base/Int";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Types "types";
import Utils "utils";

module {
  public type UserProfile = Types.UserProfile;
  public type Role = Types.Role;
  public type Result<T> = Utils.Result<T>;

  // Factory function for the user map
  public func newProfileStore() : HashMap.HashMap<Principal, UserProfile> {
    HashMap.HashMap<Principal, UserProfile>(100, Principal.equal, Principal.hash)
  };

  // Create or update a user profile
  public func upsertProfile(
    caller: Principal,
    users: HashMap.HashMap<Principal, UserProfile>,
    name: Text,
    email: Text,
    role: Role,
    bio: Text,
    location: Text
  ) : Result<UserProfile> {
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
    #ok(newProfile)
  };

  // Get caller's profile
  public func myProfile(
    caller: Principal,
    users: HashMap.HashMap<Principal, UserProfile>
  ) : Result<UserProfile> {
    switch (users.get(caller)) {
      case (?profile) #ok(profile);
      case null #err("Profile not found");
    }
  };

  // Get someone else's profile
  public func getProfileOf(
    target: Principal,
    users: HashMap.HashMap<Principal, UserProfile>
  ) : Result<UserProfile> {
    switch (users.get(target)) {
      case (?profile) #ok(profile);
      case null #err("User not found");
    }
  };

  // List all profiles
  public func listUsers(users: HashMap.HashMap<Principal, UserProfile>) : [UserProfile] {
    Iter.toArray<UserProfile>(users.vals())
  };
}
