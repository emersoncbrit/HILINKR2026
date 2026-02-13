import { X } from 'lucide-react';

const LandingProblem = () => {
  const pains = [
    'Links espalhados em blocos de notas, WhatsApp e abas abertas',
    'Dificuldade para organizar campanhas',
    'Páginas improvisadas para rodar anúncios',
    'Nenhuma estrutura própria',
    'Sensação de estar sempre começando do zero',
  ];

  return (
    <section id="problema" className="py-16 md:py-24 px-5 lg:px-8 bg-card border-y border-border">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Você se identifica?</p>
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
          Divulgar link solto <span className="text-gradient">não é estratégia.</span>
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          Se você trabalha como afiliado, provavelmente já passou por isso:
        </p>
        <div className="grid sm:grid-cols-2 gap-4 text-left max-w-2xl mx-auto mb-10">
          {pains.map((pain, i) => (
            <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-background border border-border">
              <div className="w-6 h-6 rounded-full bg-destructive/10 flex items-center justify-center shrink-0 mt-0.5">
                <X className="h-3.5 w-3.5 text-destructive" />
              </div>
              <p className="text-sm leading-relaxed">{pain}</p>
            </div>
          ))}
        </div>
        <p className="text-base text-muted-foreground leading-relaxed">
          Isso não é falta de esforço.{' '}
          <span className="font-bold text-foreground">É falta de estrutura.</span>
        </p>
      </div>
    </section>
  );
};

export default LandingProblem;
