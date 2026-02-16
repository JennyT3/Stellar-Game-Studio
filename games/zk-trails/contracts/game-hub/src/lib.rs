#![no_std]

use soroban_sdk::{contract, contractimpl, Address, Env};

#[contract]
pub struct MockGameHub;

#[contractimpl]
impl MockGameHub {
    pub fn start_game(
        env: Env,
        player1: Address,
        player2: Option<Address>,
        game_id: u64,
    ) -> u64 {
        player1.require_auth();
        let session_id: u64 = env.ledger().sequence().into();
        env.storage().instance().set(
            &(session_id, game_id, player1.clone()),
            &true,
        );
        session_id
    }

    pub fn end_game(
        env: Env,
        session_id: u64,
        player1: Address,
        player1_won: bool,
    ) {
        player1.require_auth();
        env.storage().instance().set(
            &(session_id, player1),
            &player1_won,
        );
    }
}