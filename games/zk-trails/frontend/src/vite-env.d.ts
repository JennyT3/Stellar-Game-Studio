/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_STELLAR_NETWORK: string
  readonly VITE_GAME_HUB_CONTRACT: string
  readonly VITE_MISSION_MANAGER_CONTRACT: string
  readonly VITE_ZK_VERIFIER_CONTRACT: string
  readonly VITE_ZK_TRAILS_CONTRACT: string
  readonly VITE_HORIZON_URL: string
  readonly VITE_SOROBAN_RPC_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
