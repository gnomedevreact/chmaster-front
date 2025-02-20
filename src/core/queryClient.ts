import { QueryClient } from '@tanstack/react-query';

export const queryClientUtil = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});
