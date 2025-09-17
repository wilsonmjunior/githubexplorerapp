import type { GitHubSearchResponse } from '@/models/GitHubSearchResponse';
import { createHeaders, handleResponse } from './githubApiUtils';

export async function fetchGetRepositoriesSearch(
  query: string,
  page: number = 1,
  perPage: number = 20
): Promise<GitHubSearchResponse> {
  const searchParams = new URLSearchParams({
    q: query,
    page: page.toString(),
    per_page: perPage.toString(),
    sort: 'stars',
    order: 'desc',
  });

  const url = `${process.env.EXPO_PUBLIC_GITHUB_API_BASE}/search/repositories?${searchParams.toString()}`;

  const response = await fetch(url, {
    headers: createHeaders(),
  });

  return handleResponse(response);
}
