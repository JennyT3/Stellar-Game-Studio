export interface Mission {
 id: string;
 name: string;
 type: 'physical' | 'online';
 description: string;
 reward: number;
 xp: number;
 // Physical mission parameters
 latMin?: number;
 latMax?: number;
 lonMin?: number;
 lonMax?: number;
 maxAge?: number;
 // Online mission parameters (Soroswap)
 contractAddress?: string;
 tokenIn?: string;
 tokenOut?: string;
 minAmount?: number;
}

export const MISSIONS: Mission[] = [
 {
   id: 'm0',
   name: 'Madrid Central Challenge',
   type: 'physical',
   description: 'Visit the heart of Madrid and prove your location cryptographically without revealing exact coordinates',
   reward: 100,
   xp: 50,
   latMin: 40413000,
   latMax: 40416000,
   lonMin: -3708000,
   lonMax: -3705000,
   maxAge: 300
 },
 {
   id: 'm1',
   name: 'Soroswap DeFi Pioneer',
   type: 'online',
   description: 'Execute a real swap on Soroswap testnet and prove it with zero-knowledge',
   reward: 200,
   xp: 100,
   contractAddress: 'CAG5LRYQ5JVEUI5TEID72EYOVX44TTUJT5BQR2J6J77FH65PCCFAJDDH', // Soroswap Router Testnet
   tokenIn: 'XLM',
   tokenOut: 'USDC',
   minAmount: 1000000 // 0.1 XLM in stroops
 }
];

export const MISSION_ZONES: Record<string, any> = {
 m0: {
   name: 'Madrid Central',
   latMin: 40413000,
   latMax: 40416000,
   lonMin: -3708000,
   lonMax: -3705000,
   maxAge: 300
 }
};

export const SOROSWAP_TESTNET = {
 router: 'CAG5LRYQ5JVEUI5TEID72EYOVX44TTUJT5BQR2J6J77FH65PCCFAJDDH',
 factory: 'CA4HEQTL2WPEUYKYKCDOHCDNIV4QHNJ7EL4J4NQ6VADP7SYHVRYZ7AW2',
 tokens: {
   XLM: 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC', // Wrapped XLM
   USDC: 'CAAV3AE3VK4ASVGRZAPXRPX6JCOFA6QQ7XJVSZ6EODLFWO3ZT3Z75ACX' // Testnet USDC
 }
};
