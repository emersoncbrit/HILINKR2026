import { useSiteDesign } from '@/lib/site-design';

const LandingFooter = () => {
  const { logoUrl, siteName, siteNameFallback } = useSiteDesign();
  const logoOnly = !siteName.trim();
  return (
    <footer className="border-t border-border py-10 px-5 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <img
            src={logoUrl}
            alt={siteNameFallback}
            className={logoOnly ? 'h-10 w-10 object-contain' : 'h-8 w-8 object-contain'}
          />
          {siteName ? <span className="text-sm font-bold">{siteName}</span> : null}
        </div>
        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-xs text-muted-foreground" aria-label="Links institucionais">
          <a href="/termos" className="hover:text-foreground transition-colors">Termos de Uso</a>
          <a href="/privacidade" className="hover:text-foreground transition-colors">Privacidade</a>
          <a href="mailto:contato@hilinkr.com.br" className="hover:text-foreground transition-colors">Contato</a>
        </nav>
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} {siteNameFallback}. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
};

export default LandingFooter;
