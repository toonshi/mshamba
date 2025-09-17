import Farm "lib/farms";
import UserProfile "lib/userProfiles";
import Text "mo:base/Text";
import Principal "mo:base/Principal";
import Nat "mo:base/Nat";
import Array "mo:base/Array";
// import TF "canister:token_factory";
import Types "lib/types";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Time "mo:base/Time";
import Int "mo:base/Int";
import Debug "mo:base/Debug";


import LedgerTypes "canister:farm1_ledger";

actor {

  // public type Allocation = TF.Allocation;

   var farmStore = Farm.newFarmStore();
   var profileStore = UserProfile.newProfileStore();
  var investmentStore = HashMap.HashMap<Principal, [Types.Investment]>(10, Principal.equal, Principal.hash);

  // ==============================
  // HELPERS
  // ==============================
  func getFarmerProfile(caller: Principal) : ?UserProfile.Profile {
  switch (UserProfile.getProfile(profileStore, caller)) {
    case (?(p)) {
      if (p.role == #Farmer) { ?p } else { null }
    };
    case null { null };
  }
};

  type LedgerActor = actor {
    icrc1_transfer : (LedgerTypes.TransferArg) -> async LedgerTypes.TransferResult;
    icrc1_fee : () -> async Nat;
  };

  // ==============================
  // PROFILES
  // ==============================
  public shared ({ caller }) func createProfile(
    name : Text,
    bio : Text,
    role : UserProfile.Role,
    certifications : [Text],
    profilePicture: Text // New parameter
  ) : async Bool {
    UserProfile.createProfile(profileStore, caller, name, bio, role, certifications, profilePicture)
  };

  public query func getProfile(owner : Principal) : async ?UserProfile.Profile {
    UserProfile.getProfile(profileStore, owner)
  };

  // ==============================
  // FARMS (Farmer-only actions)
  // ==============================
      public shared ({ caller }) func createFarm(farm: Types.FarmPayload) : async Types.Result<Types.Farm> {
    Farm.createFarm(caller, farmStore, farm)
  };

  public shared query ({ caller }) func myFarms() : async [Farm.Farm] {
    Farm.listFarmsByOwner(farmStore, caller)
  };

  public query func listFarms() : async [Farm.Farm] {
    Farm.listFarms(farmStore)
  };

  // ==============================
  // INVESTMENT (Token Factory Integration)
  // ==============================
    public shared ({ caller }) func openFarmInvestment(
    farmId : Text,
    tokenName : Text,
    tokenSymbol : Text,
    initialSupply : Nat,
    vestingDays : Nat,
    transferFee : Nat,
    extraControllers : [Principal],
    cyclesToSpend : ?Nat
  ) : async Farm.Result<Farm.Farm> {
    return #err("openFarmInvestment is not available");
  };

  // ==============================
  // INVESTOR ACTIONS
  // ==============================
  public shared ({ caller }) func handleInvest(
    farmId : Text,
    amount : Nat
  ) : async Farm.Result<Farm.Farm> {
    // 1. Retrieve the farm and ensure it exists & is open for investment
    let farmResult = Farm.getFarm(farmId, farmStore);
    switch (farmResult) {
      case (#err(msg)) { return #err(msg) };
      case (#ok(farm)) {
        if (not farm.isOpenForInvestment) {
          return #err("This farm is not open for investment");
        };

        // 2. Ensure the farm has a deployed ledger canister
        let ledgerId = switch (farm.ledgerCanister) {
          case (?id) { id };
          case null { return #err("Farm does not have a deployed ledger canister yet.") };
        };

        // 3. Calculate tokens to issue based on investment amount and share price
        if (farm.sharePrice == 0) {
          return #err("Farm share price is not set. Cannot invest.");
        };

        let tokensToIssue = amount / farm.sharePrice;
        if (tokensToIssue == 0) {
          return #err("Investment amount is too small to receive any tokens.");
        };

        // 4. Perform Transfers
        let ledgerActor : LedgerActor = actor(Principal.toText(ledgerId));

        let fee = await ledgerActor.icrc1_fee();
        if (tokensToIssue <= fee) {
          return #err("Investment amount is too small to cover the transfer fee.");
        };

        let transferAmount = tokensToIssue - fee;

        let transferArgs : LedgerTypes.TransferArg = {
          from_subaccount = null;
          to = { owner = caller; subaccount = null };
          amount = transferAmount;
          fee = ?fee;
          memo = null;
          created_at_time = null;
        };

        let transferResult = await ledgerActor.icrc1_transfer(transferArgs);

        switch (transferResult) {
          case (#Err(err)) {
            return #err("Token transfer failed: " # debug_transfer_error(err));
          };
          case (#Ok(_)) {
            // 5. Update farm funding and investors
            let updateResult = Farm.investInFarm(caller, farmId, amount, farmStore);
            switch (updateResult) {
              case (#ok(updatedFarm)) {
                // Update totalShares
                let finalFarm : Farm.Farm = {
                  updatedFarm with
                  totalShares = updatedFarm.totalShares + tokensToIssue;
                };
                farmStore.put(farmId, finalFarm);

                // Create and store the investment record
                let investmentId = "inv-" # Int.toText(Time.now());
                let newInvestment : Types.Investment = {
                  investmentId = investmentId;
                  investor = caller;
                  farmId = farmId;
                  amount = amount;
                  sharesReceived = tokensToIssue; // Now actual tokens
                  pricePerShare = farm.sharePrice; // Actual price
                  timestamp = Time.now();
                };

                let existingInvestments = switch (investmentStore.get(caller)) {
                  case (?investments) { investments };
                  case null { [] };
                };

                let updatedInvestments = Array.append(existingInvestments, [newInvestment]);
                investmentStore.put(caller, updatedInvestments);

                #ok(finalFarm)
              };
              case (#err(msg)) { #err(msg) };
            }
          }
        }
      }
    }
  };

  // Helper function to debug TransferError
  // Helper function to debug TransferError
  func debug_transfer_error(error: LedgerTypes.TransferError) : Text {
    switch (error) {
      case (#BadFee(e)) { "Transfer failed: BadFee" };
      case (#BadBurn(e)) { "Transfer failed: BadBurn" };
      case (#InsufficientFunds(e)) { "Transfer failed: InsufficientFunds" };
      case (#TooOld) { "Transfer failed: TooOld" };
      case (#CreatedInFuture(e)) { "Transfer failed: CreatedInFuture" };
      case (#TemporarilyUnavailable) { "Transfer failed: TemporarilyUnavailable" };
      case (#Duplicate(e)) { "Transfer failed: Duplicate" };
      case (#GenericError(e)) { "Transfer failed: GenericError" };
    }
  };

  // ==============================
  // FARMER ACTIONS
  // ==============================
  public shared ({ caller }) func toggleFarmInvestmentStatus(
    farmId : Text,
    newStatus : Bool
  ) : async Farm.Result<Farm.Farm> {
    switch (Farm.getFarm(farmId, farmStore)) {
      case (#err(msg)) { return #err(msg) };
      case (#ok(farm)) {
        if (farm.owner != caller) {
          return #err("Only the farm owner can change investment status");
        };
        let updateResult = Farm.updateFarmInvestmentStatus(farmId, farmStore, newStatus);
        switch (updateResult) {
          case (#ok(updatedFarm)) { #ok(updatedFarm) };
          case (#err(msg)) { #err(msg) };
        }
      }
    }
  };

  public shared ({ caller }) func updateFarmSharePrice(
    farmId : Text,
    newSharePrice : Nat
  ) : async Farm.Result<Farm.Farm> {
    switch (Farm.getFarm(farmId, farmStore)) {
      case (#err(msg)) { return #err(msg) };
      case (#ok(farm)) {
        if (farm.owner != caller) {
          return #err("Only the farm owner can update the share price");
        };
        let updatedFarm : Farm.Farm = {
          farm with
          sharePrice = newSharePrice;
        };
        farmStore.put(farmId, updatedFarm);
        #ok(updatedFarm)
      }
    }
  };

  public shared ({ caller }) func updateFarmLedger(
    farmId : Text,
    ledgerCanisterId : Principal
  ) : async Farm.Result<Farm.Farm> {
    switch (Farm.getFarm(farmId, farmStore)) {
      case (#err(msg)) { return #err(msg) };
      case (#ok(farm)) {
        if (farm.owner != caller) {
          return #err("Only the farm owner can update the ledger canister");
        };
        switch (Farm.updateLedgerCanister(farmId, farmStore, ledgerCanisterId)) {
          case (#ok(updatedFarm)) { #ok(updatedFarm) };
          case (#err(msg)) { #err(msg) };
        }
      }
    }
  };

  public shared ({ caller }) func updateFarmDetails(
    farmId : Text,
    description : Text,
    location : Text,
    fundingGoal : Nat,
    image: Text,
    crop: Text,
    size: Text,
    minInvestment: Nat,
    duration: Nat
  ) : async Farm.Result<Farm.Farm> {
    switch (Farm.getFarm(farmId, farmStore)) {
      case (#err(msg)) { return #err(msg) };
      case (#ok(farm)) {
        if (farm.owner != caller) {
          return #err("Only the farm owner can update farm details");
        };
        let updatedFarm : Farm.Farm = {
          farm with
          description = description;
          location = location;
          fundingGoal = fundingGoal;
          image = image;
          crop = crop;
          size = size;
          minInvestment = minInvestment;
          duration = duration;
        };
        farmStore.put(farmId, updatedFarm);
        #ok(updatedFarm)
      }
    }
  };

  public shared ({ caller }) func addFarmDocument(
    farmId : Text,
    documentId : Text
  ) : async Farm.Result<Farm.Farm> {
    switch (Farm.getFarm(farmId, farmStore)) {
      case (#err(msg)) { return #err(msg) };
      case (#ok(farm)) {
        if (farm.owner != caller) {
          return #err("Only the farm owner can add documents to their farm");
        };
        let updatedFarm : Farm.Farm = {
          farm with
          documents = Array.append(farm.documents, [documentId]);
        };
        farmStore.put(farmId, updatedFarm);
        #ok(updatedFarm)
      }
    }
  };

  public shared query ({ caller }) func getMyInvestments() : async [Types.Investment] {
    switch (investmentStore.get(caller)) {
      case (?investments) { investments };
      case null { [] };
    }
  };

  public shared ({ caller }) func sendEmailToFarmOwner(farmId: Text, message: Text) : async Types.Result<Bool> {
    // In a real application, this would integrate with an external email service.
    // For now, we'll simulate success and log the attempt.
    Debug.print("Simulating email to farm owner for farm ID: " # farmId # " with message: " # message);
    return #ok(true);
  };

  public shared query func getInvestmentDetails(investmentId: Text) : async Types.Result<Types.Investment> {
    // Iterate through all investors' investments to find the matching investmentId
    for (investorInvestments in investmentStore.vals()) {
      for (investment in investorInvestments.vals()) {
        if (investment.investmentId == investmentId) {
          return #ok(investment);
        };
      };
    };
    return #err("Investment not found.");
  };

  public shared ({ caller }) func sellFarmTokens(
    farmId : Text,
    recipient : Principal,
    amount : Nat
  ) : async Types.Result<Bool> {
    // 1. Retrieve the farm to get its ledger canister ID
    let farmResult = Farm.getFarm(farmId, farmStore);
    switch (farmResult) {
      case (#err(msg)) { return #err(msg) };
      case (#ok(farm)) {
        let ledgerId = switch (farm.ledgerCanister) {
          case (?id) { id };
          case null { return #err("Farm does not have a deployed ledger canister.") };
        };

        // 2. Create an actor for the farm's ledger canister
        let ledgerActor : LedgerActor = actor(Principal.toText(ledgerId));

        // 3. Get the transfer fee
        let fee = await ledgerActor.icrc1_fee();

        // 4. Prepare transfer arguments
        let transferArgs : LedgerTypes.TransferArg = {
          from_subaccount = null;
          to = { owner = recipient; subaccount = null };
          amount = amount;
          fee = ?fee;
          memo = null;
          created_at_time = null;
        };

        // 5. Perform the transfer
        let transferResult = await ledgerActor.icrc1_transfer(transferArgs);

        switch (transferResult) {
          case (#Err(err)) {
            return #err("Token transfer failed: " # debug_transfer_error(err));
          };
          case (#Ok(_)) {
            Debug.print("Tokens successfully transferred from " # Principal.toText(caller) # " to " # Principal.toText(recipient) # " for farm " # farmId);
            return #ok(true);
        };
      };
    };
  };
};
};