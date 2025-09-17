import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchGetRepositoryIssues } from '../clients/fetchGetRepositoryIssues';

export const GithubRepositoryIssuesKey = 'Github:RepositoryIssuesKey';

export function useGetRepositoryIssues(owner: string, repo: string) {
  return useInfiniteQuery({
    queryKey: [GithubRepositoryIssuesKey, owner, repo],
    queryFn: ({ pageParam = 1 }) => fetchGetRepositoryIssues(owner, repo, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const hasMore = lastPage.length === 20;
      return hasMore ? allPages.length + 1 : undefined;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}
