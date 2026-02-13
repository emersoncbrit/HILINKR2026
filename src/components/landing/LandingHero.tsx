import { ArrowRight, Zap, Link2, FileText, MousePointerClick } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const LandingHero = () => {
  const navigate = useNavigate();
  const goToAuth = () => navigate('/auth');

  return (
    <section className="relative pt-20 pb-24 md:pt-32 md:pb-40 px-5 lg:px-8">
      <div className="absolute inset-0 glow-blue opacity-20 pointer-events-none" />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 mb-8 shadow-soft">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Gratuito para começar</span>
            </div>

            <h1 className="text-hero-sm md:text-[3.5rem] lg:text-hero font-extrabold tracking-[-0.03em] leading-[1.05] mb-7">
              Construa sua estrutura{' '}
              <br className="hidden sm:block" />
              <span className="text-gradient">profissional como afiliado.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-lg mb-10">
              Organize seus produtos, crie mini-páginas para anúncios, monte sua loja com domínio próprio e gerencie tudo em um único painel.
            </p>
            <div className="flex flex-col sm:flex-row items-start gap-4 mb-5">
              <Button size="lg" className="h-14 px-8 text-base font-bold gap-3" onClick={goToAuth}>
                Criar minha conta grátis <ArrowRight className="h-5 w-5" />
              </Button>
              <button
                className="text-base font-semibold text-muted-foreground hover:text-foreground transition-colors px-2 py-3.5"
                onClick={() => document.getElementById('funcionalidades')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Ver funcionalidades
              </button>
            </div>
            <p className="text-xs text-muted-foreground">✦ Sem cartão de crédito · Comece em menos de 1 minuto</p>
          </div>

          {/* Dashboard preview */}
          <div className="relative hidden lg:block">
            <div className="absolute -inset-8 glow-blue opacity-40 rounded-3xl" />
            <div className="relative bg-card border border-border rounded-2xl shadow-float p-6 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold">Painel Hilinkr</span>
                <span className="text-xs text-muted-foreground">Visão geral</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Produtos', value: '12', icon: Link2 },
                  { label: 'Campanhas', value: '5', icon: FileText },
                  { label: 'Cliques', value: '847', icon: MousePointerClick },
                ].map(s => (
                  <div key={s.label} className="bg-background rounded-xl p-3 border border-border">
                    <s.icon className="h-4 w-4 text-primary mb-1.5" />
                    <p className="text-lg font-bold">{s.value}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </div>
                ))}
              </div>
              <div className="h-24 bg-background rounded-xl border border-border flex items-end justify-around px-4 pb-3">
                {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                  <div key={i} className="w-6 rounded-t-md bg-primary/20" style={{ height: `${h}%` }}>
                    <div className="w-full rounded-t-md bg-primary" style={{ height: '60%' }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingHero;
