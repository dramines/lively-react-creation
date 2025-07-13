import { useCallback, useMemo } from 'react';

// Debounce hook for search and other frequent operations
export const useDebounce = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  return useCallback(
    (...args: Parameters<T>) => {
      const timeoutId = setTimeout(() => callback(...args), delay);
      return () => clearTimeout(timeoutId);
    },
    [callback, delay]
  ) as T;
};

// Memoization for expensive calculations
export const useMemoizedCalculation = <T>(
  calculation: () => T,
  dependencies: React.DependencyList
): T => {
  return useMemo(calculation, dependencies);
};

// Optimized API request with caching
export const useOptimizedFetch = () => {
  const cache = useMemo(() => new Map<string, any>(), []);

  const fetchWithCache = useCallback(async (url: string, options: RequestInit = {}) => {
    const cacheKey = `${url}-${JSON.stringify(options)}`;
    
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      cache.set(cacheKey, data);
      
      // Clear cache after 5 minutes
      setTimeout(() => cache.delete(cacheKey), 5 * 60 * 1000);
      
      return data;
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  }, [cache]);

  return { fetchWithCache };
};