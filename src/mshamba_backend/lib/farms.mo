//farm module
import Time "mo:base/Time";
import Text "mo:base/Text";
import Int "mo:base/Int";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Array "mo:base/Array";
import Types "types";
import Nat "mo:base/Nat";



module {
  public type Result<T> = Types.Result<T>;
  public type Farm = Types.Farm;
  public type FarmStatus = Types.FarmStatus;

  // ==============================
  // Farm Store
  // ==============================
  public func newFarmStore() : HashMap.HashMap<Text, Farm> {
    HashMap.HashMap<Text, Farm>(10, Text.equal, Text.hash)
  };

  // ==============================
  // Create Farm
  // ==============================
  public func createFarm(
    caller: Principal,
    farms: HashMap.HashMap<Text, Farm>,
    name: Text,
    description: Text,
    location: Text,
    fundingGoal: Nat,
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
  ) : Types.Result<Farm> {

    let farmId = "farm-" # Int.toText(Time.now());

    let newFarm: Farm = {
      farmId = farmId;
      name = name;
      owner = caller;
      description = description;
      location = location;
      fundingGoal = fundingGoal;
      fundedAmount = 0;
      totalShares = 0;
      sharePrice = 0;
      isOpenForInvestment = true;
      createdAt = Time.now();
      status = #Registered;
      investors = [];
      valuationHistory = [];
      sharePriceHistory = [];
      ledgerCanister = null; // Initially no ledger canister deployed
      imageContent = imageContent;
      imageContentType = imageContentType;
      crop = crop;
      size = size;
      duration = duration;
      minInvestment = 0; // Initialize new field
      expectedYield = expectedYield;
      expectedROI = expectedROI;
      farmerName = farmerName;
      experience = experience;
      phone = phone;
      email = email;
    };

    farms.put(farmId, newFarm);
    #ok(newFarm)
  };

  // ==============================
  // Get a Farm by ID
  // ==============================
  public func getFarm(
    farmId: Text,
    farms: HashMap.HashMap<Text, Farm>
  ) : Types.Result<Farm> {
    switch (farms.get(farmId)) {
      case (?farm) { #ok(farm) };
      case null { #err("Farm not found") };
    }
  };

  // ==============================
  // List all Farms
  // ==============================
  public func listFarms(farms: HashMap.HashMap<Text, Farm>) : [Farm] {
    Iter.toArray(
      Iter.map<(Text, Farm), Farm>(
        farms.entries(),
        func ((_, farm)) = farm
      )
    )
  };

  // ==============================
  // List Farms by Owner
  // ==============================
  public func listFarmsByOwner(
    farms: HashMap.HashMap<Text, Farm>,
    owner: Principal
  ) : [Farm] {
    let ownedFarms = Iter.filter<(Text, Farm)>(
      farms.entries(),
      func ((_, farm)) = farm.owner == owner
    );

    Iter.toArray(
      Iter.map<(Text, Farm), Farm>(
        ownedFarms,
        func ((_, farm)) = farm
      )
    )
  };

  // ==============================
  // Invest in a Farm (State only)
  // ==============================
  public func investInFarm(
    caller: Principal,
    farmId: Text,
    amount: Nat,
    farms: HashMap.HashMap<Text, Farm>
  ) : Types.Result<Farm> {

    switch (farms.get(farmId)) {
      case (?farm) {

        if (not farm.isOpenForInvestment) {
          return #err("This farm is not open for investment");
        };

        let updatedFunded = farm.fundedAmount + amount;

        let updatedFarm: Farm = {
          farm with
          fundedAmount = updatedFunded;
          investors = Array.append(farm.investors, [caller])
        };

        let finalFarm: Farm = updatedFarm;

        farms.put(farmId, finalFarm);
        #ok(finalFarm)
      };
      case null { #err("Farm not found") };
    }
  };

  // ==============================
  // Update Farm Investment Status
  // ==============================
  public func updateFarmInvestmentStatus(
    farmId: Text,
    farms: HashMap.HashMap<Text, Farm>,
    newStatus: Bool
  ) : Types.Result<Farm> {
    switch (farms.get(farmId)) {
      case (?farm) {
        let updatedFarm: Farm = {
          farm with
          isOpenForInvestment = newStatus;
        };
        farms.put(farmId, updatedFarm);
        #ok(updatedFarm)
      };
      case null { #err("Farm not found") };
    }
  };
};
