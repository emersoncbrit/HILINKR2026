import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useUsername } from '@/hooks/use-username';
import { BASE_URL } from '@/lib/reserved-usernames';
import { Copy, Plus, Trash2, GripVertical, Save, Eye, Upload, Instagram, Youtube, Twitter, Facebook, Music2 } from 'lucide-react';

interface LinkItem {
  id: string;
  title: string;
  url: string;
  icon?: string;
}

interface SocialLinks {
  instagram?: string;
  tiktok?: string;
  youtube?: string;
  twitter?: string;
  facebook?: string;
  whatsapp?: string;
}

interface ThemeColors {
  primary: string;
  background: string;
  text: string;
  cardBg: string;
}

interface LinkBioConfig {
  id?: string;
  title: string;
  bio: string;
  avatar_url: string | null;
  template: string;
  theme_colors: ThemeColors;
  links: LinkItem[];
  social_links: SocialLinks;
}

const TEMPLATES = [
  { id: 'minimal', name: 'Minimal', colors: { primary: '#F59E0B', background: '#FFFFFF', text: '#1F2937', cardBg: '#F3F4F6' } },
  { id: 'dark', name: 'Dark', colors: { primary: '#F59E0B', background: '#0F172A', text: '#FFFFFF', cardBg: '#1E293B' } },
  { id: 'gradient', name: 'Gradient', colors: { primary: '#8B5CF6', background: '#1E1B4B', text: '#FFFFFF', cardBg: 'rgba(255,255,255,0.1)' } },
  { id: 'pastel', name: 'Pastel', colors: { primary: '#EC4899', background: '#FDF2F8', text: '#831843', cardBg: '#FFFFFF' } },
  { id: 'nature', name: 'Nature', colors: { primary: '#059669', background: '#ECFDF5', text: '#064E3B', cardBg: '#FFFFFF' } },
];

