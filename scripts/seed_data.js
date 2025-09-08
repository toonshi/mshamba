// Seed script to create real farm data for testing
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "../src/declarations/mshamba_backend/mshamba_backend.did.js";
import { Principal } from "@dfinity/principal";

const canisterId = "pwj2z-kaaaa-aaaac-a4bea-cai";
const host = "https://icp-api.io";

async function seedData() {
  console.log("🌱 Seeding Mshamba with real farm data...");

  const agent = new HttpAgent({ host });
  // No need to fetchRootKey for mainnet

  const mshamba = Actor.createActor(idlFactory, {
    agent,
    canisterId,
  });

  try {
    // Create a farmer profile for the caller
    console.log("Creating farmer profile...");
    const profileResult = await mshamba.createProfile(
      "Test Farmer",
      "A test farmer profile.",
      { Farmer: null },
      [],
      ""
    );

    if (profileResult) {
      console.log("✅ Farmer profile created successfully.");
    } else {
      console.log("❌ Failed to create farmer profile.");
      return; // Exit if profile creation fails
    }

    // Create sample farms with real data
    const farms = [
      {
        name: "Green Valley",
        description: "A beautiful farm in the heart of the valley.",
        location: "Rift Valley",
        fundingGoal: 100000,
        image: "https://images.pexels.com/photos/235725/pexels-photo-235725.jpeg",
        crop: "Maize",
        size: "10 acres",
        minInvestment: 1000,
        duration: 12,
        ledgerId: "osevl-taaaa-aaaac-a4bca-cai",
      },
      {
        name: "Sunny Meadows",
        description: "A sunny farm with a beautiful view.",
        location: "Nakuru",
        fundingGoal: 200000,
        image: "https://images.pexels.com/photos/326055/pexels-photo-326055.jpeg",
        crop: "Coffee",
        size: "20 acres",
        minInvestment: 2000,
        duration: 24,
        ledgerId: "ovft7-6yaaa-aaaac-a4bcq-cai",
      },
      {
        name: "Golden Fields",
        description: "A farm with golden fields of wheat.",
        location: "Eldoret",
        fundingGoal: 300000,
        image: "https://images.pexels.com/photos/265216/pexels-photo-265216.jpeg",
        crop: "Wheat",
        size: "30 acres",
        minInvestment: 3000,
        duration: 18,
        ledgerId: "o4gyd-iqaaa-aaaac-a4bda-cai",
      },
      {
        name: "Happy Acres",
        description: "A happy farm with happy animals.",
        location: "Naivasha",
        fundingGoal: 400000,
        image: "https://images.pexels.com/photos/1482476/pexels-photo-1482476.jpeg",
        crop: "Tomatoes",
        size: "40 acres",
        minInvestment: 4000,
        duration: 6,
        ledgerId: "o3h6x-fiaaa-aaaac-a4bdq-cai",
      },
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
          farm.image,
          farm.crop,
          farm.size,
          farm.minInvestment,
          farm.duration
        );

        if ("ok" in result) {
          console.log(`✅ Created farm: ${farm.name}`);
          createdFarms.push(result.ok);
        } else {
          console.log(`❌ Failed to create farm ${farm.name}: ${result.err}`);
        }
      } catch (error) {
        console.log(`❌ Error creating farm ${farm.name}:`, error);
      }
    }

    console.log("\nLinking farms to ledger canisters...");
    for (let i = 0; i < createdFarms.length; i++) {
      const farm = createdFarms[i];
      const ledgerId = farms[i].ledgerId;
      try {
        const result = await mshamba.updateFarmLedger(
          farm.id,
          Principal.fromText(ledgerId)
        );
        if ("ok" in result) {
          console.log(`✅ Linked farm ${farm.name} to ledger ${ledgerId}`);
        } else {
          console.log(
            `❌ Failed to link farm ${farm.name} to ledger ${ledgerId}: ${result.err}`
          );
        }
      } catch (error) {
        console.log(
          `❌ Error linking farm ${farm.name} to ledger ${ledgerId}:`,
          error
        );
      }
    }

    console.log("\n🎉 Data seeding completed!");
    console.log(`Created and linked ${createdFarms.length} farms.`);

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
