
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App.tsx';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Data stays fresh for 5 minutes
      gcTime: 1000 * 60 * 30, // Cache persists for 30 minutes
      refetchOnWindowFocus: false, // Don't refetch when window regains focus
      retry: 1,
    },
  },
});

// Prefetch users data
queryClient.prefetchQuery({
  queryKey: ['users'],
  queryFn: () => fetch('https://plateform.draminesaid.com/app/get_usersnew.php')
    .then(res => res.json())
    .then(data => data.users),
});

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
