#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype, contracterror, Address, BytesN, Env, String, Symbol, Vec, Val,
    IntoVal,
};

const GAME_STUDIO_MOCK_ADDRESS: &str = "CB4VZAT2U3UC6XFK3N23SKRF2NDCMP3QHJYMCHHFMZO7MRQO6DQ2EMYG";

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Admin,
    GameHub,
    MissionCounter,
    Mission(u64),
    PlayerProgress(Address, u64),
    PlayerStats(Address),
    Leaderboard,
}

#[derive(Clone, Debug, Eq, PartialEq)]
#[contracttype]
pub enum MissionStatus {
    Active,
    Completed,
    Failed,
}

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum Error {
    NotInitialized = 1,
    AlreadyInitialized = 2,
    Unauthorized = 3,
    MissionNotFound = 4,
    MissionAtCapacity = 5,
    NoActiveMission = 6,
    MissionNotActive = 7,
    ZkProofRequired = 8,
    ScoreBelowMinimum = 9,
}

#[derive(Clone)]
#[contracttype]
pub struct Mission {
    pub id: u64,
    pub name: String,
    pub description: String,
    pub reward: u64,
    pub max_completions: u64,
    pub current_completions: u64,
    pub min_score: u64,
    pub zk_proof_required: bool,
}

#[derive(Clone)]
#[contracttype]
pub struct PlayerProgress {
    pub player: Address,
    pub mission_id: u64,
    pub status: MissionStatus,
    pub score: u64,
    pub session_id: u64,
}

#[derive(Clone)]
#[contracttype]
pub struct PlayerStats {
    pub total_missions: u64,
    pub total_score: u64,
    pub rank: u64,
}

#[contract]
pub struct MissionManager;

#[contractimpl]
impl MissionManager {
    pub fn initialize(env: Env, admin: Address) -> Result<(), Error> {
        if env.storage().instance().has(&DataKey::Admin) {
            return Err(Error::AlreadyInitialized);
        }
        
        admin.require_auth();
        env.storage().instance().set(&DataKey::Admin, &admin);
        
        let game_hub = Address::from_string(&String::from_str(&env, GAME_STUDIO_MOCK_ADDRESS));
        env.storage().instance().set(&DataKey::GameHub, &game_hub);
        env.storage().instance().set(&DataKey::MissionCounter, &0u64);
        
        let leaderboard: Vec<Address> = Vec::new(&env);
        env.storage().instance().set(&DataKey::Leaderboard, &leaderboard);
        
        Ok(())
    }
    
    pub fn create_mission(
        env: Env,
        admin: Address,
        name: String,
        description: String,
        reward: u64,
        max_completions: u64,
        min_score: u64,
        zk_proof_required: bool,
    ) -> Result<u64, Error> {
        admin.require_auth();
        
        let stored_admin: Address = env.storage().instance()
            .get(&DataKey::Admin)
            .ok_or(Error::NotInitialized)?;
        
        if admin != stored_admin {
            return Err(Error::Unauthorized);
        }
        
        let mission_id: u64 = env.storage().instance()
            .get(&DataKey::MissionCounter)
            .unwrap_or(0);
        
        let mission = Mission {
            id: mission_id,
            name,
            description,
            reward,
            max_completions,
            current_completions: 0,
            min_score,
            zk_proof_required,
        };
        
        env.storage().persistent().set(&DataKey::Mission(mission_id), &mission);
        env.storage().instance().set(&DataKey::MissionCounter, &(mission_id + 1));
        
        Ok(mission_id)
    }
    
    pub fn start_mission(env: Env, player: Address, mission_id: u64) -> Result<u64, Error> {
        player.require_auth();
        
        let mission: Mission = env.storage().persistent()
            .get(&DataKey::Mission(mission_id))
            .ok_or(Error::MissionNotFound)?;
        
        if mission.max_completions > 0 && mission.current_completions >= mission.max_completions {
            return Err(Error::MissionAtCapacity);
        }
        
        let game_hub_addr = Self::get_game_hub_address(&env);
        let start_fn = Symbol::new(&env, "start_game");
        let args: Vec<Val> = (player.clone(),).into_val(&env);
        
        let session_id: u64 = env.invoke_contract(&game_hub_addr, &start_fn, args);
        
        let progress = PlayerProgress {
            player: player.clone(),
            mission_id,
            status: MissionStatus::Active,
            score: 0,
            session_id,
        };
        
        env.storage().persistent().set(
            &DataKey::PlayerProgress(player.clone(), mission_id),
            &progress
        );
        
        Ok(session_id)
    }
    
