import { createContext, useContext, useEffect, useState, useMemo, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface SiteDesignConfig {
  id: string;
  logo_url: string | null;
  favicon_url: string | null;
  site_name: string | null;
  primary_color: string | null;
  secondary_color: string | null;
  accent_color: string | null;
  sidebar_primary_color: string | null;
  updated_at: string;
}

const DEFAULT_CONFIG: SiteDesignConfig = {
  id: 'default',
  logo_url: null,
  favicon_url: null,
  site_name: 'Hilinkr',
  primary_color: '#58c411',
  secondary_color: '#e8f5e0',
  accent_color: '#58c411',
  sidebar_primary_color: '#58c411',
  updated_at: '',
};

function hexToHsl(hex: string): string {
  const h = hex.replace(/^#/, '');
  if (h.length !== 6 && h.length !== 3) return '93 83% 42%';
  let r: number, g: number, b: number;
  if (h.length === 3) {
    r = parseInt(h[0] + h[0], 16) / 255;
    g = parseInt(h[1] + h[1], 16) / 255;
    b = parseInt(h[2] + h[2], 16) / 255;
  } else {
    r = parseInt(h.slice(0, 2), 16) / 255;
    g = parseInt(h.slice(2, 4), 16) / 255;
    b = parseInt(h.slice(4, 6), 16) / 255;
  }
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let s = 0, l = (max + min) / 2;
  if (max !== min) {
    s = l > 0.5 ? (max - min) / (2 - max - min) : (max - min) / (max + min);
  }
  let a = 0;
  if (max === min) a = 0;
  else if (max === r) a = ((g - b) / (max - min)) % 6;
  else if (max === g) a = (b - r) / (max - min) + 2;
  else a = (r - g) / (max - min) + 4;
  const hue = Math.round(a * 60) + (a < 0 ? 360 : 0);
  const sat = Math.round(s * 100);
  const lum = Math.round(l * 100);
  return `${hue} ${sat}% ${lum}%`;
}

interface SiteDesignContextType {
  config: SiteDesignConfig;
  loading: boolean;
  logoUrl: string;
  /** Nome do site para exibição; vazio se o admin deixou em branco (mostrar só a logo maior) */
  siteName: string;
  /** Nome para título da página e alt text; nunca vazio */
  siteNameFallback: string;
  faviconUrl: string | null;
  refetch: () => Promise<void>;
}

const SiteDesignContext = createContext<SiteDesignContextType>({
  config: DEFAULT_CONFIG,
  loading: true,
  logoUrl: '/logo.png',
  siteName: 'Hilinkr',
  siteNameFallback: 'Hilinkr',
  faviconUrl: null,
  refetch: async () => {},
});

export function useSiteDesign() {
  const ctx = useContext(SiteDesignContext);
  if (!ctx) throw new Error('useSiteDesign must be used within SiteDesignProvider');
  return ctx;
}

export function SiteDesignProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<SiteDesignConfig>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);

  const fetchConfig = async () => {
    const { data, error } = await supabase
      .from('site_design_config')
      .select('*')
      .eq('id', 'default')
      .maybeSingle();
    if (!error && data) setConfig(data as SiteDesignConfig);
    setLoading(false);
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const logoUrl = config.logo_url?.trim() || '/logo.png';
  const siteName = config.site_name?.trim() ?? '';
  const siteNameFallback = siteName || 'Hilinkr';
  const faviconUrl = config.favicon_url?.trim() || null;

  useEffect(() => {
    if (loading) return;
    const primary = config.primary_color?.trim() || '#58c411';
    const secondary = config.secondary_color?.trim() || '#e8f5e0';
    const accent = config.accent_color?.trim() || '#58c411';
    const sidebarPrimary = config.sidebar_primary_color?.trim() || primary;
    const style = document.getElementById('site-design-overrides') || document.createElement('style');
    style.id = 'site-design-overrides';
    style.textContent = `
      :root {
        --primary: ${hexToHsl(primary)};
        --ring: ${hexToHsl(primary)};
        --secondary: ${hexToHsl(secondary)};
        --accent: ${hexToHsl(accent)};
        --sidebar-primary: ${hexToHsl(sidebarPrimary)};
        --sidebar-ring: ${hexToHsl(sidebarPrimary)};
        --chart-1: ${hexToHsl(primary)};
      }
      .text-gradient { color: ${primary}; }
      .glow-blue, .glow-green { background: radial-gradient(ellipse at center, ${primary}14 0%, transparent 70%); }
    `;
    if (!document.getElementById('site-design-overrides')) document.head.appendChild(style);
    else document.head.replaceChild(style, document.getElementById('site-design-overrides')!);
  }, [loading, config.primary_color, config.secondary_color, config.accent_color, config.sidebar_primary_color]);

  useEffect(() => {
    let link = document.querySelector<HTMLLinkElement>('link[rel="icon"].site-design-favicon');
    if (faviconUrl) {
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        link.className = 'site-design-favicon';
        document.head.appendChild(link);
      }
      link.href = faviconUrl;
    } else if (link) {
      link.remove();
    }
  }, [faviconUrl]);

  const value = useMemo<SiteDesignContextType>(() => ({
    config,
    loading,
    logoUrl,
    siteName,
    siteNameFallback,
    faviconUrl,
    refetch: fetchConfig,
  }), [config, loading, logoUrl, siteName, siteNameFallback, faviconUrl]);

  return (
    <SiteDesignContext.Provider value={value}>
      {children}
    </SiteDesignContext.Provider>
  );
}
