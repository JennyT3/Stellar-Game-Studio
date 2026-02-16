const API_URL = "http://localhost:3001/api";

const CONTRACTS = {
  MISSION_MANAGER: "CAVJDRDVMH36E2AXJRJZYIPTERLP672WLPGSCAK7IDNJF4MQF42YXHH4",
  ZK_VERIFIER: "CCU3OVHMC3UR6JJISIIEBFYXOQRUKXHP752R7VUGFZQRXL6ULP2ZUW23",
  ZK_TRAILS: "CBGQETI2B2MTWDZBAUKX4EMJUH2C2QHW3WMZNYVHIOSTUEJUPYVQ4LPT",
  GAME_HUB: "CB4VZAT2U3UC6XFK3N23SKRF2NDCMP3QHJYMCHHFMZO7MRQO6DQ2EMYG",
};

export async function startMission(missionId: string, playerAddress: string) {
  const res = await fetch(`${API_URL}/missions/${missionId}/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ player: playerAddress }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to start mission");
  }
  return res.json();
}

export async function completeMission(missionId: string, playerAddress: string, score?: number, proof?: string) {
  const res = await fetch(`${API_URL}/missions/${missionId}/complete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ player: playerAddress, score: score || 100, proof }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to complete mission");
  }
  return res.json();
}

export async function getMissions() {
  const res = await fetch(`${API_URL}/missions`);
  if (!res.ok) throw new Error("Failed to fetch missions");
  return res.json();
}

export async function getPlayerStats(address: string) {
  const res = await fetch(`${API_URL}/missions/players/${address}`);
  if (!res.ok) throw new Error("Failed to fetch player");
  return res.json();
}
