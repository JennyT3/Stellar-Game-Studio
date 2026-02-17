import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import type { Mission, MissionDetail, ProofSubmission, MissionReward } from '../types';

const MISSIONS_KEY = 'missions';
const USER_KEY = 'user';

export function useMissionsMap() {
  return useQuery({
    queryKey: [MISSIONS_KEY, 'map'],
    queryFn: () => api.get<Mission[]>('/missions/map'),
    staleTime: 30000,
  });
}

export function useMissionDetail(missionId: string | null) {
  return useQuery({
    queryKey: [MISSIONS_KEY, missionId],
    queryFn: () => api.get<MissionDetail>(`/missions/${missionId}`),
    enabled: !!missionId,
  });
}

export function useStartMission() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (missionId: string) => 
      api.post<void>(`/missions/${missionId}/start`, {}),
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
      api.post<MissionReward>(`/missions/${submission.missionId}/submit`, submission),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MISSIONS_KEY, 'map'] });
      queryClient.invalidateQueries({ queryKey: [USER_KEY] });
    },
  });
}

export function useUser() {
  return useQuery({
    queryKey: [USER_KEY],
    queryFn: () => api.get('/me'),
    staleTime: 60000,
  });
}
