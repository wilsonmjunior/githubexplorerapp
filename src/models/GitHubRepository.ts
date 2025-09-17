export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  owner: {
    id: number;
    login: string;
    avatar_url: string;
  };
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  language: string | null;
  html_url: string;
  created_at: string;
  updated_at: string;
}
