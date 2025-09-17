import { GitHubAPIError } from './githubApiError';

const GITHUB_TOKEN = process.env.EXPO_PUBLIC_GITHUB_TOKEN;

export function createHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'GitHub-Explorer-App',
  };

  if (GITHUB_TOKEN) {
    headers['Authorization'] = `token ${GITHUB_TOKEN}`;
  }
  return headers;
}

export async function handleResponse(response: Response) {
  if (!response.ok) {
    const isRateLimit =
      response.status === 403 && response.headers.get('X-RateLimit-Remaining') === '0';
    let message = 'Ocorreu um erro inesperado';

    if (response.status === 404) {
      message = 'Recurso não encontrado';
    } else if (isRateLimit) {
      const resetTime = response.headers.get('X-RateLimit-Reset');
      const resetDate = resetTime ? new Date(parseInt(resetTime) * 1000) : null;
      message = resetDate
        ? `Limite de requisições excedido. Tente novamente após ${resetDate.toLocaleTimeString()}`
        : 'Limite de requisições excedido. Tente novamente mais tarde';
    } else if (response.status >= 500) {
      message = 'Erro no servidor do GitHub. Tente novamente mais tarde';
    }

    throw new GitHubAPIError(message, response.status, isRateLimit);
  }
  return response.json();
}