    pub fn complete_mission(
        env: Env,
        player: Address,
        mission_id: u64,
        score: u64,
        zk_proof: Option<BytesN<4942>>,
    ) -> Result<(), Error> {
        player.require_auth();
        
        let progress: PlayerProgress = env.storage().persistent()
            .get(&DataKey::PlayerProgress(player.clone(), mission_id))
            .ok_or(Error::NoActiveMission)?;
        
        if progress.status != MissionStatus::Active {
            return Err(Error::MissionNotActive);
        }
        
        let mission: Mission = env.storage().persistent()
            .get(&DataKey::Mission(mission_id))
            .ok_or(Error::MissionNotFound)?;
        
        if mission.zk_proof_required && zk_proof.is_none() {
            return Err(Error::ZkProofRequired);
        }
        
        if score < mission.min_score {
            return Err(Error::ScoreBelowMinimum);
        }
        
        let total_score = progress.score + score;
        
        let stats: PlayerStats = env.storage().persistent()
            .get(&DataKey::PlayerStats(player.clone()))
            .unwrap_or(PlayerStats {
                total_missions: 0,
                total_score: 0,
                rank: 0,
            });
        
        let updated_stats = PlayerStats {
            total_missions: stats.total_missions + 1,
            total_score: stats.total_score + total_score,
            rank: Self::calculate_rank(stats.total_score + total_score),
        };
        
        env.storage().persistent().set(
            &DataKey::PlayerStats(player.clone()),
            &updated_stats
        );
        
        let game_hub_addr = Self::get_game_hub_address(&env);
        let end_fn = Symbol::new(&env, "end_game");
        let args: Vec<Val> = (progress.session_id, player.clone(), total_score).into_val(&env);
        
        env.invoke_contract::<()>(&game_hub_addr, &end_fn, args);
        
        let mut updated_mission = mission;
        updated_mission.current_completions += 1;
        env.storage().persistent().set(&DataKey::Mission(mission_id), &updated_mission);
        
        let mut updated_progress = progress;
        updated_progress.status = MissionStatus::Completed;
        updated_progress.score = total_score;
        env.storage().persistent().set(
            &DataKey::PlayerProgress(player.clone(), mission_id),
            &updated_progress
        );
        
        Self::update_leaderboard(&env, player.clone());
        Ok(())
    }
    
    fn get_game_hub_address(env: &Env) -> Address {
        Address::from_string(&String::from_str(env, GAME_STUDIO_MOCK_ADDRESS))
    }
    
    fn calculate_rank(total_score: u64) -> u64 {
        match total_score {
            0..=999 => 3,
            1000..=4999 => 2,
            _ => 1,
        }
    }
    
    fn update_leaderboard(env: &Env, player: Address) {
        let mut leaderboard: Vec<Address> = env.storage().instance()
            .get(&DataKey::Leaderboard)
            .unwrap_or(Vec::new(env));
        
        if !leaderboard.contains(&player) {
            leaderboard.push_back(player);
            env.storage().instance().set(&DataKey::Leaderboard, &leaderboard);
        }
    }
    
    pub fn get_mission(env: Env, mission_id: u64) -> Result<Mission, Error> {
        env.storage().persistent()
            .get(&DataKey::Mission(mission_id))
            .ok_or(Error::MissionNotFound)
    }
    
    pub fn get_player_progress(env: Env, player: Address, mission_id: u64) -> Result<PlayerProgress, Error> {
        env.storage().persistent()
            .get(&DataKey::PlayerProgress(player, mission_id))
            .ok_or(Error::NoActiveMission)
    }
    
    pub fn get_player_stats(env: Env, player: Address) -> PlayerStats {
        env.storage().persistent()
            .get(&DataKey::PlayerStats(player))
            .unwrap_or(PlayerStats {
                total_missions: 0,
                total_score: 0,
                rank: 0,
            })
    }
    
    pub fn get_leaderboard(env: Env) -> Vec<Address> {
        env.storage().instance()
            .get(&DataKey::Leaderboard)
            .unwrap_or(Vec::new(&env))
    }
    
    pub fn get_game_hub(env: Env) -> Address {
        Self::get_game_hub_address(&env)
    }
}
