import { ReactNode } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { RequireAuth } from '@/lib/auth';

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <RequireAuth>
      <SidebarProvider>
        <div className="min-h-screen min-h-screen-safe flex w-full bg-muted/30 overflow-x-hidden">
          <AppSidebar />
          <div className="flex-1 flex flex-col min-w-0 min-w-0 overflow-x-hidden">
            <header className="h-14 min-h-[52px] sm:min-h-0 flex items-center gap-3 border-b border-border px-3 sm:px-6 bg-background sticky top-0 z-10 safe-area-pt shrink-0">
              <SidebarTrigger className="h-10 w-10 shrink-0 md:h-7 md:w-7" />
              <span className="text-base font-semibold text-foreground truncate md:sr-only">Hilinkr</span>
            </header>
            <main className="flex-1 p-3 sm:p-6 lg:p-8 animate-fade-in safe-area-pb overflow-x-hidden">
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </RequireAuth>
  );
}
