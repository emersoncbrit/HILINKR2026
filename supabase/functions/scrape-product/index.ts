const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const PLATFORM_DOMAINS: Record<string, string> = {
  'magazineluiza.com.br': 'Magalu', 'magalu.com.br': 'Magalu',
  'amazon.com.br': 'Amazon', 'amazon.com': 'Amazon',
  'shopee.com.br': 'Shopee', 's.shopee.com.br': 'Shopee',
  'mercadolivre.com.br': 'Mercado Livre', 'produto.mercadolivre.com.br': 'Mercado Livre',
  'natura.com.br': 'Natura',
  'shein.com': 'Shein', 'shein.com.br': 'Shein',
  'casasbahia.com.br': 'Casas Bahia',
  'americanas.com.br': 'Americanas',
  'netshoes.com.br': 'Netshoes',
  'nike.com.br': 'Nike',
  'adidas.com.br': 'Adidas',
  'centauro.com.br': 'Centauro',
  'dafiti.com.br': 'Dafiti',
  'kabum.com.br': 'Kabum',
  'sephora.com.br': 'Sephora',
  'boticario.com.br': 'Boticário',
  'carrefour.com.br': 'Carrefour',
  'aliexpress.com': 'AliExpress', 'pt.aliexpress.com': 'AliExpress',
  'renner.com.br': 'Lojas Renner',
  'riachuelo.com.br': 'Riachuelo',
  'fastshop.com.br': 'Fastshop',
  'samsung.com.br': 'Samsung',
  'puma.com.br': 'Puma',
  'cobasi.com.br': 'Cobasi',
  'vivara.com.br': 'Vivara',
  'zattini.com.br': 'Zattini',
  'belezanaweb.com.br': 'Beleza na Web',
  'epocacosmeticos.com.br': 'Época Cosméticos',
  'leroymerlin.com.br': 'Leroy Merlin',
  'madeiramadeira.com.br': 'Madeira Madeira',
  'extra.com.br': 'Extra',
  'pontofrio.com.br': 'Ponto Frio',
  'polishop.com.br': 'Polishop',
  'dell.com.br': 'Dell',
  'nespresso.com.br': 'Nespresso',
  'avon.com.br': 'Avon',
  'eudora.com.br': 'Eudora',
  'camicado.com.br': 'Camicado',
};

function identifyPlatform(url: string): string | null {
  try {
    const hostname = new URL(url).hostname.replace('www.', '');
    for (const [domain, platform] of Object.entries(PLATFORM_DOMAINS)) {
      if (hostname.includes(domain)) return platform;
    }
  } catch {}
  return null;
}

function extractPrice(text: string): number | null {
  const patterns = [
    /R\$\s*([\d]{1,3}(?:\.[\d]{3})*,[\d]{2})/,
    /R\$\s*([\d.,]+)/i,
    /"price"[:\s]*([\d.]+)/i,
    /"amount"[:\s]*([\d.]+)/i,
    /(?:preço|price|valor)[:\s]*R?\$?\s*([\d.,]+)/i,
  ];
  for (const p of patterns) {
    const m = text.match(p);
    if (m) {
      let val = m[1].replace(/\./g, '').replace(',', '.');
      const num = parseFloat(val);
      if (!isNaN(num) && num > 1 && num < 100000) return num;
    }
  }
  return null;
}

function extractTitleFromMarkdown(markdown: string): string | null {
  // Try to get first meaningful heading
  const headingMatch = markdown.match(/^#{1,3}\s+(.+)$/m);
  if (headingMatch?.[1]) {
    const title = headingMatch[1].trim();
    // Skip generic titles
    if (title.length > 5 && !title.toLowerCase().includes('login') && !title.toLowerCase().includes('faça login')) {
      return title;
    }
  }
  return null;
}

function extractImageFromMarkdown(markdown: string): string | null {
  const imgMatch = markdown.match(/!\[.*?\]\((https?:\/\/[^\s)]+(?:\.jpg|\.jpeg|\.png|\.webp)[^\s)]*)\)/i);
  if (imgMatch?.[1]) return imgMatch[1];
  // Try any image URL
  const anyImg = markdown.match(/!\[.*?\]\((https?:\/\/[^\s)]+)\)/);
  if (anyImg?.[1] && !anyImg[1].includes('icon') && !anyImg[1].includes('logo') && !anyImg[1].includes('avatar')) {
    return anyImg[1];
  }
  return null;
}

