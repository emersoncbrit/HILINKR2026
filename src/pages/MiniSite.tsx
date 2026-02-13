import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
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
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  const [campaign, setCampaign] = useState<CampaignData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [email, setEmail] = useState('');
  const [submittingEmail, setSubmittingEmail] = useState(false);

  useEffect(() => {
    const fetchCampaign = async () => {
      if (!slug) return;
      const { data, error } = await supabase
        .from('campaigns')
        .select('id, product_id, headline, subheadline, benefits, cta_text, urgency_text, social_proof_text, status, user_id, logo_url, image_url, description, button_color, installment_text, reviews, custom_faqs, newsletter_enabled, products(affiliate_link, name, image_url, price)')
        .eq('slug', slug)
        .eq('status', 'active')
        .maybeSingle();

      if (error || !data) { setNotFound(true); }
      else { setCampaign(data as unknown as CampaignData); }
      setLoading(false);
    };
    fetchCampaign();
  }, [slug]);

  const handleClick = async () => {
    if (!campaign || !campaign.products) return;
    await supabase.from('clicks').insert({
      campaign_id: campaign.id,
      product_id: campaign.product_id,
      owner_id: campaign.user_id,
    });
    window.location.href = campaign.products.affiliate_link;
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

  const product = campaign.products;
  const price = product?.price;
  const displayImage = campaign.image_url || product?.image_url;
  const hasImage = !!displayImage;
  const btnColor = campaign.button_color || '#22c55e';
  const reviews = (campaign.reviews as ReviewItem[]) || [];
  const faqs = (campaign.custom_faqs as FAQItem[]) || [];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Urgency Banner */}
      {campaign.urgency_text && (
        <div className="text-white text-center py-2.5 text-sm font-medium tracking-wide" style={{ backgroundColor: btnColor }}>
          {campaign.urgency_text}
        </div>
      )}

      {/* Logo */}
      {campaign.logo_url && (
        <div className="flex justify-center py-4 border-b border-gray-100">
          <img src={campaign.logo_url} alt="Logo" className="h-10 object-contain" />
        </div>
      )}

      {/* Main Product Section */}
      <div className="max-w-5xl mx-auto px-4 py-8 md:py-14">
        <div className={`grid gap-8 ${hasImage ? 'md:grid-cols-2' : 'md:grid-cols-1 max-w-2xl mx-auto'}`}>
          {/* Product Image */}
          {hasImage && (
            <div className="flex items-start justify-center">
              <img
                src={displayImage!}
                alt={product?.name || 'Product'}
                className="rounded-xl object-cover bg-gray-50"
                style={{ width: 500, height: 500 }}
                loading="eager"
              />
            </div>
          )}

          {/* Product Info */}
          <div className="flex flex-col justify-center space-y-4">
            {campaign.social_proof_text && (
              <div className="flex items-center gap-1.5 text-sm">
                <div className="flex text-yellow-500">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                </div>
                <span className="text-gray-500">{campaign.social_proof_text}</span>
              </div>
            )}

            <h1 className="text-2xl md:text-3xl font-bold leading-tight">
              {campaign.headline || product?.name || 'Produto'}
            </h1>

            {campaign.subheadline && (
              <p className="text-gray-600 text-base leading-relaxed">{campaign.subheadline}</p>
            )}

            {/* Price & Installments */}
            {price && (
              <div className="space-y-1">
                <p className="text-3xl font-bold">
                  R$ {price.toFixed(2).replace('.', ',')}
                </p>
                {campaign.installment_text && (
                  <p className="text-sm text-gray-500">{campaign.installment_text}</p>
                )}
              </div>
            )}

            {/* CTA Button */}
            <button
              onClick={handleClick}
              className="w-full text-white text-base font-semibold py-4 px-8 rounded-xl flex items-center justify-center gap-2 transition-all hover:brightness-110 active:scale-[0.98]"
              style={{ backgroundColor: btnColor }}
            >
              {campaign.cta_text || 'Comprar Agora'}
              <ArrowRight className="h-5 w-5" />
            </button>

            {/* Trust Badges */}
            <div className="flex items-center justify-center gap-6 pt-1 text-xs text-gray-400">
              <span className="flex items-center gap-1"><Shield className="h-4 w-4" />Compra Segura</span>
              <span className="flex items-center gap-1"><Truck className="h-4 w-4" />Entrega Garantida</span>
            </div>
          </div>
        </div>
      </div>

      {/* Description Section */}
      {campaign.description && (
        <div className="bg-gray-50 py-10 md:py-14">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-xl font-bold mb-4">Descrição</h2>
            <div className="text-gray-700 leading-relaxed whitespace-pre-line">{campaign.description}</div>
          </div>
        </div>
      )}

      {/* Benefits Section */}
      {campaign.benefits && campaign.benefits.length > 0 && (
        <div className="py-10 md:py-14">
          <div className="max-w-3xl mx-auto px-4 space-y-6">
            <h2 className="text-xl md:text-2xl font-bold text-center">
              Por que escolher {product?.name || 'este produto'}?
            </h2>
            <div className="space-y-4">
              {campaign.benefits.map((b, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 mt-0.5 shrink-0" style={{ color: btnColor }} />
                  <span className="text-gray-700 leading-relaxed">{b}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Reviews Section */}
      {reviews.length > 0 && (
        <div className="bg-gray-50 py-10 md:py-14">
          <div className="max-w-3xl mx-auto px-4 space-y-6">
            <h2 className="text-xl md:text-2xl font-bold text-center">Avaliações de Clientes</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {reviews.map((r, i) => (
                <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, si) => (
                      <Star key={si} className={`h-4 w-4 ${si < r.rating ? 'text-yellow-500 fill-current' : 'text-gray-200'}`} />
                    ))}
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">"{r.text}"</p>
                  <p className="text-xs font-semibold text-gray-500">— {r.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FAQ Section */}
      {faqs.length > 0 && (
        <div className="max-w-3xl mx-auto px-4 py-10 md:py-14">
          <h2 className="text-xl md:text-2xl font-bold text-center mb-6">Perguntas Frequentes</h2>
          <Accordion type="single" collapsible className="space-y-2">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border rounded-lg px-4">
                <AccordionTrigger className="text-sm font-medium hover:no-underline" style={{ color: btnColor }}>
                  {f.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-gray-600">{f.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
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

      {/* Bottom CTA */}
      <div className="bg-gray-50 py-10 text-center px-4">
        <button
          onClick={handleClick}
          className="text-white text-base font-semibold px-10 py-4 rounded-xl inline-flex items-center gap-2 transition-all hover:brightness-110 active:scale-[0.98]"
          style={{ backgroundColor: btnColor }}
        >
          {campaign.cta_text || 'Comprar Agora'}
          <ArrowRight className="ml-1 h-5 w-5" />
        </button>
        <p className="text-xs text-gray-400 mt-3">🔒 Pagamento 100% seguro</p>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-6 text-center">
        <p className="text-xs text-gray-400">© {new Date().getFullYear()} Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default MiniSite;
