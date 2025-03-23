
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import type { Visitor, VisitorApiResponse } from '../types/visitors';

/**
 * Custom hook for fetching and managing visitor data
 * @returns Visitor data, loading state, error state and refetch function
 */
export function useVisitors() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVisitors = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Use axios for better error handling and response processing
      const response = await axios.get<VisitorApiResponse>(
        'https://respizenmedical.com/tazart/get_all_visitors.php',
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          timeout: 10000 // 10 seconds timeout
        }
      );
      
      if (response.status === 200) {
        const data = response.data;
        
        if (Array.isArray(data)) {
          setVisitors(data);
          console.log('Fetched visitors successfully:', data.length);
        } else {
          throw new Error('API returned unexpected data format');
        }
      } else {
        throw new Error(`API returned status code ${response.status}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch visitor data');
      console.error('Error fetching visitor data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVisitors();
  }, [fetchVisitors]);

  const refetch = useCallback(() => {
    console.log('Refetching visitor data...');
    fetchVisitors();
  }, [fetchVisitors]);

  return { visitors, isLoading, error, refetch };
}
