// Mock verifier for hackathon
pub struct MockVerifier;

impl MockVerifier {
    pub fn verify(&self, proof: &[u8], inputs: &[u8]) -> bool {
        // Para el hackathon: acepta si el proof no es todo ceros
        !proof.iter().all(|&b| b == 0)
    }
}
