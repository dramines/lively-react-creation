
import { useQuery } from '@tanstack/react-query';
import { fetchUsers } from '../api/users';
import type { UserData } from '../types/users';

export const useUsers = () => {
  return useQuery<UserData[]>({
    queryKey: ['users'],
    queryFn: fetchUsers,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    refetchOnWindowFocus: false, // Prevent automatic refetching when window gains focus
    retry: 1, // Reduce retry attempts to speed up error feedback
  });
};
