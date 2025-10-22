# Mshamba Economic Model
## Token Economics, Pricing, and Financial Projections

**Version 1.0** | **October 2025**

---

## Table of Contents

1. [Equity Tokenization Model](#equity-tokenization-model)
2. [Token Pricing Mechanics](#token-pricing-mechanics)
3. [Dividend Distribution](#dividend-distribution)
4. [Secondary Market Economics](#secondary-market-economics)
5. [Platform Revenue Model](#platform-revenue-model)
6. [Financial Projections](#financial-projections)
7. [Risk & Return Analysis](#risk--return-analysis)

---

## Equity Tokenization Model

### Core Principle: Real Ownership

Unlike revenue-sharing or debt-based models, Mshamba tokens represent **actual equity ownership** in farms:

```
Traditional Crowdfunding:
├─ Investor lends money
├─ Gets fixed interest (if lucky)
├─ No ownership or upside
└─ Risk: Lose all if farm fails

Mshamba Model:
├─ Investor buys equity
├─ Gets proportional dividends
├─ Owns piece of appreciating asset
├─ Can sell tokens anytime
└─ Risk shared with all stakeholders
```

### Standard Equity Structure

**For a typical farm raising 2M KES valued at 25M KES:**

```
Total Farm Valuation: 25,000,000 KES
Capital to Raise: 2,000,000 KES (8%)

Equity Allocation:
├─ Farmer: 87% (21,750,000 KES)
│   ├─ Maintains control
│   ├─ Vested over 4 years
│   └─ Earns 87% of all profits
│
├─ Platform: 5% (1,250,000 KES)
│   ├─ For valuation services
│   ├─ Vested over 2 years
│   └─ Earns 5% of all profits
│
└─ Investors: 8% (2,000,000 KES)
    ├─ IFO sale to public
    ├─ Immediately liquid
    └─ Earns 8% of all profits

Token Distribution:
├─ Total supply: 1,000,000 tokens
├─ Farmer: 870,000 tokens (87%)
├─ Platform: 50,000 tokens (5%)
└─ IFO: 80,000 tokens (8%)
```

### Why This Split Works

**For Farmers:**
-  Retains majority ownership (no loss of control)
-  No debt or interest payments (saves 15-25% annually)
-  Shares upside with supporters
-  Can raise follow-on rounds later
-  Vesting ensures long-term commitment

**For Investors:**
-  Real equity ownership (not just revenue share)
-  Proportional profit sharing (dividends)
-  Capital appreciation potential
-  Liquidity via secondary market
-  Transparent operations

**For Platform:**
-  Aligned incentives (profit from farm success)
-  Covers intensive valuation work
-  Not extractive (5% vs 10%+ others charge)
-  Long-term recurring revenue

### Vesting Schedules

**Purpose:** Prevent immediate token dumping, align long-term incentives

**Farmer Tokens (87% = 870,000):**
```
Month 0:  0 tokens liquid (100% locked)
Month 12: 0 tokens liquid (1-year cliff)
Month 24: 217,500 liquid (25% vested)
Month 36: 435,000 liquid (50% vested)
Month 48: 652,500 liquid (75% vested)
Month 60: 870,000 liquid (100% vested)

Annual unlock rate after cliff: 217,500 tokens/year
```

**Platform Tokens (5% = 50,000):**
```
Month 0:  0 tokens liquid
Month 12: 25,000 liquid (50% vested)
Month 24: 50,000 liquid (100% vested)
```

**Investor Tokens (8% = 80,000):**
```
Immediately liquid upon purchase
Can trade on secondary market post-IFO
```

**Smart Contract Implementation:**
```motoko
type VestingSchedule = {
  beneficiary: Principal;
  totalTokens: Nat;
  startDate: Int;
  cliffDuration: Int;        // 365 days in nanoseconds
  vestingDuration: Int;      // 1460 days (4 years)
  releasedTokens: Nat;
};

func calculateVestedTokens(schedule: VestingSchedule) : Nat {
  let now = Time.now();
  let elapsed = now - schedule.startDate;
  
  // Before cliff
  if (elapsed < schedule.cliffDuration) {
    return 0;
  };
  
  // After full vesting
  if (elapsed >= schedule.vestingDuration) {
    return schedule.totalTokens;
  };
  
  // Linear vesting after cliff
  let postCliffDuration = schedule.vestingDuration - schedule.cliffDuration;
  let postCliffElapsed = elapsed - schedule.cliffDuration;
  let vestingProgress = Float.fromInt(postCliffElapsed) / Float.fromInt(postCliffDuration);
  
  let vested = Nat.fromFloat(Float.fromNat(schedule.totalTokens) * vestingProgress);
  vested
};
```

---

## Token Pricing Mechanics

### Initial Price Discovery (IFO)

**Calculation Formula:**
```
Farm Valuation (from API): V
Capital to Raise: C
Equity % for Sale: E = C / V

Total Token Supply: S (always 1,000,000)
IFO Token Allocation: S × E

Token Price = C / (S × E)
```

**Example: Joseph's Potato Farm**
```
V = 25,000,000 KES
C = 2,000,000 KES
E = 2,000,000 / 25,000,000 = 0.08 (8%)

S = 1,000,000 tokens
IFO Tokens = 1,000,000 × 0.08 = 80,000 tokens

Token Price = 2,000,000 / 80,000 = 25 KES per token

In USDC (@ 100 KES/USD):
Token Price = 0.25 USDC per token
```

### Post-IFO Price Discovery

**Factors Affecting Secondary Market Price:**

**1. Farm Performance (Primary Driver)**
```
Scenario A: Harvest Exceeds Projections (+30%)
├─ Expected profit: 1.7M KES
├─ Actual profit: 2.2M KES
├─ Market revises farm value: 25M → 28M KES
└─ Token price: 25 → 28 KES (+12%)

Scenario B: Harvest Below Projections (-20%)
├─ Expected profit: 1.7M KES
├─ Actual profit: 1.4M KES
├─ Market revises farm value: 25M → 23M KES
└─ Token price: 25 → 23 KES (-8%)
```

**2. Milestone Completion (Confidence Builder)**
```
Each verified milestone adds credibility:
├─ M1 verified: +2% price bump (reduced execution risk)
├─ M2 verified: +2% (on track)
├─ M3 verified: +3% (plants in ground)
└─ M4 verified: +5% (revenue confirmed)

Cumulative effect: ~12% appreciation before harvest
```

**3. Commodity Price Movements**
```
Global potato prices rise 15%:
├─ Farm's revenue projections increase
├─ Future cash flows worth more
├─ Token fair value: 25 → 27 KES (+8%)
└─ Market price follows fundamentals
```

**4. Liquidity & Trading Volume**
```
High Liquidity (100+ trades/week):
├─ Tight bid-ask spread (1-2%)
├─ Efficient price discovery
└─ Easy to buy/sell

Low Liquidity (5 trades/week):
├─ Wide bid-ask spread (5-10%)
├─ Price volatility
└─ Harder to exit
```

### Fair Value Calculation

**DCF Model (Simplified):**
```
Fair Value = Asset Value + NPV(Future Cash Flows)

Asset Value:
├─ Land: 20M KES
├─ Equipment: 1.5M KES
└─ Total: 21.5M KES

Future Cash Flows (3 years):
├─ Year 1: 1.7M profit
├─ Year 2: 1.9M profit (contracts renewed)
├─ Year 3: 2.1M profit (expansion)
└─ NPV @ 12% discount rate: 4.5M KES

Total Fair Value: 21.5M + 4.5M = 26M KES
Per Token: 26M / 1M = 26 KES

vs Market Price: 30 KES
Analysis: 15% premium (market optimism priced in)
```

**Oracle-Based Pricing (Future):**
```motoko
type FarmMetrics = {
  soilMoisture: Float;
  growthStage: Text;
  weatherForecast: [Float];
  globalCommodityPrice: Nat;
  milestoneProgress: Float;
};

func calculateFairValue(farmId: Text, metrics: FarmMetrics) : Nat {
  let farm = getFarm(farmId);
  let baseValuation = farm.valuation;
  
  var priceMultiplier: Float = 1.0;
  
  // Adjust for metrics
  if (metrics.milestoneProgress > 0.8) {
    priceMultiplier *= 1.10;  // +10% for on-track execution
  };
  
  if (metrics.globalCommodityPrice > farm.historicalAvgPrice) {
    let priceIncrease = Float.fromNat(metrics.globalCommodityPrice - farm.historicalAvgPrice) / 
                        Float.fromNat(farm.historicalAvgPrice);
    priceMultiplier *= (1.0 + priceIncrease);
  };
  
  // Weather impact (simplified)
  if (metrics.soilMoisture > 0.6 and metrics.soilMoisture < 0.8) {
    priceMultiplier *= 1.05;  // Optimal conditions
  };
  
  let fairValue = Nat.fromFloat(Float.fromNat(baseValuation) * priceMultiplier);
  fairValue / farm.tokenSupply  // Per-token price
};
```

---

## Dividend Distribution

### Distribution Mechanism

**Profit Calculation:**
```
Farm Revenue: R
Operating Costs: C
Net Profit: P = R - C

Dividend Pool: D = P (100% of profit distributed)
Per-Token Dividend: D / Total Token Supply

Example:
├─ Revenue: 4.2M KES
├─ Costs: 2.5M KES
├─ Profit: 1.7M KES
└─ Per-token: 1.7M / 1M = 1.7 KES per token
```

**Equity-Based Distribution:**
```
Farmer (870,000 tokens):
├─ Dividend: 870,000 × 1.7 = 1,479,000 KES (87%)
└─ This is profit, not loan repayment!

Investors (80,000 tokens):
├─ Dividend: 80,000 × 1.7 = 136,000 KES (8%)
└─ Split among all token holders proportionally

Platform (50,000 tokens):
├─ Dividend: 50,000 × 1.7 = 85,000 KES (5%)
└─ Platform's ongoing revenue stream
```

**Individual Investor Example:**
```
Investor holds: 400 tokens (0.04% of farm)
Per-token dividend: 1.7 KES
Dividend received: 400 × 1.7 = 680 KES

Initial investment: 10,000 KES
Dividend yield: 680 / 10,000 = 6.8%

Plus token appreciation: 25 → 30 KES = +20%
Total Year 1 return: 26.8%
```

### Payment Schedule

**Primary Distribution:** Post-harvest (80% of annual profit)
```
Month 12: Harvest complete
Month 13: Financials finalized
Month 14: Dividend declared & distributed

Amount: 80% of verified profit
Method: Automatic ICRC-1 transfers
Currency: USDC (stable)
```

**Optional Mid-Season Payment:** (20% advance if cash flow strong)
```
Month 6: Mid-season review
If revenue exceeds projections:
├─ Advance dividend: 20% of expected annual profit
└─ Deducted from year-end distribution
```

### Smart Contract Automation

```motoko
public shared({caller}) func declareDividend(
  farmId: Text,
  totalProfit: Nat  // In USDC e6s
) : async Result<DividendDistribution> {
  
  // Only farm owner can declare
  let farm = getFarm(farmId);
  if (caller != farm.owner) {
    return #err("Only farm owner can declare dividends");
  };
  
  // Calculate per-token amount
  let perTokenAmount = totalProfit / farm.tokenSupply;
  
  // Get all token holders from ICRC-1 ledger
  let ledger = actor(Principal.toText(farm.ledgerCanister)) : ICRC1;
  
  // Iterate through all holders and distribute
  // (In practice, use batch processing for gas efficiency)
  let holders = await getAllTokenHolders(ledger);
  
  for (holder in holders.vals()) {
    let dividend = holder.balance * perTokenAmount;
    
    // Transfer USDC to holder
    let transferResult = await ckUSDC_ledger.icrc1_transfer({
      to = { owner = holder.principal; subaccount = null };
      amount = dividend;
      memo = ?Text.encodeUtf8("Dividend from " # farm.name);
      ...
    });
    
    // Log distribution
    recordDividendPayment(farm.farmId, holder.principal, dividend);
  };
  
  let distribution: DividendDistribution = {
    farmId = farmId;
    totalAmount = totalProfit;
    perTokenAmount = perTokenAmount;
    distributionDate = Time.now();
    recipientCount = holders.size();
  };
  
  #ok(distribution)
};
```

### Tax Considerations

**For Kenyan Investors:**
```
Dividend income is taxable at 15% (withholding tax)
Platform withholds and remits to KRA
Investor receives 85% of dividend

Example:
├─ Gross dividend: 680 KES
├─ Tax withheld: 102 KES (15%)
└─ Net received: 578 KES
```

**For International Investors:**
```
Subject to double taxation treaties
May require W-8BEN form
Consult local tax advisor
```

---

## Secondary Market Economics

### Trading Mechanisms

**Option 1: P2P Marketplace (Phase 1)**
```
Investor A wants to sell 500 tokens
├─ Lists: "500 JPFT @ 28 KES"
├─ Tokens locked in escrow
└─ Any buyer can purchase (atomic swap)

Investor B wants to buy
├─ Sees listing
├─ Clicks "Buy"
├─ Sends 14,000 KES worth of USDC
├─ Receives 500 tokens
└─ Platform takes 1% fee (140 KES)
```

**Option 2: Order Book (Phase 2)**
```
Bids (Buyers):                Asks (Sellers):
├─ 100 @ 27.5 KES            ├─ 50 @ 28.5 KES
├─ 200 @ 27.0 KES            ├─ 150 @ 28.8 KES
└─ 500 @ 26.5 KES            └─ 300 @ 29.0 KES

Market Price: ~28 KES (midpoint)
Spread: 1 KES (3.6%)

When bid >= ask:
├─ Trade executes
├─ Price discovery happens
└─ New market price established
```

**Option 3: AMM Pool (Phase 3)**
```
Liquidity Pool:
├─ 10,000 JPFT tokens
├─ 280,000 USDC (in KES equivalent)
└─ Price = 280,000 / 10,000 = 28 KES per token

Constant Product: k = x × y = 10,000 × 280,000 = 2.8B

Buy 100 tokens:
├─ Tokens out: 100
├─ USDC needed: solve (10,000 - 100) × (280,000 + X) = 2.8B
├─ X = 2,828 USDC equivalent
├─ Price per token: 28.28 KES (slippage from 28)
└─ New pool: 9,900 tokens, 282,828 USDC

New price: 282,828 / 9,900 = 28.57 KES
```

### Trading Windows Strategy

**Milestone-Based Trading (Recommended for MVP):**
```
Month 1: IFO closes → Trading LOCKED
Month 2: Milestone 1 verified → 7-day trading window
Month 3: Trading LOCKED
Month 4: Milestone 2 verified → 7-day trading window
Month 6: Milestone 3 verified → 7-day trading window
Month 9: Milestone 4 verified → 7-day trading window
Month 12: Harvest → Continuous trading begins

Benefits:
 Reduces speculation
 Aligns with farm progress
 Prevents panic selling
 Simpler to implement
```

### Price Stability Mechanisms

**Circuit Breakers:**
```
Daily price limit: ±10% from previous close
├─ Price hits 27.5 (27.5% down): Trading paused 1 hour
├─ Price hits 22.5 (22.5% down): Trading halted until next window
└─ Protects against flash crashes

Weekly limit: ±25%
Monthly limit: ±50%
```

**Liquidity Incentives:**
```
Platform provides initial liquidity:
├─ Commits 5% of IFO tokens to AMM pool
├─ Matches with equivalent USDC
└─ Earns trading fees (0.3%)

Liquidity providers earn:
├─ Trading fees: 0.3% per trade
├─ Platform rewards: Bonus tokens
└─ Makes providing liquidity profitable
```

---

## Platform Revenue Model

### Revenue Streams

**1. IFO Success Fee: 2.5% of Capital Raised**
```
Per Farm:
├─ Capital raised: 2M KES
├─ Fee: 2M × 0.025 = 50K KES
└─ Paid from first milestone release

Annual (10 farms):
├─ 10 farms × 50K = 500K KES
└─ One-time per farm
```

**2. Equity Stake: 5% of Every Farm**
```
Per Farm (Year 1):
├─ Profit: 1.7M KES
├─ Platform share: 1.7M × 0.05 = 85K KES
└─ Recurring annually

Annual (10 farms, avg 85K each):
├─ 10 farms × 85K = 850K KES
└─ Grows as farms mature
```

**3. Secondary Market Fees: 1% per Trade**
```
Trading volume (monthly estimate):
├─ 100 trades × avg 10K KES = 1M KES volume
├─ Fee: 1M × 0.01 = 10K KES
└─ Grows with platform adoption

Annual (conservative):
├─ 12 months × 10K = 120K KES
└─ Could be much higher as liquidity increases
```

**4. Premium Services (Future)**
```
- Advanced analytics: 5K KES/month
- Institutional dashboard: 50K KES/month
- API access: 20K KES/month
- Farm insurance facilitation: 2% commission
```

### Financial Projections

**Year 1 (10 Farms):**
```
Revenue:
├─ IFO fees: 500K KES
├─ Equity dividends: 850K KES
├─ Trading fees: 120K KES
└─ Total: 1.47M KES ($14,700)

Costs:
├─ Development: 2M KES
├─ Operations: 800K KES
├─ Marketing: 400K KES
└─ Total: 3.2M KES

Net: -1.73M KES (investment phase)
```

**Year 2 (30 Farms Total):**
```
Revenue:
├─ IFO fees (20 new): 1M KES
├─ Equity dividends (30 farms): 2.55M KES
├─ Trading fees: 600K KES
└─ Total: 4.15M KES ($41,500)

Costs:
├─ Operations: 1.2M KES
├─ Marketing: 800K KES
└─ Total: 2M KES

Net: +2.15M KES (profitable!)
```

**Year 3 (80 Farms Total):**
```
Revenue:
├─ IFO fees (50 new): 2.5M KES
├─ Equity dividends (80 farms): 6.8M KES
├─ Trading fees: 2M KES
├─ Premium services: 1.2M KES
└─ Total: 12.5M KES ($125,000)

Costs:
├─ Operations: 2M KES
├─ Marketing: 1.5M KES
└─ Total: 3.5M KES

Net: +9M KES (healthy margins)
```

**Year 5 (200 Farms Total):**
```
Revenue:
├─ IFO fees (60 new): 3M KES
├─ Equity dividends (200 farms): 17M KES
├─ Trading fees: 6M KES
├─ Premium services: 3M KES
├─ Institutional partnerships: 5M KES
└─ Total: 34M KES ($340,000)

Costs:
├─ Operations: 5M KES
├─ Marketing: 3M KES
├─ R&D: 2M KES
└─ Total: 10M KES

Net: +24M KES (scale achieved!)
```

---

## Risk & Return Analysis

### For Investors

**Risk Factors:**
```
Agricultural Risks:
├─ Weather (drought, floods)
├─ Pests and diseases
├─ Market price fluctuations
└─ Harvest failure

Mitigation:
├─ Diversify across multiple farms
├─ Insurance products (future)
├─ Milestone verification reduces fraud
└─ Transparent reporting
```

**Return Scenarios:**

**Best Case (30% ROI):**
```
Investment: 10,000 KES
Year 1:
├─ Dividend: 1,200 KES (12% yield)
├─ Token appreciation: 25 → 30 KES (+20%)
└─ Total value: 13,200 KES (+32%)
```

**Base Case (15% ROI):**
```
Investment: 10,000 KES
Year 1:
├─ Dividend: 680 KES (6.8% yield)
├─ Token appreciation: 25 → 27 KES (+8%)
└─ Total value: 11,480 KES (+14.8%)
```

**Worst Case (-20% loss):**
```
Investment: 10,000 KES
Year 1:
├─ Dividend: 200 KES (2% yield - poor harvest)
├─ Token depreciation: 25 → 20 KES (-20%)
└─ Total value: 8,200 KES (-18%)
```

### For Farmers

**Comparison with Traditional Loan:**

**Bank Loan Scenario:**
```
Borrow: 2M KES @ 15% interest
Year 1:
├─ Profit: 1.7M KES
├─ Interest payment: 300K KES
├─ Net: 1.4M KES
└─ Risk: Lose land if can't repay
```

**Mshamba Equity Scenario:**
```
Raise: 2M KES for 8% equity
Year 1:
├─ Profit: 1.7M KES
├─ Keep: 87% = 1.48M KES
├─ Net: 1.48M KES (80K more than loan!)
└─ Risk: Dilution only, no collateral at risk
```

**Multi-Year Comparison:**
```
Year 1:
├─ Loan: 1.4M take-home (after 300K interest)
└─ Equity: 1.48M take-home (+80K better!)

Year 2:
├─ Loan: 1.5M take-home (after 300K interest)
└─ Equity: 1.65M take-home (+150K better!)

Year 3:
├─ Loan: 1.7M take-home (loan repaid)
└─ Equity: 1.83M take-home (+130K better, still own 87%!)

5-Year Total:
├─ Loan: 7.1M cumulative (debt-free after year 3)
└─ Equity: 8.9M cumulative (+1.8M more!)
```

---

## Conclusion

Mshamba's economic model creates a **triple-win scenario**:

**Farmers:** Access capital without debt, keep majority ownership, save on interest  
**Investors:** Real equity returns, dividends + appreciation, liquid exit options  
**Platform:** Aligned incentives, recurring revenue, sustainable growth

The use of **stablecoins (ckUSDC)** eliminates currency risk, while **milestone verification** builds trust and reduces fraud. **Secondary markets** provide liquidity without sacrificing long-term alignment.

This isn't just DeFi innovation—it's **real economic impact** for Kenyan agriculture.

---

**For economic modeling questions:** economics@mshamba.io  
**Partnership inquiries:** partners@mshamba.io

**© 2025 Mshamba Technologies Ltd.**
