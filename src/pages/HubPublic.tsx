import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { getUserIdByUsername } from '@/hooks/use-username';
import { Search, ExternalLink, Image, ChevronLeft, ChevronRight } from 'lucide-react';
import LeadCapturePopup from '@/components/hub/LeadCapturePopup';

interface Product {
  id: string;
  name: string;
  affiliate_link: string;
  image_url: string | null;
  platform: string | null;
  category: string | null;
  price: number | null;
  click_count: number;
}

interface StoreConfig {
  id: string;
  store_name: string | null;
  store_description: string | null;
  logo_url: string | null;
  favicon_url: string | null;
  primary_color: string;
  secondary_color: string;
  header_color: string;
  header_text_color: string;
  social_links: Record<string, string>;
  banners: string[];
  user_id: string;
  store_template: string;
  popup_enabled: boolean;
  popup_title: string;
  popup_description: string;
  popup_button_text: string;
  popup_bg_color: string;
  popup_text_color: string;
  popup_button_color: string;
}

const SOCIAL_ICONS: Record<string, string> = {
  instagram: '📷',
  telegram: '✈️',
  whatsapp: '💬',
  whatsapp_channel: '📢',
  twitter: '🐦',
  tiktok: '🎵',
  facebook: '👤',
  youtube: '▶️',
  threads: '🧵',
  pinterest: '📌',
};

