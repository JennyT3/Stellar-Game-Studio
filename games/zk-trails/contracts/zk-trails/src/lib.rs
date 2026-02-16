#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, Address, BytesN, Env, String, Vec};

#[contracttype]
#[derive(Clone)]
pub struct TrailData {
    pub player: Address,
    pub mission_id: u64,
    pub location_proof: BytesN<32>,
    pub timestamp: u64,
}

#[contracttype]
pub enum DataKey {
    Admin,
    MissionManager,
    ZkVerifier,
    TrailCounter,
    Trail(u64),
}

#[contract]
pub struct ZkTrails;

#[contractimpl]
impl ZkTrails {
    
    // 🔧 FIX: Accepts mission_manager and zk_verifier as parameters
    pub fn initialize(env: Env, admin: Address, mission_manager: Address, zk_verifier: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("Already initialized");
        }
        
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::MissionManager, &mission_manager);
        env.storage().instance().set(&DataKey::ZkVerifier, &zk_verifier);
        env.storage().instance().set(&DataKey::TrailCounter, &0u64);
    }
    
    pub fn record_trail(
        env: Env,
        player: Address,
        mission_id: u64,
        location_proof: BytesN<32>,
    ) -> u64 {
        player.require_auth();
        
        let counter: u64 = env.storage().instance()
            .get(&DataKey::TrailCounter)
            .unwrap_or(0u64);
        
        let new_trail_id = counter + 1;
        
        let trail = TrailData {
            player: player.clone(),
            mission_id,
            location_proof,
            timestamp: env.ledger().timestamp(),
        };
        
        env.storage().persistent().set(&DataKey::Trail(new_trail_id), &trail);
        env.storage().instance().set(&DataKey::TrailCounter, &new_trail_id);
        
        new_trail_id
    }
    
    pub fn get_trail(env: Env, trail_id: u64) -> TrailData {
        env.storage().persistent()
            .get(&DataKey::Trail(trail_id))
            .unwrap_or_else(|| panic!("Trail not found"))
    }
    
    pub fn get_player_trails(env: Env, player: Address) -> Vec<TrailData> {
        let counter: u64 = env.storage().instance()
            .get(&DataKey::TrailCounter)
            .unwrap_or(0);
        
        let mut trails = Vec::new(&env);
        
        for i in 1..=counter {
            if let Some(trail) = env.storage().persistent().get::<DataKey, TrailData>(&DataKey::Trail(i)) {
                if trail.player == player {
                    trails.push_back(trail);
                }
            }
        }
        
        trails
    }
}