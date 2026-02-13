import { Bolt } from 'lucide-react';

const LandingFooter = () => {
  return (
    <footer className="border-t border-border py-10 px-5 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Bolt className="h-4 w-4 text-primary" />
          <span className="text-sm font-bold">Hilinkr</span>
        </div>
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Hilinkr. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
};

export default LandingFooter;
