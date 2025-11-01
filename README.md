# Mshamba: Agricultural Equity Tokenization Platform

**Date:** October 18, 2025  
**Status:** Production Ready

> **Transforming Kenyan farms into publicly traded companies through blockchain technology**

The site is live on mainnet at: [https://pri4n-hyaaa-aaaac-a4beq-cai.icp0.io/](https://pri4n-hyaaa-aaaac-a4beq-cai.icp0.io/)

---

## Table of Contents

- [Vision](#vision)
- [How It Works](#how-it-works)
- [Quick Start](#quick-start)
- [Common Tasks](#common-tasks)
- [Token Factory Management](#token-factory-management)
- [Token Parameters](#token-parameters)
- [Budget & Cycle Costs](#budget--cycle-costs)
- [Troubleshooting](#troubleshooting)
- [Technical Architecture](#technical-architecture)
- [Mainnet Deployment](#mainnet-deployment)
- [Changelog](#changelog)

---

## Vision

**Mshamba** is the **NASDAQ for Kenyan farms** — a decentralized platform that enables farmers to raise capital by tokenizing farm equity, allowing anyone to invest in real agricultural businesses without traditional loans or banks.

### The Problem We Solve

**For Farmers:**
- Bank loans have predatory 15-25% interest rates
- Heavy collateral requirements risk losing land
- Slow approval processes miss market opportunities
- Debt obligations regardless of harvest success

**For Investors:**
- No access to agricultural investment opportunities
- Lack of transparency in farm operations
- Illiquid investments with no exit strategy
- Limited to local opportunities only

### Our Solution

**Mshamba enables farmers to:**
- Raise capital by selling tokenized equity (not taking loans)
- Keep majority ownership (75%+) and operational control
- Access global investor pool via M-Pesa and crypto
- Get funds released via milestone verification (transparency)
- Share profits through dividend distributions
- Scale with follow-on funding rounds

**Investor Benefits:**
- Direct ownership in real agricultural businesses
- Fractional investments starting from 1,000 KES (~$10)
- Tradable tokens on secondary markets (liquidity)
- Dividend income from farm profits
- Transparent milestone tracking and reporting
- Portfolio diversification across multiple farms

---

## How It Works

### Example: Joseph's Potato Farm Expansion

**Situation:**
- Joseph owns 100 acres in Nakuru
- Currently farming 60 acres (supplies St. Mary's School)
- Gets new contract opportunity with St. John's School
- Needs 2,000,000 KES to expand to remaining 40 acres
- Can't get bank loan (15% interest, heavy collateral)

**Mshamba Solution:**

1. **Farm Valuation**
   - Python API analyzes farm data + national agricultural benchmarks
   - Farm valued at 25,000,000 KES (post-expansion)
   - Recommendation: Raise 2M by selling 8% equity

2. **Token Creation**
   - Total: 1,000,000 tokens created
   - Joseph keeps: 870,000 tokens (87% ownership, vesting)
   - Mshamba gets: 50,000 tokens (5% for platform services)
   - IFO sale: 80,000 tokens @ 25 KES each = 2,000,000 KES

3. **Investment (IFO - Initial Farm Offering)**
   - 30-day fundraising period
   - Investors pay via M-Pesa (KES) or crypto (USDC)
   - ~200 investors contribute (avg. 10,000 KES each)
   - Reaches funding target if demand is strong

4. **Milestone-Based Fund Release**
   - Funds held in escrow, released in stages:
     - Milestone 1: Equipment purchase (800K) - Month 1
     - Milestone 2: Land preparation (600K) - Month 2  
     - Milestone 3: Planting complete (400K) - Month 3
     - Milestone 4: First delivery (200K) - Month 5
   - Evidence required: Photos, receipts, GPS coordinates
   - Platform verifies before releasing funds

5. **Harvest & Returns**
   - Year 1 profit: 1,700,000 KES
   - Joseph gets: 87% = 1,479,000 KES (no loan interest!)
   - Investors get: 8% = 136,000 KES (~6.8% ROI)
   - Mshamba gets: 5% = 85,000 KES
   - Token value increases (farm proven successful)

6. **Secondary Trading**
   - Post-milestone trading windows
   - P2P marketplace for liquidity
   - Investors can exit or hold for more dividends
   - Token price reflects farm performance

---

## Why Blockchain? The Core Value Proposition

Let's be frank. Here's the real value of the crypto/blockchain part for Mshamba, and why it's not just a gimmick.

Imagine Mshamba without blockchain, using a traditional database and a web server:

*   **Trust:** You would have to ask your users to trust you, Mshamba, completely. You would be the central authority controlling the database of who owns what. An investor in another country would have to trust that you are recording their investment correctly and that you will pay them their fair share of the profits.
*   **Transparency:** There would be no way for an investor to independently verify the farm's records or the platform's financials. They would have to rely on the reports you provide.
*   **Global Payments:** Moving money across borders would be slow, expensive, and subject to the fees and restrictions of traditional banking systems.
*   **Liquidity:** Creating a secondary market for a non-tokenized asset would be a complex legal and technical challenge.

Now, let's look at what the crypto/blockchain part brings to the table:

**1. Verifiable Trust, Not Assumed Trust.**

*   **This is the core value proposition.** With blockchain, you are not asking your users to trust you. You are giving them the tools to verify everything for themselves. Every investment, every token, every transaction is a public record that cannot be changed. This is a monumental shift in the power dynamic between a platform and its users.

**2. A Global, 24/7, Permissionless Financial System.**

*   By using tokens, you are plugging into a global financial system that is always on and open to everyone. You can accept an investment from someone in Japan as easily as you can from someone in Nairobi, without needing a bank. This is how you unlock a truly global pool of capital for your farmers.

**3. Automated and Transparent Rules of the Game.**

*   Smart contracts are like a robotic lawyer and accountant that works for everyone. They automatically enforce the rules of the platform—how dividends are distributed, how votes are counted, etc. This ensures that everyone is treated fairly and that the rules are applied consistently.

**4. True Ownership and Liquidity.**

*   Tokenization is not just about creating a digital representation of an asset. It's about creating a *bearer asset* that the user truly owns and controls. And because it's a standardized digital asset, it can be easily traded on a secondary market, providing the liquidity that is so crucial for investors.

**In short, the crypto/blockchain part is what allows you to make these credible promises:**

*   To farmers: "You are in control. The system is fair and transparent."
*   To investors: "You can trust the records. Your investment is real, and you have a path to liquidity."

Without the blockchain, Mshamba would be just another fintech company asking for trust. With the blockchain, you are building a trust machine. That's the fundamental difference, and that's your unique and powerful value proposition.

---

### Platform Mechanics & Token Economics

This section details the core mechanics of the Mshamba platform, including our "crypto-invisible" payment system and the economics of the farm tokens.

#### The "Crypto-Invisible" Payment Experience

While Mshamba is powered by blockchain technology, we have designed the platform to be simple and intuitive for our users, especially farmers who operate in the real-world economy.

*   **The Challenge:** How to leverage the power of global, on-chain finance without forcing users to deal with the complexities of cryptocurrency.
*   **Our Solution:** The Mshamba platform acts as a seamless bridge between the traditional financial world (M-Pesa, bank accounts) and the decentralized world (ICP, Hedera).
    *   **For Farmers:** The experience is purely in Kenyan Shillings (KES). They receive capital in KES and pay dividends in KES. They never need to open a crypto wallet or handle digital currencies.
    *   **For Investors:** Investors have the choice to invest using familiar methods like M-Pesa or with cryptocurrencies like ckUSDC.
    *   **The "Engine":** We partner with a regulated payment provider to handle all fiat-to-crypto conversions automatically in the background. This allows us to offer a simple user experience while still benefiting from the power of on-chain settlement.

#### The Lifecycle of an Investment

To support a global investor pool, all on-chain transactions are settled in a universal currency (the ckUSDC stablecoin). Here’s how money flows through the system:

1.  **Investor On-Ramp:** A local investor deposits 10,000 KES via M-Pesa. The platform automatically converts this to its equivalent value in ckUSDC (e.g., 75 ckUSDC). An international investor might deposit 75 ckUSDC directly.
2.  **On-Chain Investment:** The 75 ckUSDC is used to purchase the farm's tokens in a transparent, on-chain transaction. The smart contract now records the investor as owning a specific number of tokens.
3.  **Farmer Payout:** Once the funding goal is met, the collected ckUSDC is automatically converted back into KES and disbursed to the farmer's bank account or M-Pesa wallet, providing them with the capital they need.
4.  **Dividend Distribution:** The farmer pays the total dividend amount in KES to the Mshamba platform. The platform then automatically converts this to ckUSDC and distributes it to all token holders according to their ownership stake, finally converting it back to KES for local investors' payouts.

#### Understanding the Farm Token (Tokenomics)

It's important to distinguish between the farm's initial funding and the token's ongoing life on the secondary market.

*   **Initial Farm Offering (IFO):** This is the primary fundraising event where investors buy tokens directly from the farm to provide it with capital. This is the "Farm Funding" stage.

*   **Token Liquidity:** After the IFO, the token needs liquidity so that investors can trade it. This is achieved by creating a **liquidity pool** on a secondary market. This pool (e.g., containing the farm's tokens and ckUSDC) allows investors to buy and sell tokens from each other at any time.

*   **Token Price Drivers:** The price of the token on the secondary market is **not** determined by the initial funding amount. It is driven by **supply and demand**, which is based on the market's perception of the farm's performance and future profitability.
    *   **Positive Drivers (Price Up):** Good harvests, new contracts, high dividend payouts, positive operational updates.
    *   **Negative Drivers (Price Down):** Poor harvests, loss of customers, low profits.

In essence, the capital paid to the farmer is used to **create real-world value**. The successful creation of that value then **drives the token's price** on the liquid secondary market.

---

## Quick Start

### Setup & Deploy (Local)

```bash
# Start local replica
df_x start --clean --background

# Deploy all canisters
df_x deploy

# Top up token factory with cycles
df_x canister deposit-cycles 10000000000000 token_factory
```

### Create Your First Farm with Token

#### Interactive Script (Recommended)
```bash
./scripts/create-farm-with-token.sh
```
Follow the prompts to create a farm and launch its token!

#### Manual Commands

**1. Create Farmer Profile**
```bash
df_x canister call mshamba_backend createProfile (
  "John Farmer",
  "Organic farming expert", 
  vec { variant { Farmer } },
  vec { "Organic Certification" }
)
```

**2. Create Farm**
```bash
df_x canister call mshamba_backend createFarm (
  "Green Acres Farm",
  "Organic vegetables",
  "Kiambu, Kenya",
  1000000,
  "10 acres",
  "Vegetables",
  12,
  "5000kg tomatoes",
  "25%",
  "John Kamau",
  "15 years",
  "+254712345678",
  "john@greenacres.ke",
  blob "\00\01\02",
  "image/jpeg",
  "Green Acres Farm Token",
  "GAFT",
  1000000000,
  8,
  10000,
  null
)
```

**3. Launch Token**
```bash
# Replace FARM_ID with the farmId from step 2
df_x canister call mshamba_backend launchFarmToken ('("farm-XXXXXXXXXXXXX")')
```

**4. Open for Investment**
```bash
df_x canister call mshamba_backend toggleFarmInvestmentStatus ('("farm-XXXXXXXXXXXXX", true)')
```

### Common Tasks

*   **List All Farms:** `df_x canister call mshamba_backend listFarms`
*   **View My Farms:** `df_x canister call mshamba_backend myFarms`
*   **Check Token Details:** `df_x canister call LEDGER_ID icrc1_name`
*   **Check Token Balance:** `df_x canister call LEDGER_ID icrc1_balance_of '(record { owner = principal "YOUR_PRINCIPAL"; subaccount = null })'`

### Token Factory Management

*   **Check Status:** `./scripts/manage-token-factory.sh status`
*   **Top Up Cycles:** `./scripts/manage-token-factory.sh topup`
*   **Estimate Remaining Tokens:** `./scripts/manage-token-factory.sh estimate`

### Token Parameters

| Parameter | Description | Example |
|---|---|---|
| **token_name** | Full name of the token | "Green Acres Farm Token" |
| **token_symbol** | Trading symbol (3-5 chars) | "GAFT" |
| **token_supply** | Total supply in smallest unit | 1000000000 (10M with 8 decimals) |
| **token_decimals** | Decimal places (usually 8) | 8 |
| **token_transfer_fee** | Fee per transfer | 10000 (0.0001 tokens if decimals=8) |
| **token_logo** | Logo URL or null | "https://example.com/logo.png" |

### Budget & Cycle Costs

#### Initial Mainnet Deployment

| Component | Cycles Required | USD Equivalent | Purpose |
|---|---|---|---|
| **mshamba_backend** | 10T cycles | ~$13 | Main backend canister deployment |
| **token_factory** | 50T cycles | ~$65 | Token factory canister + initial reserve |
| **mshamba_frontend** | 5T cycles | ~$6.50 | Frontend asset canister |
| **TOTAL INITIAL** | **65T cycles** | **~$84.50** | One-time deployment cost |

#### Per-Farm Token Launch

| Item | Cycles Required | USD Equivalent | Notes |
|---|---|---|---|
| **ICRC-1 Ledger Creation** | ~2T cycles | ~$2.60 | Automatically deducted from token_factory |
| **Ledger Initialization** | Included | Included | Name, symbol, supply, decimals, etc. |
| **Platform Fee** | None | None | Platform covers cycle costs |

**Example:** Launching 10 farm tokens = 20T cycles (~$26)

#### Monthly Operational Costs

| Component | Cycles/Month | USD/Month | Description |
|---|---|---|---|
| **mshamba_backend** | 5-10T | $6.50-$13 | API calls, storage, compute |
| **token_factory** | 40-50T | $52-$65 | 20 new farm tokens per month |
| **mshamba_frontend** | 2-3T | $2.60-$3.90 | Asset serving, HTTP requests |
| **Existing Ledgers** | 0.5T per ledger | $0.65 per ledger | Transfer operations, queries |
| **TOTAL (20 farms/month)** | **~55-75T** | **~$71.50-$97.50** | Scales with activity |

#### Cycle Reserve Recommendations

*   **token_factory:** Maintain 50T+ cycles (supports ~25 farm token launches)
*   **mshamba_backend:** Maintain 20T+ cycles (4-6 months of operations)
*   **mshamba_frontend:** Maintain 10T+ cycles (3-4 months of traffic)
*   **Monitoring:** Set alerts at 25% remaining capacity

#### Cost Optimization

*   **Batch Operations:** Group farm creations to reduce per-operation overhead
*   **Cycle Top-Ups:** Purchase cycles in bulk for better rates
*   **Archive Strategy:** Consider archiving inactive farms after 24 months
*   **Query Optimization:** Use query calls (free) instead of update calls where possible

#### Scaling Projections

| Monthly Farms | Cycle Cost | USD Cost | Notes |
|---|---|---|---|
| **10 farms** | ~35T | ~$45.50 | Light usage |
| **20 farms** | ~60T | ~$78 | Moderate usage (current estimate) |
| **50 farms** | ~130T | ~$169 | Heavy usage |
| **100 farms** | ~240T | ~$312 | Enterprise scale |

**Note:** Cycle-to-USD conversion rate: 1T cycles ≈ $1.30 (varies with ICP price)

### Troubleshooting

*   **"Token must be launched before opening investment"**: Call `launchFarmToken(farmId)` first.
*   **"Out of cycles"**: Top up the token_factory: `df_x canister deposit-cycles 10000000000000 token_factory`
*   **"Only farmers can create farms"**: Create a farmer profile first with `createProfile`.
*   **Token creation taking a long time**: This is normal. Deployment takes 5-15 seconds.

---

## Technical Architecture

*   **Frontend:** React + Vite, Internet Identity, Plug Wallet
*   **Backend:** Motoko
*   **Token Factory:** Rust
*   **Escrow:** Motoko
*   **ICRC-1 Ledgers:** One per farm
*   **External Integrations:** Farm Intelligence API (Python), M-Pesa Gateway (IntaSend), ckUSDC Ledger, National Ag Data, Weather APIs

---

## Mainnet Deployment

### Pre-Deployment Checklist

*   **Code Review & Testing:** Ensure all tests pass, no console errors, and error handling is verified.
*   **Security Review:** No hardcoded secrets, proper access control, and clean imports.
*   **Budget Planning:** Review [Budget & Cycle Costs](#budget--cycle-costs) section. Initial deployment requires ~65T cycles (~$84.50).
*   **Configuration:** Update canister IDs in `dfx.json`, set environment variables, and configure frontend for mainnet.

### Deployment Steps

1.  Set network to mainnet: `export DFX_NETWORK=ic`
2.  Create and use a mainnet deployer identity.
3.  Top up canisters with cycles:
    *   `token_factory`: 50T+ cycles
    *   `mshamba_backend`: 10T+ cycles
    *   `mshamba_frontend`: 5T+ cycles
4.  Deploy canisters:
    ```bash
    df_x deploy mshamba_backend --network ic
    df_x deploy token_factory --network ic
    df_x deploy mshamba_frontend --network ic
    ```
5.  Top up the token factory:
    ```bash
    df_x canister deposit-cycles 50000000000000 token_factory --network ic
    ```
6.  Verify deployments and update configuration files.
7.  Test core functionality on mainnet.
8.  Set controllers for security.

### Post-Deployment Operations

*   **Monitoring & Maintenance:** Monitor cycle balances, perform regular top-ups, and track failed transactions.
*   **Emergency Procedures:** Have a plan for running out of cycles, backend failures, and frontend failures.
*   **Cost Management:** See [Budget & Cycle Costs](#budget--cycle-costs) for detailed monthly operational costs and scaling projections.
*   **Rollback Plan:** Have a process for rolling back to a previous version if a deployment fails.

---

## Changelog

*   **Dynamic Token Factory System:** Each farm can now launch its own ICRC-1 token with custom parameters.
*   **Enhanced Farm System:** Added 6 new token fields to the Farm type.
*   **Developer Tools:** Added scripts for managing the token factory and creating farms.
*   **Legacy System Cleanup:** Removed the shared `farm1_ledger` and related code.
*   **Backend Updates:** `createFarm()` now requires token parameters, and farms are created with `isOpenForInvestment = false` by default.
*   **Configuration:** `dfx.json` and `Cargo.toml` have been updated to support the new token factory.