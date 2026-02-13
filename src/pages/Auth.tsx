import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Bolt, ArrowRight } from 'lucide-react';

type AuthMode = 'login' | 'signup' | 'reset';

const Auth = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate('/dashboard');
      } else if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        toast({ title: 'Verifique seu email', description: 'Enviamos um link de confirmação.' });
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin,
        });
        if (error) throw error;
        toast({ title: 'Verifique seu email', description: 'Link de redefinição de senha enviado.' });
      }
    } catch (err: any) {
      toast({ title: 'Erro', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left panel — dark with brand glow */}
      <div className="hidden lg:flex lg:w-[52%] bg-sidebar relative overflow-hidden flex-col justify-between p-14">
        {/* Subtle blue glow */}
        <div className="absolute inset-0 glow-blue opacity-40" />
        
        <div className="relative z-10 flex items-center gap-2.5">
          <Bolt className="h-6 w-6 text-sidebar-primary" />
          <span className="text-lg font-bold tracking-tight text-sidebar-accent-foreground">Hilinkr</span>
        </div>

        <div className="relative z-10 max-w-lg">
          <h1 className="text-hero leading-[1.08] text-sidebar-accent-foreground mb-6">
            Conecte.{' '}
            <span className="text-gradient">Cresça.</span>
          </h1>
          <p className="text-lg text-sidebar-foreground leading-relaxed max-w-md">
            Gerencie seus links de afiliado, lance campanhas e escale sua receita — tudo em um só lugar.
          </p>
        </div>

        <p className="relative z-10 text-sidebar-foreground/30 text-sm">© 2026 Hilinkr</p>
      </div>

      {/* Right panel — clean form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-[400px] animate-fade-in">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-12">
            <Bolt className="h-5 w-5 text-primary" />
            <span className="text-lg font-bold tracking-tight">Hilinkr</span>
          </div>

          <h2 className="text-2xl font-bold tracking-tight mb-2">
            {mode === 'login' ? 'Bem-vindo de volta' : mode === 'signup' ? 'Criar conta' : 'Redefinir senha'}
          </h2>
          <p className="text-muted-foreground mb-10 text-[15px]">
            {mode === 'login' ? 'Entre na sua conta para continuar' : mode === 'signup' ? 'Comece a gerenciar seus links de afiliado' : 'Digite seu email para redefinir'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'signup' && (
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm font-medium">Nome completo</Label>
                <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Seu nome" required />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@exemplo.com" required />
            </div>
            {mode !== 'reset' && (
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Senha</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} />
              </div>
            )}
            <div className="pt-2">
              <Button type="submit" className="w-full h-12" size="lg" disabled={loading}>
                {loading ? 'Carregando...' : mode === 'login' ? 'Entrar' : mode === 'signup' ? 'Criar conta' : 'Enviar link'}
                {!loading && <ArrowRight className="ml-1 h-4 w-4" />}
              </Button>
            </div>
          </form>

          <div className="mt-10 text-center text-sm space-y-3">
            {mode === 'login' && (
              <>
                <button onClick={() => setMode('reset')} className="text-muted-foreground hover:text-foreground transition-colors">
                  Esqueceu a senha?
                </button>
                <p className="text-muted-foreground">
                  Não tem conta?{' '}
                  <button onClick={() => setMode('signup')} className="text-primary font-semibold hover:underline">
                    Criar conta
                  </button>
                </p>
              </>
            )}
            {mode === 'signup' && (
              <p className="text-muted-foreground">
                Já tem conta?{' '}
                <button onClick={() => setMode('login')} className="text-primary font-semibold hover:underline">
                  Entrar
                </button>
              </p>
            )}
            {mode === 'reset' && (
              <button onClick={() => setMode('login')} className="text-primary font-semibold hover:underline">
                Voltar ao login
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
