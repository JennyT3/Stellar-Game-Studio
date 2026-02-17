import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import type { Mission, MissionDetail, ProofSubmission, MissionReward } from '../types';

const MISSIONS_KEY = 'missions';
const USER_KEY = 'user';

export function useMissionsMap() {
  return useQuery({
    queryKey: [MISSIONS_KEY, 'map'],
    queryFn: () => api.get<Mission[]>('/zk/missions'),
    staleTime: 30000,
  });
}

export function useMissionDetail(missionId: string | null) {
  return useQuery({
    queryKey: [MISSIONS_KEY, missionId],
    queryFn: () => api.get<MissionDetail>(`/zk/missions`),
    enabled: !!missionId,
  });
}

export function useStartMission() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (missionId: string) => 
      api.post<void>(`/zk/missions`, { missionId }),
    onSuccess: (_, missionId) => {
      queryClient.invalidateQueries({ queryKey: [MISSIONS_KEY, 'map'] });
      queryClient.invalidateQueries({ queryKey: [MISSIONS_KEY, missionId] });
    },
  });
}

export function useSubmitProof() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (submission: ProofSubmission) =>
      api.post<MissionReward>(`/zk/generate-proof`, {
        missionId: submission.missionId,
        lat: submission.lat,
        lon: submission.lon,
        walletAddress: submission.walletAddress,
        timestamp: submission.timestamp || Math.floor(Date.now() / 1000),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MISSIONS_KEY, 'map'] });
      queryClient.invalidateQueries({ queryKey: [USER_KEY] });
    },
  });
}

export function useUser() {
  return useQuery({
    queryKey: [USER_KEY],
    queryFn: () => api.get('/health'),
    staleTime: 60000,
  });
}
