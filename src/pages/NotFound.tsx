import { useLocation, Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      const returnUrl = location.pathname + location.search;
      navigate(returnUrl ? `/auth?returnUrl=${encodeURIComponent(returnUrl)}` : "/auth", { replace: true });
    }
  }, [user, loading, location.pathname, location.search, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center px-4">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Página não encontrada</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/dashboard" className="text-primary underline hover:text-primary/90 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded">
            Ir ao painel
          </Link>
          <Link to="/" className="text-primary underline hover:text-primary/90 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded">
            Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
