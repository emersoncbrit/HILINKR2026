import { useEffect } from 'react';
import { useSiteDesign } from '@/lib/site-design';

const EmBreve = () => {
  const { logoUrl, siteNameFallback } = useSiteDesign();

  useEffect(() => {
    document.title = `Em breve — ${siteNameFallback}`;
    return () => { document.title = ''; };
  }, [siteNameFallback]);

  return (
    <div className="min-h-screen min-h-screen-safe flex flex-col items-center justify-center bg-background text-foreground px-4 safe-area-pb safe-area-pt">
      <div className="w-full max-w-md flex flex-col items-center text-center">
        <img
          src={logoUrl}
          alt={siteNameFallback}
          className="h-14 w-auto object-contain mb-10 opacity-95"
        />
        <div className="w-16 h-1 rounded-full bg-primary mb-8" />
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-3">
          Em breve
        </h1>
        <p className="text-muted-foreground text-lg max-w-sm">
          Estamos preparando tudo para você. O lançamento está próximo.
        </p>
        <p className="text-sm text-muted-foreground/80 mt-6">
          Em caso de dúvidas, entre em contato.
        </p>
      </div>
    </div>
  );
};

export default EmBreve;
