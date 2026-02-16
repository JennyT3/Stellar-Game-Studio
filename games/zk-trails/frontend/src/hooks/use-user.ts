import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

export interface UserProgress {
  publicKey: string;
  score: number;
  tier: string;
  completedMissions: string[];
}

export function useUser(publicKey: string | null) {
  return useQuery({
    queryKey: ['user', publicKey],
    queryFn: async () => {
      if (!publicKey) return null;
      const res = await apiRequest('GET', `/api/missions/players/${publicKey}`);
      return res.json() as Promise<UserProgress>;
    },
    enabled: !!publicKey,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (publicKey: string) => {
      // The user is created automatically upon completing the first mission
      // or when consulting their profile, so we only invalidate the cache
      return { publicKey, score: 0, tier: 'ROOKIE', completedMissions: [] };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['user', data.publicKey], data);
    },
  });
}

export function useUpdateProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      missionId,
      publicKey,
      proof
    }: {
      missionId: string;
      publicKey: string;
      proof?: string;
    }) => {
      const res = await apiRequest('POST', `/api/missions/${missionId}/complete`, {
        publicKey,
        proof,
      });
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['user', variables.publicKey] });
      queryClient.invalidateQueries({ queryKey: ['missions'] });
    },
  });
}
