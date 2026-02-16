#!/usr/bin/env bun
import { $ } from "bun";
import { writeFile, mkdir } from "fs/promises";

const NETWORK = "testnet";

// 🔧 CORRECT ORDER: zk-verifier first, then mission-manager, then zk-trails
const contracts = [
  { packageName: "zk-verifier", needsInit: false }, // No init needed
  { packageName: "mission-manager", needsInit: true },
  { packageName: "zk-trails", needsInit: true },
];

const mock = { packageName: "mock-game-hub" };

console.log("🚀 Deploying contracts to Stellar testnet...\n");

// Setup identities
console.log("Setting up admin identity...");
let adminSecret: string;
let adminPublic: string;

try {
  adminPublic = await $`stellar keys address admin`.text();
  adminPublic = adminPublic.trim();
  adminSecret = await $`stellar keys show admin`.text();
  adminSecret = adminSecret.trim();
  console.log("✅ Using existing admin");
} catch {
  console.log("📝 Generating new admin identity...");
  await $`stellar keys generate admin --network ${NETWORK}`.quiet();
  adminPublic = await $`stellar keys address admin`.text();
  adminPublic = adminPublic.trim();
  adminSecret = await $`stellar keys show admin`.text();
  adminSecret = adminSecret.trim();

  console.log(`💰 Funding ${adminPublic} via friendbot...`);
  await $`stellar keys fund admin --network ${NETWORK}`.quiet();
  console.log("✅ admin funded");
}

// Setup player1
let player1Secret: string;
let player1Public: string;

try {
  player1Public = await $`stellar keys address player1`.text();
  player1Public = player1Public.trim();
  player1Secret = await $`stellar keys show player1`.text();
  player1Secret = player1Secret.trim();
  console.log("✅ Using existing player1");
} catch {
  console.log("📝 Generating new player1...");
  await $`stellar keys generate player1 --network ${NETWORK}`.quiet();
  player1Public = await $`stellar keys address player1`.text();
  player1Public = player1Public.trim();
  player1Secret = await $`stellar keys show player1`.text();
  player1Secret = player1Secret.trim();

  console.log(`✅ player1: ${player1Public}`);
  console.log(`💰 Funding ${player1Public} via friendbot...`);
  await $`stellar keys fund player1 --network ${NETWORK}`.quiet();
  console.log("✅ player1 funded\n");
}

// Setup player2
let player2Secret: string;
let player2Public: string;

try {
  player2Public = await $`stellar keys address player2`.text();
  player2Public = player2Public.trim();
  player2Secret = await $`stellar keys show player2`.text();
  player2Secret = player2Secret.trim();
  console.log("✅ Using existing player2\n");
} catch {
  console.log("📝 Generating new player2...");
  await $`stellar keys generate player2 --network ${NETWORK}`.quiet();
  player2Public = await $`stellar keys address player2`.text();
  player2Public = player2Public.trim();
  player2Secret = await $`stellar keys show player2`.text();
  player2Secret = player2Secret.trim();

  console.log(`✅ player2: ${player2Public}`);
  console.log(`💰 Funding ${player2Public} via friendbot...`);
  await $`stellar keys fund player2 --network ${NETWORK}`.quiet();
  console.log("✅ player2 funded\n");
}

console.log("🔐 Player secret keys will be saved to .env (gitignored)\n");
console.log("💼 Wallet addresses:");
console.log(`  Admin:   ${adminPublic}`);
console.log(`  Player1: ${player1Public}`);
console.log(`  Player2: ${player2Public}\n`);

// Deploy or reuse mock-game-hub
let mockGameHubId: string;
const mockWasmPath = `target/wasm32v1-none/release/${mock.packageName.replace(/-/g, "_")}.wasm`;

try {
  const existingMockId = process.env.VITE_MOCK_GAME_HUB_CONTRACT_ID;
  if (existingMockId && existingMockId !== "PENDIENTE") {
    console.log(`✅ Using existing ${mock.packageName} on testnet: ${existingMockId}\n`);
    mockGameHubId = existingMockId;
  } else {
    throw new Error("No existing mock");
  }
} catch {
  console.log(`Deploying ${mock.packageName}...`);
  console.log("  Uploading WASM...");
  const mockUploadResult = await $`stellar contract upload --wasm ${mockWasmPath} --source admin --network ${NETWORK}`.text();
  const mockWasmHash = mockUploadResult.trim();
  console.log(`  WASM hash: ${mockWasmHash}`);

  console.log("  Deploying...");
  mockGameHubId = await $`stellar contract deploy --wasm-hash ${mockWasmHash} --source admin --network ${NETWORK}`.text();
  mockGameHubId = mockGameHubId.trim();
  console.log(`✅ ${mock.packageName} deployed: ${mockGameHubId}\n`);
}

