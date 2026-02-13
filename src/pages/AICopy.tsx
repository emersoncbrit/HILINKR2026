import { Card, CardContent } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

const AICopy = () => {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold">IA de Copies</h1>
        <p className="text-muted-foreground">Gere textos de vendas para seus produtos</p>
      </div>

      <Card className="glass-card">
        <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <Sparkles className="h-10 w-10 mb-3 opacity-50" />
          <p className="font-medium">Em Breve</p>
          <p className="text-sm mt-1">Geração de copies com IA estará disponível aqui.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AICopy;
