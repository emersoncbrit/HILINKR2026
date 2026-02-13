import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Plus, DollarSign } from 'lucide-react';
import { StatCard } from '@/components/StatCard';

interface Product { id: string; name: string; }
interface Sale { id: string; product_id: string; quantity: number; sale_value: number; sale_date: string; products?: { name: string }; }

const Sales = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [sales, setSales] = useState<Sale[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ product_id: '', quantity: 1, sale_value: 0, sale_date: new Date().toISOString().split('T')[0] });

  const fetchData = async () => {
    if (!user) return;
    const [salesRes, prodRes] = await Promise.all([
      supabase.from('manual_sales').select('*, products(name)').eq('user_id', user.id).order('sale_date', { ascending: false }),
      supabase.from('products').select('id, name').eq('user_id', user.id),
    ]);
    setSales((salesRes.data as Sale[]) || []);
    setProducts((prodRes.data as Product[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [user]);

  const handleAdd = async () => {
    if (!user || !form.product_id) return;
    const { error } = await supabase.from('manual_sales').insert({
      ...form, quantity: Number(form.quantity), sale_value: Number(form.sale_value), user_id: user.id,
    });
    if (error) { toast({ title: 'Erro', description: error.message, variant: 'destructive' }); return; }
    toast({ title: 'Venda registrada' });
    setDialogOpen(false);
    setForm({ product_id: '', quantity: 1, sale_value: 0, sale_date: new Date().toISOString().split('T')[0] });
    fetchData();
  };

  const totalRevenue = sales.reduce((s, x) => s + x.sale_value, 0);
  const thisMonth = sales.filter((s) => new Date(s.sale_date).getMonth() === new Date().getMonth() && new Date(s.sale_date).getFullYear() === new Date().getFullYear());
  const monthlyRevenue = thisMonth.reduce((s, x) => s + x.sale_value, 0);

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Vendas Manuais</h1>
          <p className="text-sm text-muted-foreground">Registre e acompanhe sua receita</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild><Button className="w-full sm:w-auto"><Plus className="h-4 w-4 mr-2" />Adicionar Venda</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Registrar Venda</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Produto *</Label>
                <Select value={form.product_id} onValueChange={(v) => setForm({ ...form, product_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Selecionar produto" /></SelectTrigger>
                  <SelectContent>{products.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Quantidade</Label><Input type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })} min={1} /></div>
                <div><Label>Valor da Venda</Label><Input type="number" value={form.sale_value} onChange={(e) => setForm({ ...form, sale_value: Number(e.target.value) })} min={0} step="0.01" /></div>
              </div>
              <div><Label>Data</Label><Input type="date" value={form.sale_date} onChange={(e) => setForm({ ...form, sale_date: e.target.value })} /></div>
              <Button onClick={handleAdd} className="w-full">Registrar Venda</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard title="Receita Total" value={`R$${totalRevenue.toFixed(2)}`} icon={<DollarSign className="h-5 w-5" />} description="Receita manual registrada" />
        <StatCard title="Este Mês" value={`R$${monthlyRevenue.toFixed(2)}`} icon={<DollarSign className="h-5 w-5" />} description="Receita manual do mês" />
      </div>

      <Card className="glass-card">
        <CardHeader><CardTitle className="text-base">Vendas Recentes</CardTitle></CardHeader>
        <CardContent className="p-0 sm:p-6">
          {sales.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8 px-4">Nenhuma venda registrada ainda.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead className="hidden sm:table-cell">Qtd</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead className="hidden sm:table-cell">Data</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sales.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium text-xs sm:text-sm">{(s as any).products?.name || '—'}</TableCell>
                      <TableCell className="hidden sm:table-cell">{s.quantity}</TableCell>
                      <TableCell className="text-xs sm:text-sm">R${s.sale_value.toFixed(2)}</TableCell>
                      <TableCell className="hidden sm:table-cell">{new Date(s.sale_date).toLocaleDateString('pt-BR')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Sales;
