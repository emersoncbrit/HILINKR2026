import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { getUserIdByUsername } from '@/hooks/use-username';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowRight, CheckCircle2, Shield, Star, Truck, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ReviewItem { name: string; text: string; rating: number; }
interface FAQItem { question: string; answer: string; }

interface CampaignData {
  id: string;
  product_id: string;
  headline: string;
  subheadline: string;
  benefits: string[];
  cta_text: string;
  urgency_text: string;
  social_proof_text: string;
  status: string;
  user_id: string;
  logo_url: string | null;
  image_url: string | null;
  description: string | null;
  button_color: string | null;
  installment_text: string | null;
  reviews: ReviewItem[] | null;
  custom_faqs: FAQItem[] | null;
  newsletter_enabled: boolean | null;
  products: { affiliate_link: string; name: string; image_url: string | null; price: number | null } | null;
}

const MiniSite = () => {
  const { slug, username, campaignSlug } = useParams<{ slug?: string; username?: string; campaignSlug?: string }>();
  const { toast } = useToast();
  const [campaign, setCampaign] = useState<CampaignData | null>(null);
  const [productFallback, setProductFallback] = useState<{ affiliate_link: string; name: string; image_url: string | null; price: number | null } | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [email, setEmail] = useState('');
  const [submittingEmail, setSubmittingEmail] = useState(false);

  const effectiveSlug = campaignSlug || slug;
  const product = campaign?.products ?? productFallback;

  useEffect(() => {
    const fetchCampaign = async () => {
      if (!effectiveSlug) return;
      let query = supabase
        .from('campaigns')
        .select('id, product_id, headline, subheadline, benefits, cta_text, urgency_text, social_proof_text, status, user_id, logo_url, image_url, description, button_color, installment_text, reviews, custom_faqs, newsletter_enabled, products(affiliate_link, name, image_url, price)')
        .eq('slug', effectiveSlug)
        .eq('status', 'active');

      if (username) {
        const userId = await getUserIdByUsername(username);
        if (!userId) { setNotFound(true); setLoading(false); return; }
        query = query.eq('user_id', userId);
      }
      const { data, error } = await query.maybeSingle();
      if (error || !data) { setNotFound(true); setLoading(false); return; }
      const camp = data as unknown as CampaignData;
      setCampaign(camp);
      if (camp.product_id && !camp.products) {
        const { data: prod } = await supabase.from('products').select('affiliate_link, name, image_url, price').eq('id', camp.product_id).maybeSingle();
        if (prod) setProductFallback(prod as { affiliate_link: string; name: string; image_url: string | null; price: number | null });
      }
      setLoading(false);
    };
    fetchCampaign();
  }, [effectiveSlug, username]);

  const handleClick = async () => {
    if (!campaign) return;
    const link = product?.affiliate_link?.trim();
    if (!link) {
      toast({ title: 'Link do produto não configurado', variant: 'destructive' });
      return;
    }
    try {
      await supabase.from('clicks').insert({
        campaign_id: campaign.id,
        product_id: campaign.product_id,
        owner_id: campaign.user_id,
      });
    } catch {}
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  const handleEmailSubmit = async () => {
    if (!email || !campaign) return;
    setSubmittingEmail(true);
    // Store as hub_lead with campaign owner
    await supabase.from('hub_leads').insert({
      email,
      name: '',
      hub_config_id: campaign.id, // reuse for campaign leads
      owner_id: campaign.user_id,
    });
    toast({ title: 'Cadastrado com sucesso!', description: 'Você receberá nossas ofertas.' });
    setEmail('');
    setSubmittingEmail(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
      </div>
    );
  }

  if (notFound || !campaign) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-gray-500">Campanha não encontrada ou inativa.</p>
      </div>
    );
  }

  const price = product?.price;
  const displayImage = campaign.image_url || product?.image_url;
  const hasImage = !!displayImage;
  const btnColor = campaign.button_color || '#22c55e';
  const reviews = (campaign.reviews as ReviewItem[]) || [];
  const faqs = (campaign.custom_faqs as FAQItem[]) || [];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Barra de urgência */}
      {campaign.urgency_text && (
        <div className="text-white text-center py-3 text-sm font-semibold tracking-wide" style={{ backgroundColor: btnColor }}>
          {campaign.urgency_text}
        </div>
      )}

      {/* Header com logo */}
      <header className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-center">
          {campaign.logo_url ? (
            <img src={campaign.logo_url} alt="Logo" className="h-10 md:h-12 object-contain" />
          ) : (
            <span className="text-lg font-bold text-gray-700">{product?.name || 'Oferta'}</span>
          )}
        </div>
      </header>

      {/* Hero / Produto principal */}
      <section className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-10 md:py-16">
          <div className={`grid gap-10 md:gap-14 ${hasImage ? 'md:grid-cols-2' : 'md:grid-cols-1 max-w-2xl mx-auto'} items-center`}>
            {hasImage && (
              <div className="relative flex justify-center">
                <div className="rounded-2xl overflow-hidden shadow-xl ring-1 ring-black/5 bg-gray-50">
                  <img
                    src={displayImage!}
                    alt={product?.name || 'Produto'}
                    className="w-full aspect-square object-cover max-w-md"
                    loading="eager"
                  />
                </div>
              </div>
            )}
            <div className="flex flex-col justify-center space-y-5">
              {campaign.social_proof_text && (
                <div className="flex items-center gap-2 text-sm">
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                  </div>
                  <span className="text-gray-500 font-medium">{campaign.social_proof_text}</span>
                </div>
              )}
              <h1 className="text-3xl md:text-4xl font-extrabold leading-tight tracking-tight text-gray-900">
                {campaign.headline || product?.name || 'Produto'}
              </h1>
              {campaign.subheadline && (
                <p className="text-lg text-gray-600 leading-relaxed">{campaign.subheadline}</p>
              )}
              {price != null && price > 0 && (
                <div className="space-y-0.5">
                  <p className="text-4xl font-bold text-gray-900">
                    R$ {price.toFixed(2).replace('.', ',')}
                  </p>
                  {campaign.installment_text && (
                    <p className="text-base text-gray-500">{campaign.installment_text}</p>
                  )}
                </div>
              )}
              <button
                onClick={handleClick}
                className="w-full text-white text-lg font-bold py-5 px-8 rounded-xl flex items-center justify-center gap-2 transition-all hover:brightness-110 active:scale-[0.99] shadow-lg"
                style={{ backgroundColor: btnColor }}
              >
                {campaign.cta_text || 'Comprar Agora'}
                <ArrowRight className="h-5 w-5" />
              </button>
              <div className="flex items-center justify-center gap-8 pt-2 text-sm text-gray-500">
                <span className="flex items-center gap-1.5"><Shield className="h-5 w-5 text-gray-400" /> Compra segura</span>
                <span className="flex items-center gap-1.5"><Truck className="h-5 w-5 text-gray-400" /> Entrega garantida</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Descrição */}
      {campaign.description && (
        <section className="py-12 md:py-16">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Sobre o produto</h2>
            <div className="text-gray-700 leading-relaxed whitespace-pre-line text-base">{campaign.description}</div>
          </div>
        </section>
      )}

      {/* Benefícios */}
      {campaign.benefits && campaign.benefits.length > 0 && (
        <section className="bg-white py-12 md:py-16">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-8">
              Por que escolher {product?.name || 'este produto'}?
            </h2>
            <div className="space-y-5">
              {campaign.benefits.map((b, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-gray-50">
                  <CheckCircle2 className="h-6 w-6 mt-0.5 shrink-0" style={{ color: btnColor }} />
                  <span className="text-gray-700 leading-relaxed">{b}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Avaliações */}
      {reviews.length > 0 && (
        <section className="py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-8">Avaliações de clientes</h2>
            <div className="grid gap-5 md:grid-cols-2">
              {reviews.map((r, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, si) => (
                      <Star key={si} className={`h-4 w-4 ${si < r.rating ? 'text-amber-500 fill-current' : 'text-gray-200'}`} />
                    ))}
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-3">"{r.text}"</p>
                  <p className="text-sm font-semibold text-gray-500">— {r.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="bg-white py-12 md:py-16">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-8">Perguntas frequentes</h2>
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((f, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="border border-gray-200 rounded-xl px-5 bg-gray-50/50">
                  <AccordionTrigger className="text-base font-semibold hover:no-underline py-5" style={{ color: btnColor }}>
                    {f.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 pb-5">{f.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      )}

      {/* Newsletter Section */}
      {campaign.newsletter_enabled && (
        <div className="py-10 md:py-14" style={{ backgroundColor: btnColor + '10' }}>
          <div className="max-w-md mx-auto px-4 text-center space-y-4">
            <Mail className="h-8 w-8 mx-auto" style={{ color: btnColor }} />
            <h2 className="text-lg font-bold">Receba Ofertas Exclusivas</h2>
            <p className="text-sm text-gray-600">Cadastre seu e-mail e fique por dentro das novidades.</p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
              />
              <button
                onClick={handleEmailSubmit}
                disabled={submittingEmail || !email}
                className="text-white text-sm font-semibold px-5 py-2 rounded-xl transition-all hover:brightness-110 disabled:opacity-50"
                style={{ backgroundColor: btnColor }}
              >
                Cadastrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CTA final */}
      <section className="bg-gray-50 py-12 text-center px-4">
        <button
          onClick={handleClick}
          className="text-white text-lg font-bold px-12 py-5 rounded-xl inline-flex items-center gap-2 transition-all hover:brightness-110 active:scale-[0.99] shadow-lg"
          style={{ backgroundColor: btnColor }}
        >
          {campaign.cta_text || 'Comprar Agora'}
          <ArrowRight className="h-5 w-5" />
        </button>
        <p className="text-sm text-gray-500 mt-4 flex items-center justify-center gap-1.5">
          <Shield className="h-4 w-4" /> Pagamento 100% seguro
        </p>
      </section>

      {/* CTA fixo mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur border-t border-gray-100 shadow-lg safe-area-pb">
        <button
          onClick={handleClick}
          className="w-full text-white text-base font-bold py-4 rounded-xl flex items-center justify-center gap-2"
          style={{ backgroundColor: btnColor }}
        >
          {campaign.cta_text || 'Comprar Agora'}
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
      <div className="md:hidden h-20" />

      <footer className="border-t border-gray-200 bg-white py-6 text-center">
        <p className="text-xs text-gray-400">© {new Date().getFullYear()} Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default MiniSite;
