# zk-trails Architecture

This document outlines the architecture of the `zk-trails` project, comparing the intended design with the current implementation state.

## Overview

`zk-trails` is a decentralized application (dApp) built on the Stellar network using Soroban for smart contracts. It integrates Zero-Knowledge (ZK) proofs for verified location-based interactions and challenges.

### Core Components

The system is composed of three main layers:
1.  **Smart Contracts (Soroban)**: Manages game state, user progression, and rewards.
2.  **ZK Circuits (Noir)**: Generates proofs for off-chain verification of user actions (location, knowledge).
3.  **Frontend (React/Vite)**: User interface for interacting with missions and viewing progress.

---

## 1. Smart Contracts (`/contracts`)

The contracts form the backend logic of the application.

### `game-hub` (✅ Partially Implemented)
-   **Role**: functions as the central registry and points system. It tracks player sessions and rewards.
-   **Current State**: Implements a `MockGameHub` with basic `start_game` and `end_game` logic.
    -   **Events**: Emits `GameStarted` and `GameEnded`.
    -   **Storage**: Uses instance storage for admin/hub addresses and temporary storage for game state.
-   **Files**: `src/lib.rs`, `Cargo.toml`.

### `mission-manager` (⚠️ Needs Correction)
-   **Role**: Should manage specific mission logic (e.g., verifying criteria, tracking progress).
-   **Current State**: Currently contains a simple "Guessing Game" logic (`MissionManagerContract`).
    -   **Logic**: Players guess a number between 1-10.
    -   **Issue**: This logic does not match the intended "Mission Manager" functionality. It needs to be refactored to handle mission definitions and completions.
-   **Files**: `src/lib.rs` (contains guessing game logic), `Cargo.toml`.

### `zk-trails` (⚠️ Needs Implementation)
-   **Role**: Likely the main entry point or coordinator for the specific "Trails" game mode.
-   **Current State**: **Duplicate** of the `mission-manager` guessing game logic.
    -   **File Content**: Identical to `mission-manager/src/lib.rs`.
    -   **Action**: Needs to be implemented with actual trails logic (Missions, Badges, Leaderboard).
-   **Files**: `src/lib.rs` (duplicate code), `Cargo.toml`.

### `zk-verifier` (❌ Missing Implementation)
-   **Role**: Verifies ZK proofs submitted by users (e.g., Groth16 verify). 
-   **Current State**: **Empty**.
    -   **Missing**: `Cargo.toml`.
    -   **Empty**: `src/lib.rs` (if it exists, it's empty).
-   **Action**: Needs implementation of the verifier logic.

---

## 2. ZK Circuits (`/circuits`)

Zero-Knowledge circuits written in Noir.

### `location_proof` (❌ Missing Implementation)
-   **Role**: Proves a user was at a specific physical location without revealing exact coordinates publically (Proof of Physical Presence).
-   **Current State**: Directory exists but sources are empty.
-   **Action**: Implement `src/main.nr` with GPS/Location constraints.

### `challenge_proof` (❌ Missing Implementation)
-   **Role**: Proves knowledge of a secret or solution to a puzzle (Proof of Knowledge).
-   **Current State**: Directory exists but sources are empty.
-   **Action**: Implement `src/main.nr` handling the challenge logic.

---

## 3. Frontend (`/frontend`) (❌ Missing)

The user interface for the application.

-   **Role**: Web interface for users to connect wallets, view missions, and submit proofs.
-   **Current State**: **Does not exist**.
-   **Intended Structure**:
    -   `components/`: `MissionGrid`, `MissionModal`, `AxolotlJump`, `Leaderboard`.
    -   `styles/`: Neon/Retro theme.
    -   `lib/`: Stellar and Noir integration.
-   **Action**: Needs to be initialized (likely React + Vite).

---

## Summary of Work Required

1.  **Refactor**: `mission-manager` from guessing game to mission logic.
2.  **Implement**: `zk-trails` core logic (Missions, Badges).
3.  **Implement**: `zk-verifier` contract.
4.  **Develop**: Noir circuits for location and challenge proofs.
5.  **Create**: Frontend application from scratch.
