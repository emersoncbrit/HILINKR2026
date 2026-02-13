import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';

interface Product { id: string; name: string; }

export interface FAQItem { question: string; answer: string; }
export interface ReviewItem { name: string; text: string; rating: number; }

export interface CampaignFormData {
  name: string;
  product_id: string;
  campaign_type: string;
  campaign_goal: string;
  headline: string;
  subheadline: string;
  benefits: string;
  cta_text: string;
  urgency_text: string;
  social_proof_text: string;
  logo_url: string;
  image_url: string;
  description: string;
  button_color: string;
  installment_text: string;
  reviews: ReviewItem[];
  custom_faqs: FAQItem[];
  newsletter_enabled: boolean;
}

export const INITIAL_FORM: CampaignFormData = {
  name: '', product_id: '', campaign_type: 'organic', campaign_goal: 'click',
  headline: '', subheadline: '', benefits: '', cta_text: 'Comprar Agora', urgency_text: '', social_proof_text: '',
  logo_url: '', image_url: '', description: '', button_color: '#22c55e', installment_text: '',
  reviews: [], custom_faqs: [], newsletter_enabled: false,
};

interface CampaignFormProps {
  form: CampaignFormData;
  setForm: (form: CampaignFormData) => void;
  products: Product[];
  onSubmit: () => void;
  submitLabel: string;
}

