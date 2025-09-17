import type { GitHubRepository } from '@/models/GitHubRepository';
import { createHeaders, handleResponse } from './githubApiUtils';

export async function fetchGetRepository(owner: string, repo: string): Promise<GitHubRepository> {
  const url = `${process.env.EXPO_PUBLIC_GITHUB_API_BASE}/repos/${owner}/${repo}`;

  const response = await fetch(url, {
    headers: createHeaders(),
  });

  return handleResponse(response);
}
