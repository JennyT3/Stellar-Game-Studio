use dep::std;

fn main(
    // Public input: The hash of the solution/secret
    commitment: pub [u8; 32],

    // Private input: The actual solution/secret known by the user
    solution: [u8; 32],
) {
    // 1. Hash the private solution
    let calculated_hash = std::hash::sha256(solution);

    // 2. Assert the calculated hash matches the public commitment
    assert(calculated_hash == commitment);
}
