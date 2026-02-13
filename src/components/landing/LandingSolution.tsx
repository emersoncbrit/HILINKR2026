import { Package, Rocket, Store, Link2, BarChart3 } from 'lucide-react';

const LandingSolution = () => {
  const items = [
    { icon: Package, text: 'Organizar todos os seus produtos em um só lugar' },
    { icon: Rocket, text: 'Criar mini-sites prontos para conversão' },
    { icon: Store, text: 'Montar sua loja personalizada' },
    { icon: Link2, text: 'Criar link na bio profissional' },
    { icon: BarChart3, text: 'Controlar campanhas e cliques em um único painel' },
  ];

  return (
    <section className="py-16 md:py-24 px-5 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">A solução</p>
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
          O Hilinkr é sua <span className="text-gradient">base operacional</span> como afiliado.
        </h2>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-12 leading-relaxed">
          Aqui você não cria apenas links. Você constrói sua própria estrutura digital.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-left max-w-3xl mx-auto mb-10">
          {items.map((item, i) => (
            <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <item.icon className="h-4 w-4 text-primary" />
              </div>
              <p className="text-sm font-medium leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>

        <p className="text-base font-semibold text-foreground">
          Simples. Rápido. Organizado.
        </p>
      </div>
    </section>
  );
};

export default LandingSolution;
