// lib/UserProfile.mo
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";

module {
  public type Role = { #Farmer; #Investor };

  public type Profile = {
    owner: Principal;
    name: Text;
    bio: Text;
    roles: [Role];
    certifications: [Text];
  };

  public type ProfileStore = HashMap.HashMap<Principal, Profile>;

  public func newProfileStore() : ProfileStore {
    HashMap.HashMap<Principal, Profile>(10, Principal.equal, Principal.hash)
  };

  public func createProfile(
    store: ProfileStore,
    owner: Principal,
    name: Text,
    bio: Text,
    roles: [Role],
    certifications: [Text]
  ) : Bool {
    // Create or update profile (upsert behavior)
    let profile: Profile = {
      owner; name; bio; roles; certifications
    };
    store.put(owner, profile);
    true
  };

  public func getProfile(store: ProfileStore, owner: Principal) : ?Profile {
    store.get(owner)
  };

  public func listProfiles(store: ProfileStore) : [Profile] {
    Iter.toArray(store.vals())
  };

  public func hasRole(profile: Profile, role: Role) : Bool {
    for (r in profile.roles.vals()) {
      if (r == role) return true;
    };
    false
  };
};
