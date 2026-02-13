import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ShoppingBag, ExternalLink, Save, Upload, Eye, Palette, Share2, Loader2, ImagePlus, Trash2 } from 'lucide-react';
import { PageLoader } from '@/components/PageLoader';
import { useDocumentTitle } from '@/hooks/use-document-title';
import { useUsername } from '@/hooks/use-username';
import { BASE_URL } from '@/lib/reserved-usernames';
import { Separator } from '@/components/ui/separator';
import StoreTemplateSelector from '@/components/hub/StoreTemplateSelector';
import PopupConfigCard from '@/components/hub/PopupConfigCard';

interface HubConfig {
  id: string;
  slug: string;
  store_name: string | null;
  store_description: string | null;
  logo_url: string | null;
  favicon_url: string | null;
  primary_color: string;
  secondary_color: string;
  header_color: string;
  header_text_color: string;
  social_links: Record<string, string>;
  banners: string[];
}

const SOCIAL_FIELDS = [
  { key: 'instagram', label: 'Instagram', placeholder: 'Ex: https://www.instagram.com/...' },
  { key: 'telegram', label: 'Telegram', placeholder: 'Ex: https://t.me/...' },
  { key: 'whatsapp', label: 'Contato pessoal WhatsApp', placeholder: 'Ex: https://chat.whatsapp.com/...' },
  { key: 'whatsapp_channel', label: 'Canal de vendas WhatsApp', placeholder: 'Ex: https://chat.whatsapp.com/...' },
  { key: 'twitter', label: 'Twitter', placeholder: 'Ex: https://x.com/...' },
  { key: 'tiktok', label: 'Tiktok', placeholder: 'Ex: https://www.tiktok.com/...' },
  { key: 'facebook', label: 'Facebook', placeholder: 'Ex: https://www.facebook.com/...' },
  { key: 'youtube', label: 'Youtube', placeholder: 'Ex: https://www.youtube.com/...' },
  { key: 'threads', label: 'Threads', placeholder: 'Ex: https://www.threads.net/...' },
  { key: 'pinterest', label: 'Pinterest', placeholder: 'Ex: https://br.pinterest.com/...' },
];

