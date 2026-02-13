import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LandingPositioning = () => {
  const navigate = useNavigate();
  const goToAuth = () => navigate('/auth');

  const items = [
    'Sua própria loja',
    'Suas próprias páginas',
    'Seu próprio domínio',
    'Seu próprio painel de controle',
  ];

  return (
    <section className="py-16 md:py-24 px-5 lg:px-8 bg-card border-y border-border">
      <div className="max-w-4xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Posicionamento</p>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-6">
              Quem leva afiliação a sério <span className="text-gradient">constrói estrutura.</span>
            </h2>
            <p className="text-base text-muted-foreground mb-6 leading-relaxed">
              Você pode continuar divulgando links soltos. Ou pode ter:
            </p>
            <div className="space-y-4 mb-8">
              {items.map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                  <span className="text-sm font-medium">{feature}</span>
                </div>
              ))}
            </div>
            <p className="text-base font-bold text-foreground mb-8">O Hilinkr é a base para isso.</p>
            <Button size="lg" onClick={goToAuth}>
              Criar conta grátis <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* Mini mockup */}
          <div className="bg-background border border-border rounded-2xl shadow-elevated p-5 space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 rounded-full bg-destructive/60" />
              <div className="w-3 h-3 rounded-full bg-warning/60" />
              <div className="w-3 h-3 rounded-full bg-success/60" />
              <span className="ml-auto text-xs text-muted-foreground">hilinkr.app</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-card rounded-xl border border-border p-4">
                <p className="text-xs text-muted-foreground mb-1">Produtos</p>
                <p className="text-2xl font-bold">8</p>
              </div>
              <div className="bg-card rounded-xl border border-border p-4">
                <p className="text-xs text-muted-foreground mb-1">Campanhas</p>
                <p className="text-2xl font-bold">3</p>
              </div>
            </div>
            <div className="bg-card rounded-xl border border-border p-4">
              <p className="text-xs text-muted-foreground mb-2">Cliques este mês</p>
              <p className="text-3xl font-bold text-gradient">342</p>
              <p className="text-xs text-muted-foreground mt-1">Em 3 campanhas ativas</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingPositioning;
