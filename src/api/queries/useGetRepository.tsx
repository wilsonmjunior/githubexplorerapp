import { useQuery } from '@tanstack/react-query';
import { fetchGetRepository } from '../clients/fetchGetRepository';

export const GithubRepositoryKey = 'Github:Repository';

export function useGetRepository(owner: string, repo: string) {
  return useQuery({
    queryKey: [GithubRepositoryKey, owner, repo],
    queryFn: () => fetchGetRepository(owner, repo),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
