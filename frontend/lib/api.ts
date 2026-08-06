const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3333';
const TOKEN_KEY = '@omegaGym:token';

export type Usuario = { id: string; nome: string; email: string; matricula: string; plano: string; status: string; vencimento: string; idade: number | null; peso: number | null; altura: number | null };

export function salvarSessao(token: string) { localStorage.setItem(TOKEN_KEY, token); }
export function encerrarSessao() { localStorage.removeItem(TOKEN_KEY); }

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window === 'undefined' ? null : localStorage.getItem(TOKEN_KEY);
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.message ?? 'Não foi possível concluir a solicitação.');
  }
  return response.status === 204 ? (undefined as T) : response.json();
}
