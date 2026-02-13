import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const faqs = [
  { q: 'O Hilinkr é gratuito?', a: 'Sim. Você pode criar sua conta gratuitamente e começar a usar as principais funcionalidades sem cartão de crédito.' },
  { q: 'Funciona com qualquer plataforma de afiliados?', a: 'Sim. Basta ter seu link de afiliado. Você pode cadastrar produtos de qualquer plataforma.' },
  { q: 'Preciso saber programar?', a: 'Não. Toda a estrutura é pronta para usar. Você apenas preenche as informações.' },
  { q: 'O que é o mini-site de vendas?', a: 'É uma página simples e focada em conversão que você cria para divulgar um produto específico.' },
  { q: 'O que é a Loja?', a: 'É uma página onde todos os seus produtos ficam organizados em um único lugar, podendo inclusive usar domínio próprio.' },
  { q: 'Como funciona o rastreamento?', a: 'O sistema registra os cliques realizados nos seus links dentro da sua estrutura criada no Hilinkr.' },
];

const LandingFAQ = () => {
  return (
    <section id="faq" className="py-16 md:py-24 px-5 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">FAQ</p>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Perguntas frequentes
          </h2>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((item, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="border border-border rounded-xl px-5 data-[state=open]:border-primary/20">
              <AccordionTrigger className="text-sm font-semibold hover:no-underline py-4">{item.q}</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed">{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default LandingFAQ;
