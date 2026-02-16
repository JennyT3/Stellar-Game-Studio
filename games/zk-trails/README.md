# 🎯 ZK-Trails

**Privacy-Preserving CTF Game on Stellar**

A location-based Capture-The-Flag game that uses Zero-Knowledge proofs to verify player locations without revealing exact coordinates. Built for the Stellar ZK Gaming Hackathon.

[![Stellar](https://img.shields.io/badge/Stellar-Testnet-brightgreen)](https://stellar.org)
[![Soroban](https://img.shields.io/badge/Soroban-Smart%20Contracts-blue)](https://soroban.stellar.org)
[![Noir](https://img.shields.io/badge/Noir-ZK%20Circuits-purple)](https://noir-lang.org)

## 🎮 Overview

ZK-Trails combines the excitement of location-based gaming with the privacy guarantees of Zero-Knowledge cryptography. Players complete missions by proving they're in designated areas without exposing their exact GPS coordinates.

### Why ZK?

Traditional location-based games expose sensitive user data. ZK-Trails uses Zero-Knowledge proofs to:
- ✅ Verify players are in the correct area
- ✅ Keep exact coordinates private
- ✅ Prevent location spoofing
- ✅ Enable trustless verification on-chain

## 🏗️ Architecture

```
┌─────────────────┐
│   Frontend UI   │
│   (React/Vite)  │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│        Stellar Testnet                  │
│  ┌─────────────┐  ┌─────────────────┐  │
│  │  Game Hub   │  │ Mission Manager │  │
│  │  Contract   │◄─┤   Contract      │  │
│  └─────────────┘  └────────┬────────┘  │
│                            │            │
│  ┌─────────────┐  ┌────────▼────────┐  │
│  │ ZK Verifier │◄─┤  ZK-Trails      │  │
│  │  Contract   │  │   Contract      │  │
│  └─────────────┘  └─────────────────┘  │
└─────────────────────────────────────────┘
         ▲
         │
    ┌────┴─────┐
    │  Noir    │
    │ Circuits │
    └──────────┘
```

### Smart Contracts

1. **game-hub** (`CB4VZAT2U3UC6XFK3N23SKRF2NDCMP3QHJYMCHHFMZO7MRQO6DQ2EMYG`)
   - Central game coordination
   - Tracks game sessions
   - Implements hackathon requirements

2. **mission-manager** (`CAVJDRDVMH36E2AXJRJZYIPTERLP672WLPGSCAK7IDNJF4MQF42YXHH4`)
   - Creates and manages missions
   - Stores mission metadata
   - Tracks player progress

3. **zk-verifier** (`CCU3OVHMC3UR6JJISIIEBFYXOQRUKXHP752R7VUGFZQRXL6ULP2ZUW23`)
   - Verifies ZK proofs on-chain
   - Uses Stellar Protocol 25 primitives
   - Validates location and challenge proofs

4. **zk-trails** (`CBGQETI2B2MTWDZBAUKX4EMJUH2C2QHW3WMZNYVHIOSTUEJUPYVQ4LPT`)
   - Main game logic
   - Player state management
   - Leaderboard and rewards

### ZK Circuits (Noir)

1. **location_proof.nr**
   - Proves proximity to a location
   - Input: GPS coordinates (private)
   - Output: Valid proof (public)
   - No coordinates revealed

2. **challenge_proof.nr**
   - Proves knowledge of challenge solution
   - Input: Solution hash (private)
   - Output: Verification result (public)

## 🚀 Quick Start

### Prerequisites

```bash
# Required tools
node >= 18.0.0
bun >= 1.0.0
stellar-cli >= 23.1.4
rustc >= 1.74.0
nargo >= 0.19.0  # Noir compiler
```

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/zk-trails
cd zk-trails

# Install dependencies
bun install

# Setup Stellar CLI identities
stellar keys generate admin --network testnet
stellar keys generate player1 --network testnet
stellar keys generate player2 --network testnet

# Build contracts
bun run scripts/build.ts

# Deploy to testnet
bun run scripts/deploy.ts
```

### Running Tests

```bash
# Test contract functionality
bun run scripts/test-mission-flow.ts

# Test ZK circuits
cd circuits/location_proof
nargo test
```

### Frontend Development

```bash
cd frontend
bun install
bun run dev
# Open http://localhost:5173
```

## 🎯 Gameplay Flow

1. **Browse Missions**: View available CTF challenges
2. **Start Mission**: Select a mission to attempt
3. **Generate Proof**: Create ZK proof of location
4. **Submit Proof**: Verify on-chain without revealing coordinates
5. **Earn Rewards**: Complete missions for points and NFTs

## 🔐 ZK Implementation Details

### Location Verification

```noir
// Simplified location proof circuit
fn main(
    lat: Field,        // Private: actual latitude
    lon: Field,        // Private: actual longitude
    target_lat: pub Field,   // Public: target area center
    target_lon: pub Field,
    radius: pub Field        // Public: allowed radius
) -> pub Field {
    // Compute distance without revealing exact location
    let distance = calculate_distance(lat, lon, target_lat, target_lon);
    assert(distance <= radius);
    1  // Proof valid
}
```

### Challenge Verification

```noir
fn main(
    solution: Field,        // Private: challenge solution
    expected_hash: pub Field  // Public: solution hash
) {
    let hash = poseidon_hash(solution);
    assert(hash == expected_hash);
}
```

## 📦 Project Structure

```
zk-trails/
├── contracts/           # Soroban smart contracts
│   ├── game-hub/
│   ├── mission-manager/
│   ├── zk-verifier/
│   └── zk-trails/
├── circuits/            # Noir ZK circuits
│   ├── location_proof/
│   └── challenge_proof/
├── frontend/            # React UI
│   └── src/
├── scripts/             # Build & deploy scripts
└── docs/                # Documentation
```

## 🛠️ Built With

- **Stellar Soroban**: Smart contract platform
- **Noir**: ZK proof language by Aztec
- **Protocol 25 (X-Ray)**: BN254 curves, Poseidon hash
- **React + Vite**: Frontend framework
- **TypeScript**: Type-safe development
- **Bun**: Fast JavaScript runtime

## 🏆 Hackathon Compliance

✅ **Forked Game Studio**: Built on Stellar Game Studio framework  
✅ **ZK-Powered Mechanic**: Location proofs without coordinate exposure  
✅ **Deployed On-Chain**: All contracts live on Stellar testnet  
✅ **Game Hub Integration**: Calls `start_game()` and `end_game()`  
✅ **Functional UI**: React frontend for gameplay  
✅ **Open Source**: MIT licensed, public repository  
✅ **Video Demo**: [Watch Demo](LINK_TO_VIDEO)

## 📹 Demo Video

[2-3 minute demonstration](LINK_TO_VIDEO) showing:
- ZK proof generation
- On-chain verification
- Privacy-preserving gameplay
- Smart contract interaction

## 🤝 Contributing

Contributions welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) first.

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

## 🔗 Links

- **Live Demo**: [zk-trails.vercel.app](https://zk-trails.vercel.app)
- **Stellar Explorer**: [stellar.expert](https://stellar.expert/explorer/testnet)
- **Game Studio**: [Stellar Game Studio](https://github.com/jamesbachini/Stellar-Game-Studio)
- **Hackathon**: [Stellar ZK Gaming](https://stellar.org/hackathon)

## 👥 Team

Built for the Stellar ZK Gaming Hackathon by [Your Name]

## 🙏 Acknowledgments

- Stellar Development Foundation for Protocol 25
- Aztec for the Noir language
- James Bachini for Stellar Game Studio
- Stellar community for support

---

**⚡ Privacy meets gaming. Prove without revealing. Play without exposing.**