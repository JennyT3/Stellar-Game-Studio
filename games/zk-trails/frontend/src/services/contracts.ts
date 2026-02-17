const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

const CONTRACTS = {
  MISSION_MANAGER: "CAVJDRDVMH36E2AXJRJZYIPTERLP672WLPGSCAK7IDNJF4MQF42YXHH4",
  ZK_VERIFIER: "CCU3OVHMC3UR6JJISIIEBFYXOQRUKXHP752R7VUGFZQRXL6ULP2ZUW23",
  ZK_TRAILS: "CBGQETI2B2MTWDZBAUKX4EMJUH2C2QHW3WMZNYVHIOSTUEJUPYVQ4LPT",
  GAME_HUB: "CB4VZAT2U3UC6XFK3N23SKRF2NDCMP3QHJYMCHHFMZO7MRQO6DQ2EMYG",
};

// Get all missions from backend
export async function getMissions() {
  const res = await fetch(`${API_URL}/zk/missions`);
  if (!res.ok) throw new Error("Failed to fetch missions");
  return res.json();
}

// Get single mission details
export async function getMission(id: string) {
  const res = await fetch(`${API_URL}/zk/missions/${id}`);
  if (!res.ok) throw new Error("Failed to fetch mission");
  return res.json();
}

// Start mission tracking
export async function startMission(missionId: string, walletAddress: string) {
  const res = await fetch(`${API_URL}/zk/missions/${missionId}/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ walletAddress }),
  });
  if (!res.ok) throw new Error("Failed to start mission");
  return res.json();
}

// Generate ZK proof via backend + Barretenberg
export async function generateZKProof(data: {
  missionId: string;
  lat: number;
  lon: number;
  walletAddress: string;
  timestamp: number;
}) {
  const res = await fetch(`${API_URL}/zk/generate-proof`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "ZK proof generation failed");
  }
  return res.json();
}

// Complete mission (submit proof to blockchain)
export async function completeMission(data: {
  missionId: string;
  proof: any;
  walletAddress: string;
}) {
  const res = await fetch(`${API_URL}/zk/complete-mission`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to complete mission");
  }
  return res.json();
}

// Get player stats from backend
export async function getPlayerStats(address: string) {
  const res = await fetch(`${API_URL}/zk/players/${address}/stats`);
  if (!res.ok) throw new Error("Failed to fetch player stats");
  return res.json();
}

export { CONTRACTS };
