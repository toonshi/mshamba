#!/bin/bash

# Token Factory Management Script for Mshamba
# Usage: ./scripts/manage-token-factory.sh [command]

set -e

NETWORK="${DFX_NETWORK:-local}"
CANISTER_NAME="token_factory"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}🏭 Mshamba Token Factory Manager${NC}\n"

# Function to check status
check_status() {
    echo -e "${YELLOW}Checking token_factory status...${NC}"
    dfx canister status $CANISTER_NAME --network $NETWORK
}

# Function to top up cycles
topup_cycles() {
    AMOUNT=${1:-10000000000000}  # Default 10T cycles
    echo -e "${YELLOW}Topping up $CANISTER_NAME with $AMOUNT cycles...${NC}"
    dfx canister deposit-cycles $AMOUNT $CANISTER_NAME --network $NETWORK
    check_status
}

# Function to get cycle balance
get_balance() {
    echo -e "${YELLOW}Getting cycle balance...${NC}"
    dfx canister status $CANISTER_NAME --network $NETWORK | grep "Balance:"
}

# Function to estimate remaining tokens
estimate_tokens() {
    echo -e "${YELLOW}Estimating tokens that can be created...${NC}"
    BALANCE=$(dfx canister status $CANISTER_NAME --network $NETWORK | grep "Balance:" | awk '{print $2}')
    CYCLES_PER_TOKEN=2000000000000
    TOKENS=$((BALANCE / CYCLES_PER_TOKEN))
    echo -e "${GREEN}Approximate tokens remaining: $TOKENS${NC}"
    
    if [ $TOKENS -lt 5 ]; then
        echo -e "${RED}⚠️  Warning: Low cycles! Consider topping up.${NC}"
    fi
}

# Function to show help
show_help() {
    cat << EOF
Token Factory Management Commands:

  status          - Show canister status and cycle balance
  topup [amount]  - Top up cycles (default: 10T)
  balance         - Show current cycle balance
  estimate        - Estimate how many tokens can still be created
  help            - Show this help message

Examples:
  ./scripts/manage-token-factory.sh status
  ./scripts/manage-token-factory.sh topup 20000000000000
  ./scripts/manage-token-factory.sh estimate

Note: Each farm token costs approximately 2T cycles (~\$2.50 USD)
EOF
}

# Main command dispatcher
case "${1:-status}" in
    status)
        check_status
        estimate_tokens
        ;;
    topup)
        topup_cycles $2
        ;;
    balance)
        get_balance
        ;;
    estimate)
        estimate_tokens
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        echo -e "${RED}Unknown command: $1${NC}"
        show_help
        exit 1
        ;;
esac
