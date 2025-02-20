
import { useQuery } from '@tanstack/react-query';
import { fetchUsers } from '../api/users';
import type { UserData } from '../types/users';

export const useUsers = () => {
  return useQuery<UserData[]>({
    queryKey: ['users'],
    queryFn: fetchUsers,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });
};
