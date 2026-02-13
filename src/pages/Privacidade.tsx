import { Link } from 'react-router-dom';
import { useDocumentTitle } from '@/hooks/use-document-title';

const Privacidade = () => {
  useDocumentTitle('Privacidade');
  return (
    <div className="min-h-screen bg-background p-6 md:p-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Política de Privacidade</h1>
        <p className="text-muted-foreground mb-6">
          Esta página está em construção. Em breve você encontrará aqui a política de privacidade do Hilinkr.
        </p>
        <Link to="/" className="text-primary hover:underline">Voltar ao início</Link>
      </div>
    </div>
  );
};

export default Privacidade;