export const CampaignForm = ({ form, setForm, products, onSubmit, submitLabel }: CampaignFormProps) => {
  const addReview = () => setForm({ ...form, reviews: [...form.reviews, { name: '', text: '', rating: 5 }] });
  const removeReview = (i: number) => setForm({ ...form, reviews: form.reviews.filter((_, idx) => idx !== i) });
  const updateReview = (i: number, field: keyof ReviewItem, value: string | number) => {
    const updated = [...form.reviews];
    updated[i] = { ...updated[i], [field]: value };
    setForm({ ...form, reviews: updated });
  };

  const addFaq = () => setForm({ ...form, custom_faqs: [...form.custom_faqs, { question: '', answer: '' }] });
  const removeFaq = (i: number) => setForm({ ...form, custom_faqs: form.custom_faqs.filter((_, idx) => idx !== i) });
  const updateFaq = (i: number, field: keyof FAQItem, value: string) => {
    const updated = [...form.custom_faqs];
    updated[i] = { ...updated[i], [field]: value };
    setForm({ ...form, custom_faqs: updated });
  };

  return (
    <div className="space-y-4">
      {/* Basic Info */}
      <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Informações Básicas</p>
      <div>
        <Label>Nome da Campanha *</Label>
        <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Promoção de verão" />
      </div>
      <div>
        <Label>Produto *</Label>
        <Select value={form.product_id} onValueChange={(v) => setForm({ ...form, product_id: v })}>
          <SelectTrigger><SelectValue placeholder="Selecionar produto" /></SelectTrigger>
          <SelectContent>
            {products.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Tipo</Label>
          <Select value={form.campaign_type} onValueChange={(v) => setForm({ ...form, campaign_type: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="organic">Orgânico</SelectItem>
              <SelectItem value="paid_ads">Anúncios Pagos</SelectItem>
              <SelectItem value="lead_capture">Captura de Leads</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Objetivo</Label>
          <Select value={form.campaign_goal} onValueChange={(v) => setForm({ ...form, campaign_goal: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="click">Clique</SelectItem>
              <SelectItem value="lead">Lead</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <hr className="border-border" />
      <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Aparência</p>

      <div>
        <Label>URL do Logo (opcional)</Label>
        <Input value={form.logo_url} onChange={(e) => setForm({ ...form, logo_url: e.target.value })} placeholder="https://exemplo.com/logo.png" />
      </div>
      <div>
        <Label>URL da Imagem do Produto (opcional)</Label>
        <Input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://exemplo.com/produto.png" />
      </div>
      <div>
        <Label>Cor do Botão</Label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={form.button_color}
            onChange={(e) => setForm({ ...form, button_color: e.target.value })}
            className="h-10 w-14 rounded border border-input cursor-pointer"
          />
          <Input value={form.button_color} onChange={(e) => setForm({ ...form, button_color: e.target.value })} className="flex-1" />
        </div>
      </div>

      <hr className="border-border" />
      <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Conteúdo da Página</p>

      <div>
        <Label>Título Principal</Label>
        <Input value={form.headline} onChange={(e) => setForm({ ...form, headline: e.target.value })} placeholder="Transforme sua saúde hoje" />
      </div>
      <div>
        <Label>Subtítulo</Label>
        <Input value={form.subheadline} onChange={(e) => setForm({ ...form, subheadline: e.target.value })} placeholder="Descubra a solução nº 1" />
      </div>
      <div>
        <Label>Texto de Parcelamento (ex: "12x de R$ 9,90")</Label>
        <Input value={form.installment_text} onChange={(e) => setForm({ ...form, installment_text: e.target.value })} placeholder="12x de R$ 9,90 no cartão" />
      </div>
      <div>
        <Label>Texto do Botão</Label>
        <Input value={form.cta_text} onChange={(e) => setForm({ ...form, cta_text: e.target.value })} />
      </div>
      <div>
        <Label>Texto de Urgência (opcional)</Label>
        <Input value={form.urgency_text} onChange={(e) => setForm({ ...form, urgency_text: e.target.value })} placeholder="Oferta por tempo limitado!" />
      </div>
      <div>
        <Label>Prova Social (opcional)</Label>
        <Input value={form.social_proof_text} onChange={(e) => setForm({ ...form, social_proof_text: e.target.value })} placeholder="Junte-se a mais de 10.000 clientes" />
      </div>
      <div>
        <Label>Benefícios (um por linha, máx 5)</Label>
        <Textarea value={form.benefits} onChange={(e) => setForm({ ...form, benefits: e.target.value })} placeholder={"✅ Benefício um\n✅ Benefício dois"} rows={4} />
      </div>
      <div>
        <Label>Descrição do Produto</Label>
        <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Descrição completa do produto..." rows={5} />
      </div>

      {/* Reviews */}
      <hr className="border-border" />
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Avaliações</p>
        <Button type="button" variant="ghost" size="sm" onClick={addReview}><Plus className="h-3.5 w-3.5 mr-1" />Adicionar</Button>
      </div>
      {form.reviews.map((r, i) => (
        <div key={i} className="space-y-2 p-3 border rounded-lg relative">
          <Button type="button" variant="ghost" size="icon" className="absolute top-1 right-1 h-7 w-7" onClick={() => removeReview(i)}>
            <Trash2 className="h-3.5 w-3.5 text-destructive" />
          </Button>
          <Input value={r.name} onChange={(e) => updateReview(i, 'name', e.target.value)} placeholder="Nome do cliente" />
          <Textarea value={r.text} onChange={(e) => updateReview(i, 'text', e.target.value)} placeholder="Depoimento..." rows={2} />
          <div className="flex items-center gap-2">
            <Label className="text-xs">Estrelas:</Label>
            <Select value={String(r.rating)} onValueChange={(v) => updateReview(i, 'rating', Number(v))}>
              <SelectTrigger className="w-20 h-8"><SelectValue /></SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5].map((n) => <SelectItem key={n} value={String(n)}>{n}⭐</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      ))}

      {/* Custom FAQs */}
      <hr className="border-border" />
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Perguntas Frequentes</p>
        <Button type="button" variant="ghost" size="sm" onClick={addFaq}><Plus className="h-3.5 w-3.5 mr-1" />Adicionar</Button>
      </div>
      {form.custom_faqs.map((f, i) => (
        <div key={i} className="space-y-2 p-3 border rounded-lg relative">
          <Button type="button" variant="ghost" size="icon" className="absolute top-1 right-1 h-7 w-7" onClick={() => removeFaq(i)}>
            <Trash2 className="h-3.5 w-3.5 text-destructive" />
          </Button>
          <Input value={f.question} onChange={(e) => updateFaq(i, 'question', e.target.value)} placeholder="Pergunta" />
          <Textarea value={f.answer} onChange={(e) => updateFaq(i, 'answer', e.target.value)} placeholder="Resposta" rows={2} />
        </div>
      ))}

      {/* Newsletter */}
      <hr className="border-border" />
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">Captura de E-mail (Newsletter)</p>
          <p className="text-xs text-muted-foreground">Exibe um campo de e-mail na página para capturar leads</p>
        </div>
        <Switch checked={form.newsletter_enabled} onCheckedChange={(v) => setForm({ ...form, newsletter_enabled: v })} />
      </div>

      <Button onClick={onSubmit} className="w-full mt-4">{submitLabel}</Button>
    </div>
  );
};