function isLoginPage(title: string | null): boolean {
  if (!title) return false;
  const lower = title.toLowerCase();
  return lower.includes('login') || lower.includes('faça login') || lower.includes('sign in') || lower.includes('entrar');
}

// Extract product name from URL path (useful for Shopee SEO URLs)
function extractNameFromUrl(url: string): string | null {
  try {
    const u = new URL(url);
    // Check for seoName parameter (Shopee)
    const seoName = u.searchParams.get('seoName');
    if (seoName) return decodeURIComponent(seoName).replace(/-/g, ' ');
    
    // Try path segments - look for product-name-like segments
    const segments = u.pathname.split('/').filter(s => s.length > 10 && /[a-zA-Z]/.test(s));
    for (const seg of segments) {
      // Skip segments that are just IDs
      if (/^\d+$/.test(seg)) continue;
      // Clean up the segment
      const cleaned = seg
        .replace(/-i\.\d+\.\d+$/, '') // Shopee format
        .replace(/[-_]/g, ' ')
        .trim();
      if (cleaned.length > 10) return cleaned;
    }
  } catch {}
  return null;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();
    if (!url) {
      return new Response(JSON.stringify({ success: false, error: 'URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith('http')) formattedUrl = `https://${formattedUrl}`;

    console.log('Scraping:', formattedUrl);

    const platform = identifyPlatform(formattedUrl);
    const urlName = extractNameFromUrl(formattedUrl);

    // Try Firecrawl with JSON extraction for better structured data
    const firecrawlKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (firecrawlKey) {
      try {
        console.log('Using Firecrawl...');
        const fcResponse = await fetch('https://api.firecrawl.dev/v1/scrape', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${firecrawlKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: formattedUrl,
            formats: ['markdown', 'html'],
            onlyMainContent: false,
            waitFor: 3000,
          }),
        });

        const fcData = await fcResponse.json();

        if (fcResponse.ok && fcData.success) {
          const metadata = fcData.data?.metadata || fcData.metadata || {};
          const markdown = fcData.data?.markdown || fcData.markdown || '';
          const html = fcData.data?.html || fcData.html || '';

          // Get title from metadata, then markdown, then URL
          let title = metadata['og:title'] || metadata.title || null;
          if (!title || isLoginPage(title)) {
            title = extractTitleFromMarkdown(markdown);
          }
          if (!title || isLoginPage(title)) {
            title = urlName;
          }

          // Get image from metadata, then markdown
          let image = metadata['og:image'] || metadata.image || null;
          if (!image) image = extractImageFromMarkdown(markdown);

          // Get price from HTML first (more structured), then markdown
          let price = extractPrice(html) || extractPrice(markdown);

          const finalUrl = metadata.sourceURL || formattedUrl;
          const detectedPlatform = identifyPlatform(finalUrl) || platform;

          console.log('Firecrawl result:', {
            title: title ? title.substring(0, 50) : null,
            image: image ? 'found' : 'none',
            platform: detectedPlatform,
            price,
          });

          return new Response(JSON.stringify({
            success: true,
            data: { title, image, platform: detectedPlatform, price },
          }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        console.log('Firecrawl failed:', fcData.error || 'unknown error');
      } catch (fcErr) {
        console.error('Firecrawl error:', fcErr);
      }
    }

    // Fallback: direct fetch
    console.log('Using direct fetch fallback...');
    const response = await fetch(formattedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
      },
      redirect: 'follow',
    });

    const html = await response.text();
    const finalUrl = response.url;

    const getMetaContent = (property: string): string | null => {
      const patterns = [
        new RegExp(`<meta[^>]*(?:property|name)=["']${property}["'][^>]*content=["']([^"']*)["']`, 'i'),
        new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*(?:property|name)=["']${property}["']`, 'i'),
      ];
      for (const p of patterns) {
        const m = html.match(p);
        if (m?.[1]) return m[1].trim();
      }
      return null;
    };

    let title = getMetaContent('og:title') || getMetaContent('twitter:title') || html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.trim() || null;
    if (isLoginPage(title)) title = urlName;
    
    const image = getMetaContent('og:image') || getMetaContent('twitter:image') || null;
    const detectedPlatform = identifyPlatform(finalUrl) || platform;
    const price = extractPrice(html);

    console.log('Fallback result:', { title: title?.substring(0, 50), image: image ? 'found' : 'none', platform: detectedPlatform, price });

    return new Response(JSON.stringify({
      success: true,
      data: { title, image, platform: detectedPlatform, price },
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  } catch (error) {
    console.error('Scrape error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to scrape',
    }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
