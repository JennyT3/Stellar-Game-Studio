import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import * as path from 'path';

const execAsync = promisify(exec);

const CIRCUITS_DIR = '/Users/jennytejedor/Desktop/Stellar-Game-Studio/games/zk-trails/circuits';
const LOCATION_PROOF_DIR = path.join(CIRCUITS_DIR, 'location_proof');

export interface LocationInputs {
  userLat: number;
  userLon: number;
  userTime: number;
  zoneLatMin: number;
  zoneLatMax: number;
  zoneLonMin: number;
  zoneLonMax: number;
  currentTime: number;
  maxAge: number;
}

export interface SwapInputs {
  amountIn: number;
  amountOut: number;
  path: string[];
  timestamp: number;
  minAmountOut: number;
}

export async function generateLocationProof(inputs: LocationInputs, missionId: string): Promise<any> {
  try {
    console.log(`[ZK Engine] Starting UltraHonk proof generation for mission: ${missionId}`);
    
    // Step 1: Create Prover.toml with scaled coordinates (multiply by 10^6)
    const proverToml = `
zone_lat_min = "${Math.floor(inputs.zoneLatMin * 1000000)}"
zone_lat_max = "${Math.floor(inputs.zoneLatMax * 1000000)}"
zone_lon_min = "${Math.floor(inputs.zoneLonMin * 1000000)}"
zone_lon_max = "${Math.floor(inputs.zoneLonMax * 1000000)}"
current_time = "${inputs.currentTime}"
max_age = "${inputs.maxAge}"
user_lat = "${Math.floor(inputs.userLat * 1000000)}"
user_lon = "${Math.floor(inputs.userLon * 1000000)}"
user_time = "${inputs.userTime}"
`;
    
    const proverPath = path.join(LOCATION_PROOF_DIR, 'Prover.toml');
    await fs.writeFile(proverPath, proverToml);
    console.log('[ZK Engine] Prover.toml created');

    // Step 2: Compile circuit with nargo
    console.log('[ZK Engine] Compiling with nargo 1.0.0-beta.9...');
    await execAsync('nargo compile', {
      cwd: LOCATION_PROOF_DIR,
      timeout: 60000
    });

    // Step 3: Execute to generate witness
    console.log('[ZK Engine] Executing circuit...');
    await execAsync('nargo execute', {
      cwd: LOCATION_PROOF_DIR,
      timeout: 60000
    });

    // Step 4: Generate proof with BB (Barretenberg)
    console.log('[ZK Engine] Generating UltraHonk proof with BB 0.87.0...');
    const proofOutputDir = path.join(LOCATION_PROOF_DIR, 'proof_output');
    
    // Ensure output directory exists
    try {
      await fs.mkdir(proofOutputDir, { recursive: true });
    } catch (e) {
      // Directory might already exist
    }

    const bbCommand = `/Users/jennytejedor/.bb/bin/bb prove -b ${path.join(LOCATION_PROOF_DIR, 'target/location_proof.json')} -w ${path.join(LOCATION_PROOF_DIR, 'target/location_proof.gz')} -o ${proofOutputDir} --scheme ultra_honk`;
    
    console.log(`[ZK Engine] BB Command: ${bbCommand}`);
    
    const { stdout, stderr } = await execAsync(bbCommand, {
      timeout: 120000
    });

    if (stderr) {
      console.log(`[ZK Engine] BB stderr: ${stderr}`);
    }

    // Step 5: Read generated proof
    const proofPath = path.join(proofOutputDir, 'proof');
    const publicInputsPath = path.join(proofOutputDir, 'public_inputs');
    
    const proof = await fs.readFile(proofPath);
    let publicInputs: Buffer | null = null;
    
    try {
      publicInputs = await fs.readFile(publicInputsPath);
    } catch (e) {
      console.log('[ZK Engine] No public_inputs file found');
    }

    console.log(`[ZK Engine] UltraHonk proof generated! Size: ${proof.length} bytes`);

    return {
      success: true,
      proof: proof.toString('hex'),
      publicInputs: publicInputs?.toString('hex') || null,
      missionId,
      timestamp: inputs.currentTime
    };

  } catch (error: any) {
    console.error('[ZK Engine Error]:', error.message);
    throw new Error(`Proof generation failed: ${error.message}`);
  }
}

export async function generateSwapProof(inputs: SwapInputs): Promise<any> {
  // TODO: Implement swap proof generation when swap circuit is ready
  console.log('[ZK Engine] Swap proof generation not yet implemented');
  throw new Error('Swap proof circuit not deployed yet');
}
