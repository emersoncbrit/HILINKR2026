import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { PageLoader } from '@/components/PageLoader';
import { useDocumentTitle } from '@/hooks/use-document-title';
import { User, Save, Loader2, Crown, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const Account = () => {
  useDocumentTitle('Minha Conta');
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const USERNAME_CHANGE_DAYS = 15;

  const [form, setForm] = useState({
    full_name: '',
    username: '',
    phone: '',
  });
  const [usernameChangedAt, setUsernameChangedAt] = useState<string | null>(null);
  const [initialUsername, setInitialUsername] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      if (data) {
        const d = data as any;
        const u = (d.username || '').trim();
        setForm({
          full_name: d.full_name || '',
          username: u,
          phone: d.phone || '',
        });
        setUsernameChangedAt(d.username_changed_at || null);
        setInitialUsername(u || null);
      }
      setLoading(false);
    };
    fetch();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    const newUsername = form.username?.toLowerCase().replace(/[^a-z0-9_-]/g, '') || null;
    const isChangingUsername = initialUsername !== null && newUsername !== initialUsername;

    if (isChangingUsername && usernameChangedAt) {
      const daysSince = (Date.now() - new Date(usernameChangedAt).getTime()) / (1000 * 60 * 60 * 24);
      if (daysSince < USERNAME_CHANGE_DAYS) {
        const diasRestantes = Math.ceil(USERNAME_CHANGE_DAYS - daysSince);
        toast({
          title: 'Troca de username bloqueada',
          description: `Você só pode alterar o username uma vez a cada ${USERNAME_CHANGE_DAYS} dias. Tente novamente em ${diasRestantes} dia(s).`,
          variant: 'destructive',
        });
        return;
      }
    }

    setSaving(true);

    const payload: Record<string, any> = {
      full_name: form.full_name || null,
      username: newUsername,
      phone: form.phone || null,
    };
    if (newUsername) payload.username_changed_at = new Date().toISOString();

    const { error } = await supabase
      .from('profiles')
      .update(payload)
      .eq('user_id', user.id);

    if (error) {
      if (error.message.includes('unique') || error.message.includes('duplicate')) {
        toast({ title: 'Username já está em uso', variant: 'destructive' });
      } else {
        toast({ title: 'Erro ao salvar', description: error.message, variant: 'destructive' });
      }
    } else {
      if (isChangingUsername) setUsernameChangedAt(new Date().toISOString());
      setInitialUsername(newUsername);
      toast({ title: 'Perfil atualizado!' });
    }
    setSaving(false);
  };

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            <User className="h-5 sm:h-6 w-5 sm:w-6" />
            Minha Conta
          </h1>
          <p className="text-sm text-muted-foreground">Gerencie suas informações pessoais</p>
        </div>
        <Button className="w-full sm:w-auto" onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          Salvar
        </Button>
      </div>

      {/* Dados Pessoais */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Dados Pessoais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Email</Label>
            <Input value={user?.email || ''} disabled className="bg-muted" />
            <p className="text-xs text-muted-foreground mt-1">O email não pode ser alterado</p>
          </div>
          <div>
            <Label>Nome completo</Label>
            <Input
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              placeholder="Seu nome completo"
            />
          </div>
          <div>
            <Label>Username</Label>
            <Input
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '') })}
              placeholder="seu_username"
            />
            <p className="text-xs text-muted-foreground mt-1">Apenas letras, números, _ e -. Seu link na bio será hilinkr.com/<strong>{form.username || 'seu_username'}</strong>; lojas e campanhas usam hilinkr.com/<strong>{form.username || 'username'}</strong>/loja/... e /c/...</p>
          </div>
          <div>
            <Label>Telefone</Label>
            <Input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="(00) 00000-0000"
            />
          </div>
        </CardContent>
      </Card>

      {/* Assinaturas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Crown className="h-5 w-5" />
            Minha Assinatura
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/30">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <CheckCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold">Plano Gratuito</p>
                <p className="text-sm text-muted-foreground">Acesso básico a todas as ferramentas</p>
              </div>
            </div>
            <Badge variant="secondary">Ativo</Badge>
          </div>

          <Separator />

          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground mb-3">
              Em breve, planos premium com mais recursos e funcionalidades avançadas.
            </p>
            <Button variant="outline" disabled>
              <Crown className="h-4 w-4 mr-2" />
              Upgrade (em breve)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Account;
