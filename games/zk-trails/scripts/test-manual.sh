#!/bin/bash

# Load environment variables
# Note: Network passphrase with spaces needs special handling if exported directly
# We just use the file for variables we need
source .env

echo "🧪 Running manual test for Mission Manager..."
echo ""

# Check if CONTRACT_ID is set
if [ -z "$VITE_MISSION_MANAGER_CONTRACT_ID" ]; then
    echo "❌ VITE_MISSION_MANAGER_CONTRACT_ID not set in .env"
    exit 1
fi

echo "1️⃣  Creating a new mission..."

# Check if 'admin' identity exists in stellar keys
if stellar keys address admin > /dev/null 2>&1; then
    echo "✅ Using 'admin' identity from Stellar CLI"
    SOURCE_ACC="--source admin"
else
    # Prompt for secret if not found
    echo "⚠️  'admin' identity not found in Stellar CLI."
    echo "Please enter the Admin Secret Key (starts with S) to proceed:"
    read -s ADMIN_SECRET
    
    if [ -z "$ADMIN_SECRET" ]; then
        echo "❌ No secret provided. Exiting."
        exit 1
    fi
    echo "✅ Secret received."
    SOURCE_ACC="--source-account $ADMIN_SECRET"
fi

CMD="stellar contract invoke \
  --id $VITE_MISSION_MANAGER_CONTRACT_ID \
  --network testnet \
  $SOURCE_ACC \
  -- \
  create_mission \
  --name 'First Mission' \
  --description 'This is a test mission' \
  --reward 100"

echo "Running mission creation..."
# Eval matches the quoted string correctly
eval $CMD

echo ""
echo "✅ Test script finished (check output above)"