const Hub = () => {
  useDocumentTitle('Minha Loja');
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState<HubConfig | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);

  const [form, setForm] = useState({
    slug: '',
    store_name: '',
    store_description: '',
    logo_url: '',
    favicon_url: '',
    primary_color: '#e05500',
    secondary_color: '#1a4baf',
    header_color: '#1a4baf',
    header_text_color: '#ffffff',
    social_links: {} as Record<string, string>,
    banners: [] as string[],
    store_template: 'default',
    popup_enabled: false,
    popup_title: 'Ofertas Exclusivas! 🔥',
    popup_description: 'Cadastre-se e receba as melhores promoções diretamente no seu WhatsApp!',
    popup_button_text: 'Quero receber ofertas!',
    popup_bg_color: '#ffffff',
    popup_text_color: '#1a1a1a',
    popup_button_color: '#e05500',
  });

  useEffect(() => {
    if (!user) return;
    const fetchConfig = async () => {
      const { data } = await supabase
        .from('hub_configs')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (data) {
        setConfig(data as unknown as HubConfig);
        setForm({
          slug: data.slug || '',
          store_name: (data as any).store_name || '',
          store_description: (data as any).store_description || '',
          logo_url: (data as any).logo_url || '',
          favicon_url: (data as any).favicon_url || '',
          primary_color: (data as any).primary_color || '#e05500',
          secondary_color: (data as any).secondary_color || '#1a4baf',
          header_color: (data as any).header_color || '#1a4baf',
          header_text_color: (data as any).header_text_color || '#ffffff',
          social_links: ((data as any).social_links as Record<string, string>) || {},
          banners: ((data as any).banners as string[]) || [],
          store_template: (data as any).store_template || 'default',
          popup_enabled: (data as any).popup_enabled || false,
          popup_title: (data as any).popup_title || 'Ofertas Exclusivas! 🔥',
          popup_description: (data as any).popup_description || 'Cadastre-se e receba as melhores promoções diretamente no seu WhatsApp!',
          popup_button_text: (data as any).popup_button_text || 'Quero receber ofertas!',
          popup_bg_color: (data as any).popup_bg_color || '#ffffff',
          popup_text_color: (data as any).popup_text_color || '#1a1a1a',
          popup_button_color: (data as any).popup_button_color || '#e05500',
        });
      }
      setLoading(false);
    };
    fetchConfig();
  }, [user]);

  const uploadFile = async (file: File, type: 'logo' | 'favicon' | 'banner') => {
    if (!user) return;
    const setter = type === 'logo' ? setUploadingLogo : type === 'favicon' ? setUploadingFavicon : setUploadingBanner;
    setter(true);

    try {
      const ext = file.name.split('.').pop();
      const path = `${user.id}/${type}-${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from('store-assets').upload(path, file, { upsert: true });
      if (error) throw error;

      const { data: urlData } = supabase.storage.from('store-assets').getPublicUrl(path);
      const url = urlData.publicUrl;

      if (type === 'logo') {
        setForm(prev => ({ ...prev, logo_url: url }));
      } else if (type === 'favicon') {
        setForm(prev => ({ ...prev, favicon_url: url }));
      } else {
        setForm(prev => ({ ...prev, banners: [...prev.banners, url] }));
      }
      toast({ title: type === 'banner' ? 'Banner enviado!' : `${type === 'logo' ? 'Logotipo' : 'Favicon'} enviado!` });
    } catch (err: any) {
      toast({ title: 'Erro no upload', description: err.message, variant: 'destructive' });
    } finally {
      setter(false);
    }
  };

  const removeBanner = (index: number) => {
    setForm(prev => ({ ...prev, banners: prev.banners.filter((_, i) => i !== index) }));
  };

  const handleSave = async () => {
    if (!user) return;
    if (!form.slug.trim()) {
      toast({ title: 'Informe um slug para sua loja', variant: 'destructive' });
      return;
    }

    setSaving(true);
    const payload = {
      slug: form.slug.toLowerCase().replace(/[^a-z0-9-]/g, ''),
      store_name: form.store_name || null,
      store_description: form.store_description || null,
      logo_url: form.logo_url || null,
      favicon_url: form.favicon_url || null,
      primary_color: form.primary_color,
      secondary_color: form.secondary_color,
      header_color: form.header_color,
      header_text_color: form.header_text_color,
      social_links: form.social_links,
      banners: form.banners,
      store_template: form.store_template,
      popup_enabled: form.popup_enabled,
      popup_title: form.popup_title,
      popup_description: form.popup_description,
      popup_button_text: form.popup_button_text,
      popup_bg_color: form.popup_bg_color,
      popup_text_color: form.popup_text_color,
      popup_button_color: form.popup_button_color,
      user_id: user.id,
    };

    let error;
    if (config) {
      ({ error } = await supabase.from('hub_configs').update(payload).eq('id', config.id));
    } else {
      ({ error } = await supabase.from('hub_configs').insert(payload));
    }

    if (error) {
      toast({ title: 'Erro ao salvar', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Configurações salvas!' });
      // Refetch
      const { data } = await supabase.from('hub_configs').select('*').eq('user_id', user.id).maybeSingle();
      if (data) setConfig(data as unknown as HubConfig);
    }
    setSaving(false);
  };

  const { username } = useUsername();
  const origin = typeof window !== 'undefined' ? window.location.origin : BASE_URL;
  const storeUrl = form.slug ? (username ? `${origin}/${username}/loja/${form.slug}` : `${origin}/loja/${form.slug}`) : '';

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            <ShoppingBag className="h-5 sm:h-6 w-5 sm:w-6" />
            Configurações da Loja
          </h1>
          <p className="text-sm text-muted-foreground">Configure sua vitrine pública de produtos</p>
        </div>
        <div className="flex gap-2">
          {storeUrl && (
            <Button variant="outline" size="sm" asChild>
              <a href={username ? `/${username}/loja/${form.slug}` : `/loja/${form.slug}`} target="_blank" rel="noopener noreferrer">
                <Eye className="h-4 w-4 mr-1" />Ver Loja
              </a>
            </Button>
          )}
          <Button size="sm" onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Save className="h-4 w-4 mr-1" />}
            Salvar
          </Button>
        </div>
      </div>

      {/* Geral */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">⚙️ Geral</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Link da loja</Label>
              <div className="flex items-center gap-2">
                <Input
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                  placeholder="minha-loja"
                />
              </div>
              {storeUrl && (
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xs text-muted-foreground truncate">{storeUrl}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs h-6 px-2"
                    onClick={() => { navigator.clipboard.writeText(storeUrl); toast({ title: 'Link copiado!' }); }}
                  >
                    Copiar
                  </Button>
                  <a href={username ? `/${username}/loja/${form.slug}` : `/loja/${form.slug}`} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1">
                    Acessar <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
            </div>
            <div>
              <Label>Nome da loja</Label>
              <Input
                value={form.store_name}
                onChange={(e) => setForm({ ...form, store_name: e.target.value })}
                placeholder="Nome da sua loja"
              />
            </div>
          </div>
          <div>
            <Label>Descrição</Label>
            <Input
              value={form.store_description}
              onChange={(e) => setForm({ ...form, store_description: e.target.value })}
              placeholder="Texto de descrição que aparece quando o link do seu site é compartilhado"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tema */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2"><Palette className="h-5 w-5" /> Tema</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Logo */}
            <div>
              <Label className="text-base font-semibold">Logotipo</Label>
              <div className="mt-2 border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center min-h-[160px] bg-muted/20">
                {form.logo_url ? (
                  <img src={form.logo_url} alt="Logo" className="max-h-24 max-w-full object-contain mb-3" />
                ) : (
                  <Upload className="h-10 w-10 text-muted-foreground/40 mb-3" />
                )}
                <label className="cursor-pointer">
                  <span className="text-sm text-primary hover:underline">
                    {uploadingLogo ? 'Enviando...' : 'Escolher foto'}
                  </span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) uploadFile(f, 'logo');
                  }} />
                </label>
                <p className="text-xs text-muted-foreground mt-1">.jpeg, .png, .svg — máx 500 KB</p>
              </div>
            </div>
            {/* Favicon */}
            <div>
              <Label className="text-base font-semibold">Ícone do navegador (favicon)</Label>
              <div className="mt-2 border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center min-h-[160px] bg-muted/20">
                {form.favicon_url ? (
                  <img src={form.favicon_url} alt="Favicon" className="h-16 w-16 object-contain mb-3" />
                ) : (
                  <Upload className="h-10 w-10 text-muted-foreground/40 mb-3" />
                )}
                <label className="cursor-pointer">
                  <span className="text-sm text-primary hover:underline">
                    {uploadingFavicon ? 'Enviando...' : 'Escolher foto'}
                  </span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) uploadFile(f, 'favicon');
                  }} />
                </label>
                <p className="text-xs text-muted-foreground mt-1">32x32 ideal — .png, .ico</p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Cor primária</Label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="color"
                  value={form.primary_color}
                  onChange={(e) => setForm({ ...form, primary_color: e.target.value })}
                  className="h-9 w-9 rounded border border-border cursor-pointer"
                />
                <Input
                  value={form.primary_color}
                  onChange={(e) => setForm({ ...form, primary_color: e.target.value })}
                  className="font-mono text-sm"
                />
              </div>
            </div>
            <div>
              <Label>Cor secundária</Label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="color"
                  value={form.secondary_color}
                  onChange={(e) => setForm({ ...form, secondary_color: e.target.value })}
                  className="h-9 w-9 rounded border border-border cursor-pointer"
                />
                <Input
                  value={form.secondary_color}
                  onChange={(e) => setForm({ ...form, secondary_color: e.target.value })}
                  className="font-mono text-sm"
                />
              </div>
            </div>
            <div>
              <Label>Cor do cabeçalho</Label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="color"
                  value={form.header_color}
                  onChange={(e) => setForm({ ...form, header_color: e.target.value })}
                  className="h-9 w-9 rounded border border-border cursor-pointer"
                />
                <Input
                  value={form.header_color}
                  onChange={(e) => setForm({ ...form, header_color: e.target.value })}
                  className="font-mono text-sm"
                />
              </div>
            </div>
            <div>
              <Label>Cor do texto no cabeçalho</Label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="color"
                  value={form.header_text_color}
                  onChange={(e) => setForm({ ...form, header_text_color: e.target.value })}
                  className="h-9 w-9 rounded border border-border cursor-pointer"
                />
                <Input
                  value={form.header_text_color}
                  onChange={(e) => setForm({ ...form, header_text_color: e.target.value })}
                  className="font-mono text-sm"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Banners */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2"><ImagePlus className="h-5 w-5" /> Banners</CardTitle>
          <p className="text-sm text-muted-foreground">Os banners aparecem no topo da sua loja. Adicione mais de um para criar um slider automático.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {form.banners.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {form.banners.map((url, index) => (
                <div key={index} className="relative group rounded-lg overflow-hidden border border-border">
                  <img src={url} alt={`Banner ${index + 1}`} className="w-full h-32 object-cover" />
                  <button
                    onClick={() => removeBanner(index)}
                    className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <span className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded">
                    Banner {index + 1}
                  </span>
                </div>
              ))}
            </div>
          )}
          <div className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center min-h-[120px] bg-muted/20">
            <Upload className="h-8 w-8 text-muted-foreground/40 mb-2" />
            <label className="cursor-pointer">
              <span className="text-sm text-primary hover:underline">
                {uploadingBanner ? 'Enviando...' : '+ Adicionar banner'}
              </span>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) uploadFile(f, 'banner');
              }} />
            </label>
            <p className="text-xs text-muted-foreground mt-1">Recomendado: 1200×400px — .jpeg, .png</p>
          </div>
        </CardContent>
      </Card>

      {/* Template */}
      <StoreTemplateSelector
        value={form.store_template}
        onChange={(t, preset) => setForm({ ...form, store_template: t, ...preset })}
      />

      {/* Popup de Captura */}
      <PopupConfigCard
        form={{
          popup_enabled: form.popup_enabled,
          popup_title: form.popup_title,
          popup_description: form.popup_description,
          popup_button_text: form.popup_button_text,
          popup_bg_color: form.popup_bg_color,
          popup_text_color: form.popup_text_color,
          popup_button_color: form.popup_button_color,
        }}
        onChange={(updates) => setForm({ ...form, ...updates })}
      />

      {/* Redes Sociais */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2"><Share2 className="h-5 w-5" /> Redes Sociais</CardTitle>
          <p className="text-sm text-muted-foreground">As redes sociais aparecem no rodapé da sua loja.</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SOCIAL_FIELDS.map((field) => (
              <div key={field.key}>
                <Label>{field.label}</Label>
                <Input
                  value={form.social_links[field.key] || ''}
                  onChange={(e) => setForm({
                    ...form,
                    social_links: { ...form.social_links, [field.key]: e.target.value },
                  })}
                  placeholder={field.placeholder}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Save button bottom */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} size="lg">
          {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          Salvar
        </Button>
      </div>
    </div>
  );
};

export default Hub;
