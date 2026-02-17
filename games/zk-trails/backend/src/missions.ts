export interface Mission {
  id: string;
  name: string;
  description: string;
  targetLocation: {
    lat: number;
    lon: number;
    radius: number; // metros
  };
  reward: string;
  status: 'active' | 'completed' | 'locked';
}

export const missions: Mission[] = [
  {
    id: 'mission-001',
    name: 'Soroban Genesis',
    description: 'Encuentra el punto de inicio del ecosistema Stellar en San Francisco',
    targetLocation: {
      lat: 37.7749,
      lon: -122.4194,
      radius: 100 // 100 metros de margen
    },
    reward: '10 XLM + ZK Badge',
    status: 'active'
  },
  {
    id: 'mission-002',
    name: 'Barretenberg Vault',
    description: 'Localiza la bóveda criptográfica secreta',
    targetLocation: {
      lat: 37.7849,
      lon: -122.4094,
      radius: 150
    },
    reward: '25 XLM + UltraHonk NFT',
    status: 'active'
  }
];
