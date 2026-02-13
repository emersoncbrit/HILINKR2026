import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useDocumentTitle } from '@/hooks/use-document-title';
import { Mail, Download, Trash2, Users, MessageCircle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { PageLoader } from '@/components/PageLoader';
import { EmptyState } from '@/components/EmptyState';
import ExcelJS from 'exceljs';

interface Lead {
  id: string;
  name: string;
  email: string;
  whatsapp: string | null;
  created_at: string;
}

async function fetchLeads(userId: string): Promise<Lead[]> {
  const { data } = await supabase
    .from('hub_leads')
    .select('*')
    .eq('owner_id', userId)
    .order('created_at', { ascending: false });
  return (data as Lead[]) || [];
}

const Leads = () => {
  useDocumentTitle('Leads');
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);
  const [deleting, setDeleting] = useState(false);

  const { data: leads = [], isLoading: loading } = useQuery({
    queryKey: ['hub_leads', user?.id],
    queryFn: () => fetchLeads(user!.id),
    enabled: !!user?.id,
  });

  const exportExcel = async () => {
    if (leads.length === 0) {
      toast({ title: 'Nenhum lead para exportar', variant: 'destructive' });
      return;
    }
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Leads');
    sheet.columns = [
      { header: 'Nome', key: 'name', width: 25 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'WhatsApp', key: 'whatsapp', width: 18 },
      { header: 'Data de Captura', key: 'created_at', width: 22 },
    ];
    leads.forEach((l) => {
      sheet.addRow({
        name: l.name,
        email: l.email,
        whatsapp: l.whatsapp || '',
        created_at: new Date(l.created_at).toLocaleString('pt-BR'),
      });
    });
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `leads-${new Date().toISOString().slice(0, 10)}.xlsx`;
    link.click();
    URL.revokeObjectURL(url);
    toast({ title: 'Arquivo exportado!' });
  };

  const confirmDelete = (lead: Lead) => setLeadToDelete(lead);

  const deleteLead = async () => {
    if (!leadToDelete) return;
    setDeleting(true);
    const { error } = await supabase.from('hub_leads').delete().eq('id', leadToDelete.id);
    if (error) {
      toast({ title: 'Erro ao remover', description: error.message, variant: 'destructive' });
      setDeleting(false);
      setLeadToDelete(null);
      return;
    }
    await queryClient.invalidateQueries({ queryKey: ['hub_leads', user?.id] });
    setLeadToDelete(null);
    setDeleting(false);
    toast({ title: 'Lead removido' });
  };

  if (loading) return <PageLoader />;

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
                <MessageCircle className="h-5 w-5 text-primary" />
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
            <EmptyState
              icon={<Mail className="h-12 w-12 mx-auto" />}
              title="Nenhum lead capturado ainda."
              description="Ative o popup de captura nas configurações da sua loja."
            />
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
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => confirmDelete(lead)} aria-label="Remover lead">
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

      <AlertDialog open={!!leadToDelete} onOpenChange={(open) => !open && setLeadToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover lead?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O lead será removido permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
            <Button variant="destructive" disabled={deleting} onClick={deleteLead}>
              {deleting ? 'Removendo...' : 'Remover'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Leads;
