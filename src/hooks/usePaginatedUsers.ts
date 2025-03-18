
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchPaginatedUsers } from '../api/users';
import type { UserData, PaginatedResponse } from '../types/users';
import { useEffect } from 'react';

export const usePaginatedUsers = (page: number, limit: number, searchTerm: string = '') => {
  const queryClient = useQueryClient();
  
  // Prefetch next page when current page is loaded
  useEffect(() => {
    const prefetchNextPage = async () => {
      // Prefetch next page
      await queryClient.prefetchQuery({
        queryKey: ['paginatedUsers', page + 1, limit, searchTerm],
        queryFn: () => fetchPaginatedUsers(page + 1, limit, searchTerm),
        staleTime: 1000 * 60 * 5, // 5 minutes
      });
      
      // Optional: Prefetch page after next page for smoother navigation
      await queryClient.prefetchQuery({
        queryKey: ['paginatedUsers', page + 2, limit, searchTerm],
        queryFn: () => fetchPaginatedUsers(page + 2, limit, searchTerm),
        staleTime: 1000 * 60 * 5, // 5 minutes
      });
    };
    
    prefetchNextPage();
  }, [page, limit, searchTerm, queryClient]);

  return useQuery<PaginatedResponse<UserData>>({
    queryKey: ['paginatedUsers', page, limit, searchTerm],
    queryFn: () => fetchPaginatedUsers(page, limit, searchTerm),
    staleTime: 1000 * 60 * 5, // 5 minutes
    placeholderData: (previousData) => previousData
  });
};
