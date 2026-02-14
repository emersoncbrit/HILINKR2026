import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';

export const PROFILE_USERNAME_QUERY_KEY = ['profile-username'] as const;

export type ProfileUsernameRow = { username: string | null; username_changed_at: string | null } | null;

export async function fetchProfileUsername(userId: string): Promise<ProfileUsernameRow> {
  const { data } = await supabase
    .from('profiles')
    .select('username, username_changed_at')
    .eq('user_id', userId)
    .maybeSingle();
  return data as ProfileUsernameRow;
}

/**
 * Retorna o username do usuário logado (profiles).
 * Usado para montar URLs: hilinkr.com/username, hilinkr.com/username/loja/slug, etc.
 */
export function useUsername() {
  const { user } = useAuth();
  const { data: row, isLoading } = useQuery({
    queryKey: [...PROFILE_USERNAME_QUERY_KEY, user?.id],
    queryFn: () => fetchProfileUsername(user!.id),
    enabled: !!user?.id,
  });
  const username = row?.username?.trim() || null;
  return { username, isLoading };
}

/**
 * Resolve user_id a partir do username (para páginas públicas).
 */
export async function getUserIdByUsername(username: string): Promise<string | null> {
  const { data } = await supabase
    .from('profiles')
    .select('user_id')
    .eq('username', username.trim().toLowerCase())
    .maybeSingle();
  return (data as { user_id: string } | null)?.user_id ?? null;
}
