import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMissions, startMission, completeMission } from '@/services/contracts';

export function useMissions() {
  return useQuery({
    queryKey: ['missions'],
    queryFn: getMissions,
    staleTime: 30000,
  });
}

export function useStartMission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ missionId, playerAddress }: { missionId: string; playerAddress: string }) =>
      startMission(missionId, playerAddress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['missions'] });
    },
  });
}

export function useCompleteMission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ missionId, playerAddress, score, proof }: { missionId: string; playerAddress: string; score?: number; proof?: string }) => 
      completeMission(missionId, playerAddress, score, proof),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['missions'] });
      queryClient.invalidateQueries({ queryKey: ['player'] });
    },
  });
}
