import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, AlertTriangle } from 'lucide-react';

const SejaAfiliado = () => {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('admin_affiliate_plans').select('*').order('sort_order').then(({ data }) => {
      setPlans(data || []);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="flex items-center justify-center h-32"><div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>;

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold">Seja um Afiliado</h1>
        <p className="text-muted-foreground">Fature promovendo o Hilinkr</p>
      </div>

      <Card className="glass-card border-warning/30">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-lg font-semibold">Regras:</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>1) Os links de afiliação não podem ser usados como meio de desconto. Seu objetivo é unicamente de publicidade.</li>
            <li>2) A comissão é paga apenas sobre a primeira mensalidade do plano e vale apenas 1 vez por cliente. A comissão não é recorrente.</li>
          </ul>
          <div className="flex items-center gap-2 text-destructive text-sm font-medium">
            <AlertTriangle className="h-4 w-4" />
            <span>O descumprimento das regras acima resultará em cancelamento da afiliação.</span>
          </div>
        </CardContent>
      </Card>

      {plans.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nenhum plano disponível ainda.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <Card key={plan.id} className="glass-card hover:border-primary/30 transition-colors">
              <CardContent className="p-6 text-center space-y-4">
                <div className="h-32 w-full rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="text-4xl font-bold text-primary">H</span>
                </div>
                <h3 className="font-semibold">{plan.name}</h3>
                <p className="text-xs text-muted-foreground">Receba até</p>
                <p className="text-2xl font-bold text-primary">{plan.commission}</p>
                <p className="text-xs text-muted-foreground">{plan.description}</p>
                {plan.affiliate_link && (
                  <Button size="sm" className="w-full" onClick={() => window.open(plan.affiliate_link, '_blank')}>
                    <ExternalLink className="h-3 w-3 mr-2" />Link de Afiliado
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SejaAfiliado;
