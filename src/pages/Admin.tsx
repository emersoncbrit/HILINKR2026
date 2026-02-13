import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAdmin } from '@/hooks/use-admin';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash2, Users, Package, Megaphone, Store, Mail, Link2, Layout, GraduationCap, ShoppingBag, Users2, Tag, Monitor, Shield } from 'lucide-react';

const Admin = () => {
  const { isAdmin, loading: adminLoading } = useAdmin();
  const { user } = useAuth();
  const { toast } = useToast();

  // State for all sections
  const [platforms, setPlatforms] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [tutorials, setTutorials] = useState<any[]>([]);
  const [vendaMais, setVendaMais] = useState<any[]>([]);
  const [affiliatePlans, setAffiliatePlans] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [allCampaigns, setAllCampaigns] = useState<any[]>([]);
  const [allHubs, setAllHubs] = useState<any[]>([]);
  const [allLeads, setAllLeads] = useState<any[]>([]);
  const [allLinkBios, setAllLinkBios] = useState<any[]>([]);
  const [allTemplates, setAllTemplates] = useState<any[]>([]);

  // Form states
  const [newPlatform, setNewPlatform] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [tutorialForm, setTutorialForm] = useState({ title: '', description: '', duration: '', video_url: '' });
  const [vendaMaisForm, setVendaMaisForm] = useState({ name: '', description: '', image_url: '', checkout_url: '' });
  const [planForm, setPlanForm] = useState({ name: '', commission: '', description: '', affiliate_link: '' });
  const [dialogOpen, setDialogOpen] = useState<string | null>(null);

  const fetchAll = async () => {
    const [p, c, t, v, a, users, prods, camps, hubs, leads, bios, temps] = await Promise.all([
      supabase.from('admin_platforms').select('*').order('name'),
      supabase.from('admin_categories').select('*').order('name'),
      supabase.from('admin_tutorials').select('*').order('sort_order'),
      supabase.from('admin_venda_mais').select('*').order('sort_order'),
      supabase.from('admin_affiliate_plans').select('*').order('sort_order'),
      supabase.from('profiles').select('*').order('created_at', { ascending: false }),
      supabase.from('products').select('*').order('created_at', { ascending: false }),
      supabase.from('campaigns').select('*').order('created_at', { ascending: false }),
      supabase.from('hub_configs').select('*').order('created_at', { ascending: false }),
      supabase.from('hub_leads').select('*').order('created_at', { ascending: false }),
      supabase.from('link_bio_configs').select('*').order('created_at', { ascending: false }),
      supabase.from('story_templates').select('*').order('created_at', { ascending: false }),
    ]);
    setPlatforms(p.data || []);
    setCategories(c.data || []);
    setTutorials(t.data || []);
    setVendaMais(v.data || []);
    setAffiliatePlans(a.data || []);
    setAllUsers(users.data || []);
    setAllProducts(prods.data || []);
    setAllCampaigns(camps.data || []);
    setAllHubs(hubs.data || []);
    setAllLeads(leads.data || []);
    setAllLinkBios(bios.data || []);
    setAllTemplates(temps.data || []);
  };

  useEffect(() => { if (isAdmin) fetchAll(); }, [isAdmin]);

  if (adminLoading) return <div className="flex items-center justify-center h-64"><div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>;
  if (!isAdmin) return <div className="flex items-center justify-center h-64 text-muted-foreground"><Shield className="h-8 w-8 mr-2" /> Acesso restrito a administradores.</div>;

  const addPlatform = async () => {
    if (!newPlatform.trim()) return;
    const { error } = await supabase.from('admin_platforms').insert({ name: newPlatform.trim() });
    if (error) { toast({ title: 'Erro', description: error.message, variant: 'destructive' }); return; }
    setNewPlatform('');
    toast({ title: 'Plataforma adicionada' });
    fetchAll();
  };

  const deletePlatform = async (id: string) => {
    await supabase.from('admin_platforms').delete().eq('id', id);
    toast({ title: 'Plataforma removida' });
    fetchAll();
  };

  const addCategory = async () => {
    if (!newCategory.trim()) return;
    const { error } = await supabase.from('admin_categories').insert({ name: newCategory.trim() });
    if (error) { toast({ title: 'Erro', description: error.message, variant: 'destructive' }); return; }
    setNewCategory('');
    toast({ title: 'Categoria adicionada' });
    fetchAll();
  };

  const deleteCategory = async (id: string) => {
    await supabase.from('admin_categories').delete().eq('id', id);
    toast({ title: 'Categoria removida' });
    fetchAll();
  };

  const addTutorial = async () => {
    const { error } = await supabase.from('admin_tutorials').insert({ ...tutorialForm, sort_order: tutorials.length });
    if (error) { toast({ title: 'Erro', description: error.message, variant: 'destructive' }); return; }
    setTutorialForm({ title: '', description: '', duration: '', video_url: '' });
    setDialogOpen(null);
    toast({ title: 'Tutorial adicionado' });
    fetchAll();
  };

  const deleteTutorial = async (id: string) => {
    await supabase.from('admin_tutorials').delete().eq('id', id);
    toast({ title: 'Tutorial removido' });
    fetchAll();
  };

  const addVendaMais = async () => {
    const { error } = await supabase.from('admin_venda_mais').insert({ ...vendaMaisForm, sort_order: vendaMais.length });
    if (error) { toast({ title: 'Erro', description: error.message, variant: 'destructive' }); return; }
    setVendaMaisForm({ name: '', description: '', image_url: '', checkout_url: '' });
    setDialogOpen(null);
    toast({ title: 'Produto adicionado' });
    fetchAll();
  };

  const deleteVendaMais = async (id: string) => {
    await supabase.from('admin_venda_mais').delete().eq('id', id);
    toast({ title: 'Produto removido' });
    fetchAll();
  };

  const addPlan = async () => {
    const { error } = await supabase.from('admin_affiliate_plans').insert({ ...planForm, sort_order: affiliatePlans.length });
    if (error) { toast({ title: 'Erro', description: error.message, variant: 'destructive' }); return; }
    setPlanForm({ name: '', commission: '', description: '', affiliate_link: '' });
    setDialogOpen(null);
    toast({ title: 'Plano adicionado' });
    fetchAll();
  };

  const deletePlan = async (id: string) => {
    await supabase.from('admin_affiliate_plans').delete().eq('id', id);
    toast({ title: 'Plano removido' });
    fetchAll();
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold">Painel Admin</h1>
        <p className="text-sm text-muted-foreground">Gerencie toda a plataforma</p>
      </div>

      <Tabs defaultValue="platforms" className="w-full">
        <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/50 p-1 rounded-xl">
          <TabsTrigger value="platforms" className="text-xs gap-1"><Monitor className="h-3 w-3" />Plataformas</TabsTrigger>
          <TabsTrigger value="categories" className="text-xs gap-1"><Tag className="h-3 w-3" />Categorias</TabsTrigger>
          <TabsTrigger value="users" className="text-xs gap-1"><Users className="h-3 w-3" />Usuários</TabsTrigger>
          <TabsTrigger value="products" className="text-xs gap-1"><Package className="h-3 w-3" />Produtos</TabsTrigger>
          <TabsTrigger value="campaigns" className="text-xs gap-1"><Megaphone className="h-3 w-3" />Campanhas</TabsTrigger>
          <TabsTrigger value="hubs" className="text-xs gap-1"><Store className="h-3 w-3" />Lojas</TabsTrigger>
          <TabsTrigger value="leads" className="text-xs gap-1"><Mail className="h-3 w-3" />Leads</TabsTrigger>
          <TabsTrigger value="linkbios" className="text-xs gap-1"><Link2 className="h-3 w-3" />Links Bio</TabsTrigger>
          <TabsTrigger value="templates" className="text-xs gap-1"><Layout className="h-3 w-3" />Templates</TabsTrigger>
          <TabsTrigger value="tutorials" className="text-xs gap-1"><GraduationCap className="h-3 w-3" />Tutoriais</TabsTrigger>
          <TabsTrigger value="vendamais" className="text-xs gap-1"><ShoppingBag className="h-3 w-3" />Venda Mais</TabsTrigger>
          <TabsTrigger value="afiliado" className="text-xs gap-1"><Users2 className="h-3 w-3" />Afiliado</TabsTrigger>
        </TabsList>

        {/* PLATFORMS */}
        <TabsContent value="platforms">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Plataformas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input value={newPlatform} onChange={(e) => setNewPlatform(e.target.value)} placeholder="Nome da plataforma" onKeyDown={(e) => e.key === 'Enter' && addPlatform()} />
                <Button onClick={addPlatform}><Plus className="h-4 w-4" /></Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {platforms.map((p) => (
                  <Badge key={p.id} variant="secondary" className="gap-1 pr-1">
                    {p.name}
                    <button onClick={() => deletePlatform(p.id)} className="ml-1 hover:text-destructive"><Trash2 className="h-3 w-3" /></button>
                  </Badge>
                ))}
                {platforms.length === 0 && <p className="text-sm text-muted-foreground">Nenhuma plataforma cadastrada.</p>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* CATEGORIES */}
        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Categorias</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="Nome da categoria" onKeyDown={(e) => e.key === 'Enter' && addCategory()} />
                <Button onClick={addCategory}><Plus className="h-4 w-4" /></Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((c) => (
                  <Badge key={c.id} variant="secondary" className="gap-1 pr-1">
                    {c.name}
                    <button onClick={() => deleteCategory(c.id)} className="ml-1 hover:text-destructive"><Trash2 className="h-3 w-3" /></button>
                  </Badge>
                ))}
                {categories.length === 0 && <p className="text-sm text-muted-foreground">Nenhuma categoria cadastrada.</p>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* USERS */}
        <TabsContent value="users">
          <Card>
            <CardHeader><CardTitle className="text-lg">Usuários ({allUsers.length})</CardTitle></CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead className="hidden sm:table-cell">Username</TableHead>
                      <TableHead className="hidden sm:table-cell">Telefone</TableHead>
                      <TableHead>Criado em</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allUsers.map((u) => (
                      <TableRow key={u.id}>
                        <TableCell className="font-medium">{u.full_name || '—'}</TableCell>
                        <TableCell className="hidden sm:table-cell">{u.username || '—'}</TableCell>
                        <TableCell className="hidden sm:table-cell">{u.phone || '—'}</TableCell>
                        <TableCell className="text-xs">{new Date(u.created_at).toLocaleDateString('pt-BR')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PRODUCTS */}
        <TabsContent value="products">
          <Card>
            <CardHeader><CardTitle className="text-lg">Todos os Produtos ({allProducts.length})</CardTitle></CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead className="hidden sm:table-cell">Plataforma</TableHead>
                      <TableHead className="hidden sm:table-cell">Categoria</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allProducts.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="font-medium max-w-[200px] truncate">{p.name}</TableCell>
                        <TableCell className="hidden sm:table-cell">{p.platform || '—'}</TableCell>
                        <TableCell className="hidden sm:table-cell">{p.category || '—'}</TableCell>
                        <TableCell><Badge variant="outline">{p.status}</Badge></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* CAMPAIGNS */}
        <TabsContent value="campaigns">
          <Card>
            <CardHeader><CardTitle className="text-lg">Todas as Campanhas ({allCampaigns.length})</CardTitle></CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead className="hidden sm:table-cell">Slug</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden sm:table-cell">Criada</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allCampaigns.map((c) => (
                      <TableRow key={c.id}>
                        <TableCell className="font-medium max-w-[200px] truncate">{c.name}</TableCell>
                        <TableCell className="hidden sm:table-cell">{c.slug}</TableCell>
                        <TableCell><Badge variant="outline">{c.status}</Badge></TableCell>
                        <TableCell className="hidden sm:table-cell text-xs">{new Date(c.created_at).toLocaleDateString('pt-BR')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* HUBS */}
        <TabsContent value="hubs">
          <Card>
            <CardHeader><CardTitle className="text-lg">Lojas Ativas ({allHubs.length})</CardTitle></CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Slug</TableHead>
                      <TableHead className="hidden sm:table-cell">Template</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allHubs.map((h) => (
                      <TableRow key={h.id}>
                        <TableCell className="font-medium">{h.store_name || '—'}</TableCell>
                        <TableCell>{h.slug}</TableCell>
                        <TableCell className="hidden sm:table-cell">{h.store_template || 'default'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* LEADS */}
        <TabsContent value="leads">
          <Card>
            <CardHeader><CardTitle className="text-lg">Todos os Leads ({allLeads.length})</CardTitle></CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead className="hidden sm:table-cell">WhatsApp</TableHead>
                      <TableHead className="hidden sm:table-cell">Data</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allLeads.map((l) => (
                      <TableRow key={l.id}>
                        <TableCell className="font-medium">{l.name || '—'}</TableCell>
                        <TableCell className="text-xs">{l.email}</TableCell>
                        <TableCell className="hidden sm:table-cell">{l.whatsapp || '—'}</TableCell>
                        <TableCell className="hidden sm:table-cell text-xs">{new Date(l.created_at).toLocaleDateString('pt-BR')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* LINK BIOS */}
        <TabsContent value="linkbios">
          <Card>
            <CardHeader><CardTitle className="text-lg">Links na Bio ({allLinkBios.length})</CardTitle></CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Título</TableHead>
                      <TableHead>Slug</TableHead>
                      <TableHead className="hidden sm:table-cell">Template</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allLinkBios.map((b) => (
                      <TableRow key={b.id}>
                        <TableCell className="font-medium">{b.title || '—'}</TableCell>
                        <TableCell>{b.slug}</TableCell>
                        <TableCell className="hidden sm:table-cell">{b.template || 'minimal'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TEMPLATES */}
        <TabsContent value="templates">
          <Card>
            <CardHeader><CardTitle className="text-lg">Templates de Stories ({allTemplates.length})</CardTitle></CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Cor BG</TableHead>
                      <TableHead className="hidden sm:table-cell">Cor Preço</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allTemplates.map((t) => (
                      <TableRow key={t.id}>
                        <TableCell className="font-medium">{t.name}</TableCell>
                        <TableCell><div className="flex items-center gap-2"><div className="h-4 w-4 rounded" style={{ backgroundColor: t.bg_color }} />{t.bg_color}</div></TableCell>
                        <TableCell className="hidden sm:table-cell"><div className="flex items-center gap-2"><div className="h-4 w-4 rounded" style={{ backgroundColor: t.price_bg_color }} />{t.price_bg_color}</div></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TUTORIALS */}
        <TabsContent value="tutorials">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Tutoriais ({tutorials.length})</CardTitle>
              <Dialog open={dialogOpen === 'tutorial'} onOpenChange={(o) => setDialogOpen(o ? 'tutorial' : null)}>
                <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-1" />Novo</Button></DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Novo Tutorial</DialogTitle></DialogHeader>
                  <div className="space-y-3">
                    <div><Label>Título</Label><Input value={tutorialForm.title} onChange={(e) => setTutorialForm({ ...tutorialForm, title: e.target.value })} /></div>
                    <div><Label>Descrição</Label><Textarea value={tutorialForm.description} onChange={(e) => setTutorialForm({ ...tutorialForm, description: e.target.value })} /></div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><Label>Duração</Label><Input value={tutorialForm.duration} onChange={(e) => setTutorialForm({ ...tutorialForm, duration: e.target.value })} placeholder="5 min" /></div>
                      <div><Label>URL do Vídeo</Label><Input value={tutorialForm.video_url} onChange={(e) => setTutorialForm({ ...tutorialForm, video_url: e.target.value })} /></div>
                    </div>
                    <Button onClick={addTutorial} className="w-full">Criar Tutorial</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {tutorials.map((t) => (
                  <div key={t.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <p className="font-medium text-sm">{t.title}</p>
                      <p className="text-xs text-muted-foreground">{t.description}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => deleteTutorial(t.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* VENDA MAIS */}
        <TabsContent value="vendamais">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Venda Mais ({vendaMais.length})</CardTitle>
              <Dialog open={dialogOpen === 'vendamais'} onOpenChange={(o) => setDialogOpen(o ? 'vendamais' : null)}>
                <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-1" />Novo</Button></DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Novo Produto Venda Mais</DialogTitle></DialogHeader>
                  <div className="space-y-3">
                    <div><Label>Nome</Label><Input value={vendaMaisForm.name} onChange={(e) => setVendaMaisForm({ ...vendaMaisForm, name: e.target.value })} /></div>
                    <div><Label>Descrição</Label><Textarea value={vendaMaisForm.description} onChange={(e) => setVendaMaisForm({ ...vendaMaisForm, description: e.target.value })} /></div>
                    <div><Label>URL da Imagem</Label><Input value={vendaMaisForm.image_url} onChange={(e) => setVendaMaisForm({ ...vendaMaisForm, image_url: e.target.value })} /></div>
                    <div><Label>URL de Checkout</Label><Input value={vendaMaisForm.checkout_url} onChange={(e) => setVendaMaisForm({ ...vendaMaisForm, checkout_url: e.target.value })} /></div>
                    <Button onClick={addVendaMais} className="w-full">Criar Produto</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {vendaMais.map((v) => (
                  <div key={v.id} className="border rounded-lg overflow-hidden">
                    {v.image_url && <img src={v.image_url} alt={v.name} className="h-32 w-full object-cover" />}
                    <div className="p-3 flex items-start justify-between">
                      <div>
                        <p className="font-medium text-sm">{v.name}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2">{v.description}</p>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => deleteVendaMais(v.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AFFILIATE PLANS */}
        <TabsContent value="afiliado">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Planos de Afiliado ({affiliatePlans.length})</CardTitle>
              <Dialog open={dialogOpen === 'plan'} onOpenChange={(o) => setDialogOpen(o ? 'plan' : null)}>
                <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-1" />Novo</Button></DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Novo Plano</DialogTitle></DialogHeader>
                  <div className="space-y-3">
                    <div><Label>Nome do Plano</Label><Input value={planForm.name} onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })} /></div>
                    <div><Label>Comissão (ex: R$ 20,10)</Label><Input value={planForm.commission} onChange={(e) => setPlanForm({ ...planForm, commission: e.target.value })} /></div>
                    <div><Label>Descrição</Label><Input value={planForm.description} onChange={(e) => setPlanForm({ ...planForm, description: e.target.value })} /></div>
                    <div><Label>Link de Afiliado</Label><Input value={planForm.affiliate_link} onChange={(e) => setPlanForm({ ...planForm, affiliate_link: e.target.value })} /></div>
                    <Button onClick={addPlan} className="w-full">Criar Plano</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {affiliatePlans.map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <p className="font-medium text-sm">{p.name}</p>
                      <p className="text-xs text-primary font-bold">{p.commission}</p>
                      <p className="text-xs text-muted-foreground">{p.description}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => deletePlan(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
