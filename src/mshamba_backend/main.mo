import Farm "lib/farms";
import IM "lib/token_factory";  
import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Principal "mo:base/Principal";

actor MshambaBackend {
  stable var farmStore = Farm.newFarmStore();

  // ✅ create a new farm
  public shared({caller}) func createFarm(
    name: Text,
    description: Text,
    location: Text,
    fundingGoal: Nat
  ) : async Farm.Result<Farm.Farm> {
    Farm.createFarm(caller, farmStore, name, description, location, fundingGoal)
  };

  // ✅ open investment for a given farm (delegates to Farm -> InvestmentManager -> TokenFactory)
  public shared({caller}) func openInvestment(
    farmId: Text,
    tokenName: Text,
    tokenSymbol: Text,
    initialSupply: Nat,
    investorAllocs: [IM.Allocation]   // 🔄 pull type from InvestmentManager
  ) : async Farm.Result<Farm.Farm> {
    await Farm.openFarmInvestment(
      caller,
      farmStore,
      farmId,
      tokenName,
      tokenSymbol,
      initialSupply,
      investorAllocs
    )
  };

  // ✅ list all farms
  public query func listFarms() : async [Farm.Farm] {
    Farm.listFarms(farmStore)
  };
}
