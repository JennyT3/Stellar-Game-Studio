export type AppMode = 
  | 'HOME' 
  | 'EXPLORATION' 
  | 'BRIEFING' 
  | 'ACTIVE' 
  | 'PROVING' 
  | 'SUCCESS' 
  | 'PROFILE';

export type MissionStatus = 'LOCKED' | 'AVAILABLE' | 'IN_PROGRESS' | 'COMPLETED';

export type MissionCategory = 
  | 'Location' 
  | 'DeFi' 
  | 'Lending' 
  | 'Balance' 
  | 'Governance' 
  | 'Technical' 
  | 'Education';

export type MissionType = 'PHYSICAL' | 'REMOTE';

export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT' | 'LEGEND';

export interface Coords {
  x: number;
  y: number;
}

export interface Mission {
  id: string;
  category: MissionCategory;
  type: MissionType;
  title: string;
  description: string;
  difficulty: Difficulty;
  reward: string;
  points: number;
  requirements: string[];
  coords: Coords;
  status: MissionStatus;
}

export interface User {
  id: string;
  address: string;
  reputation: number;
  level: number;
  completedMissions: string[];
  badges: string[];
}

export interface MissionDetail extends Mission {
  userStatus?: {
    startedAt?: string;
    completedAt?: string;
    attempts: number;
  };
}

export interface ProofSubmission {
  missionId: string;
  proof: string;
  publicInputs: string[];
  txHash?: string;
}

export interface MissionReward {
  points: number;
  badge: string;
  newUnlocks: string[];
  levelUp?: boolean;
}
