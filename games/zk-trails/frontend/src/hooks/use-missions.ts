import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { API_URL } from '@/lib/constants';

export interface Mission {
  id: string;
  title: string;
  description: string;
  lat: number;
  lon: number;
  reward: number;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
}

export function useMissions() {
  return useQuery<Mission[]>({
    queryKey: ['missions'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/zk/missions`);
      if (!res.ok) throw new Error('Failed to fetch missions');
      return res.json();
    },
  });
}

export function useStartMission() {
  return useMutation({
    mutationFn: async ({ missionId, walletAddress }: { missionId: string; walletAddress: string }) => {
      const res = await fetch(`${API_URL}/zk/missions/${missionId}/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress }),
      });
      if (!res.ok) throw new Error('Failed to start mission');
      return res.json();
    },
  });
}

export function useCompleteMission() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { missionId: string; walletAddress: string; score: number; proof: string }) => {
      const res = await fetch(`${API_URL}/zk/complete-mission`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to complete mission');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['missions'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
}
