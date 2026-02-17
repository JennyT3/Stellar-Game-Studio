#!/bin/bash

# ZK-Trails: Complete Mission with ZK Proof
# Usage: ./complete_zk_mission.sh <MISSION_ID> <LAT> <LON> <WALLET_ADDRESS>

set -e

MISSION_ID=${1:-0}
LAT=${2:-40.405000}
LON=${3:--3.695000}
WALLET=${4:-$VITE_WALLET_ADDRESS}

# Configuration
CIRCUIT_PATH="/Users/jennytejedor/Desktop/Stellar-Game-Studio/games/zk-trails/circuits/location_proof"
PROOF_PATH="$CIRCUIT_PATH/proofs/location_proof.proof"
MISSION_MANAGER=${MISSION_MANAGER_CONTRACT:-"CAVJDRDVMH36E2AXJRJZYIPTERLP672WLPGSCAK7IDNJF4MQF42YXHH4"}

echo "🎯 ZK-Trails Mission Completion"
echo "================================"
echo "Mission ID: $MISSION_ID"
echo "Location: $LAT, $LON"
echo "Wallet: $WALLET"

# Step 1: Convert coordinates (multiply by 10^6)
LAT_INT=$(echo "$LAT * 1000000" | bc | cut -d. -f1)
LON_INT=$(echo "$LON * 1000000" | bc | cut -d. -f1)
NOW=$(date +%s)
USER_TIME=$((NOW - 60))  # 1 minute ago

echo ""
echo "📍 Step 1: Coordinates converted"
echo "   Lat: $LAT_INT"
echo "   Lon: $LON_INT"
echo "   Time: $USER_TIME"

# Step 2: Generate Prover.toml dynamically
echo ""
echo "🔧 Step 2: Generating Prover.toml..."
cat > "$CIRCUIT_PATH/Prover.toml" << EOT
zone_lat_min = "40400000"
zone_lat_max = "40410000"
zone_lon_min = "-3700000"
zone_lon_max = "-3690000"
current_time = "$NOW"
max_age = "300"
user_lat = "$LAT_INT"
user_lon = "$LON_INT"
user_time = "$USER_TIME"
EOT
echo "   ✅ Prover.toml created"

# Step 3: Generate ZK Proof
echo ""
echo "🔐 Step 3: Generating ZK Proof with Noir..."
cd "$CIRCUIT_PATH"
if ! command -v nargo &> /dev/null; then
    echo "   ❌ nargo not found. Please install Noir:"
    echo "      curl -L https://noirup.dev | bash"
    exit 1
fi

nargo prove
if [ ! -f "$PROOF_PATH" ]; then
    echo "   ❌ Proof generation failed"
    exit 1
fi
PROOF_SIZE=$(stat -f%z "$PROOF_PATH" 2>/dev/null || stat -c%s "$PROOF_PATH" 2>/dev/null)
echo "   ✅ Proof generated: $PROOF_SIZE bytes"

# Step 4: Convert proof to hex for blockchain
echo ""
echo "📦 Step 4: Preparing for Stellar..."
PROOF_HEX=$(xxd -p "$PROOF_PATH" | tr -d '\n')
echo "   ✅ Proof serialized to hex (${#PROOF_HEX} chars)"

# Step 5: Submit to Stellar
echo ""
echo "⛓️  Step 5: Submitting to Stellar Testnet..."
echo "   Contract: $MISSION_MANAGER"

# Check if stellar CLI is installed
if ! command -v stellar &> /dev/null; then
    echo "   ❌ stellar CLI not found. Install with:"
    echo "      cargo install stellar-cli"
    exit 1
fi

# Submit transaction
stellar contract invoke \
    --id "$MISSION_MANAGER" \
    --network testnet \
    --source-account "$WALLET" \
    -- \
    complete_mission \
    --player "$WALLET" \
    --mission_id "$MISSION_ID" \
    --score 100 \
    --zk_proof "$PROOF_HEX"

echo ""
echo "✅ Mission completed successfully!"
echo "   Check your stats at: https://zk-trails.vercel.app/dashboard"
