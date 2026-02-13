import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

const VendaMais = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('admin_venda_mais').select('*').order('sort_order').then(({ data }) => {
      setCourses(data || []);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="flex items-center justify-center h-32"><div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>;

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold">Venda Mais</h1>
        <p className="text-muted-foreground">Melhores cursos e consultorias para alavancar suas vendas online</p>
      </div>

      {courses.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nenhum produto disponível ainda.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {courses.map((course) => (
            <Card key={course.id} className="glass-card overflow-hidden hover:border-primary/30 transition-colors group">
              {course.image_url && (
                <div className="h-44 w-full overflow-hidden">
                  <img src={course.image_url} alt={course.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
              )}
              <CardContent className="p-4">
                <h3 className="font-semibold text-sm mb-2">{course.name}</h3>
                <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{course.description}</p>
                {course.checkout_url && (
                  <Button size="sm" className="w-full" onClick={() => window.open(course.checkout_url, '_blank')}>
                    <ExternalLink className="h-3 w-3 mr-2" />Acessar
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

export default VendaMais;
