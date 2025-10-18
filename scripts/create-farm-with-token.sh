#!/bin/bash

# Create Farm with Token - Complete Workflow Script
# This script demonstrates the full farm creation and token launch process

set -e

NETWORK="${DFX_NETWORK:-local}"
BACKEND="mshamba_backend"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}🌾 Mshamba Farm Creation Wizard${NC}\n"

# Check if user is authenticated
echo -e "${YELLOW}Step 1: Checking identity...${NC}"
IDENTITY=$(dfx identity whoami)
PRINCIPAL=$(dfx identity get-principal)
echo -e "${BLUE}Using identity: $IDENTITY ($PRINCIPAL)${NC}\n"

# Interactive mode if no arguments provided
if [ $# -eq 0 ]; then
    echo -e "${YELLOW}📝 Enter farm details:${NC}"
    
    read -p "Farm Name: " FARM_NAME
    read -p "Description: " DESCRIPTION
    read -p "Location: " LOCATION
    read -p "Funding Goal (e.g., 1000000): " FUNDING_GOAL
    read -p "Farm Size (e.g., 10 acres): " SIZE
    read -p "Crop Type: " CROP
    read -p "Duration (months): " DURATION
    read -p "Expected Yield: " EXPECTED_YIELD
    read -p "Expected ROI (e.g., 25%): " EXPECTED_ROI
    read -p "Farmer Name: " FARMER_NAME
    read -p "Experience: " EXPERIENCE
    read -p "Phone: " PHONE
    read -p "Email: " EMAIL
    
    echo -e "\n${YELLOW}🪙 Enter token details:${NC}"
    read -p "Token Name (e.g., Green Acres Token): " TOKEN_NAME
    read -p "Token Symbol (e.g., GAFT): " TOKEN_SYMBOL
    read -p "Token Supply (e.g., 1000000000): " TOKEN_SUPPLY
    read -p "Token Decimals (usually 8): " TOKEN_DECIMALS
    read -p "Transfer Fee (e.g., 10000): " TOKEN_FEE
    read -p "Token Logo URL (optional, press enter to skip): " TOKEN_LOGO
    
    # Set token logo to null if empty
    if [ -z "$TOKEN_LOGO" ]; then
        TOKEN_LOGO_PARAM="null"
    else
        TOKEN_LOGO_PARAM="opt \"$TOKEN_LOGO\""
    fi
else
    # Use command line arguments (for scripting)
    FARM_NAME=$1
    DESCRIPTION=$2
    LOCATION=$3
    FUNDING_GOAL=$4
    SIZE=$5
    CROP=$6
    DURATION=$7
    EXPECTED_YIELD=$8
    EXPECTED_ROI=$9
    FARMER_NAME=${10}
    EXPERIENCE=${11}
    PHONE=${12}
    EMAIL=${13}
    TOKEN_NAME=${14}
    TOKEN_SYMBOL=${15}
    TOKEN_SUPPLY=${16}
    TOKEN_DECIMALS=${17}
    TOKEN_FEE=${18}
    TOKEN_LOGO=${19:-null}
    TOKEN_LOGO_PARAM=${TOKEN_LOGO}
fi

echo -e "\n${YELLOW}Step 2: Creating farm...${NC}"

# Create farm
RESULT=$(dfx canister call $BACKEND createFarm "(
  \"$FARM_NAME\",
  \"$DESCRIPTION\",
  \"$LOCATION\",
  $FUNDING_GOAL,
  \"$SIZE\",
  \"$CROP\",
  $DURATION,
  \"$EXPECTED_YIELD\",
  \"$EXPECTED_ROI\",
  \"$FARMER_NAME\",
  \"$EXPERIENCE\",
  \"$PHONE\",
  \"$EMAIL\",
  blob \"\\00\\01\\02\",
  \"image/jpeg\",
  \"$TOKEN_NAME\",
  \"$TOKEN_SYMBOL\",
  $TOKEN_SUPPLY,
  $TOKEN_DECIMALS,
  $TOKEN_FEE,
  $TOKEN_LOGO_PARAM
)" --network $NETWORK)

# Extract farmId from result
FARM_ID=$(echo "$RESULT" | grep -o 'farmId = "[^"]*"' | cut -d'"' -f2)

if [ -z "$FARM_ID" ]; then
    echo -e "${RED}❌ Failed to create farm${NC}"
    echo "$RESULT"
    exit 1
fi

echo -e "${GREEN}✅ Farm created successfully!${NC}"
echo -e "${BLUE}Farm ID: $FARM_ID${NC}\n"

# Ask to launch token
read -p "Launch token now? (y/n): " LAUNCH
if [[ $LAUNCH =~ ^[Yy]$ ]]; then
    echo -e "\n${YELLOW}Step 3: Launching farm token...${NC}"
    echo -e "${BLUE}This will take approximately 5-10 seconds...${NC}"
    
    TOKEN_RESULT=$(dfx canister call $BACKEND launchFarmToken "(\"$FARM_ID\")" --network $NETWORK)
    
    # Extract token canister ID
    TOKEN_CANISTER=$(echo "$TOKEN_RESULT" | grep -o 'principal "[^"]*"' | head -1 | cut -d'"' -f2)
    
    if [ -z "$TOKEN_CANISTER" ]; then
        echo -e "${RED}❌ Failed to launch token${NC}"
        echo "$TOKEN_RESULT"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Token launched successfully!${NC}"
    echo -e "${BLUE}Token Canister: $TOKEN_CANISTER${NC}\n"
    
    # Verify token
    echo -e "${YELLOW}Step 4: Verifying token...${NC}"
    NAME=$(dfx canister call $TOKEN_CANISTER icrc1_name --network $NETWORK)
    SYMBOL=$(dfx canister call $TOKEN_CANISTER icrc1_symbol --network $NETWORK)
    SUPPLY=$(dfx canister call $TOKEN_CANISTER icrc1_total_supply --network $NETWORK)
    
    echo -e "${GREEN}Token Details:${NC}"
    echo -e "  Name: $NAME"
    echo -e "  Symbol: $SYMBOL"
    echo -e "  Supply: $SUPPLY"
    
    # Ask to open for investment
    read -p "Open farm for investment now? (y/n): " OPEN
    if [[ $OPEN =~ ^[Yy]$ ]]; then
        echo -e "\n${YELLOW}Step 5: Opening farm for investment...${NC}"
        OPEN_RESULT=$(dfx canister call $BACKEND toggleFarmInvestmentStatus "(\"$FARM_ID\", true)" --network $NETWORK)
        echo -e "${GREEN}✅ Farm is now open for investment!${NC}\n"
    fi
fi

# Summary
echo -e "\n${GREEN}════════════════════════════════════════${NC}"
echo -e "${GREEN}📊 Summary${NC}"
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo -e "Farm: $FARM_NAME"
echo -e "Farm ID: ${BLUE}$FARM_ID${NC}"
if [ ! -z "$TOKEN_CANISTER" ]; then
    echo -e "Token: $TOKEN_NAME ($TOKEN_SYMBOL)"
    echo -e "Token Canister: ${BLUE}$TOKEN_CANISTER${NC}"
fi
echo -e "${GREEN}════════════════════════════════════════${NC}\n"

# Next steps
echo -e "${YELLOW}📝 Next Steps:${NC}"
echo -e "  • View farm: dfx canister call $BACKEND listFarms"
echo -e "  • Check your farms: dfx canister call $BACKEND myFarms"
if [ ! -z "$TOKEN_CANISTER" ]; then
    echo -e "  • Query token: dfx canister call $TOKEN_CANISTER icrc1_balance_of '(record { owner = principal \"$PRINCIPAL\"; subaccount = null })'"
fi
echo ""
