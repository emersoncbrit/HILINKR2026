import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';

/**
 * Retorna o username do usuário logado (profiles).
 * Usado para montar URLs: hilinkr.com/username, hilinkr.com/username/loja/slug, etc.
 */
export function useUsername() {
  const { user } = useAuth();
  const { data: username, isLoading } = useQuery({
    queryKey: ['profile-username', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data } = await supabase
        .from('profiles')
        .select('username')
        .eq('user_id', user.id)
        .maybeSingle();
      return (data as { username: string | null } | null)?.username?.trim() || null;
    },
    enabled: !!user?.id,
  });
  return { username: username || null, isLoading };
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
