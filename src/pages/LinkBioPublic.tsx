import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { getUserIdByUsername } from '@/hooks/use-username';
import { isReservedUsername } from '@/lib/reserved-usernames';
import { Instagram, Youtube, Twitter, Facebook, Music2, ExternalLink } from 'lucide-react';

interface LinkItem {
  id: string;
  title: string;
  url: string;
}

interface SocialLinks {
  instagram?: string;
  tiktok?: string;
  youtube?: string;
  twitter?: string;
  facebook?: string;
}

interface ThemeColors {
  primary: string;
  background: string;
  text: string;
  cardBg: string;
}

const LinkBioPublic = () => {
  const { slug, username: usernameParam } = useParams<{ slug?: string; username?: string }>();
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      if (!slug && !usernameParam) { setLoading(false); return; }
      if (usernameParam) {
        if (isReservedUsername(usernameParam)) {
          setNotFound(true);
          setLoading(false);
          return;
        }
        const userId = await getUserIdByUsername(usernameParam);
        if (!userId) { setNotFound(true); setLoading(false); return; }
        const { data, error } = await supabase
          .from('link_bio_configs')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();
        if (!data || error) setNotFound(true);
        else setConfig(data);
      } else if (slug) {
        const { data, error } = await supabase
          .from('link_bio_configs')
          .select('*')
          .eq('slug', slug)
          .maybeSingle();
        if (!data || error) setNotFound(true);
        else setConfig(data);
      } else return;
      setLoading(false);
    };
    fetch();
  }, [slug, usernameParam]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
      </div>
    );
  }

  if (notFound || !config) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Página não encontrada</h1>
          <p className="text-gray-400">Este link não existe ou foi removido.</p>
        </div>
      </div>
    );
  }

  const colors: ThemeColors = (config.theme_colors as unknown as ThemeColors) || { primary: '#F59E0B', background: '#0F172A', text: '#FFFFFF', cardBg: '#1E293B' };
  const rawLinks = (config.links as unknown as LinkItem[] | null | undefined) || [];
  const links: LinkItem[] = rawLinks.map((l) => ({
    id: String(l?.id ?? ''),
    title: String(l?.title ?? ''),
    url: String(l?.url ?? '').trim(),
  })).filter((l) => l.title || l.url);
  const social: SocialLinks = (config.social_links as unknown as SocialLinks) || {};
  const template = config.template || 'dark';

  const getSocialUrl = (platform: string, value: string) => {
    if (value.startsWith('http')) return value;
    const clean = value.replace('@', '');
    switch (platform) {
      case 'instagram': return `https://instagram.com/${clean}`;
      case 'tiktok': return `https://tiktok.com/@${clean}`;
      case 'twitter': return `https://x.com/${clean}`;
      case 'facebook': return value.startsWith('http') ? value : `https://facebook.com/${clean}`;
      case 'youtube': return value;
      default: return value;
    }
  };

  /** Monta a URL absoluta para abrir no clique — usa origin no momento do clique para evitar 404. */
  const getLinkHref = (url: string | null | undefined): string => {
    const u = String(url ?? '').trim();
    if (!u) return '';
    if (u.startsWith('http://') || u.startsWith('https://')) return u;
    const firstSegment = u.split('/')[0];
    if (firstSegment.includes('.')) return `https://${u}`;
    const path = u.startsWith('/') ? u : `/${u.replace(/^\//, '')}`;
    if (typeof window === 'undefined') return path;
    return `${window.location.origin}${path}`;
  };

  const bgStyle: React.CSSProperties = template === 'gradient'
    ? { background: `linear-gradient(135deg, ${colors.background}, ${colors.primary}30)`, color: colors.text }
    : { background: colors.background, color: colors.text };

  return (
    <>
      <head>
        <title>{config.title || 'Link na Bio'}</title>
        <meta name="description" content={config.bio || 'Meus links'} />
        <meta property="og:title" content={config.title || 'Link na Bio'} />
        <meta property="og:description" content={config.bio || 'Meus links'} />
        {config.avatar_url && <meta property="og:image" content={config.avatar_url} />}
      </head>
      <div className="min-h-screen flex items-center justify-center p-4" style={bgStyle}>
        <div className="w-full max-w-md flex flex-col items-center py-10">
          {/* Avatar */}
          {config.avatar_url && (
            <img
              src={config.avatar_url}
              alt={config.title}
              className="h-24 w-24 rounded-full object-cover border-3 mb-4"
              style={{ borderColor: colors.primary }}
            />
          )}

          {/* Title + Bio */}
          <h1 className="font-bold text-xl text-center" style={{ color: colors.text }}>
            {config.title}
          </h1>
          {config.bio && (
            <p className="text-sm text-center mt-2 max-w-xs opacity-80">{config.bio}</p>
          )}

          {/* Links — cada botão abre o site/URL que o usuário colocou em "Meus links" */}
          <div className="w-full mt-8 space-y-3">
            {links.filter((l) => l.title && l.url).map((link) => {
              const rawUrl = link.url;
              const handleClick = (e: React.MouseEvent) => {
                e.preventDefault();
                const urlToOpen = getLinkHref(rawUrl);
                if (urlToOpen) window.open(urlToOpen, '_blank', 'noopener,noreferrer');
              };
              const href = getLinkHref(rawUrl) || '#';
              return (
                <a
                  key={link.id}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleClick}
                  className="block w-full py-3.5 px-5 rounded-xl text-center font-medium text-sm transition-all hover:scale-[1.03] hover:shadow-lg"
                  style={{
                    background: colors.cardBg,
                    color: colors.text,
                    border: `1px solid ${colors.primary}40`,
                  }}
                >
                  {link.title}
                </a>
              );
            })}
          </div>

          {/* Social Icons */}
          {Object.values(social).some(Boolean) && (
            <div className="flex gap-5 mt-10">
              {social.instagram && (
                <a href={getSocialUrl('instagram', social.instagram)} target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 transition-opacity">
                  <Instagram className="h-5 w-5" />
                </a>
              )}
              {social.tiktok && (
                <a href={getSocialUrl('tiktok', social.tiktok)} target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 transition-opacity">
                  <Music2 className="h-5 w-5" />
                </a>
              )}
              {social.youtube && (
                <a href={getSocialUrl('youtube', social.youtube)} target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 transition-opacity">
                  <Youtube className="h-5 w-5" />
                </a>
              )}
              {social.twitter && (
                <a href={getSocialUrl('twitter', social.twitter)} target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 transition-opacity">
                  <Twitter className="h-5 w-5" />
                </a>
              )}
              {social.facebook && (
                <a href={getSocialUrl('facebook', social.facebook)} target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 transition-opacity">
                  <Facebook className="h-5 w-5" />
                </a>
              )}
            </div>
          )}

          <p className="text-xs opacity-40 mt-12">Feito com Hilinkr</p>
        </div>
      </div>
    </>
  );
};

export default LinkBioPublic;
