
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchUsers } from '../api/users';
import type { UserData } from '../types/users';

export const useUsers = () => {
  const queryClient = useQueryClient();
  
  return useQuery<UserData[]>({
    queryKey: ['users'],
    queryFn: fetchUsers,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    refetchOnWindowFocus: false,
    retry: 1,
    initialData: () => {
      // Return cached data if available
      return queryClient.getQueryData(['users']) as UserData[] | undefined;
    }
  });
};
