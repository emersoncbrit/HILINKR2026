import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { useUsername } from '@/hooks/use-username';
import { BASE_URL } from '@/lib/reserved-usernames';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Megaphone, Copy, Eye, Pencil } from 'lucide-react';
import { CampaignForm, INITIAL_FORM, type CampaignFormData, type ReviewItem, type FAQItem } from '@/components/campaigns/CampaignForm';
import { PageLoader } from '@/components/PageLoader';
import { EmptyState } from '@/components/EmptyState';
import { useDocumentTitle } from '@/hooks/use-document-title';

interface Product { id: string; name: string; }
interface Campaign {
  id: string; name: string; slug: string; campaign_type: string; campaign_goal: string; status: string;
  headline: string; subheadline: string; benefits: string[]; cta_text: string; urgency_text: string; social_proof_text: string;
  logo_url: string | null; description: string | null; button_color: string | null; installment_text: string | null;
  reviews: ReviewItem[] | null; custom_faqs: FAQItem[] | null; newsletter_enabled: boolean | null;
  created_at: string; product_id: string; products?: { name: string };
}

async function fetchCampaignsData(userId: string): Promise<{ campaigns: Campaign[]; products: Product[] }> {
  const [campRes, prodRes] = await Promise.all([
    supabase.from('campaigns').select('*, products(name)').eq('user_id', userId).order('created_at', { ascending: false }),
    supabase.from('products').select('id, name').eq('user_id', userId).eq('status', 'active'),
  ]);
  return {
    campaigns: (campRes.data as unknown as Campaign[]) || [],
    products: (prodRes.data as Product[]) || [],
  };
}

