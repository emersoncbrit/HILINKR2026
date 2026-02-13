import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404: Rota não encontrada:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center px-4">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Página não encontrada</p>
        <Link to="/" className="text-primary underline hover:text-primary/90 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded">
          Voltar ao início
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
