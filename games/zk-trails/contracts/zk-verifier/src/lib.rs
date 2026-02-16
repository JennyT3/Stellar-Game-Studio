#![no_std]
use soroban_sdk::{contract, contracterror, contractimpl, symbol_short, Bytes, Env, Symbol};
use ultrahonk_rust_verifier::{UltraHonkVerifier, PROOF_BYTES};

/// Contract
#[contract]
pub struct ZkVerifierContract;  // Cambiado de UltraHonkVerifierContract para mantener compatibilidad

#[contracterror]
#[repr(u32)]
#[derive(Copy, Clone, Debug, Eq, PartialEq)]
pub enum Error {
    VkParseError = 1,
    ProofParseError = 2,
    VerificationFailed = 3,
    VkNotSet = 4,
}

#[contractimpl]
impl ZkVerifierContract {
    fn key_vk() -> Symbol {
        symbol_short!("vk")
    }

    /// Initialize the on-chain VK once at deploy time.
    pub fn __constructor(env: Env, vk_bytes: Bytes) -> Result<(), Error> {
        env.storage().instance().set(&Self::key_vk(), &vk_bytes);
        Ok(())
    }

    /// Verify an UltraHonk proof using the stored VK.
    /// This is the REAL function that verifies cryptographically
    pub fn verify_proof(env: Env, public_inputs: Bytes, proof_bytes: Bytes) -> Result<(), Error> {
        if proof_bytes.len() as usize != PROOF_BYTES {
            return Err(Error::ProofParseError);
        }

        let vk_bytes: Bytes = env
            .storage()
            .instance()
            .get(&Self::key_vk())
            .ok_or(Error::VkNotSet)?;
        
        // Deserialize verification key bytes
        let verifier = UltraHonkVerifier::new(&env, &vk_bytes).map_err(|_| Error::VkParseError)?;

        // Verify - ESTO ES REAL, NO MOCK
        verifier
            .verify(&proof_bytes, &public_inputs)
            .map_err(|_| Error::VerificationFailed)?;
        Ok(())
    }
    
    /// Wrapper para mantener compatibilidad con tu interfaz anterior
    pub fn verify_location_proof(env: Env, proof_bytes: Bytes, public_inputs: Bytes) -> bool {
        match Self::verify_proof(env, public_inputs, proof_bytes) {
            Ok(_) => true,
            Err(_) => false,
        }
    }
    
    /// Wrapper para challenge proofs
    pub fn verify_challenge_proof(env: Env, proof_bytes: Bytes, public_inputs: Bytes) -> bool {
        match Self::verify_proof(env, public_inputs, proof_bytes) {
            Ok(_) => true,
            Err(_) => false,
        }
    }
}