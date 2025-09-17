import { GitHubRepository } from './GitHubRepository';

export interface GitHubSearchResponse {
  total_count: number;
  incomplete_results: boolean;
  items: GitHubRepository[];
}
