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
    role: Role;
    certifications: [Text];
    profilePicture: Text;
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
    role: Role,
    certifications: [Text],
    profilePicture: Text // New parameter
  ) : Bool {
    switch (store.get(owner)) {
      case (?_) { false }; // already exists
      case null {
        let profile: Profile = {
          owner; name; bio; role; certifications; profilePicture // Assign new field
        };
        store.put(owner, profile);
        true
      };
    }
  };

  public func getProfile(store: ProfileStore, owner: Principal) : ?Profile {
    store.get(owner)
  };

  public func listProfiles(store: ProfileStore) : [Profile] {
  Iter.toArray(store.vals())
};
};
