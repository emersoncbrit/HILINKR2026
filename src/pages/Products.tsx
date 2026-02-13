import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus, Search, Package, ExternalLink, Pencil, Copy, Share2, Image, Loader2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

// Platforms and categories are now fetched from admin tables

interface Product {
  id: string; name: string; affiliate_link: string; original_link: string | null;
  image_url: string | null; platform: string; category: string; price: number;
  commission_estimate: number; tags: string[]; status: string;
  last_activated_at: string | null; created_at: string;
}

const formatBRL = (value: number): string => {
  if (!value) return '';
  return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const parseBRL = (value: string): number => {
  const cleaned = value.replace(/[^\d,]/g, '').replace(',', '.');
  return parseFloat(cleaned) || 0;
};

const Products = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [scraping, setScraping] = useState(false);
  const [priceDisplay, setPriceDisplay] = useState('');
  const [commissionDisplay, setCommissionDisplay] = useState('');
  const [adminPlatforms, setAdminPlatforms] = useState<string[]>([]);
  const [adminCategories, setAdminCategories] = useState<string[]>([]);

  const [form, setForm] = useState({
    name: '', affiliate_link: '', original_link: '', image_url: '', platform: '', category: '', price: 0, commission_estimate: 0, status: 'active',
  });

  const fetchProducts = async () => {
    if (!user) return;
    const { data } = await supabase.from('products').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
    setProducts((data as Product[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, [user]);

  useEffect(() => {
    supabase.from('admin_platforms').select('name').order('name').then(({ data }) => {
      setAdminPlatforms((data || []).map((p: any) => p.name));
    });
    supabase.from('admin_categories').select('name').order('name').then(({ data }) => {
      setAdminCategories((data || []).map((c: any) => c.name));
    });
  }, []);

  const resetForm = () => {
    setForm({ name: '', affiliate_link: '', original_link: '', image_url: '', platform: '', category: '', price: 0, commission_estimate: 0, status: 'active' });
    setPriceDisplay('');
    setCommissionDisplay('');
    setEditingProduct(null);
  };

  const openEdit = (p: Product) => {
    setEditingProduct(p);
    setForm({
      name: p.name, affiliate_link: p.affiliate_link, original_link: p.original_link || '', image_url: p.image_url || '',
      platform: p.platform, category: p.category, price: p.price, commission_estimate: p.commission_estimate,
      status: p.status,
    });
    setPriceDisplay(p.price > 0 ? formatBRL(p.price) : '');
    setCommissionDisplay(p.commission_estimate > 0 ? String(p.commission_estimate) : '');
    setDialogOpen(true);
  };

  const scrapeUrl = async (url: string) => {
    if (!url || (!url.startsWith('http://') && !url.startsWith('https://'))) return;
    setScraping(true);
    try {
      const { data, error } = await supabase.functions.invoke('scrape-product', {
        body: { url },
      });
      if (error) throw error;
      if (data?.success && data?.data) {
        const d = data.data;
        const updates: Partial<typeof form> = {};
        if (d.title && !form.name) updates.name = d.title;
        if (d.image && !form.image_url) updates.image_url = d.image;
        if (d.platform && !form.platform) updates.platform = d.platform;
        if (d.price && !form.price) {
          updates.price = d.price;
          setPriceDisplay(formatBRL(d.price));
        }
        if (Object.keys(updates).length > 0) {
          setForm((prev) => ({ ...prev, ...updates }));
          toast({ title: 'Dados preenchidos automaticamente!' });
        }
      }
    } catch (err) {
      console.error('Scrape failed:', err);
    } finally {
      setScraping(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    const payload = {
      ...form, tags: [], price: Number(form.price), commission_estimate: Number(form.commission_estimate),
      user_id: user.id, original_link: form.original_link || null, image_url: form.image_url || null,
    };

    if (editingProduct) {
      const { error } = await supabase.from('products').update(payload).eq('id', editingProduct.id);
      if (error) { toast({ title: 'Erro', description: error.message, variant: 'destructive' }); return; }
      toast({ title: 'Produto atualizado' });
    } else {
      const { error } = await supabase.from('products').insert(payload);
      if (error) { toast({ title: 'Erro', description: error.message, variant: 'destructive' }); return; }
      toast({ title: 'Produto criado' });
    }
    setDialogOpen(false);
    resetForm();
    fetchProducts();
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: `${label} copiado!` });
  };

  const shareLink = (link: string, platform: 'whatsapp' | 'telegram') => {
    const encoded = encodeURIComponent(link);
    const url = platform === 'whatsapp'
      ? `https://wa.me/?text=${encoded}`
      : `https://t.me/share/url?url=${encoded}`;
    window.open(url, '_blank');
  };

  const categories = [...new Set(products.map((p) => p.category).filter(Boolean))];

  const filtered = products.filter((p) => {
    if (filterStatus !== 'all' && p.status !== filterStatus) return false;
    if (filterCategory !== 'all' && p.category !== filterCategory) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const statusColor = (s: string) => {
    if (s === 'active') return 'bg-success/15 text-success border-success/20';
    if (s === 'paused') return 'bg-warning/15 text-warning border-warning/20';
    return 'bg-muted text-muted-foreground';
  };

  const statusLabel = (s: string) => {
    if (s === 'active') return 'Ativo';
    if (s === 'paused') return 'Pausado';
    return 'Arquivado';
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Central de Produtos</h1>
          <p className="text-sm text-muted-foreground">Gerencie seus produtos de afiliado</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto"><Plus className="h-4 w-4 mr-2" />Adicionar Produto</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProduct ? 'Editar Produto' : 'Novo Produto'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Link Original do Produto</Label>
                <div className="flex gap-2">
                  <Input
                    value={form.original_link}
                    onChange={(e) => setForm({ ...form, original_link: e.target.value })}
                    onBlur={(e) => scrapeUrl(e.target.value)}
                    placeholder="https://... cola o link e preenchemos automaticamente"
                  />
                  {scraping && <Loader2 className="h-4 w-4 animate-spin mt-2.5 shrink-0 text-primary" />}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Cole o link para preencher nome, imagem, plataforma e preço automaticamente</p>
              </div>
              <div>
                <Label>Link de Afiliado *</Label>
                <Input
                  value={form.affiliate_link}
                  onChange={(e) => setForm({ ...form, affiliate_link: e.target.value })}
                  onBlur={(e) => { if (!form.original_link) scrapeUrl(e.target.value); }}
                  placeholder="https://... seu link de afiliado"
                />
              </div>
              <div>
                <Label>Nome do Produto *</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nome do produto" />
              </div>
              <div>
                <Label>URL da Imagem (opcional)</Label>
                <Input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://... imagem do produto" />
                {form.image_url && (
                  <div className="mt-2 rounded-md overflow-hidden border border-border h-32 w-full">
                    <img src={form.image_url} alt="Preview" className="h-full w-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Plataforma</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-between font-normal">
                        {form.platform || <span className="text-muted-foreground">Selecionar...</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[250px] p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Buscar..." />
                        <CommandList>
                          <CommandEmpty>Nenhuma encontrada.</CommandEmpty>
                          <CommandGroup>
                            {adminPlatforms.map((name) => (
                              <CommandItem key={name} value={name} onSelect={() => setForm({ ...form, platform: name })} className="cursor-pointer">
                                {name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label>Categoria</Label>
                  <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                    <SelectTrigger><SelectValue placeholder="Selecionar..." /></SelectTrigger>
                    <SelectContent>
                      {adminCategories.map((name) => (
                        <SelectItem key={name} value={name}>{name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Preço (R$)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">R$</span>
                    <Input
                      className="pl-9"
                      value={priceDisplay}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/[^\d,]/g, '');
                        setPriceDisplay(raw);
                        setForm({ ...form, price: parseBRL(raw) });
                      }}
                      placeholder="0,00"
                    />
                  </div>
                </div>
                <div>
                  <Label>Comissão (%)</Label>
                  <div className="relative">
                    <Input
                      className="pr-8"
                      value={commissionDisplay}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/[^\d.,]/g, '');
                        setCommissionDisplay(raw);
                        setForm({ ...form, commission_estimate: parseFloat(raw) || 0 });
                      }}
                      placeholder="0"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">%</span>
                  </div>
                </div>
              </div>
              <div>
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="paused">Pausado</SelectItem>
                    <SelectItem value="archived">Arquivado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleSave} className="w-full">{editingProduct ? 'Atualizar' : 'Criar'} Produto</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar produtos..." className="pl-9" />
        </div>
        <div className="flex gap-3">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full sm:w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="active">Ativo</SelectItem>
              <SelectItem value="paused">Pausado</SelectItem>
              <SelectItem value="archived">Arquivado</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-full sm:w-[140px]"><SelectValue placeholder="Categoria" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Grid de produtos */}
      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : filtered.length === 0 ? (
        <Card className="glass-card">
          <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Package className="h-10 w-10 mb-3 opacity-50" />
            <p>Nenhum produto ainda. Adicione seu primeiro produto.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <Card key={p.id} className="glass-card hover:border-primary/30 transition-colors group overflow-hidden">
              {p.image_url ? (
                <div className="h-36 w-full overflow-hidden border-b border-border">
                  <img src={p.image_url} alt={p.name} className="h-full w-full object-cover" />
                </div>
              ) : (
                <div className="h-24 w-full flex items-center justify-center bg-muted/30 border-b border-border">
                  <Image className="h-8 w-8 text-muted-foreground/30" />
                </div>
              )}
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-sm leading-tight">{p.name}</h3>
                  <Badge variant="outline" className={statusColor(p.status)}>{statusLabel(p.status)}</Badge>
                </div>
                {p.platform && <p className="text-xs text-muted-foreground mb-1">{p.platform}</p>}
                {p.category && <Badge variant="secondary" className="text-xs mb-3">{p.category}</Badge>}
                <div className="flex items-center gap-4 text-xs text-muted-foreground mt-3">
                  {p.price > 0 && <span>R$ {formatBRL(p.price)}</span>}
                  {p.commission_estimate > 0 && <span>{p.commission_estimate}% com.</span>}
                </div>
                <div className="flex items-center gap-1 mt-4 pt-3 border-t border-border flex-wrap">
                  <Button variant="ghost" size="sm" onClick={() => openEdit(p)} className="text-xs">
                    <Pencil className="h-3 w-3 mr-1" />Editar
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(p.affiliate_link, 'Link de afiliado')} className="text-xs">
                    <Copy className="h-3 w-3 mr-1" />Copiar
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-xs">
                        <Share2 className="h-3 w-3 mr-1" />Compartilhar
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => shareLink(p.affiliate_link, 'whatsapp')}>WhatsApp</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => shareLink(p.affiliate_link, 'telegram')}>Telegram</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <a href={p.affiliate_link} target="_blank" rel="noopener noreferrer" className="ml-auto">
                    <Button variant="ghost" size="sm" className="text-xs"><ExternalLink className="h-3 w-3" /></Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
