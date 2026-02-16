import { BarretenbergBackend } from '@noir-lang/backend_barretenberg';
import { Noir } from '@noir-lang/noir_js';
import circuit from '../../../circuits/location_proof/target/location_proof.json';

let backend: BarretenbergBackend | null = null;
let noir: Noir | null = null;

// Input type matching the circuit exactly
export type LocationProofInputs = {
  zone_lat_min: string;
  zone_lat_max: string;
  zone_lon_min: string;
  zone_lon_max: string;
  current_time: string;
  max_age: string;
  user_lat: string;
  user_lon: string;
  user_time: string;
  [key: string]: string;
};

export interface ProofResult {
  proof: Uint8Array;
  publicInputs: string[];
}

export async function initZK(): Promise<void> {
  if (!backend) {
    backend = new BarretenbergBackend(circuit as any);
    noir = new Noir(circuit as any);
    console.log('✅ ZK Backend initialized');
  }
}

export async function generateLocationProof(inputs: LocationProofInputs): Promise<ProofResult> {
  if (!noir || !backend) {
    await initZK();
  }
  try {
    console.log('Generating proof with inputs:', inputs);
    const { witness } = await noir!.execute(inputs);
    const proof = await backend!.generateProof(witness);
    console.log('✅ Proof generated successfully');
    return {
      proof: proof.proof,
      publicInputs: proof.publicInputs
    };
  } catch (error) {
    console.error('❌ Error generating proof:', error);
    throw error;
  }
}

export async function verifyLocationProof(proof: Uint8Array, publicInputs: string[]): Promise<boolean> {
  if (!noir || !backend) {
    await initZK();
  }
  try {
    const isValid = await backend!.verifyProof({ proof, publicInputs });
    return isValid;
  } catch (error) {
    console.error('❌ Error verifying proof:', error);
    return false;
  }
}

export function proofToHex(proof: Uint8Array): string {
  return '0x' + Buffer.from(proof).toString('hex');
}

export function hexToProof(hex: string): Uint8Array {
  const cleanHex = hex.startsWith('0x') ? hex.slice(2) : hex;
  return new Uint8Array(Buffer.from(cleanHex, 'hex'));
}

export async function destroyZK(): Promise<void> {
  if (backend) {
    await backend.destroy();
    backend = null;
    noir = null;
    console.log('ZK Backend destroyed');
  }
}
