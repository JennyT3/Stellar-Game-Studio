#!/usr/bin/env bun
import { $ } from "bun";

const NETWORK = "testnet";
const GAME_HUB = "CB4VZAT2U3UC6XFK3N23SKRF2NDCMP3QHJYMCHHFMZO7MRQO6DQ2EMYG";

console.log("🚀 Deploying remaining contracts...\n");

// Deploy zk-trails
console.log("Deploying zk-trails...");
const zkTrailsWasm = "target/wasm32v1-none/release/zk_trails.wasm";

console.log("  Uploading WASM...");
const zkTrailsHash = await $`stellar contract upload --wasm ${zkTrailsWasm} --source admin --network ${NETWORK}`.text();
console.log(`  WASM hash: ${zkTrailsHash.trim()}`);

console.log("  Deploying...");
const zkTrailsId = await $`stellar contract deploy --wasm-hash ${zkTrailsHash.trim()} --source admin --network ${NETWORK}`.text();
console.log(`  Contract ID: ${zkTrailsId.trim()}`);

console.log("  Initializing...");
const adminAddr = await $`stellar keys address admin`.text();
await $`stellar contract invoke --id ${zkTrailsId.trim()} --source admin --network ${NETWORK} -- initialize --admin ${adminAddr.trim()} --game_hub ${GAME_HUB}`.quiet();
console.log("  ✅ Initialized\n");

// Deploy zk-verifier (no initialize needed)
console.log("Deploying zk-verifier...");
const zkVerifierWasm = "target/wasm32v1-none/release/zk_verifier.wasm";

console.log("  Uploading WASM...");
const zkVerifierHash = await $`stellar contract upload --wasm ${zkVerifierWasm} --source admin --network ${NETWORK}`.text();
console.log(`  WASM hash: ${zkVerifierHash.trim()}`);

console.log("  Deploying...");
const zkVerifierId = await $`stellar contract deploy --wasm-hash ${zkVerifierHash.trim()} --source admin --network ${NETWORK}`.text();
console.log(`  Contract ID: ${zkVerifierId.trim()}`);
console.log("  ✅ No initialization needed\n");

console.log("🎉 All contracts deployed!\n");
console.log("Update your .env with:");
console.log(`VITE_ZK_TRAILS_CONTRACT_ID=${zkTrailsId.trim()}`);
console.log(`VITE_ZK_VERIFIER_CONTRACT_ID=${zkVerifierId.trim()}`);
