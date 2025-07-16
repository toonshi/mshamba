import Time "mo:base/Time";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Int "mo:base/Int";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Array "mo:base/Array";
import Types "lib/types";
import Utils "lib/utils";

actor {

  public type Farm = Types.Farm;
  public type FarmStatus = Types.FarmStatus;
  public type Result<T> = Utils.Result<T>;

  // In-memory store for farms using a HashMap
  var farms = HashMap.HashMap<Text, Farm>(10, Text.equal, Text.hash);

  // Creates a new farm project with given parameters
  public shared ({ caller }) func createFarm(
    name: Text,
    description: Text,
    location: Text,
    fundingGoal: Nat,
    totalShares: Nat,
    sharePrice: Nat
  ) : async Result<Farm> {
    let farmId = "farm-" # Int.toText(Time.now());

    let newFarm: Farm = {
      farmId = farmId;
      name = name;
      owner = caller;
      description = description;
      location = location;
      fundingGoal = fundingGoal;
      fundedAmount = 0;
      totalShares = totalShares;
      sharePrice = sharePrice;
      isOpenForInvestment = true;
      createdAt = Time.now();
      status = #Open;
      investors = [];
    };

    farms.put(farmId, newFarm);
    return #ok(newFarm);
  };

  // Retrieves a farm by ID
  public query func getFarm(farmId: Text) : async Result<Farm> {
    switch (farms.get(farmId)) {
      case (?farm) { return #ok(farm); };
      case null { return #err("Farm not found"); };
    }
  };

  // Lists all farms in the system
  public query func listFarms() : async [Farm] {
    Iter.toArray(
      Iter.map<(Text, Farm), Farm>(
        farms.entries(),
        func ((_, farm)) = farm
      )
    )
  };

  // Lists all farms owned by the caller
  public shared query ({ caller }) func listFarmsByOwner() : async [Farm] {
    let ownedFarms = Iter.filter<(Text, Farm)>(
      farms.entries(),
      func ((_, farm)) = farm.owner == caller
    );

    return Iter.toArray(
      Iter.map<(Text, Farm), Farm>(
        ownedFarms,
        func ((_, farm)) = farm
      )
    );
  };

  // Allows a user to invest in a farm by providing an amount
  public shared ({ caller }) func investInFarm(
    farmId: Text,
    amount: Nat
  ) : async Result<Farm> {
    switch (farms.get(farmId)) {
      case (?farm) {
        if (farm.isOpenForInvestment == false) {

          return #err("This farm is not open for investment");
        };

        if (farm.status != #Open) {
          return #err("This farm is not accepting funds at this time");
        };

        let updatedFunded = farm.fundedAmount + amount;

        let updatedFarm = {
          farm with
          fundedAmount = updatedFunded;
          investors = Array.append(farm.investors, [caller])
        };

        let finalFarm = if (updatedFunded >= farm.fundingGoal) {
          {
            updatedFarm with
            isOpenForInvestment = false;
            status = #Funded;
          }
        } else {
          updatedFarm
        };

        farms.put(farmId, finalFarm);
        return #ok(finalFarm);
      };
      case null { return #err("Farm not found"); };
    }
  };

};
