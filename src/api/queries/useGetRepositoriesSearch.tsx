import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchGetRepositoriesSearch } from '../clients/fetchGetRepositoriesSearch';

export const GithubRepositoriesSearchKey = 'Github:RepositoriesSearch';

export function useGetRepositoriesSearch(query: string, enabled: boolean = true) {
  return useInfiniteQuery({
    queryKey: [GithubRepositoriesSearchKey, query],
    queryFn: ({ pageParam = 1 }) => fetchGetRepositoriesSearch(query, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const hasMore = lastPage.items.length === 20;
      return hasMore ? allPages.length + 1 : undefined;
    },
    enabled: enabled && query.trim().length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