const Campaigns = () => {
  useDocumentTitle('Campanhas');
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { username } = useUsername();
  const origin = typeof window !== 'undefined' ? window.location.origin : BASE_URL;
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [form, setForm] = useState<CampaignFormData>(INITIAL_FORM);

  const { data, isLoading: loading } = useQuery({
    queryKey: ['campaigns', user?.id],
    queryFn: () => fetchCampaignsData(user!.id),
    enabled: !!user?.id,
  });
  const campaigns = data?.campaigns ?? [];
  const products = data?.products ?? [];

  const generateSlug = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + Math.random().toString(36).substring(2, 7);

  const formToPayload = (f: CampaignFormData) => ({
    name: f.name,
    product_id: f.product_id,
    campaign_type: f.campaign_type,
    campaign_goal: f.campaign_goal,
    headline: f.headline,
    subheadline: f.subheadline,
    benefits: f.benefits.split('\n').filter(Boolean),
    cta_text: f.cta_text,
    urgency_text: f.urgency_text,
    social_proof_text: f.social_proof_text,
    logo_url: f.logo_url || null,
    image_url: f.image_url || null,
    description: f.description,
    button_color: f.button_color,
    installment_text: f.installment_text,
    reviews: JSON.parse(JSON.stringify(f.reviews)),
    custom_faqs: JSON.parse(JSON.stringify(f.custom_faqs)),
    newsletter_enabled: f.newsletter_enabled,
  });

  const handleCreate = async () => {
    if (!user || !form.name || !form.product_id) return;
    const slug = generateSlug(form.name);
    const payload = formToPayload(form);
    const { error } = await supabase.from('campaigns').insert({
      ...payload, slug, user_id: user.id,
    } as any);
    if (error) { toast({ title: 'Erro', description: error.message, variant: 'destructive' }); return; }
    await supabase.from('products').update({ last_activated_at: new Date().toISOString() }).eq('id', form.product_id);
    toast({ title: 'Campanha criada!' });
    setCreateOpen(false);
    setForm(INITIAL_FORM);
    void queryClient.invalidateQueries({ queryKey: ['campaigns', user?.id] });
  };

  const openEdit = (c: Campaign) => {
    setEditingCampaign(c);
    setForm({
      name: c.name,
      product_id: c.product_id,
      campaign_type: c.campaign_type,
      campaign_goal: c.campaign_goal,
      headline: c.headline || '',
      subheadline: c.subheadline || '',
      benefits: (c.benefits || []).join('\n'),
      cta_text: c.cta_text || 'Comprar Agora',
      urgency_text: c.urgency_text || '',
      social_proof_text: c.social_proof_text || '',
      logo_url: c.logo_url || '',
      image_url: (c as any).image_url || '',
      description: c.description || '',
      button_color: c.button_color || '#22c55e',
      installment_text: c.installment_text || '',
      reviews: (c.reviews as ReviewItem[]) || [],
      custom_faqs: (c.custom_faqs as FAQItem[]) || [],
      newsletter_enabled: c.newsletter_enabled || false,
    });
    setEditOpen(true);
  };

  const handleEdit = async () => {
    if (!editingCampaign || !form.name || !form.product_id) return;
    const { error } = await supabase.from('campaigns').update(formToPayload(form) as any).eq('id', editingCampaign.id);
    if (error) { toast({ title: 'Erro', description: error.message, variant: 'destructive' }); return; }
    toast({ title: 'Campanha atualizada!' });
    setEditOpen(false);
    setEditingCampaign(null);
    setForm(INITIAL_FORM);
    void queryClient.invalidateQueries({ queryKey: ['campaigns', user?.id] });
  };

  const toggleStatus = async (c: Campaign) => {
    const newStatus = c.status === 'active' ? 'inactive' : 'active';
    await supabase.from('campaigns').update({ status: newStatus }).eq('id', c.id);
    void queryClient.invalidateQueries({ queryKey: ['campaigns', user?.id] });
  };

  const copyLink = (slug: string) => {
    const url = username ? `${origin}/${username}/c/${slug}` : `${origin}/c/${slug}`;
    navigator.clipboard.writeText(url);
    toast({ title: 'Link copiado!' });
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Campanhas</h1>
          <p className="text-sm text-muted-foreground">Crie e gerencie suas páginas de venda</p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto"><Plus className="h-4 w-4 mr-2" />Nova Campanha</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Criar Campanha</DialogTitle></DialogHeader>
            <CampaignForm form={form} setForm={setForm} products={products} onSubmit={handleCreate} submitLabel="Criar Campanha" />
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={editOpen} onOpenChange={(open) => { setEditOpen(open); if (!open) setEditingCampaign(null); }}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Editar Página de Venda</DialogTitle></DialogHeader>
          <CampaignForm form={form} setForm={setForm} products={products} onSubmit={handleEdit} submitLabel="Salvar Alterações" />
        </DialogContent>
      </Dialog>

      {loading ? (
        <PageLoader />
      ) : campaigns.length === 0 ? (
        <Card className="glass-card">
          <CardContent className="py-12">
            <EmptyState
              icon={<Megaphone className="h-10 w-10 mx-auto" />}
              title="Nenhuma campanha ainda."
              description="Crie sua primeira campanha para gerar páginas de venda."
              action={
                <Button onClick={() => setCreateOpen(true)}><Plus className="h-4 w-4 mr-2" />Nova Campanha</Button>
              }
            />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {campaigns.map((c) => (
            <Card key={c.id} className="glass-card">
              <CardContent className="p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-sm sm:text-base">{c.name}</h3>
                      <Badge variant={c.status === 'active' ? 'default' : 'secondary'}>{c.status === 'active' ? 'Ativo' : 'Inativo'}</Badge>
                      <Badge variant="outline" className="text-xs">{c.campaign_type === 'organic' ? 'Orgânico' : c.campaign_type === 'paid_ads' ? 'Anúncios' : 'Leads'}</Badge>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {(c as any).products?.name || 'Produto desconhecido'} · {c.campaign_goal === 'click' ? 'Clique' : 'Lead'} · {new Date(c.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => copyLink(c.slug)}>
                      <Copy className="h-3.5 w-3.5 mr-1" />Copiar
                    </Button>
                    <a href={username ? `/${username}/c/${c.slug}` : `/c/${c.slug}`} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="sm" className="h-8 text-xs"><Eye className="h-3.5 w-3.5 mr-1" />Ver</Button>
                    </a>
                    <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => openEdit(c)}>
                      <Pencil className="h-3.5 w-3.5 mr-1" />Editar
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => toggleStatus(c)}>
                      {c.status === 'active' ? 'Desativar' : 'Ativar'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Campaigns;
