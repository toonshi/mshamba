#!/usr/bin/env bash
set -e

echo "🚀 Starting Mshamba TokenFactory test (dfx 0.28.0 compatible)"

# CONFIG
TOP_UP_ICP=1 
TOKEN_FACTORY_ID=$(dfx canister id token_factory)

echo "🏭 Token factory ID: $TOKEN_FACTORY_ID"

# Ensure identities exist
for ID in farmer investor1 governance; do
  if ! dfx identity list | grep -q "$ID"; then
    echo "⚠ Creating identity: $ID"
    dfx identity new "$ID"
  else
    echo "*✅ Identity exists: $ID"
  fi
done

# Get principals
FARMER_PRINCIPAL=$(dfx identity --identity farmer get-principal)
INVESTOR_PRINCIPAL=$(dfx identity --identity investor1 get-principal)
GOVERNANCE_PRINCIPAL=$(dfx identity --identity governance get-principal)

echo "👨‍🌾 Farmer principal: $FARMER_PRINCIPAL"
echo "💰 Investor principal: $INVESTOR_PRINCIPAL"
echo "🏛 Governance principal: $GOVERNANCE_PRINCIPAL"

# Switch to farmer identity
echo "🔄 Switching active identity to farmer"
dfx identity use farmer
echo "Using identity: $(dfx identity get-principal)"

# Get farmer wallet
FARMER_WALLET=$(dfx identity get-wallet)

# Step 1: Fabricate cycles to farmer's cycle balance
echo "💵 Fabricating $TOP_UP_ICP ICP to farmer's wallet..."
dfx ledger fabricate-cycles --icp "$TOP_UP_ICP" --canister "$FARMER_WALLET"

# Step 2: Send cycles from farmer's wallet to token factory canister
# Increased cycles amount to ensure the canister creation succeeds.
CYCLES_TO_SEND=2000000000000 # Increased cycles to 2T
echo "💵 Sending $CYCLES_TO_SEND cycles from farmer wallet to token factory..."
dfx wallet send "$TOKEN_FACTORY_ID" "$CYCLES_TO_SEND"

# Create farm token
echo "🛠 Creating farm token..."
TOKEN_ID=$(dfx canister call token_factory createFarmToken \
  "(\"MshambaFarm\", \"MSH\", principal \"$FARMER_PRINCIPAL\", 1000000, 
  vec { record { owner = principal \"$INVESTOR_PRINCIPAL\"; allocation = 100000 } }, 
  opt principal \"$GOVERNANCE_PRINCIPAL\", 365, 10)" \
  --output raw | didc decode -t principal)

echo "🎯 New token deployed: $TOKEN_ID"

# Query token name
echo "🔎 Token name:"
dfx canister call "$TOKEN_ID" getName

# Query token symbol
echo "🔎 Token symbol:"
dfx canister call "$TOKEN_ID" getSymbol

# Check balances
echo "💳 Farmer balance:"
dfx canister call "$TOKEN_ID" getBalance "(principal \"$FARMER_PRINCIPAL\")"

echo "💳 Investor balance:"
dfx canister call "$TOKEN_ID" getBalance "(principal \"$INVESTOR_PRINCIPAL\")"

# Transfer tokens
echo "💸 Transferring 5000 from farmer to investor..."
dfx canister call "$TOKEN_ID" transfer "(principal \"$INVESTOR_PRINCIPAL\", 5000:nat)"

# Re-check balances
echo "💳 Farmer balance after transfer:"
dfx canister call "$TOKEN_ID" getBalance "(principal \"$FARMER_PRINCIPAL\")"

echo "💳 Investor balance after transfer:"
dfx canister call "$TOKEN_ID" getBalance "(principal \"$INVESTOR_PRINCIPAL\")"

echo "✅ Test completed successfully"