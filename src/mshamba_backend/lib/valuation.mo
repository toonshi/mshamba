import Time "mo:base/Time";
import Float "mo:base/Float";
import Int "mo:base/Int";
import Text "mo:base/Text";
import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Char "mo:base/Char";
import Types "types";
import Utils "utils";

module {
  public type Farm = Types.Farm;
  public type ValuationMetrics = Types.ValuationMetrics;
  public type CropType = Types.CropType;
  public type Result<T> = Utils.Result<T>;

  // Get crop multiplier for different crop types
  private func getCropMultiplier(cropType: CropType) : Float {
    switch(cropType) {
      case (#Vegetables) 1.2;  // Lower risk, faster turnover
      case (#Grains) 1.0;     // Base multiplier
      case (#Fruits) 1.5;     // Higher value, longer term
      case (#Livestock) 1.8;  // High value, ongoing revenue
      case (#Cash_Crops) 2.0; // Highest value crops
    }
  };

  // Calculate farm valuation based on multiple factors
  public func calculateFarmValuation(
    landSize: Float,           // in acres
    cropType: CropType,
    location: Text,
    soilQuality: Nat,         // 1-10 scale
    waterAccess: Bool,
    infrastructure: Nat,      // 1-10 scale
    marketAccess: Nat,        // 1-10 scale (distance to markets)
    historicalYield: ?Float,  // optional historical data
    climateRisk: Nat          // 1-10 scale (10 = high risk)
  ) : Result<ValuationMetrics> {
    
    // Base valuation per acre (in e8s - ICP format)
    let baseValuePerAcre: Float = 500_000_000.0; // ~$5000 per acre base
    
    // Get crop multiplier
    let cropMultiplier = getCropMultiplier(cropType);
    
    // Calculate quality score (0.5 to 1.5 multiplier)
    let qualityScore = (
      Float.fromInt(soilQuality) * 0.15 +
      (if (waterAccess) 1.0 else 0.3) * 0.25 +
      Float.fromInt(infrastructure) * 0.1 +
      Float.fromInt(11 - marketAccess) * 0.1 + // Closer markets = higher score
      Float.fromInt(11 - climateRisk) * 0.1
    ) / 10.0;
    
    // Location multiplier (simplified - could be enhanced with real data)
    let locationMultiplier = getLocationMultiplier(location);
    
    // Historical yield bonus
    let yieldMultiplier = switch (historicalYield) {
      case (?yield) {
        if (yield > 1.2) 1.1      // 10% bonus for high yield
        else if (yield < 0.8) 0.9 // 10% penalty for low yield
        else 1.0
      };
      case null 1.0;
    };
    
    // Calculate total valuation
    let totalValuation = landSize * baseValuePerAcre * cropMultiplier * 
                        qualityScore * locationMultiplier * yieldMultiplier;
    
    // Calculate share price (divide by standard 1M shares)
    let standardShares = 1_000_000.0;
    let sharePrice = totalValuation / standardShares;
    
    let metrics: ValuationMetrics = {
      totalValuation = Int.abs(Float.toInt(totalValuation));
      sharePrice = Int.abs(Float.toInt(sharePrice));
      qualityScore = qualityScore;
      cropMultiplier = cropMultiplier;
      locationMultiplier = locationMultiplier;
      calculatedAt = Time.now();
      factors = {
        landSize = landSize;
        cropType = cropType;
        soilQuality = soilQuality;
        waterAccess = waterAccess;
        infrastructure = infrastructure;
        marketAccess = marketAccess;
        climateRisk = climateRisk;
      };
    };
    
    #ok(metrics)
  };

  // Simplified location multiplier - could be enhanced with real geographic data
  private func getLocationMultiplier(location: Text) : Float {
    // This is a simplified version - in reality, you'd use geographic data
    let locationLower = Text.map(location, func(c: Char) : Char {
      if (c >= 'A' and c <= 'Z') {
        Char.fromNat32(Char.toNat32(c) + 32)
      } else c
    });
    
    // Example location multipliers (would be data-driven in production)
    if (Text.contains(locationLower, #text "nairobi") or 
        Text.contains(locationLower, #text "kampala") or
        Text.contains(locationLower, #text "dar es salaam")) {
      1.3 // Near major cities
    } else if (Text.contains(locationLower, #text "rift valley") or
               Text.contains(locationLower, #text "central") or
               Text.contains(locationLower, #text "western")) {
      1.1 // Good agricultural regions
    } else {
      1.0 // Standard regions
    }
  };

  // Update farm valuation (recalculate based on new data)
  public func updateFarmValuation(
    farm: Farm,
    newMetrics: ValuationMetrics
  ) : Farm {
    let updatedHistory = Array.append(farm.valuationHistory, [(Time.now(), newMetrics.totalValuation)]);
    
    {
      farm with
      sharePrice = newMetrics.sharePrice;
      valuationHistory = updatedHistory;
    }
  };

  // Calculate dynamic share price based on market conditions
  public func calculateDynamicSharePrice(
    baseValuation: ValuationMetrics,
    demandFactor: Float,      // Based on investment interest (0.5 - 2.0)
    marketSentiment: Float,   // Overall market conditions (0.8 - 1.2)
    farmPerformance: Float    // Based on actual vs projected performance (0.7 - 1.3)
  ) : Nat {
    let dynamicPrice = Float.fromInt(baseValuation.sharePrice) * 
                      demandFactor * marketSentiment * farmPerformance;
    
    Int.abs(Float.toInt(dynamicPrice))
  };

  // Get valuation trend (positive/negative/stable)
  public func getValuationTrend(valuationHistory: [(Int, Nat)]) : Text {
    let historySize = Array.size(valuationHistory);
    if (historySize < 2) return "insufficient_data";
    
    let recent = valuationHistory[historySize - 1].1;
    let previous = valuationHistory[historySize - 2].1;
    
    let changePercent = Float.fromInt(recent - previous) / Float.fromInt(previous) * 100.0;
    
    if (changePercent > 5.0) "bullish"
    else if (changePercent < -5.0) "bearish"
    else "stable"
  };
}