const LinkBio = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [config, setConfig] = useState<LinkBioConfig>({
    title: '',
    bio: '',
    avatar_url: null,
    template: 'dark',
    theme_colors: TEMPLATES[1].colors,
    links: [],
    social_links: {},
  });

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data } = await supabase
        .from('link_bio_configs')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (data) {
        setConfig({
          id: data.id,
          title: data.title || '',
          bio: data.bio || '',
          avatar_url: data.avatar_url,
          template: data.template || 'dark',
          theme_colors: (data.theme_colors as unknown as ThemeColors) || TEMPLATES[1].colors,
          links: (data.links as unknown as LinkItem[]) || [],
          social_links: (data.social_links as unknown as SocialLinks) || {},
        });
      }
      setLoading(false);
    };
    fetch();
  }, [user]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (file.size > 180 * 1024) {
      toast({ title: 'Arquivo muito grande', description: 'Máximo 180KB', variant: 'destructive' });
      return;
    }
    setUploading(true);
    const ext = file.name.split('.').pop();
    const path = `${user.id}/avatar.${ext}`;
    const { error } = await supabase.storage.from('link-bio-avatars').upload(path, file, { upsert: true });
    if (error) {
      toast({ title: 'Erro no upload', description: error.message, variant: 'destructive' });
      setUploading(false);
      return;
    }
    const { data: urlData } = supabase.storage.from('link-bio-avatars').getPublicUrl(path);
    setConfig(prev => ({ ...prev, avatar_url: urlData.publicUrl + '?t=' + Date.now() }));
    setUploading(false);
    toast({ title: 'Avatar atualizado!' });
  };

  const addLink = () => {
    if (config.links.length >= 50) return;
    setConfig(prev => ({
      ...prev,
      links: [...prev.links, { id: crypto.randomUUID(), title: '', url: '' }],
    }));
  };

  const updateLink = (id: string, field: keyof LinkItem, value: string) => {
    setConfig(prev => ({
      ...prev,
      links: prev.links.map(l => l.id === id ? { ...l, [field]: value } : l),
    }));
  };

  const removeLink = (id: string) => {
    setConfig(prev => ({ ...prev, links: prev.links.filter(l => l.id !== id) }));
  };

  const selectTemplate = (t: typeof TEMPLATES[0]) => {
    setConfig(prev => ({ ...prev, template: t.id, theme_colors: { ...t.colors } }));
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    const payload: any = {
      user_id: user.id,
      title: config.title,
      bio: config.bio,
      avatar_url: config.avatar_url,
      template: config.template,
      theme_colors: config.theme_colors,
      links: config.links,
      social_links: config.social_links,
    };

    if (config.id) {
      const { error } = await supabase.from('link_bio_configs').update(payload).eq('id', config.id);
      if (error) { toast({ title: 'Erro', description: error.message, variant: 'destructive' }); setSaving(false); return; }
    } else {
      const { data, error } = await supabase.from('link_bio_configs').insert(payload).select().single();
      if (error) { toast({ title: 'Erro', description: error.message, variant: 'destructive' }); setSaving(false); return; }
      if (data) setConfig(prev => ({ ...prev, id: data.id }));
    }
    toast({ title: 'Salvo com sucesso!' });
    setSaving(false);
  };

  const { username } = useUsername();
  const origin = typeof window !== 'undefined' ? window.location.origin : BASE_URL;
  const publicUrl = username ? `${origin}/${username}` : '';

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Link na Bio</h1>
          <p className="text-sm text-muted-foreground">Personalize sua página de links</p>
        </div>
        <div className="flex gap-2">
          {config.id && username && (
            <Button variant="outline" size="sm" onClick={() => window.open(publicUrl, '_blank')}>
              <Eye className="h-4 w-4 mr-1" />Ver
            </Button>
          )}
          <Button size="sm" onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4 mr-1" />{saving ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </div>

      {/* Link + Copy */}
      {config.id && (
        <Card className="glass-card">
          <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="min-w-0">
              {username ? (
                <p className="text-sm font-medium">Link Bio: <a href={publicUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all">{publicUrl}</a></p>
              ) : (
                <p className="text-sm font-medium text-muted-foreground">Link Bio: defina seu username em Minha Conta para usar o link hilinkr.com/seu-usuario</p>
              )}
            </div>
            {username && (
              <Button size="sm" variant="secondary" onClick={() => { navigator.clipboard.writeText(publicUrl); toast({ title: 'Link copiado!' }); }} className="shrink-0">
                <Copy className="h-4 w-4 mr-1" />Copiar
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Editor */}
        <div className="space-y-6">
          {/* Geral */}
          <Card className="glass-card">
            <CardContent className="p-6 space-y-4">
              <h2 className="font-semibold text-lg">Geral</h2>

              {/* Avatar */}
              <div className="flex flex-col items-center gap-3">
                <div
                  className="h-24 w-24 rounded-full border-2 border-dashed border-border flex items-center justify-center overflow-hidden cursor-pointer hover:border-primary transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {config.avatar_url ? (
                    <img src={config.avatar_url} alt="Avatar" className="h-full w-full object-cover" />
                  ) : (
                    <Upload className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>
                <input ref={fileInputRef} type="file" accept=".jpeg,.jpg,.png" className="hidden" onChange={handleAvatarUpload} />
                <p className="text-xs text-muted-foreground">*.jpeg, *.jpg, *.png — máximo 180KB</p>
              </div>

              <div>
                <Label>Título</Label>
                <Input value={config.title} onChange={e => setConfig(p => ({ ...p, title: e.target.value }))} placeholder="Ex: @perfil" />
                <p className="text-xs text-muted-foreground mt-1">Ex: @perfil</p>
              </div>
              <div>
                <Label>Apresentação</Label>
                <Textarea value={config.bio} onChange={e => setConfig(p => ({ ...p, bio: e.target.value }))} placeholder="Cupons de desconto e ofertas" rows={2} />
              </div>
            </CardContent>
          </Card>

          {/* Links */}
          <Card className="glass-card">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-lg">Meus links</h2>
                <Button size="sm" variant="outline" onClick={addLink} disabled={config.links.length >= 50}>
                  <Plus className="h-4 w-4 mr-1" />Adicionar ({config.links.length}/50)
                </Button>
              </div>
              {config.links.map((link, i) => (
                <div key={link.id} className="flex gap-2 items-start">
                  <GripVertical className="h-4 w-4 mt-3 text-muted-foreground shrink-0" />
                  <div className="flex-1 space-y-1">
                    <Input value={link.title} onChange={e => updateLink(link.id, 'title', e.target.value)} placeholder="Título do link" className="text-sm" />
                    <Input value={link.url} onChange={e => updateLink(link.id, 'url', e.target.value)} placeholder="https://..." className="text-sm" />
                  </div>
                  <Button size="icon" variant="ghost" onClick={() => removeLink(link.id)} className="shrink-0 mt-1">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
              {config.links.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">Nenhum link adicionado</p>}
            </CardContent>
          </Card>

          {/* Social Links */}
          <Card className="glass-card">
            <CardContent className="p-6 space-y-4">
              <h2 className="font-semibold text-lg">Redes Sociais</h2>
              {[
                { key: 'instagram', icon: Instagram, label: 'Instagram', placeholder: '@usuario' },
                { key: 'tiktok', icon: Music2, label: 'TikTok', placeholder: '@usuario' },
                { key: 'youtube', icon: Youtube, label: 'YouTube', placeholder: 'URL do canal' },
                { key: 'twitter', icon: Twitter, label: 'Twitter / X', placeholder: '@usuario' },
                { key: 'facebook', icon: Facebook, label: 'Facebook', placeholder: 'URL do perfil' },
              ].map(({ key, icon: Icon, label, placeholder }) => (
                <div key={key} className="flex items-center gap-3">
                  <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                  <Input
                    value={(config.social_links as Record<string, string>)[key] || ''}
                    onChange={e => setConfig(p => ({ ...p, social_links: { ...p.social_links, [key]: e.target.value } }))}
                    placeholder={placeholder}
                    className="text-sm"
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Templates */}
          <Card className="glass-card">
            <CardContent className="p-6 space-y-4">
              <h2 className="font-semibold text-lg">Template</h2>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {TEMPLATES.map(t => (
                  <button
                    key={t.id}
                    onClick={() => selectTemplate(t)}
                    className={`rounded-lg p-3 border-2 transition-all text-center ${config.template === t.id ? 'border-primary ring-2 ring-primary/30' : 'border-border hover:border-primary/50'}`}
                    style={{ background: t.colors.background }}
                  >
                    <div className="h-3 w-8 rounded-full mx-auto mb-2" style={{ background: t.colors.primary }} />
                    <p className="text-[10px] font-medium" style={{ color: t.colors.text }}>{t.name}</p>
                  </button>
                ))}
              </div>

              <h3 className="font-medium text-sm mt-4">Cores personalizadas</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: 'primary', label: 'Cor primária' },
                  { key: 'background', label: 'Fundo' },
                  { key: 'text', label: 'Texto' },
                  { key: 'cardBg', label: 'Card' },
                ].map(({ key, label }) => (
                  <div key={key} className="flex items-center gap-2">
                    <input
                      type="color"
                      value={(config.theme_colors as unknown as Record<string, string>)[key] || '#000000'}
                      onChange={e => setConfig(p => ({ ...p, theme_colors: { ...p.theme_colors, [key]: e.target.value } as ThemeColors }))}
                      className="h-8 w-8 rounded cursor-pointer border-0"
                    />
                    <span className="text-xs text-muted-foreground">{label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Preview - iPhone Mockup */}
        <div className="lg:sticky lg:top-20 flex justify-center">
          <div className="relative">
            {/* Sombras e reflexo para profundidade */}
            <div className="absolute -inset-4 bg-gradient-to-b from-gray-200/40 to-transparent rounded-[4rem] blur-xl scale-95" />
            <div className="relative mx-auto" style={{ width: 300 }}>
              {/* Moldura estilo iPhone - borda escura e elegante */}
              <div className="rounded-[2.75rem] border-[10px] border-gray-800 shadow-2xl overflow-hidden bg-gray-800">
                {/* Dynamic Island */}
                <div className="relative bg-gray-900 flex justify-center pt-3 pb-2 z-10">
                  <div className="w-24 h-7 bg-black rounded-full" />
                </div>

                {/* Tela */}
                <div className="bg-white overflow-hidden rounded-b-[2rem]" style={{ height: 560 }}>
                  <div
                    className="min-h-full p-5 flex flex-col items-center overflow-y-auto"
                    style={{ background: config.theme_colors.background, color: config.theme_colors.text }}
                  >
                    {/* Avatar com anel */}
                    {config.avatar_url ? (
                      <img src={config.avatar_url} alt="" className="h-20 w-20 rounded-full object-cover border-[3px] mb-4 shadow-lg" style={{ borderColor: config.theme_colors.primary }} />
                    ) : (
                      <div className="h-20 w-20 rounded-full bg-gray-500/30 mb-4 flex items-center justify-center border-2 border-dashed" style={{ borderColor: config.theme_colors.primary }}>
                        <Upload className="h-8 w-8 opacity-50" />
                      </div>
                    )}

                    <h2 className="font-bold text-lg text-center" style={{ color: config.theme_colors.text }}>
                      {config.title || 'Seu nome'}
                    </h2>
                    {config.bio && <p className="text-sm text-center mt-1 opacity-90 max-w-[260px]">{config.bio}</p>}

                    {/* Links */}
                    <div className="w-full mt-5 space-y-2.5">
                      {config.links.filter((l: { title: string; url: string }) => l.title && l.url).map((link: { id: string; title: string }) => (
                        <div
                          key={link.id}
                          className="w-full py-3 px-4 rounded-xl text-center font-medium text-sm transition-transform"
                          style={{
                            background: config.theme_colors.cardBg,
                            color: config.theme_colors.text,
                            border: `2px solid ${config.theme_colors.primary}50`,
                            boxShadow: `0 2px 8px ${config.theme_colors.primary}20`,
                          }}
                        >
                          {link.title}
                        </div>
                      ))}
                      {config.links.filter((l: { title: string; url: string }) => l.title && l.url).length === 0 && (
                        <p className="text-center text-sm opacity-50 py-4">Seus links aparecerão aqui</p>
                      )}
                    </div>

                    <div className="flex gap-4 mt-6">
                      {config.social_links.instagram && <Instagram className="h-5 w-5 opacity-80" style={{ color: config.theme_colors.primary }} />}
                      {config.social_links.tiktok && <Music2 className="h-5 w-5 opacity-80" style={{ color: config.theme_colors.primary }} />}
                      {config.social_links.youtube && <Youtube className="h-5 w-5 opacity-80" style={{ color: config.theme_colors.primary }} />}
                      {config.social_links.twitter && <Twitter className="h-5 w-5 opacity-80" style={{ color: config.theme_colors.primary }} />}
                      {config.social_links.facebook && <Facebook className="h-5 w-5 opacity-80" style={{ color: config.theme_colors.primary }} />}
                    </div>
                  </div>
                </div>

                {/* Barra inferior do iPhone */}
                <div className="bg-gray-900 flex justify-center py-2.5">
                  <div className="w-28 h-1.5 bg-gray-600 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkBio;
