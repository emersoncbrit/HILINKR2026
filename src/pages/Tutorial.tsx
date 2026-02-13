import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { PlayCircle, BookOpen, Rocket, Target, TrendingUp, Settings } from 'lucide-react';

const iconMap: Record<string, any> = { PlayCircle, BookOpen, Rocket, Target, TrendingUp, Settings };

const Tutorial = () => {
  const [tutorials, setTutorials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('admin_tutorials').select('*').order('sort_order').then(({ data }) => {
      setTutorials(data || []);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="flex items-center justify-center h-32"><div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>;

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold">Tutorial</h1>
        <p className="text-muted-foreground">Aprenda a usar a plataforma passo a passo</p>
      </div>

      {tutorials.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nenhum tutorial disponível ainda.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tutorials.map((lesson) => {
            const Icon = iconMap[lesson.icon] || BookOpen;
            return (
              <Card key={lesson.id} className="glass-card hover:border-primary/30 transition-colors cursor-pointer group"
                onClick={() => lesson.video_url && window.open(lesson.video_url, '_blank')}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    {lesson.duration && <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">{lesson.duration}</span>}
                  </div>
                  <h3 className="font-semibold text-sm mb-2 group-hover:text-primary transition-colors">{lesson.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{lesson.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Tutorial;
