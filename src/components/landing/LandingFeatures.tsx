import { Package, Rocket, Store, Link2, BarChart3, Sparkles, Instagram } from 'lucide-react';

const features = [
  {
    icon: Package,
    title: 'Cadastro de Produtos',
    desc: 'Cadastre seus links de afiliado de qualquer plataforma — Hotmart, Kiwify, Braip, Amazon, Shopee e outras.',
    details: ['Nome', 'Imagem', 'Preço', 'Categoria', 'Plataforma'],
    footer: 'Tudo centralizado e organizado.',
  },
  {
    icon: Rocket,
    title: 'Mini-Sites para Anúncios',
    desc: 'Crie páginas simples, diretas e focadas em conversão para divulgar seus produtos.',
    details: ['Headline', 'Benefícios', 'Provas / Reviews', 'FAQ', 'Botão de ação'],
    footer: 'Ideal para tráfego pago ou divulgação estratégica. Sem precisar programar.',
  },
  {
    icon: Store,
    title: 'Sua Loja como Afiliado',
    desc: 'Tenha sua própria loja online com todos os seus produtos organizados.',
    details: ['Layout profissional', 'Página personalizada', 'Domínio próprio', 'Um link único para divulgar tudo'],
    footer: 'Mais autoridade. Mais organização. Mais confiança para quem acessa.',
  },
  {
    icon: Link2,
    title: 'Link na Bio Profissional',
    desc: 'Crie uma página de link na bio personalizada para Instagram, TikTok ou qualquer rede social.',
    details: [],
    footer: 'Nada de link solto. Tudo organizado em uma página estratégica.',
  },
  {
    icon: BarChart3,
    title: 'Painel de Controle',
    desc: 'Acompanhe sua atividade de forma clara:',
    details: ['Produtos cadastrados', 'Campanhas ativas', 'Cliques por campanha', 'Produto mais promovido', 'Alertas de inatividade'],
    footer: 'Tenha visão do que está ativo e organizado.',
  },
  {
    icon: Sparkles,
    title: 'IA de Copies',
    desc: 'Gere textos persuasivos para suas campanhas com inteligência artificial integrada.',
    details: [],
    footer: 'Crie descrições, chamadas e argumentos de venda em segundos.',
  },
  {
    icon: Instagram,
    title: 'Templates de Stories',
    desc: 'Crie artes prontas para divulgar seus produtos nos stories.',
    details: [],
    footer: 'Profissional sem precisar de designer.',
  },
];

const LandingFeatures = () => {
  return (
    <section id="funcionalidades" className="py-16 md:py-24 px-5 lg:px-8 bg-card border-y border-border">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Funcionalidades</p>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
            Tudo que você precisa para divulgar com <span className="text-gradient">organização e profissionalismo</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((item, i) => (
            <div key={i} className="p-6 rounded-2xl bg-background border border-border hover:border-primary/20 transition-colors flex flex-col">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <item.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-base font-bold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">{item.desc}</p>
              {item.details.length > 0 && (
                <ul className="space-y-1 mb-3">
                  {item.details.map((d, j) => (
                    <li key={j} className="text-sm text-muted-foreground flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-primary shrink-0" />
                      {d}
                    </li>
                  ))}
                </ul>
              )}
              <p className="text-sm font-medium text-foreground mt-auto">{item.footer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LandingFeatures;
