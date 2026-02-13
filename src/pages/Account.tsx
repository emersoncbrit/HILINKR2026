import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { User, Save, Loader2, Crown, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const Account = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    full_name: '',
    username: '',
    phone: '',
  });

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      if (data) {
        setForm({
          full_name: (data as any).full_name || '',
          username: (data as any).username || '',
          phone: (data as any).phone || '',
        });
      }
      setLoading(false);
    };
    fetch();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    const payload: Record<string, any> = {
      full_name: form.full_name || null,
      username: form.username?.toLowerCase().replace(/[^a-z0-9_-]/g, '') || null,
      phone: form.phone || null,
    };

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
      toast({ title: 'Perfil atualizado!' });
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

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
            <p className="text-xs text-muted-foreground mt-1">Apenas letras, números, _ e -</p>
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
