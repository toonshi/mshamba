import { Actor, HttpAgent, Principal } from "@dfinity/agent";
import { idlFactory as mshambaIdlFactory } from "../.dfx/local/canisters/mshamba_backend/service.did.js";
import { idlFactory as ledgerIdlFactory } from "../.dfx/local/canisters/icrc1_ledger/service.did.js";
import fetch from 'node-fetch';

global.fetch = fetch;

const mshambaCanisterId = "v27v7-7x777-77774-qaaha-cai";
const ledgerCanisterId = "vt46d-j7777-77774-qaagq-cai";
const host = "http://127.0.0.1:4943";

const agent = new HttpAgent({ host });
agent.fetchRootKey(); // For local development

const mshamba = Actor.createActor(mshambaIdlFactory, {
    agent,
    canisterId: mshambaCanisterId,
});

const ledger = Actor.createActor(ledgerIdlFactory, {
    agent,
    canisterId: ledgerCanisterId,
});

async function createInvestor(name, principal) {
    console.log(`Creating investor profile for ${name}...`);
    const result = await mshamba.createProfile(
        name,
        `Bio for ${name}`,
        { "Investor": null },
        []
    );
    if (result) {
        console.log(`✅ Profile created for ${name}`);
    } else {
        console.error(`❌ Failed to create profile for ${name}`);
    }
}

async function transferTokens(toPrincipal, amount) {
    console.log(`Transferring ${amount} tokens to ${toPrincipal.toText()}...`);
    const mintingAccount = {
        owner: Principal.fromText("frf6c-rdjtw-4xfdf-ghsf7-j2rwe-czr2v-tbxcl-doo7h-bt6jl-vzrzz-mae"),
        subaccount: [],
    };

    const transferArgs = {
        to: {
            owner: toPrincipal,
            subaccount: [],
        },
        amount: BigInt(amount),
        fee: [],
        memo: [],
        from_subaccount: [],
        created_at_time: [],
    };

    try {
        const result = await ledger.icrc1_transfer(transferArgs);
        if ("Ok" in result) {
            console.log(`✅ Transferred ${amount} tokens to ${toPrincipal.toText()}`);
        } else {
            console.error(`❌ Failed to transfer tokens:`, result.Err);
        }
    } catch (error) {
        console.error(`❌ Error transferring tokens:`, error);
    }
}

async function main() {
    // Create two investors
    const alicePrincipal = Principal.fromText("535yc-uxytb-g5kpl-ydk45-gm3a2-6vr4z-sotco-g6ycs-i3p4w-t3esg-uae");
    const bobPrincipal = Principal.fromText("5c2a5-t4f6k-3swqn-qifk5-m3p6f-s5s5g-vswd5-g6j4h-i4p5w-t3esg-uae");

    await createInvestor("Alice", alicePrincipal);
    await createInvestor("Bob", bobPrincipal);

    // Transfer tokens to them
    await transferTokens(alicePrincipal, 100000000000); // 1000 tokens with 8 decimals
    await transferTokens(bobPrincipal, 100000000000);

    console.log("\nInvestors created and tokens transferred.");
}

main();