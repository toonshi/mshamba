#!/bin/bash

echo "🌾 Recreating Mshamba Test Data..."

# Create farms with realistic data
echo "Creating Green Valley Organic Farm..."
dfx canister call mshamba_backend createFarm '("Green Valley Organic Farm", "Premium organic vegetables with sustainable farming practices", "Nakuru, Kenya", 50000000000000, 25.5, variant { Vegetables }, 8, true, 7, 9, 3)'

echo "Creating Sunrise Coffee Plantation..."
dfx canister call mshamba_backend createFarm '("Sunrise Coffee Plantation", "High-altitude coffee plantation producing premium arabica beans", "Kiambu, Kenya", 75000000000000, 40.0, variant { Cash_Crops }, 9, true, 8, 10, 2)'

echo "Creating Tropical Fruit Paradise..."
dfx canister call mshamba_backend createFarm '("Tropical Fruit Paradise", "Diverse tropical fruit orchard including mangoes and avocados", "Mombasa, Kenya", 40000000000000, 18.5, variant { Fruits }, 8, true, 7, 9, 3)'

# Get farm IDs (you'll need to update these after running the script)
echo "📋 Getting farm IDs..."
dfx canister call mshamba_backend listFarms | grep "farmId"

echo ""
echo "⚠️  IMPORTANT: Copy the farm IDs from above and update the valuation commands below!"
echo ""
echo "# Add valuation history for Green Valley Farm (replace FARM_ID):"
echo 'dfx canister call mshamba_backend recordFarmValuation "(\"FARM_ID\", 4500000000000)"'
echo 'dfx canister call mshamba_backend recordFarmValuation "(\"FARM_ID\", 4700000000000)"'
echo 'dfx canister call mshamba_backend recordFarmValuation "(\"FARM_ID\", 4900000000000)"'
echo 'dfx canister call mshamba_backend recordFarmValuation "(\"FARM_ID\", 5200000000000)"'
echo ""
echo "# Add valuation history for Coffee Plantation (replace FARM_ID):"
echo 'dfx canister call mshamba_backend recordFarmValuation "(\"FARM_ID\", 12000000000000)"'
echo 'dfx canister call mshamba_backend recordFarmValuation "(\"FARM_ID\", 14500000000000)"'
echo 'dfx canister call mshamba_backend recordFarmValuation "(\"FARM_ID\", 16800000000000)"'
echo 'dfx canister call mshamba_backend recordFarmValuation "(\"FARM_ID\", 15200000000000)"'
echo ""
echo "# Add valuation history for Tropical Fruit Paradise (replace FARM_ID):"
echo 'dfx canister call mshamba_backend recordFarmValuation "(\"FARM_ID\", 4000000000000)"'
echo 'dfx canister call mshamba_backend recordFarmValuation "(\"FARM_ID\", 4600000000000)"'

echo ""
echo "🎉 Test data recreation complete!"
echo "📊 Your trading charts will now have realistic historical data!"
