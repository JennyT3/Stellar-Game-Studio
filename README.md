# ZK-Trails

A location-based CTF game on Stellar using Zero-Knowledge proofs.
Built for the **Stellar ZK Gaming Hackathon** on top of Stellar Game Studio.

[![Stellar](https://img.shields.io/badge/Stellar-Testnet-brightgreen)](https://stellar.org)
[![Soroban](https://img.shields.io/badge/Soroban-Contracts-blue)](https://soroban.stellar.org)
[![Noir](https://img.shields.io/badge/Noir-ZK%20Circuits-purple)](https://noir-lang.org)

## What it does

Players complete missions by proving they are within a target area — without revealing their exact GPS coordinates. Zero-Knowledge proofs handle verification on-chain.

**Game:** [`games/zk-trails/`](./games/zk-trails/)

---

## Contracts (Stellar Testnet)

| Contract | Address |
|----------|---------|
| Game Hub | `CB4VZAT2U3UC6XFK3N23SKRF2NDCMP3QHJYMCHHFMZO7MRQO6DQ2EMYG` |
| Mission Manager | `CAVJDRDVMH36E2AXJRJZYIPTERLP672WLPGSCAK7IDNJF4MQF42YXHH4` |
| ZK Verifier | `CCU3OVHMC3UR6JJISIIEBFYXOQRUKXHP752R7VUGFZQRXL6ULP2ZUW23` |
| ZK Trails | `CBGQETI2B2MTWDZBAUKX4EMJUH2C2QHW3WMZNYVHIOSTUEJUPYVQ4LPT` |

[View on Stellar Explorer](https://stellar.expert/explorer/testnet)

---

## Architecture
```
frontend (React + Vite + TypeScript)
    ├── Stellar Wallets Kit     → wallet connection
    ├── Soroban SDK             → contract calls  
    └── noir_js                 → ZK proof generation in-browser
            │
            ▼
    Stellar Testnet
    ├── game-hub                → start_game / end_game
    ├── mission-manager         → mission state & player progress
    ├── zk-verifier             → on-chain proof verification
    └── zk-trails               → game logic & leaderboard

backend (Bun / Node)
    └── zkService               → proof generation helpers
```

## ZK Circuit (Noir)

`games/zk-trails/circuits/location_proof/src/main.nr`

- Private inputs: player GPS coordinates
- Public inputs: target area center + radius
- Output: valid proof — coordinates never leave the device

---

## Run locally
```bash
cd games/zk-trails/frontend
bun install
cp .env.example .env.local
bun run dev
# → http://localhost:5173
```

## Hackathon compliance

| Requirement | Status |
|-------------|--------|
| Forked Game Studio | ✅ |
| ZK mechanic (Noir circuits) | ✅ |
| `start_game()` called on-chain | ✅ |
| `end_game()` called on-chain | ✅ |
| 4 contracts deployed to testnet | ✅ |
| React frontend functional | ✅ |
| Open source / MIT | ✅ |
| Video demo | ⏳ |

## Stack

Soroban · Noir · React · Vite · TypeScript · Stellar Wallets Kit · Bun · Rust

## License

MIT
