import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Mail, Download, Trash2, Users, Loader2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import * as XLSX from 'xlsx';

interface Lead {
  id: string;
  name: string;
  email: string;
  whatsapp: string | null;
  created_at: string;
}

const Leads = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeads = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('hub_leads')
      .select('*')
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false });
    setLeads((data as Lead[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchLeads(); }, [user]);

  const exportExcel = () => {
    if (leads.length === 0) {
      toast({ title: 'Nenhum lead para exportar', variant: 'destructive' });
      return;
    }
    const rows = leads.map((l) => ({
      Nome: l.name,
      Email: l.email,
      WhatsApp: l.whatsapp || '',
      'Data de Captura': new Date(l.created_at).toLocaleString('pt-BR'),
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Leads');
    XLSX.writeFile(wb, `leads-${new Date().toISOString().slice(0, 10)}.xlsx`);
    toast({ title: 'Arquivo exportado!' });
  };

  const deleteLead = async (id: string) => {
    await supabase.from('hub_leads').delete().eq('id', id);
    setLeads((prev) => prev.filter((l) => l.id !== id));
    toast({ title: 'Lead removido' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            <Mail className="h-5 sm:h-6 w-5 sm:w-6" />
            Leads Capturados
          </h1>
          <p className="text-sm text-muted-foreground">Emails e contatos capturados pela sua loja</p>
        </div>
        <Button className="w-full sm:w-auto" onClick={exportExcel} disabled={leads.length === 0}>
          <Download className="h-4 w-4 mr-2" />
          Exportar Excel
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{leads.length}</p>
                <p className="text-xs text-muted-foreground">Total de leads</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{leads.filter(l => l.email).length}</p>
                <p className="text-xs text-muted-foreground">Com email</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{leads.filter(l => l.whatsapp).length}</p>
                <p className="text-xs text-muted-foreground">Com WhatsApp</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Lista de Leads</CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          {leads.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground px-4">
              <Mail className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>Nenhum lead capturado ainda.</p>
              <p className="text-sm mt-1">Ative o popup de captura nas configurações da sua loja.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="hidden sm:table-cell">WhatsApp</TableHead>
                    <TableHead className="hidden sm:table-cell">Data</TableHead>
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leads.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell className="font-medium text-xs sm:text-sm">{lead.name || '—'}</TableCell>
                      <TableCell className="text-xs sm:text-sm">{lead.email}</TableCell>
                      <TableCell className="hidden sm:table-cell">{lead.whatsapp || '—'}</TableCell>
                      <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                        {new Date(lead.created_at).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => deleteLead(lead.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
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

export default Leads;