const formatBRL = (v: number) => v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const HubPublic = () => {
  const { slug, username } = useParams<{ slug: string; username?: string }>();
  const [config, setConfig] = useState<StoreConfig | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchStore = async () => {
      if (!slug) return;
      let query = supabase.from('hub_configs').select('*').eq('slug', slug);
      if (username) {
        const userId = await getUserIdByUsername(username);
        if (!userId) { setNotFound(true); setLoading(false); return; }
        query = query.eq('user_id', userId);
      }
      const { data: hub } = await query.maybeSingle();

      if (!hub) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      const storeConf: StoreConfig = {
        id: hub.id,
        store_name: (hub as any).store_name,
        store_description: (hub as any).store_description,
        logo_url: (hub as any).logo_url,
        favicon_url: (hub as any).favicon_url,
        primary_color: (hub as any).primary_color || '#e05500',
        secondary_color: (hub as any).secondary_color || '#1a4baf',
        header_color: (hub as any).header_color || '#1a4baf',
        header_text_color: (hub as any).header_text_color || '#ffffff',
        social_links: ((hub as any).social_links as Record<string, string>) || {},
        banners: ((hub as any).banners as string[]) || [],
        user_id: hub.user_id,
        store_template: (hub as any).store_template || 'default',
        popup_enabled: (hub as any).popup_enabled || false,
        popup_title: (hub as any).popup_title || 'Ofertas Exclusivas! 🔥',
        popup_description: (hub as any).popup_description || '',
        popup_button_text: (hub as any).popup_button_text || 'Quero receber ofertas!',
        popup_bg_color: (hub as any).popup_bg_color || '#ffffff',
        popup_text_color: (hub as any).popup_text_color || '#1a1a1a',
        popup_button_color: (hub as any).popup_button_color || '#e05500',
      };
      setConfig(storeConf);

      // Set favicon
      if (storeConf.favicon_url) {
        const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement || document.createElement('link');
        link.rel = 'icon';
        link.href = storeConf.favicon_url;
        document.head.appendChild(link);
      }

      // Set page title
      if (storeConf.store_name) {
        document.title = storeConf.store_name;
      }

      // Fetch products
      const { data: prods } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', hub.user_id)
        .eq('status', 'active');

      // Fetch click counts
      const { data: clicks } = await supabase
        .from('clicks')
        .select('product_id')
        .eq('owner_id', hub.user_id);

      const clickCounts: Record<string, number> = {};
      (clicks || []).forEach((c) => {
        clickCounts[c.product_id] = (clickCounts[c.product_id] || 0) + 1;
      });

      const enriched: Product[] = ((prods || []) as any[]).map((p) => ({
        id: p.id,
        name: p.name,
        affiliate_link: p.affiliate_link,
        image_url: p.image_url,
        platform: p.platform,
        category: p.category,
        price: p.price,
        click_count: clickCounts[p.id] || 0,
      }));

      enriched.sort((a, b) => b.click_count - a.click_count);
      setProducts(enriched);
      setLoading(false);

      // Show popup after a delay if enabled and not already captured
      if (storeConf.popup_enabled && !sessionStorage.getItem(`lead_captured_${hub.id}`)) {
        setTimeout(() => setShowPopup(true), 2000);
      }
    };

    fetchStore();
  }, [slug, username]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: '#f5f5f5' }}>
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (notFound || !config) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: '#f5f5f5' }}>
        <p className="text-gray-500 text-lg">Loja não encontrada.</p>
      </div>
    );
  }

  const categories = [...new Set(products.map((p) => p.category).filter(Boolean))] as string[];

  const filtered = products.filter((p) => {
    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const grouped = selectedCategory === 'all'
    ? categories.map((cat) => ({
        category: cat,
        items: filtered.filter((p) => p.category === cat),
      })).filter((g) => g.items.length > 0)
    : [{ category: selectedCategory, items: filtered }].filter((g) => g.items.length > 0);

  const uncategorized = filtered.filter((p) => !p.category);

  const activeSocials = Object.entries(config.social_links).filter(([, v]) => v?.trim());

  const handleProductClick = async (product: Product) => {
    // Track click
    try {
      await supabase.from('clicks').insert({
        product_id: product.id,
        owner_id: config.user_id,
        campaign_id: product.id, // using product_id as campaign reference for hub clicks
      });
    } catch {}
    window.open(product.affiliate_link, '_blank');
  };

  const templateBg = config.store_template === 'bold' || config.store_template === 'neon'
    ? '#0f0f0f' : config.store_template === 'elegant' ? '#faf8f5'
    : config.store_template === 'minimal' ? '#ffffff' : '#f9fafb';

  const templateCardBg = config.store_template === 'bold' ? '#1a1a1a'
    : config.store_template === 'neon' ? '#141414'
    : '#ffffff';

  const templateTextColor = config.store_template === 'bold' || config.store_template === 'neon'
    ? '#ffffff' : '#333333';

  return (
    <div className="min-h-screen flex flex-col" style={{ background: templateBg }}>
      {/* Lead Capture Popup */}
      {showPopup && config.popup_enabled && (
        <LeadCapturePopup
          config={{
            popup_title: config.popup_title,
            popup_description: config.popup_description,
            popup_button_text: config.popup_button_text,
            popup_bg_color: config.popup_bg_color,
            popup_text_color: config.popup_text_color,
            popup_button_color: config.popup_button_color,
          }}
          hubConfigId={config.id}
          ownerId={config.user_id}
          onClose={() => setShowPopup(false)}
        />
      )}
      {/* Header estilo e-commerce */}
      <header
        className="sticky top-0 z-50 shadow-lg"
        style={{ backgroundColor: config.header_color, color: config.header_text_color }}
      >
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {config.logo_url ? (
              <img src={config.logo_url} alt="Logo" className="h-10 md:h-11 max-w-[140px] object-contain" />
            ) : (
              <span className="text-xl md:text-2xl font-bold tracking-tight">
                {config.store_name || slug}
              </span>
            )}
            {config.logo_url && (
              <span className="text-xl font-bold tracking-tight hidden sm:block">{config.store_name || slug}</span>
            )}
          </div>
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 opacity-70" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar produtos..."
              className="w-full pl-11 pr-4 py-2.5 rounded-xl text-sm border-0 outline-none placeholder:opacity-70"
              style={{
                backgroundColor: `${config.header_text_color}18`,
                color: config.header_text_color,
              }}
            />
          </div>
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => setSelectedCategory('all')}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                color: config.header_text_color,
                backgroundColor: selectedCategory === 'all' ? `${config.header_text_color}25` : 'transparent',
              }}
            >
              Todos
            </button>
            {categories.slice(0, 6).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  color: config.header_text_color,
                  backgroundColor: selectedCategory === cat ? `${config.header_text_color}25` : 'transparent',
                }}
              >
                {cat}
              </button>
            ))}
          </nav>
        </div>
        <div className="md:hidden overflow-x-auto px-4 pb-3 flex gap-2 scrollbar-hide">
          <button
            onClick={() => setSelectedCategory('all')}
            className="shrink-0 text-xs font-medium whitespace-nowrap px-4 py-2 rounded-full"
            style={{
              backgroundColor: selectedCategory === 'all' ? config.header_text_color : 'transparent',
              color: selectedCategory === 'all' ? config.header_color : config.header_text_color,
              border: `1px solid ${config.header_text_color}50`,
            }}
          >
            Todos
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className="shrink-0 text-xs font-medium whitespace-nowrap px-4 py-2 rounded-full"
              style={{
                backgroundColor: selectedCategory === cat ? config.header_text_color : 'transparent',
                color: selectedCategory === cat ? config.header_color : config.header_text_color,
                border: `1px solid ${config.header_text_color}50`,
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* Banner Slider */}
      {config.banners.length > 0 && (
        <BannerSlider banners={config.banners} />
      )}

      {/* Conteúdo principal - grid de loja */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 md:py-10">
        {config.store_description && (
          <p className="text-center max-w-2xl mx-auto mb-8 text-base opacity-90" style={{ color: templateTextColor }}>
            {config.store_description}
          </p>
        )}
        {filtered.length === 0 ? (
          <div className="text-center py-24 rounded-2xl border border-dashed" style={{ borderColor: `${config.primary_color}40`, color: templateTextColor }}>
            <Image className="h-14 w-14 mx-auto opacity-40 mb-4" style={{ color: config.primary_color }} />
            <p className="text-lg font-medium">Nenhum produto encontrado</p>
            <p className="text-sm opacity-70 mt-1">Tente outra busca ou categoria.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {grouped.map(({ category, items }) => (
              <section key={category}>
                <h2 className="text-xl md:text-2xl font-bold mb-5 flex items-center gap-2" style={{ color: templateTextColor }}>
                  {category}
                  <span className="text-sm font-normal opacity-60">({items.length})</span>
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-6">
                  {items.map((p) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      config={config}
                      templateCardBg={templateCardBg}
                      templateTextColor={templateTextColor}
                      onClick={() => handleProductClick(p)}
                    />
                  ))}
                </div>
              </section>
            ))}
            {uncategorized.length > 0 && (
              <section>
                <h2 className="text-xl md:text-2xl font-bold mb-5 flex items-center gap-2" style={{ color: templateTextColor }}>
                  Outros
                  <span className="text-sm font-normal opacity-60">({uncategorized.length})</span>
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-6">
                  {uncategorized.map((p) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      config={config}
                      templateCardBg={templateCardBg}
                      templateTextColor={templateTextColor}
                      onClick={() => handleProductClick(p)}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t mt-auto" style={{ backgroundColor: templateCardBg, borderColor: templateBg === '#0f0f0f' || templateBg === '#141414' ? '#333' : '#e5e7eb' }}>
        <div className="max-w-7xl mx-auto px-4 py-8">
          {activeSocials.length > 0 && (
            <div className="flex justify-center gap-5 mb-6 flex-wrap">
              {activeSocials.map(([key, url]) => (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-2xl hover:scale-110 transition-transform opacity-80 hover:opacity-100"
                  title={key}
                >
                  {SOCIAL_ICONS[key] || '🔗'}
                </a>
              ))}
            </div>
          )}
          <p className="text-center text-sm opacity-70" style={{ color: templateTextColor }}>
            © {new Date().getFullYear()} {config.store_name || slug}. Todos os direitos reservados.
          </p>
          <p className="text-center text-xs opacity-50 mt-2" style={{ color: templateTextColor }}>
            As marcas registradas são propriedade de seus respectivos donos. Ao comprar através dos links nós podemos receber uma comissão.
          </p>
        </div>
      </footer>
    </div>
  );
};

const ProductCard = ({
  product,
  config,
  templateCardBg,
  templateTextColor,
  onClick,
}: {
  product: Product;
  config: StoreConfig;
  templateCardBg: string;
  templateTextColor: string;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="group rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 text-left w-full border border-transparent hover:border-opacity-20"
    style={{ backgroundColor: templateCardBg, borderColor: config.primary_color }}
  >
    {product.image_url ? (
      <div className="aspect-square overflow-hidden bg-black/5">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
    ) : (
      <div className="aspect-square flex items-center justify-center bg-black/5">
        <Image className="h-12 w-12 opacity-30" style={{ color: templateTextColor }} />
      </div>
    )}
    <div className="p-4">
      <h3 className="text-sm font-semibold line-clamp-2 leading-tight mb-1.5 group-hover:opacity-90 transition-opacity" style={{ color: templateTextColor }}>
        {product.name}
      </h3>
      {product.platform && (
        <p className="text-xs opacity-60 mb-2" style={{ color: templateTextColor }}>{product.platform}</p>
      )}
      <div className="flex items-center justify-between gap-2">
        {product.price != null && product.price > 0 ? (
          <span className="text-base font-bold" style={{ color: config.primary_color }}>
            R$ {formatBRL(product.price)}
          </span>
        ) : (
          <span />
        )}
        <span className="text-xs font-medium opacity-70 flex items-center gap-1" style={{ color: config.primary_color }}>
          Ver oferta <ExternalLink className="h-3.5 w-3.5" />
        </span>
      </div>
    </div>
  </button>
);

const BannerSlider = ({ banners }: { banners: string[] }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (banners.length === 0) return null;

  return (
    <div className="relative w-full overflow-hidden" style={{ maxHeight: '400px' }}>
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {banners.map((url, i) => (
          <img
            key={i}
            src={url}
            alt={`Banner ${i + 1}`}
            className="w-full flex-shrink-0 object-cover"
            style={{ maxHeight: '400px' }}
          />
        ))}
      </div>
      {banners.length > 1 && (
        <>
          <button
            onClick={() => setCurrent(prev => (prev - 1 + banners.length) % banners.length)}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => setCurrent(prev => (prev + 1) % banners.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className="w-2.5 h-2.5 rounded-full transition-colors"
                style={{ backgroundColor: i === current ? '#fff' : 'rgba(255,255,255,0.4)' }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default HubPublic;
