import Time "mo:base/Time";
import Text "mo:base/Text";
import Int "mo:base/Int";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Array "mo:base/Array";
import Types "types";
import Utils "utils";

module {
  public type Farm = Types.Farm;
  public type FarmStatus = Types.FarmStatus;
  public type Result<T> = Utils.Result<T>;

  // Creates a new in-memory HashMap store for farms
  public func newFarmStore() : HashMap.HashMap<Text, Farm> {
    HashMap.HashMap<Text, Farm>(10, Text.equal, Text.hash)
  };

  // Create a new farm record
  public func createFarm(
    caller: Principal,
    farms: HashMap.HashMap<Text, Farm>,
    name: Text,
    description: Text,
    location: Text,
    fundingGoal: Nat,
    totalShares: Nat,
    sharePrice: Nat
  ) : Result<Farm> {
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
    #ok(newFarm)
  };

  // Retrieve a farm by ID
  public func getFarm(
    farmId: Text,
    farms: HashMap.HashMap<Text, Farm>
  ) : Result<Farm> {
    switch (farms.get(farmId)) {
      case (?farm) { #ok(farm) };
      case null { #err("Farm not found") };
    }
  };

  // List all farms
  public func listFarms(farms: HashMap.HashMap<Text, Farm>) : [Farm] {
    Iter.toArray(
      Iter.map<(Text, Farm), Farm>(
        farms.entries(),
        func ((_, farm)) = farm
      )
    )
  };

  // List farms owned by a principal
  public func listFarmsByOwner(
    farms: HashMap.HashMap<Text, Farm>,
    caller: Principal
  ) : [Farm] {
    let ownedFarms = Iter.filter<(Text, Farm)>(
      farms.entries(),
      func ((_, farm)) = farm.owner == caller
    );

    Iter.toArray(
      Iter.map<(Text, Farm), Farm>(
        ownedFarms,
        func ((_, farm)) = farm
      )
    )
  };

  // Invest in a farm
  public func investInFarm(
    caller: Principal,
    farmId: Text,
    amount: Nat,
    farms: HashMap.HashMap<Text, Farm>
  ) : Result<Farm> {
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
        #ok(finalFarm)
      };
      case null { #err("Farm not found") };
    }
  };
};
