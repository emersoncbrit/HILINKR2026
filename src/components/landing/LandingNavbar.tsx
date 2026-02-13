import { Bolt, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingNavbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const goToAuth = () => navigate('/auth');

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-[72px] px-5 lg:px-8">
        <div className="flex items-center gap-2.5">
          <Bolt className="h-6 w-6 text-primary" />
          <span className="text-xl font-extrabold tracking-tight">Hilinkr</span>
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

        <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background px-5 py-4 space-y-3 animate-fade-in">
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
