export class GitHubAPIError extends Error {
  constructor(
    public message: string,
    public status?: number,
    public isRateLimit?: boolean
  ) {
    super(message);
    this.name = 'GitHubAPIError';
  }
}
