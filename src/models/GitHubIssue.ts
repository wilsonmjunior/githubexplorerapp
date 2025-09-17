export interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  user: {
    id: number;
    login: string;
    avatar_url: string;
  };
  labels: {
    id: number;
    name: string;
    color: string;
    description: string | null;
  }[];
  state: 'open' | 'closed';
  created_at: string;
  updated_at: string;
  body: string | null;
  html_url: string;
}
