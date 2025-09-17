import type { GitHubIssue } from '@/models/GitHubIssue';
import { createHeaders, handleResponse } from './githubApiUtils';

export async function fetchGetRepositoryIssues(
  owner: string,
  repo: string,
  page = 1,
  perPage = 20
): Promise<GitHubIssue[]> {
  const url = `${process.env.EXPO_PUBLIC_GITHUB_API_BASE}/repos/${owner}/${repo}/issues?state=open&page=${page}&per_page=${perPage}`;

  const response = await fetch(url, {
    headers: createHeaders(),
  });

  return handleResponse(response);
}
