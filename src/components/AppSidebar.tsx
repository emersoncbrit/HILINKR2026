import { LayoutDashboard, Package, Megaphone, Link2, Sparkles, LogOut, GraduationCap, ShoppingBag, Users, Layout, LinkIcon, Mail, User, Bolt, Shield } from 'lucide-react';
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
  const { signOut } = useAuth();
  const { isAdmin } = useAdmin();

  const linkClass = "flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors";
  const activeClass = "bg-primary text-primary-foreground font-medium hover:bg-primary hover:text-primary-foreground";

  return (
    <Sidebar className="border-r border-sidebar-border bg-sidebar">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <Bolt className="h-5 w-5 text-primary" />
        <span className="text-base font-bold tracking-tight text-foreground">Hilinkr</span>
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

      <SidebarFooter className="p-3 border-t border-sidebar-border">
        <button
          onClick={signOut}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors w-full text-sm"
        >
          <LogOut className="h-4 w-4" />
          <span>Sair</span>
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
