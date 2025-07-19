import Time "mo:base/Time";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Int "mo:base/Int";
import Float "mo:base/Float";
import HashMap "mo:base/HashMap";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Types "types";
import Utils "utils";
import Tokens "tokens";

module {
  public type ProfitDistribution = Types.ProfitDistribution;
  public type HarvestReport = Types.HarvestReport;
  public type TokenTransfer = Types.TokenTransfer;
  public type Result<T> = Utils.Result<T>;

  // Storage factories
  public func newDistributionStore() : HashMap.HashMap<Text, ProfitDistribution> {
    HashMap.HashMap<Text, ProfitDistribution>(50, Text.equal, Text.hash)
  };

  public func newHarvestStore() : HashMap.HashMap<Text, HarvestReport> {
    HashMap.HashMap<Text, HarvestReport>(50, Text.equal, Text.hash)
  };

  // Record harvest and calculate profits
  public func recordHarvest(
    farmId: Text,
    _farmer: Principal,
    totalYield: Float,
    totalRevenue: Nat,
    expenses: Nat,
    qualityGrade: Text,
    landSize: Float,
    harvests: HashMap.HashMap<Text, HarvestReport>
  ) : Result<HarvestReport> {
    
    if (totalRevenue <= expenses) {
      return #err("Revenue must exceed expenses to record harvest");
    };

    let reportId = "harvest-" # farmId # "-" # Int.toText(Time.now());
    let netProfit = totalRevenue - expenses;
    let yieldPerAcre = totalYield / landSize;

    let harvestReport: HarvestReport = {
      reportId = reportId;
      farmId = farmId;
      harvestDate = Time.now();
      totalYield = totalYield;
      totalRevenue = totalRevenue;
      expenses = expenses;
      netProfit = netProfit;
      yieldPerAcre = yieldPerAcre;
      qualityGrade = qualityGrade;
    };

    harvests.put(reportId, harvestReport);
    #ok(harvestReport)
  };

  // Calculate and create profit distribution
  public func createProfitDistribution(
    farmId: Text,
    harvestReport: HarvestReport,
    farmerShare: Float, // Percentage for farmer (e.g., 0.3 = 30%)
    tokenBalances: HashMap.HashMap<(Principal, Text), Nat>,
    distributions: HashMap.HashMap<Text, ProfitDistribution>
  ) : Result<ProfitDistribution> {
    
    if (farmerShare < 0.0 or farmerShare > 1.0) {
      return #err("Farmer share must be between 0 and 1");
    };

    // Calculate farmer's portion
    let farmerProfitFloat = Float.fromInt(harvestReport.netProfit) * farmerShare;
    let farmerProfit = Int.abs(Float.toInt(farmerProfitFloat));
    let investorProfit = Int.abs(harvestReport.netProfit - farmerProfit);

    // Get all token holders for this farm
    let tokenHolders = Tokens.getTokenHolders(farmId, tokenBalances);
    let totalSupply = Tokens.getTotalSupply(farmId, tokenBalances);

    if (totalSupply == 0) {
      return #err("No tokens issued for this farm");
    };

    // Calculate profit per share
    let profitPerShare = investorProfit / totalSupply;

    // Calculate individual distributions
    let recipients = Array.map<(Principal, Nat), (Principal, Nat)>(
      tokenHolders,
      func((holder, balance)) = (holder, balance * profitPerShare)
    );

    let distributionId = "dist-" # farmId # "-" # Int.toText(Time.now());
    
    let distribution: ProfitDistribution = {
      distributionId = distributionId;
      farmId = farmId;
      totalProfit = investorProfit;
      distributionDate = Time.now();
      profitPerShare = profitPerShare;
      recipients = recipients;
      status = #Pending;
    };

    distributions.put(distributionId, distribution);
    #ok(distribution)
  };

  // Execute profit distribution (transfer tokens to investors)
  public func executeProfitDistribution(
    distributionId: Text,
    distributions: HashMap.HashMap<Text, ProfitDistribution>,
    tokenBalances: HashMap.HashMap<(Principal, Text), Nat>,
    transfers: HashMap.HashMap<Text, TokenTransfer>
  ) : Result<ProfitDistribution> {
    
    switch (distributions.get(distributionId)) {
      case (?distribution) {
        if (distribution.status != #Pending) {
          return #err("Distribution already processed or failed");
        };

        // Execute transfers to each recipient
        var allTransfersSuccessful = true;
        
        for ((recipient, amount) in distribution.recipients.vals()) {
          // In a real implementation, this would transfer actual tokens/currency
          // For now, we'll record the distribution as a special transfer
          let transferResult = Tokens.transferTokens(
            Principal.fromText("2vxsx-fae"), // System principal (placeholder)
            recipient,
            distribution.farmId,
            amount,
            ?1, // Profit distribution at 1:1 rate
            tokenBalances,
            transfers
          );
          
          switch (transferResult) {
            case (#err(_)) allTransfersSuccessful := false;
            case (#ok(_)) {}; // Continue
          };
        };

        // Update distribution status
        let updatedDistribution = {
          distribution with
          status = if (allTransfersSuccessful) #Distributed else #Failed;
        };
        
        distributions.put(distributionId, updatedDistribution);
        #ok(updatedDistribution)
      };
      case null #err("Distribution not found");
    }
  };

  // Get profit history for a farm
  public func getFarmProfitHistory(
    farmId: Text,
    distributions: HashMap.HashMap<Text, ProfitDistribution>
  ) : [ProfitDistribution] {
    let farmDistributions = Iter.filter<(Text, ProfitDistribution)>(
      distributions.entries(),
      func((_, dist)) = Text.equal(dist.farmId, farmId)
    );
    
    Array.map<(Text, ProfitDistribution), ProfitDistribution>(
      Iter.toArray(farmDistributions),
      func((_, dist)) = dist
    )
  };

  // Get investor's profit history across all farms
  public func getInvestorProfitHistory(
    investor: Principal,
    distributions: HashMap.HashMap<Text, ProfitDistribution>
  ) : [(Text, Nat)] { // (farmId, totalReceived)
    let allDistributions = Iter.toArray(distributions.entries());
    
    Array.mapFilter<(Text, ProfitDistribution), (Text, Nat)>(
      allDistributions,
      func((_, dist)) : ?(Text, Nat) {
        // Find this investor in the recipients
        let investorAmount = Array.foldLeft<(Principal, Nat), Nat>(
          dist.recipients,
          0,
          func(acc, (recipient, amount)) = 
            if (Principal.equal(recipient, investor)) acc + amount else acc
        );
        
        if (investorAmount > 0) {
          ?(dist.farmId, investorAmount)
        } else null
      }
    )
  };

  // Calculate ROI for an investor in a specific farm
  public func calculateROI(
    investor: Principal,
    farmId: Text,
    originalInvestment: Nat,
    distributions: HashMap.HashMap<Text, ProfitDistribution>
  ) : Float {
    let profitHistory = getInvestorProfitHistory(investor, distributions);
    
    let totalProfitsReceived = Array.foldLeft<(Text, Nat), Nat>(
      profitHistory,
      0,
      func(acc, (fId, amount)) = 
        if (Text.equal(fId, farmId)) acc + amount else acc
    );
    
    if (originalInvestment == 0) return 0.0;
    
    Float.fromInt(totalProfitsReceived) / Float.fromInt(originalInvestment) * 100.0
  };

  // Get harvest reports for a farm
  public func getFarmHarvestHistory(
    farmId: Text,
    harvests: HashMap.HashMap<Text, HarvestReport>
  ) : [HarvestReport] {
    let farmHarvests = Iter.filter<(Text, HarvestReport)>(
      harvests.entries(),
      func((_, harvest)) = Text.equal(harvest.farmId, farmId)
    );
    
    Array.map<(Text, HarvestReport), HarvestReport>(
      Iter.toArray(farmHarvests),
      func((_, harvest)) = harvest
    )
  };

  // Calculate farm performance metrics
  public func calculateFarmPerformance(
    farmId: Text,
    harvests: HashMap.HashMap<Text, HarvestReport>
  ) : {
    averageYieldPerAcre: Float;
    totalRevenue: Nat;
    totalProfit: Nat;
    averageROI: Float;
    harvestCount: Nat;
  } {
    let farmHarvests = getFarmHarvestHistory(farmId, harvests);
    let harvestCount = Array.size(farmHarvests);
    
    if (harvestCount == 0) {
      return {
        averageYieldPerAcre = 0.0;
        totalRevenue = 0;
        totalProfit = 0;
        averageROI = 0.0;
        harvestCount = 0;
      };
    };
    
    let totals = Array.foldLeft<HarvestReport, {yield: Float; revenue: Nat; profit: Nat}>(
      farmHarvests,
      {yield = 0.0; revenue = 0; profit = 0},
      func(acc, harvest) = {
        yield = acc.yield + harvest.yieldPerAcre;
        revenue = acc.revenue + harvest.totalRevenue;
        profit = acc.profit + harvest.netProfit;
      }
    );
    
    {
      averageYieldPerAcre = totals.yield / Float.fromInt(harvestCount);
      totalRevenue = totals.revenue;
      totalProfit = totals.profit;
      averageROI = if (totals.revenue > 0) 
        Float.fromInt(totals.profit) / Float.fromInt(totals.revenue) * 100.0 
        else 0.0;
      harvestCount = harvestCount;
    }
  };
}
