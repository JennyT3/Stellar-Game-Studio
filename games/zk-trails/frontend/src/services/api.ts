const API_URL = '/api';

export async function fetchMissions() {
  const res = await fetch(`${API_URL}/missions`);
  if (!res.ok) throw new Error('Failed to fetch missions');
  return res.json();
}

export async function completeMission(missionId: string, publicKey: string) {
  const res = await fetch(`${API_URL}/missions/${missionId}/complete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ publicKey }),
  });
  if (!res.ok) throw new Error('Failed to complete mission');
  return res.json();
}

export async function fetchPlayer(publicKey: string) {
  const res = await fetch(`${API_URL}/player/${publicKey}`);
  if (!res.ok) throw new Error('Failed to fetch player');
  return res.json();
}
