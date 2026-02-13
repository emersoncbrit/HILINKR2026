import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  description?: string;
}

export function StatCard({ title, value, icon, description }: StatCardProps) {
  return (
    <Card className="glass-card">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">{title}</p>
            <p className="text-lg sm:text-2xl font-bold tracking-tight truncate">{value}</p>
            {description && <p className="text-[10px] sm:text-xs text-muted-foreground mt-1 truncate">{description}</p>}
          </div>
          <div className="p-2 sm:p-2.5 rounded-xl bg-primary/8 text-primary shrink-0 ml-2">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
