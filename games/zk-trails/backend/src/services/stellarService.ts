import dotenv from 'dotenv';
dotenv.config();

import { 
  Keypair, 
  Networks, 
  Horizon, 
  TransactionBuilder, 
  Operation, 
  Asset, 
  Contract, 
  rpc,
  xdr,
  Address,
  nativeToScVal
} from '@stellar/stellar-sdk';
import * as fs from 'fs';
import * as path from 'path';
import * as toml from 'toml';

const NETWORK_PASSPHRASE = Networks.TESTNET;
const RPC_URL = process.env.STELLAR_RPC_URL || 'https://soroban-testnet.stellar.org';
const MISSION_MANAGER_CONTRACT = process.env.MISSION_MANAGER_CONTRACT || 'CAVJDRDVMH36E2AXJRJZYIPTERLP672WLPGSCAK7IDNJF4MQF42YXHH4';
const ZK_VERIFIER_CONTRACT = process.env.ZK_VERIFIER_CONTRACT || 'CCU3OVHMC3UR6JJISIIEBFYXOQRUKXHP752R7VUGFZQRXL6ULP2ZUW23';

let adminKeypair: Keypair | null = null;
let server: Horizon.Server | null = null;
let sorobanServer: rpc.Server | null = null;

export function initStellar(): boolean {
  try {
    console.log('🔍 Searching for identity: admin');
    console.log('   Env var check:', process.env.STELLAR_ADMIN_SECRET ? 'FOUND' : 'NOT FOUND');
    
    const possiblePaths = [
      path.join(process.env.HOME || '', '.config/stellar/identity/admin.toml'),
      path.join(process.env.HOME || '', '.config/soroban/identity/admin.toml'),
      path.join(process.env.HOME || '', '.stellar/identity/admin.toml'),
      path.join(process.env.HOME || '', '.soroban/identity/admin.toml'),
      path.join(process.env.HOME || '', 'Library/Application Support/stellar/identity/admin.toml'),
      path.join(process.env.HOME || '', 'Library/Application Support/soroban/identity/admin.toml'),
    ];

    let identityPath: string | null = null;
    for (const p of possiblePaths) {
      console.log(`   Checking: ${p}`);
      if (fs.existsSync(p)) {
        console.log(`   ✅ Found!`);
        identityPath = p;
        break;
      }
    }

    if (!identityPath) {
      console.error('❌ Identity file not found');
    }
    
    // Try env var first if available
    if (process.env.STELLAR_ADMIN_SECRET && process.env.STELLAR_ADMIN_SECRET !== 'YOUR_TESTNET_SECRET_KEY_HERE') {
      console.log('   Using STELLAR_ADMIN_SECRET from env...');
      try {
        adminKeypair = Keypair.fromSecret(process.env.STELLAR_ADMIN_SECRET);
        console.log('   ✅ Loaded from env var');
      } catch (e) {
        console.error('   ❌ Invalid secret key in env var:', e);
        return false;
      }
    } else if (identityPath) {
      const content = fs.readFileSync(identityPath, 'utf8');
      const parsed = toml.parse(content);
      
      if (parsed.secret_key) {
        console.log('   Found secret_key in TOML...');
        adminKeypair = Keypair.fromSecret(parsed.secret_key);
        console.log('   ✅ Loaded from TOML secret_key');
      } else if (parsed.seed_phrase) {
        console.log('   ⚠️  Seed phrase found but no env var set');
        console.error('   Set STELLAR_ADMIN_SECRET with secret key (S...)');
        return false;
      }
    } else {
      console.error('❌ No identity file or env var found');
      return false;
    }

    server = new Horizon.Server('https://horizon-testnet.stellar.org');
    sorobanServer = new rpc.Server(RPC_URL);
    
    console.log(`   Admin: ${adminKeypair!.publicKey().substring(0, 15)}...`);
    console.log('✅ Stellar initialized');
    return true;
  } catch (error) {
    console.error('❌ Stellar init error:', error);
    return false;
  }
}

export function isStellarInitialized(): boolean {
  return adminKeypair !== null && server !== null;
}

export function getAdminPublicKey(): string | null {
  return adminKeypair?.publicKey() || null;
}

export async function verifyZKProofOnChain(proofHex: string, publicInputs: string[]): Promise<boolean> {
  if (!isStellarInitialized()) {
    console.log('⚠️  Stellar not initialized, skipping verification');
    return false;
  }

  try {
    console.log('⛓️  Verifying ZK proof on-chain...');
    
    const contract = new Contract(ZK_VERIFIER_CONTRACT);
    const sourceAccount = await server!.loadAccount(adminKeypair!.publicKey());
    
    const proofBytes = Buffer.from(proofHex.slice(2), 'hex');
    const proofScVal = xdr.ScVal.scvBytes(proofBytes);
    
    const transaction = new TransactionBuilder(sourceAccount, {
      fee: '100000',
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(
        contract.call(
          'verify_proof',
          proofScVal,
          xdr.ScVal.scvVec(publicInputs.map(input => 
            xdr.ScVal.scvBytes(Buffer.from(input, 'hex'))
          ))
        )
      )
      .setTimeout(30)
      .build();

    transaction.sign(adminKeypair!);
    
    const result = await sorobanServer!.sendTransaction(transaction);
    console.log('   Result:', result.status);
    
    const successStatuses = ['PENDING', 'SUCCESS', 'DUPLICATE'];
    return successStatuses.includes(result.status as string);
  } catch (error) {
    console.error('❌ Verification error:', error);
    return false;
  }
}

export async function completeMissionOnChain(
  playerAddress: string, 
  missionId: string, 
  points: number
): Promise<string | null> {
  if (!isStellarInitialized()) {
    console.log('⚠️  Stellar not initialized');
    return null;
  }

  try {
    console.log(`⛓️  Completing mission ${missionId}...`);
    
    const contract = new Contract(MISSION_MANAGER_CONTRACT);
    const sourceAccount = await server!.loadAccount(adminKeypair!.publicKey());
    
    const playerScVal = new Address(playerAddress).toScVal();
    const missionScVal = xdr.ScVal.scvString(missionId);
    const pointsScVal = nativeToScVal(points, { type: 'u32' });
    
    const transaction = new TransactionBuilder(sourceAccount, {
      fee: '100000',
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(
        contract.call(
          'complete_mission',
          playerScVal,
          missionScVal,
          pointsScVal
        )
      )
      .setTimeout(30)
      .build();

    transaction.sign(adminKeypair!);
    
    const result = await sorobanServer!.sendTransaction(transaction);
    
    const successStatuses = ['PENDING', 'SUCCESS', 'DUPLICATE'];
    if (successStatuses.includes(result.status as string)) {
      console.log('   ✅ Mission completed on-chain!');
      return result.hash;
    } else {
      console.error('   ❌ Failed:', result.status);
      return null;
    }
  } catch (error) {
    console.error('❌ Completion error:', error);
    return null;
  }
}
