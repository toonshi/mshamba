#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting Mshamba MVP Test Suite"
echo "================================"
echo

# Step 1: Stop any running dfx instances
echo "🛑 Stopping any running dfx instances..."
dfx stop > /dev/null 2>&1 || true

# Step 2: Start dfx in the background
echo "🚦 Starting dfx..."
dfx start --clean --background

# Step 3: Deploy the canister
echo "🛠️  Deploying Mshamba canister..."
dfx deploy

# Step 4: Get the canister ID
CANISTER_ID=$(dfx canister id mshamba_backend)
echo "📦 Canister ID: $CANISTER_ID"

# Step 5: Build and deploy the test canister
echo "🧪 Building test canister..."
dfx canister create test_workflow
dfx build test_workflow

# Step 6: Install the test canister
echo "🔧 Installing test canister..."
dfx canister install test_workflow

# Step 7: Run the tests
echo "\n🏃 Running tests..."
echo "===================="

dfx canister call test_workflow runTests

# Step 8: Display the test results
echo "\n📊 Test execution completed!"

# Step 9: Stop dfx
echo "\n🛑 Stopping dfx..."
dfx stop

echo "\n✅ Test script completed successfully!"
