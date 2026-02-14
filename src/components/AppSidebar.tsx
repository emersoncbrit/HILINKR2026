import { useState } from 'react';
import { LayoutDashboard, Package, Megaphone, Link2, Sparkles, LogOut, GraduationCap, ShoppingBag, Users, Layout, LinkIcon, Mail, User, Shield, Smartphone, Download, Info } from 'lucide-react';
import { useSiteDesign } from '@/lib/site-design';
import { NavLink } from '@/components/NavLink';
import { useAuth } from '@/lib/auth';
import { useAdmin } from '@/hooks/use-admin';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const mainNav = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Produtos', url: '/products', icon: Package },
  { title: 'Campanhas', url: '/campaigns', icon: Megaphone },
  { title: 'Minha Loja', url: '/hub', icon: Link2 },
  { title: 'Leads', url: '/leads', icon: Mail },
  { title: 'Link na Bio', url: '/link-bio', icon: LinkIcon },
];

const secondaryNav = [
  { title: 'IA de Copies', url: '/ai-copy', icon: Sparkles },
  { title: 'Template Stories', url: '/template-stories', icon: Layout },
];

const extraNav = [
  { title: 'Minha Conta', url: '/account', icon: User },
  { title: 'Tutorial', url: '/tutorial', icon: GraduationCap },
  { title: 'Venda Mais', url: '/venda-mais', icon: ShoppingBag },
  { title: 'Seja um Afiliado', url: '/seja-afiliado', icon: Users },
];

export function AppSidebar() {
  const [installDialogOpen, setInstallDialogOpen] = useState(false);
  const { signOut } = useAuth();
  const { isAdmin } = useAdmin();
  const { logoUrl, siteName, siteNameFallback } = useSiteDesign();
  const logoOnly = !siteName.trim();

  const linkClass = "flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors";
  const activeClass = "bg-primary text-primary-foreground font-medium hover:bg-primary hover:text-primary-foreground";

  return (
    <Sidebar className="border-r border-sidebar-border bg-sidebar">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <img
          src={logoUrl}
          alt={siteNameFallback}
          className={logoOnly ? 'h-11 w-11 object-contain' : 'h-8 w-8 object-contain'}
        />
        {siteName ? <span className="text-base font-bold tracking-tight text-foreground">{siteName}</span> : null}
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] uppercase tracking-wider text-muted-foreground/60 font-medium px-3">Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === '/'}
                      className={linkClass}
                      activeClassName={activeClass}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] uppercase tracking-wider text-muted-foreground/60 font-medium px-3">Ferramentas</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={linkClass}
                      activeClassName={activeClass}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] uppercase tracking-wider text-muted-foreground/60 font-medium px-3">Geral</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {extraNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={linkClass}
                      activeClassName={activeClass}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-[11px] uppercase tracking-wider text-muted-foreground/60 font-medium px-3">Admin</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink to="/admin" className={linkClass} activeClassName={activeClass}>
                      <Shield className="h-4 w-4" />
                      <span>Painel Admin</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <div className="mt-auto flex flex-col gap-2 p-3 pt-0 safe-area-pb">
        <div className="rounded-xl border border-sidebar-border bg-sidebar-accent/50 p-3">
          <div className="flex items-center gap-2 mb-1.5">
            <Smartphone className="h-4 w-4 text-primary shrink-0" />
            <span className="text-sm font-semibold text-sidebar-foreground">Baixe nosso App</span>
          </div>
          <p className="text-xs text-muted-foreground mb-3">Gerencie suas vendas de qualquer lugar.</p>
          <Button
            size="sm"
            className="w-full gap-2"
            onClick={() => setInstallDialogOpen(true)}
          >
            <Download className="h-4 w-4" />
            Download
          </Button>
        </div>

        <SidebarFooter className="p-0 border-t border-sidebar-border pt-3">
          <button
            onClick={signOut}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors w-full text-sm"
          >
            <LogOut className="h-4 w-4" />
            <span>Sair</span>
          </button>
        </SidebarFooter>
      </div>

      <Dialog open={installDialogOpen} onOpenChange={setInstallDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl border-primary/20 safe-area-pb safe-area-pl safe-area-pr">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-primary">Instalar App</DialogTitle>
          </DialogHeader>
          <div className="flex gap-3 py-2">
            <div className="shrink-0 rounded-full bg-primary/15 p-2">
              <Info className="h-5 w-5 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Use o menu do navegador e selecione <strong>&quot;Instalar aplicativo&quot;</strong> ou <strong>&quot;Adicionar à tela inicial&quot;</strong>.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </Sidebar>
  );
}
