import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSiteDesign } from '@/lib/site-design';

const LandingNavbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { logoUrl, siteName, siteNameFallback } = useSiteDesign();
  const goToAuth = () => navigate('/auth');
  const logoOnly = !siteName.trim();

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50" role="navigation" aria-label="Menu principal">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-[72px] px-5 lg:px-8">
        <div className="flex items-center gap-2.5">
          <img
            src={logoUrl}
            alt={siteNameFallback}
            className={logoOnly ? 'h-12 w-12 sm:h-14 sm:w-14 object-contain' : 'h-10 w-10 object-contain'}
          />
          {siteName ? <span className="text-xl font-extrabold tracking-tight">{siteName}</span> : null}
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <a href="#problema" className="hover:text-foreground transition-colors">Problema</a>
          <a href="#funcionalidades" className="hover:text-foreground transition-colors">Funcionalidades</a>
          <a href="#como-funciona" className="hover:text-foreground transition-colors">Como funciona</a>
          <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button onClick={goToAuth} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-4 py-2">Login</button>
          <Button size="default" className="px-6 font-bold" onClick={goToAuth}>
            Cadastre-se grátis
          </Button>
        </div>

        <button
          type="button"
          className="md:hidden p-2 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div id="mobile-menu" className="md:hidden border-t border-border bg-background px-5 py-4 space-y-3 animate-fade-in" role="region" aria-label="Menu mobile">
          <a href="#problema" className="block text-sm text-muted-foreground py-2" onClick={() => setMobileMenuOpen(false)}>Problema</a>
          <a href="#funcionalidades" className="block text-sm text-muted-foreground py-2" onClick={() => setMobileMenuOpen(false)}>Funcionalidades</a>
          <a href="#como-funciona" className="block text-sm text-muted-foreground py-2" onClick={() => setMobileMenuOpen(false)}>Como funciona</a>
          <a href="#faq" className="block text-sm text-muted-foreground py-2" onClick={() => setMobileMenuOpen(false)}>FAQ</a>
          <div className="pt-2 flex flex-col gap-2">
            <Button variant="outline" className="w-full" onClick={goToAuth}>Entrar</Button>
            <Button className="w-full" onClick={goToAuth}>Começar grátis</Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default LandingNavbar;
