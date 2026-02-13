/**
 * Usernames que não podem ser usados em URLs públicas (rotas do app).
 * Assim evitamos que /dashboard, /auth etc. sejam interpretados como :username.
 */
export const RESERVED_USERNAMES = new Set([
  'auth', 'dashboard', 'products', 'campaigns', 'sales', 'hub', 'leads', 'link-bio',
  'ai-copy', 'tutorial', 'venda-mais', 'seja-afiliado', 'template-stories', 'account',
  'admin', 'termos', 'privacidade', 'c', 'loja', 'bio', 'api', 'static', 'assets',
  'login', 'signup', 'logout', 'api', 'docs', 'blog', 'sobre', 'contato', 'help',
]);

export const BASE_URL = 'https://hilinkr.com';

export function isReservedUsername(username: string | undefined): boolean {
  if (!username || !username.trim()) return true;
  return RESERVED_USERNAMES.has(username.toLowerCase().trim());
}
