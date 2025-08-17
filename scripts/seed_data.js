// Seed script to create real farm data for testing
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "./src/declarations/mshamba_backend/mshamba_backend.did.js";

const canisterId = "bkyz2-fmaaa-aaaaa-qaaaq-cai";
const host = "http://127.0.0.1:4943";

async function seedData() {
  console.log("🌱 Seeding Mshamba with real farm data...");
  
  const agent = new HttpAgent({ host });
  await agent.fetchRootKey(); // Only for local development
  
  const mshamba = Actor.createActor(idlFactory, {
    agent,
    canisterId,
  });

  try {
    // Create sample farms with real data
    const farms = [
      {
        name: "Green Valley Organic Farm",
        description: "Premium organic vegetables and fruits with sustainable farming practices. Located in fertile valley with excellent water access.",
        location: "Nakuru, Kenya",
        fundingGoal: 50000000000000, // 500,000 ICP in e8s
        landSize: 25.5,
        cropType: { Vegetables: null },
        soilQuality: 8,
        waterAccess: true,
        infrastructure: 7,
        marketAccess: 9,
        climateRisk: 3
      },
      {
        name: "Sunrise Coffee Plantation",
        description: "High-altitude coffee plantation producing premium arabica beans. Export-ready with established international buyers.",
        location: "Kiambu, Kenya",
        fundingGoal: 75000000000000, // 750,000 ICP in e8s
        landSize: 40.0,
        cropType: { Coffee: null },
        soilQuality: 9,
        waterAccess: true,
        infrastructure: 8,
        marketAccess: 10,
        climateRisk: 2
      },
      {
        name: "Golden Grain Cooperative",
        description: "Large-scale maize and wheat production with modern equipment. Serving local and regional markets.",
        location: "Eldoret, Kenya",
        fundingGoal: 30000000000000, // 300,000 ICP in e8s
        landSize: 60.0,
        cropType: { Grains: null },
        soilQuality: 7,
        waterAccess: true,
        infrastructure: 6,
        marketAccess: 8,
        climateRisk: 4
      },
      {
        name: "Tropical Fruit Paradise",
        description: "Diverse tropical fruit orchard including mangoes, avocados, and citrus. Premium export quality.",
        location: "Mombasa, Kenya",
        fundingGoal: 40000000000000, // 400,000 ICP in e8s
        landSize: 18.5,
        cropType: { Fruits: null },
        soilQuality: 8,
        waterAccess: true,
        infrastructure: 7,
        marketAccess: 9,
        climateRisk: 3
      }
    ];

    console.log("Creating farms...");
    const createdFarms = [];
    
    for (const farm of farms) {
      try {
        const result = await mshamba.createFarm(
          farm.name,
          farm.description,
          farm.location,
          farm.fundingGoal,
          farm.landSize,
          farm.cropType,
          farm.soilQuality,
          farm.waterAccess,
          farm.infrastructure,
          farm.marketAccess,
          farm.climateRisk
        );
        
        if ('ok' in result) {
          console.log(`✅ Created farm: ${farm.name}`);
          createdFarms.push(result.ok);
        } else {
          console.log(`❌ Failed to create farm ${farm.name}: ${result.err}`);
        }
      } catch (error) {
        console.log(`❌ Error creating farm ${farm.name}:`, error);
      }
    }

    // Create some investments to generate trading activity
    console.log("\nCreating sample investments...");
    for (const farm of createdFarms) {
      try {
        // Simulate multiple investors
        const investments = [
          { amount: 5000000000000 }, // 50,000 ICP
          { amount: 2500000000000 }, // 25,000 ICP
          { amount: 1000000000000 }, // 10,000 ICP
          { amount: 7500000000000 }, // 75,000 ICP
        ];

        for (const investment of investments) {
          try {
            const result = await mshamba.investInFarm(farm.id, investment.amount);
            if ('ok' in result) {
              console.log(`✅ Investment of ${investment.amount / 100000000} ICP in ${farm.name}`);
            }
          } catch (error) {
            console.log(`⚠️  Investment simulation error:`, error);
          }
        }
      } catch (error) {
        console.log(`⚠️  Error creating investments for ${farm.name}:`, error);
      }
    }

    // Create some market orders for trading activity
    console.log("\nCreating sample market orders...");
    for (const farm of createdFarms) {
      try {
        // Create buy orders
        await mshamba.createMarketOrder(farm.id, { Buy: null }, 1000, farm.sharePrice * 95 / 100); // 5% below current price
        await mshamba.createMarketOrder(farm.id, { Buy: null }, 2500, farm.sharePrice * 98 / 100); // 2% below current price
        
        // Create sell orders
        await mshamba.createMarketOrder(farm.id, { Sell: null }, 1500, farm.sharePrice * 105 / 100); // 5% above current price
        await mshamba.createMarketOrder(farm.id, { Sell: null }, 800, farm.sharePrice * 102 / 100); // 2% above current price
        
        console.log(`✅ Created market orders for ${farm.name}`);
      } catch (error) {
        console.log(`⚠️  Error creating market orders for ${farm.name}:`, error);
      }
    }

    console.log("\n🎉 Data seeding completed!");
    console.log(`Created ${createdFarms.length} farms with investments and market orders`);
    
    // Display farm IDs for reference
    console.log("\n📋 Farm IDs for testing:");
    createdFarms.forEach((farm, index) => {
      console.log(`${index + 1}. ${farm.name}: ${farm.id}`);
    });

  } catch (error) {
    console.error("❌ Error seeding data:", error);
  }
}

seedData();
