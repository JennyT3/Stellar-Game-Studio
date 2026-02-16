import { Contract } from '@stellar/stellar-sdk';

// Cargar variables de entorno
const MISSION_MANAGER = process.env.VITE_MISSION_MANAGER_CONTRACT_ID;
const ZK_TRAILS = process.env.VITE_ZK_TRAILS_CONTRACT_ID;
const GAME_HUB = process.env.VITE_MOCK_GAME_HUB_CONTRACT_ID;

console.log('🧪 Testing deployed contracts...\n');
console.log('Mission Manager:', MISSION_MANAGER);
console.log('ZK Trails:', ZK_TRAILS);
console.log('Game Hub:', GAME_HUB);
