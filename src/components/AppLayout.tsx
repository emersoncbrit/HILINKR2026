import { ReactNode } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { RequireAuth } from '@/lib/auth';

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <RequireAuth>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-muted/30">
          <AppSidebar />
          <div className="flex-1 flex flex-col">
            <header className="h-14 flex items-center border-b border-border px-6 bg-background sticky top-0 z-10">
              <SidebarTrigger className="mr-4" />
            </header>
            <main className="flex-1 p-6 lg:p-8 animate-fade-in">
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </RequireAuth>
  );
}
