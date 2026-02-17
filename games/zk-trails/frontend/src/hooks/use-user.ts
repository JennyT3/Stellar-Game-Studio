import { useQuery } from '@tanstack/react-query';
import { API_URL } from '@/lib/constants';

export function useUser(address: string | null) {
  return useQuery({
    queryKey: ['user', address],
    queryFn: async () => {
      if (!address) return null;
      const res = await fetch(`${API_URL}/players/${address}`);
      if (!res.ok) throw new Error('Failed to fetch user');
      return res.json();
    },
    enabled: !!address,
  });
}