const deployed: Record<string, string> = {
  [mock.packageName]: mockGameHubId,
};

// Deploy main contracts IN CORRECT ORDER
for (const contract of contracts) {
  try {
    console.log(`Deploying ${contract.packageName}...`);
    const wasmPath = `target/wasm32v1-none/release/${contract.packageName.replace(/-/g, "_")}.wasm`;

    console.log("  Uploading WASM...");
    const uploadResult = await $`stellar contract upload --wasm ${wasmPath} --source admin --network ${NETWORK}`.text();
    const wasmHash = uploadResult.trim();
    console.log(`  WASM hash: ${wasmHash}`);

    console.log("  Deploying...");
    const deployResult = await $`stellar contract deploy --wasm-hash ${wasmHash} --source admin --network ${NETWORK}`.text();
    const contractId = deployResult.trim();

    deployed[contract.packageName] = contractId;

    // INITIALIZE CONTRACT
    if (contract.needsInit) {
      console.log("  Initializing contract...");

      if (contract.packageName === "mission-manager") {
        // 🆕 Mission Manager needs admin and game_hub
        await $`stellar contract invoke --id ${contractId} --source admin --network ${NETWORK} -- initialize --admin ${adminPublic} --game_hub ${mockGameHubId}`.quiet();
        console.log("  ✅ Initialized with Game Hub integration");

      } else if (contract.packageName === "zk-trails") {
        // 🆕 ZK Trails needs admin, mission_manager and zk_verifier
        const missionManagerId = deployed["mission-manager"];
        const zkVerifierId = deployed["zk-verifier"];

        await $`stellar contract invoke --id ${contractId} --source admin --network ${NETWORK} -- initialize --admin ${adminPublic} --mission_manager ${missionManagerId} --zk_verifier ${zkVerifierId}`.quiet();
        console.log("  ✅ Initialized with Mission Manager and ZK Verifier");
      }
    } else {
      console.log("  ⚠️ Contract does not require initialization");
    }

    console.log(`✅ ${contract.packageName} deployed: ${contractId}\n`);

  } catch (error) {
    console.error(`❌ Failed to deploy ${contract.packageName}:`, error);
    process.exit(1);
  }
}

console.log("🎉 Deployment complete!\n");
console.log("Contract IDs:");
console.log(`  ${mock.packageName}: ${deployed[mock.packageName]}`);
for (const contract of contracts) {
  console.log(`  ${contract.packageName}: ${deployed[contract.packageName]}`);
}

// Save to deployment.json
const deploymentData = {
  network: NETWORK,
  timestamp: new Date().toISOString(),
  contracts: deployed,
};

await mkdir(".", { recursive: true });
await writeFile("deployment.json", JSON.stringify(deploymentData, null, 2));
console.log("\n✅ Wrote deployment info to deployment.json");

// Update .env
const envContent = `# ZK-Trails Environment Variables
# Generated on ${new Date().toLocaleString()}

VITE_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
VITE_NETWORK_PASSPHRASE="Test SDF Network ; September 2015"
VITE_MOCK_GAME_HUB_CONTRACT_ID=${deployed[mock.packageName]}
VITE_MISSION_MANAGER_CONTRACT_ID=${deployed["mission-manager"]}
VITE_ZK_VERIFIER_CONTRACT_ID=${deployed["zk-verifier"]}
VITE_ZK_TRAILS_CONTRACT_ID=${deployed["zk-trails"]}

# Account addresses
ADMIN_PUBLIC=${adminPublic}
PLAYER1_PUBLIC=${player1Public}
PLAYER2_PUBLIC=${player2Public}

# Secrets (DO NOT COMMIT)
ADMIN_SECRET=${adminSecret}
PLAYER1_SECRET=${player1Secret}
PLAYER2_SECRET=${player2Secret}
`;

await writeFile(".env", envContent);
console.log("✅ Wrote secrets to .env (gitignored)");