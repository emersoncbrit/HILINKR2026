import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const LandingCTA = () => {
  const navigate = useNavigate();
  const goToAuth = () => navigate('/auth');

  return (
    <section className="py-20 md:py-28 px-5 lg:px-8 relative">
      <div className="absolute inset-0 glow-blue opacity-20 pointer-events-none" />
      <div className="max-w-3xl mx-auto text-center relative z-10">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
          Pare de improvisar.{' '}
          <span className="text-gradient">Comece a estruturar.</span>
        </h2>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8 leading-relaxed">
          Crie sua conta gratuitamente e organize seus produtos de afiliado em um único sistema.
        </p>
        <Button size="lg" className="h-14 px-10 text-base" onClick={goToAuth}>
          Criar minha conta grátis <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        <p className="text-xs text-muted-foreground mt-4">✦ Leva menos de 1 minuto · Sem cartão · Acesso imediato</p>
      </div>
    </section>
  );
};

export default LandingCTA;
