#!/usr/bin/env bun
import { config } from 'dotenv';
import { $ } from 'bun';

config();

const MISSION_MANAGER = process.env.VITE_MISSION_MANAGER_CONTRACT_ID;
const ZK_TRAILS = process.env.VITE_ZK_TRAILS_CONTRACT_ID;
const GAME_HUB = process.env.VITE_MOCK_GAME_HUB_CONTRACT_ID;
const PLAYER1 = process.env.PLAYER1_PUBLIC;
const ADMIN = process.env.ADMIN_PUBLIC;

console.log('🧪 Testing ZK-Trails Contract Flow\n');
console.log('📋 Contract IDs:');
console.log('  Mission Manager:', MISSION_MANAGER);
console.log('  ZK Trails:', ZK_TRAILS);
console.log('  Game Hub:', GAME_HUB);
console.log('\n👥 Test Accounts:');
console.log('  Admin:', ADMIN);
console.log('  Player1:', PLAYER1);

console.log('\n🎯 Test 1: Create a mission');
try {
  const result = await $`stellar contract invoke \
    --id ${MISSION_MANAGER} \
    --source admin \
    --network testnet \
    -- \
    create_mission \
    --admin ${ADMIN} \
    --name "First CTF Challenge" \
    --mission_type '{"tag":"Online","values":[]}' \
    --difficulty 1 \
    --points 100 \
    --location_hash 0000000000000000000000000000000000000000000000000000000000000001 \
    --challenge_hash 0000000000000000000000000000000000000000000000000000000000000002 \
    --max_completions 10 \
    --reward_token ${ADMIN} \
    --reward_amount 0`.text();
  
  console.log('✅ Mission created! ID:', result.trim());
} catch (error) {
  console.log('❌ Error creating mission:', error.stderr);
}

console.log('\n🎯 Test 2: Get all missions');
try {
  const missions = await $`stellar contract invoke \
    --id ${MISSION_MANAGER} \
    --source player1 \
    --network testnet \
    -- \
    get_all_missions`.text();
  
  console.log('✅ Missions:', missions);
} catch (error) {
  console.log('❌ Error getting missions:', error.stderr);
}

console.log('\n🎯 Test 3: Start mission as player');
try {
  const result = await $`stellar contract invoke \
    --id ${MISSION_MANAGER} \
    --source player1 \
    --network testnet \
    -- \
    start_mission \
    --player ${PLAYER1} \
    --mission_id 1`.text();
  
  console.log('✅ Mission started!', result);
} catch (error) {
  console.log('❌ Error starting mission:', error.stderr);
}

console.log('\n🎯 Test 4: Get player stats');
try {
  const stats = await $`stellar contract invoke \
    --id ${MISSION_MANAGER} \
    --source player1 \
    --network testnet \
    -- \
    get_player_stats \
    --player ${PLAYER1}`.text();
  
  console.log('✅ Player stats:', stats);
} catch (error) {
  console.log('❌ Error getting stats:', error.stderr);
}

console.log('\n✅ Basic flow test completed!');
