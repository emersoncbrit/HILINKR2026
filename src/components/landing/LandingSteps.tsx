import { Link2, Sparkles, BarChart3 } from 'lucide-react';

const steps = [
  {
    step: '01',
    icon: Link2,
    title: 'Cadastre seus produtos',
    desc: 'Adicione seus links de afiliado com nome, imagem e preço.',
  },
  {
    step: '02',
    icon: Sparkles,
    title: 'Crie sua estrutura',
    desc: 'Monte mini-sites, configure sua loja ou crie seu link na bio.',
  },
  {
    step: '03',
    icon: BarChart3,
    title: 'Divulgue com organização',
    desc: 'Compartilhe seus links com mais profissionalismo e controle.',
  },
];

const LandingSteps = () => {
  return (
    <section id="como-funciona" className="py-16 md:py-24 px-5 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Como funciona</p>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
            Comece em <span className="text-gradient">3 passos simples</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-0">
          {steps.map((item, i) => (
            <div key={i} className="relative p-8 text-center md:text-left">
              {i < 2 && <div className="hidden md:block absolute right-0 top-12 bottom-12 w-px bg-border" />}
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-5">
                <item.icon className="h-5 w-5 text-primary" />
              </div>
              <p className="text-xs font-bold text-primary mb-2">PASSO {item.step}</p>
              <h3 className="text-lg font-bold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LandingSteps;
