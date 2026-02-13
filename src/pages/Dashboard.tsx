import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { StatCard } from '@/components/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, Megaphone, MousePointerClick, TrendingUp, AlertTriangle, Clock, FolderOpen, Store, Trophy, Zap, Star, Flame, Crown } from 'lucide-react';

// ... keep existing code (interfaces)
interface Alert {
  message: string;
  type: 'warning' | 'info';
}

interface CategoryStat {
  name: string;
  count: number;
  clicks: number;
}

interface PlatformStat {
  name: string;
  count: number;
  clicks: number;
}

interface AffiliateLevel {
  name: string;
  icon: any;
  color: string;
  bgColor: string;
  borderColor: string;
  min: number;
  max: number;
}

const LEVELS: AffiliateLevel[] = [
  { name: 'Iniciante', icon: Star, color: 'text-muted-foreground', bgColor: 'bg-muted/50', borderColor: 'border-muted', min: 0, max: 19 },
  { name: 'Ativo', icon: Zap, color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200', min: 20, max: 49 },
  { name: 'Consistente', icon: Flame, color: 'text-orange-600', bgColor: 'bg-orange-50', borderColor: 'border-orange-200', min: 50, max: 99 },
  { name: 'Escalando', icon: Trophy, color: 'text-purple-600', bgColor: 'bg-purple-50', borderColor: 'border-purple-200', min: 100, max: 199 },
  { name: 'Elite', icon: Crown, color: 'text-yellow-600', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200', min: 200, max: Infinity },
];

function getLevel(score: number): { level: AffiliateLevel; progress: number; nextLevel: AffiliateLevel | null } {
  let idx = LEVELS.findIndex((l) => score >= l.min && score <= l.max);
  if (idx === -1) idx = 0;
  const level = LEVELS[idx];
  const nextLevel = idx < LEVELS.length - 1 ? LEVELS[idx + 1] : null;
  const rangeSize = level.max === Infinity ? 1 : level.max - level.min + 1;
  const progress = level.max === Infinity ? 100 : Math.min(100, ((score - level.min) / rangeSize) * 100);
  return { level, progress, nextLevel };
}

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeCampaigns: 0,
    totalClicks30d: 0,
    mostClickedProduct: '',
    longestInactive: '',
  });
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [categoryStats, setCategoryStats] = useState<CategoryStat[]>([]);
  const [platformStats, setPlatformStats] = useState<PlatformStat[]>([]);
  const [affiliateScore, setAffiliateScore] = useState(0);
  const [scoreBreakdown, setScoreBreakdown] = useState({ products: 0, campaigns: 0, clicks: 0, sales: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchStats = async () => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const [productsRes, campaignsRes, clicksRes, allProductsRes, salesRes] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('campaigns').select('id', { count: 'exact', head: true }).eq('user_id', user.id).eq('status', 'active'),
        supabase.from('clicks').select('product_id, clicked_at').eq('owner_id', user.id).gte('clicked_at', thirtyDaysAgo.toISOString()),
        supabase.from('products').select('id, name, last_activated_at, category, status, platform').eq('user_id', user.id),
        supabase.from('manual_sales').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
      ]);

      const products = allProductsRes.data || [];
      const clicks = clicksRes.data || [];
      const totalProducts = productsRes.count || 0;
      const activeCampaigns = campaignsRes.count || 0;
      const totalSales = salesRes.count || 0;

      // Gamification score
      const ptsProducts = Math.min(totalProducts * 3, 30);     // up to 30 pts
      const ptsCampaigns = Math.min(activeCampaigns * 10, 50); // up to 50 pts
      const ptsClicks = Math.min(Math.floor(clicks.length / 10), 60); // 1pt per 10 clicks, up to 60
      const ptsSales = Math.min(totalSales * 5, 60);           // up to 60 pts
      const totalScore = ptsProducts + ptsCampaigns + ptsClicks + ptsSales;
      setAffiliateScore(totalScore);
      setScoreBreakdown({ products: ptsProducts, campaigns: ptsCampaigns, clicks: ptsClicks, sales: ptsSales });

      const clicksByProduct: Record<string, number> = {};
      clicks.forEach((c) => {
        clicksByProduct[c.product_id] = (clicksByProduct[c.product_id] || 0) + 1;
      });
      const mostClickedId = Object.entries(clicksByProduct).sort(([, a], [, b]) => b - a)[0]?.[0];
      const mostClicked = products.find((p) => p.id === mostClickedId);

      const activeProducts = products.filter((p) => p.status !== 'archived');
      const longestInactive = activeProducts.sort((a, b) => {
        const aDate = a.last_activated_at ? new Date(a.last_activated_at).getTime() : 0;
        const bDate = b.last_activated_at ? new Date(b.last_activated_at).getTime() : 0;
        return aDate - bDate;
      })[0];

      const newAlerts: Alert[] = [];
      const now = Date.now();
      activeProducts.forEach((p) => {
        if (!p.last_activated_at) {
          newAlerts.push({ message: `"${p.name}" nunca foi ativado em uma campanha.`, type: 'info' });
        } else {
          const daysSince = Math.floor((now - new Date(p.last_activated_at).getTime()) / (1000 * 60 * 60 * 24));
          if (daysSince >= 30) {
            newAlerts.push({ message: `"${p.name}" está inativo há ${daysSince} dias.`, type: 'warning' });
          }
        }
      });

      const categories = [...new Set(activeProducts.map((p) => p.category).filter(Boolean))];
      categories.forEach((cat) => {
        const catProducts = activeProducts.filter((p) => p.category === cat);
        const latestActivation = Math.max(...catProducts.map((p) => p.last_activated_at ? new Date(p.last_activated_at).getTime() : 0));
        if (latestActivation > 0) {
          const daysSince = Math.floor((now - latestActivation) / (1000 * 60 * 60 * 24));
          if (daysSince >= 40) {
            newAlerts.push({ message: `Você não promoveu a categoria "${cat}" há ${daysSince} dias.`, type: 'info' });
          }
        }
      });

      // Category stats
      const catMap: Record<string, { count: number; clicks: number }> = {};
      activeProducts.forEach((p) => {
        const cat = p.category?.trim() || 'Sem categoria';
        if (!catMap[cat]) catMap[cat] = { count: 0, clicks: 0 };
        catMap[cat].count++;
        catMap[cat].clicks += clicksByProduct[p.id] || 0;
      });
      setCategoryStats(
        Object.entries(catMap)
          .map(([name, v]) => ({ name, ...v }))
          .sort((a, b) => b.count - a.count)
      );

      // Platform stats
      const platMap: Record<string, { count: number; clicks: number }> = {};
      activeProducts.forEach((p) => {
        const plat = p.platform?.trim() || 'Sem plataforma';
        if (!platMap[plat]) platMap[plat] = { count: 0, clicks: 0 };
        platMap[plat].count++;
        platMap[plat].clicks += clicksByProduct[p.id] || 0;
      });
      setPlatformStats(
        Object.entries(platMap)
          .map(([name, v]) => ({ name, ...v }))
          .sort((a, b) => b.count - a.count)
      );

      setStats({
        totalProducts,
        activeCampaigns,
        totalClicks30d: clicks.length,
        mostClickedProduct: mostClicked?.name || '—',
        longestInactive: longestInactive?.name || '—',
      });
      setAlerts(newAlerts.slice(0, 5));
      setLoading(false);
    };

    fetchStats();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  const { level, progress, nextLevel } = getLevel(affiliateScore);
  const LevelIcon = level.icon;

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold">Painel</h1>
        <p className="text-sm text-muted-foreground">Visão geral do seu negócio de afiliados</p>
      </div>

      {/* Affiliate Level Card */}
      <Card className={`${level.bgColor} ${level.borderColor} border-2 overflow-hidden`}>
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className={`h-12 w-12 sm:h-14 sm:w-14 rounded-2xl flex items-center justify-center ${level.bgColor} border ${level.borderColor} shrink-0`}>
                <LevelIcon className={`h-6 w-6 sm:h-7 sm:w-7 ${level.color}`} />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">📊 Seu Nível</p>
                <h2 className={`text-xl sm:text-2xl font-bold ${level.color}`}>{level.name}</h2>
                <p className="text-xs text-muted-foreground">
                  {affiliateScore} pontos
                  {nextLevel && <span> · Próximo: {nextLevel.name} ({nextLevel.min} pts)</span>}
                </p>
              </div>
            </div>
            <div className="flex gap-3 sm:gap-4 text-center">
              {[
                { label: 'Produtos', value: scoreBreakdown.products, max: 30 },
                { label: 'Campanhas', value: scoreBreakdown.campaigns, max: 50 },
                { label: 'Cliques', value: scoreBreakdown.clicks, max: 60 },
                { label: 'Vendas', value: scoreBreakdown.sales, max: 60 },
              ].map((item) => (
                <div key={item.label} className="flex-1 sm:flex-none sm:w-16">
                  <div className="text-sm sm:text-base font-bold">{item.value}</div>
                  <div className="text-[10px] text-muted-foreground">{item.label}</div>
                  <div className="h-1 w-full bg-black/5 rounded-full mt-1 overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${(item.value / item.max) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Progress bar */}
          <div className="mt-4">
            <div className="h-2 w-full bg-black/5 rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all duration-700" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard title="Produtos" value={stats.totalProducts} icon={<Package className="h-5 w-5" />} />
        <StatCard title="Campanhas Ativas" value={stats.activeCampaigns} icon={<Megaphone className="h-5 w-5" />} />
        <StatCard title="Cliques (30d)" value={stats.totalClicks30d} icon={<MousePointerClick className="h-5 w-5" />} />
        <StatCard title="Mais Clicado" value={stats.mostClickedProduct} icon={<TrendingUp className="h-5 w-5" />} description="Últimos 30 dias" />
      </div>

      {/* Categorias e Lojas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
              Produtos por Categoria
            </CardTitle>
          </CardHeader>
          <CardContent>
            {categoryStats.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum produto cadastrado ainda.</p>
            ) : (
              <div className="space-y-3">
                {categoryStats.map((cat) => (
                  <div key={cat.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-sm font-medium truncate">{cat.name}</span>
                      <Badge variant="secondary" className="text-xs shrink-0">{cat.count}</Badge>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {cat.clicks} clique{cat.clicks !== 1 ? 's' : ''}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Store className="h-4 w-4 text-muted-foreground" />
              Produtos por Loja
            </CardTitle>
          </CardHeader>
          <CardContent>
            {platformStats.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum produto cadastrado ainda.</p>
            ) : (
              <div className="space-y-3">
                {platformStats.map((plat) => (
                  <div key={plat.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-sm font-medium truncate">{plat.name}</span>
                      <Badge variant="secondary" className="text-xs shrink-0">{plat.count}</Badge>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {plat.clicks} clique{plat.clicks !== 1 ? 's' : ''}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              Produto Mais Inativo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">{stats.longestInactive}</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-warning" />
              Alertas de Reativação
            </CardTitle>
          </CardHeader>
          <CardContent>
            {alerts.length === 0 ? (
              <p className="text-sm text-muted-foreground">Sem alertas — tudo em dia!</p>
            ) : (
              <ul className="space-y-2">
                {alerts.map((alert, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Badge variant={alert.type === 'warning' ? 'destructive' : 'secondary'} className="text-xs mt-0.5 shrink-0">
                      {alert.type === 'warning' ? 'aviso' : 'info'}
                    </Badge>
                    <span>{alert.message}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
