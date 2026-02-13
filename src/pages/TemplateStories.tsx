import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Download, Save, Trash2, Plus } from 'lucide-react';
import { toPng } from 'html-to-image';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';

interface StoryTemplate {
  id?: string;
  name: string;
  bg_color: string;
  card_border_color: string | null;
  price_bg_color: string;
  title_text: string;
  disclaimer_text: string;
}

const DEFAULT_TEMPLATES: StoryTemplate[] = [
  { name: 'Laranja', bg_color: '#FF6B35', card_border_color: null, price_bg_color: '#E53E3E', title_text: 'PROMO', disclaimer_text: '*Promoção sujeita a alteração a qualquer momento' },
  { name: 'Verde Neon', bg_color: '#AAFF00', card_border_color: null, price_bg_color: '#000000', title_text: 'PROMO', disclaimer_text: '*Promoção sujeita a alteração a qualquer momento' },
  { name: 'Azul', bg_color: '#1E90FF', card_border_color: '#1E90FF', price_bg_color: '#E53E3E', title_text: 'OFERTA', disclaimer_text: '*Promoção sujeita a alteração a qualquer momento' },
  { name: 'Rosa', bg_color: '#FF69B4', card_border_color: '#FF1493', price_bg_color: '#FF1493', title_text: 'PROMO', disclaimer_text: '*Promoção sujeita a alteração a qualquer momento' },
  { name: 'Dark Navy', bg_color: '#1B2A4A', card_border_color: null, price_bg_color: '#FF8C00', title_text: 'PROMO', disclaimer_text: '*Promoção sujeita a alteração a qualquer momento' },
  { name: 'Pink Pastel', bg_color: '#FFB6C1', card_border_color: '#FF69B4', price_bg_color: '#FF69B4', title_text: 'PROMO', disclaimer_text: '*Promoção sujeita a alteração a qualquer momento' },
];

const TemplateStories = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const storyRef = useRef<HTMLDivElement>(null);

  const [productName, setProductName] = useState('Nome do Produto');
  const [priceFrom, setPriceFrom] = useState('');
  const [priceTo, setPriceTo] = useState('');
  const [bgColor, setBgColor] = useState('#FF6B35');
  const [cardBorderColor, setCardBorderColor] = useState('');
  const [priceBgColor, setPriceBgColor] = useState('#E53E3E');
  const [titleText, setTitleText] = useState('PROMO');
  const [disclaimerText, setDisclaimerText] = useState('*Promoção sujeita a alteração a qualquer momento');

  const [savedTemplates, setSavedTemplates] = useState<StoryTemplate[]>([]);
  const [templateName, setTemplateName] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('story_templates')
      .select('*')
      .eq('user_id', user.id)
      .then(({ data }) => {
        if (data) {
          setSavedTemplates(data.map(d => ({
            id: d.id,
            name: d.name,
            bg_color: d.bg_color,
            card_border_color: d.card_border_color,
            price_bg_color: d.price_bg_color,
            title_text: d.title_text || 'PROMO',
            disclaimer_text: d.disclaimer_text || '',
          })));
        }
      });
  }, [user]);

  const applyTemplate = (t: StoryTemplate) => {
    setBgColor(t.bg_color);
    setCardBorderColor(t.card_border_color || '');
    setPriceBgColor(t.price_bg_color);
    setTitleText(t.title_text);
    setDisclaimerText(t.disclaimer_text);
  };

  const handleSaveTemplate = async () => {
    if (!user || !templateName.trim()) {
      toast({ title: 'Digite um nome para o template', variant: 'destructive' });
      return;
    }
    setSaving(true);
    const payload = {
      user_id: user.id,
      name: templateName,
      bg_color: bgColor,
      card_border_color: cardBorderColor || null,
      price_bg_color: priceBgColor,
      title_text: titleText,
      disclaimer_text: disclaimerText,
    };
    const { data, error } = await supabase.from('story_templates').insert(payload).select().single();
    if (error) {
      toast({ title: 'Erro ao salvar', description: error.message, variant: 'destructive' });
    } else if (data) {
      setSavedTemplates(prev => [...prev, { ...payload, id: data.id }]);
      setTemplateName('');
      toast({ title: 'Template salvo!' });
    }
    setSaving(false);
  };

  const handleDeleteTemplate = async (id: string) => {
    await supabase.from('story_templates').delete().eq('id', id);
    setSavedTemplates(prev => prev.filter(t => t.id !== id));
    toast({ title: 'Template removido' });
  };

  const handleDownload = async () => {
    if (!storyRef.current) return;
    try {
      const dataUrl = await toPng(storyRef.current, { pixelRatio: 3, quality: 1 });
      const link = document.createElement('a');
      link.download = `story-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      toast({ title: 'Imagem baixada!' });
    } catch {
      toast({ title: 'Erro ao gerar imagem', variant: 'destructive' });
    }
  };

  const isLight = (hex: string) => {
    const c = hex.replace('#', '');
    const r = parseInt(c.substring(0, 2), 16);
    const g = parseInt(c.substring(2, 4), 16);
    const b = parseInt(c.substring(4, 6), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 > 150;
  };

  const textColor = isLight(bgColor) ? '#000000' : '#FFFFFF';
  const priceTextColor = isLight(priceBgColor) ? '#000000' : '#FFFFFF';

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold">Template de Stories</h1>
        <p className="text-sm text-muted-foreground">Crie artes para stories e baixe como imagem</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Editor */}
        <div className="lg:col-span-2 space-y-6">
          {/* Templates Prontos */}
          <Card className="glass-card">
            <CardContent className="p-6 space-y-4">
              <h2 className="font-semibold">Modelos Prontos</h2>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {DEFAULT_TEMPLATES.map((t, i) => (
                  <button
                    key={i}
                    onClick={() => applyTemplate(t)}
                    className="rounded-lg border-2 border-border hover:border-primary/50 transition-all overflow-hidden"
                  >
                    <div className="aspect-[9/16] flex flex-col items-center justify-between p-2" style={{ background: t.bg_color }}>
                      <span className="text-[8px] font-black" style={{ color: isLight(t.bg_color) ? '#000' : '#fff' }}>{t.title_text}</span>
                      <div className="w-[85%] aspect-square rounded bg-white" />
                      <div className="w-full rounded-sm py-0.5" style={{ background: t.price_bg_color }}>
                        <span className="text-[6px] font-bold block text-center" style={{ color: isLight(t.price_bg_color) ? '#000' : '#fff' }}>R$</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-center py-1 text-muted-foreground">{t.name}</p>
                  </button>
                ))}
              </div>

              {/* Saved templates */}
              {savedTemplates.length > 0 && (
                <>
                  <h3 className="font-medium text-sm mt-2">Meus Templates</h3>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                    {savedTemplates.map((t) => (
                      <div key={t.id} className="relative group">
                        <button
                          onClick={() => applyTemplate(t)}
                          className="w-full rounded-lg border-2 border-border hover:border-primary/50 transition-all overflow-hidden"
                        >
                          <div className="aspect-[9/16] flex flex-col items-center justify-between p-2" style={{ background: t.bg_color }}>
                            <span className="text-[8px] font-black" style={{ color: isLight(t.bg_color) ? '#000' : '#fff' }}>{t.title_text}</span>
                            <div className="w-[85%] aspect-square rounded bg-white" />
                            <div className="w-full rounded-sm py-0.5" style={{ background: t.price_bg_color }}>
                              <span className="text-[6px] font-bold block text-center" style={{ color: isLight(t.price_bg_color) ? '#000' : '#fff' }}>R$</span>
                            </div>
                          </div>
                          <p className="text-[10px] text-center py-1 text-muted-foreground truncate px-1">{t.name}</p>
                        </button>
                        <button
                          onClick={() => t.id && handleDeleteTemplate(t.id)}
                          className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Configurações */}
          <Card className="glass-card">
            <CardContent className="p-6 space-y-4">
              <h2 className="font-semibold">Configurações</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Nome do produto</Label>
                  <Input value={productName} onChange={e => setProductName(e.target.value)} />
                </div>
                <div>
                  <Label>Texto do topo</Label>
                  <Input value={titleText} onChange={e => setTitleText(e.target.value)} placeholder="PROMO" />
                </div>
                <div>
                  <Label>Preço de</Label>
                  <Input value={priceFrom} onChange={e => setPriceFrom(e.target.value)} placeholder="R$ 199,90" />
                </div>
                <div>
                  <Label>Preço por</Label>
                  <Input value={priceTo} onChange={e => setPriceTo(e.target.value)} placeholder="R$ 99,90" />
                </div>
                <div>
                  <Label>Texto de rodapé</Label>
                  <Input value={disclaimerText} onChange={e => setDisclaimerText(e.target.value)} />
                </div>
              </div>

              <h3 className="font-medium text-sm mt-2">Cores</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Fundo', value: bgColor, set: setBgColor },
                  { label: 'Borda do card', value: cardBorderColor || bgColor, set: setCardBorderColor },
                  { label: 'Fundo do preço', value: priceBgColor, set: setPriceBgColor },
                ].map(({ label, value, set }) => (
                  <div key={label} className="flex items-center gap-2">
                    <input type="color" value={value} onChange={e => set(e.target.value)} className="h-8 w-8 rounded cursor-pointer border-0" />
                    <span className="text-xs text-muted-foreground">{label}</span>
                  </div>
                ))}
              </div>

              {/* Save template */}
              {user && (
                <div className="flex gap-2 items-end mt-4">
                  <div className="flex-1">
                    <Label>Salvar como template</Label>
                    <Input value={templateName} onChange={e => setTemplateName(e.target.value)} placeholder="Nome do template" />
                  </div>
                  <Button onClick={handleSaveTemplate} disabled={saving} size="sm">
                    <Save className="h-4 w-4 mr-1" />{saving ? 'Salvando...' : 'Salvar'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Preview */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Pré-visualização</h3>
            <Button size="sm" variant="outline" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-1" />Baixar
            </Button>
          </div>

          <div className="border border-border rounded-xl overflow-hidden shadow-lg">
            <div
              ref={storyRef}
              className="relative flex flex-col items-center"
              style={{
                background: bgColor,
                aspectRatio: '9/16',
                width: '100%',
              }}
            >
              {/* Title text at top - absolute so it doesn't affect card position */}
              {titleText && (
                <div className="absolute top-0 left-0 right-0 pt-4 pb-2 text-center z-10">
                  <h2
                    className="text-4xl font-black tracking-tight"
                    style={{
                      color: textColor,
                      textShadow: isLight(bgColor) ? 'none' : '2px 2px 0 rgba(0,0,0,0.2)',
                      opacity: 0.9,
                    }}
                  >
                    {titleText}
                  </h2>
                </div>
              )}

              {/* Product image white card - fixed position & size */}
              <div
                className="absolute rounded-2xl bg-white flex items-center justify-center"
                style={{
                  top: '12%',
                  left: '16px',
                  right: '16px',
                  bottom: '30%',
                  border: cardBorderColor ? `3px solid ${cardBorderColor}` : 'none',
                }}
              >
                <p className="text-sm text-gray-300 select-none">Imagem do produto</p>
              </div>

              {/* Bottom section - fixed at bottom */}
              <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center px-4 pb-3">
                {/* Product name */}
                <p className="text-xs font-bold text-center mb-1" style={{ color: textColor }}>
                  {productName}
                </p>

                {/* Price from - only show if not empty */}
                {priceFrom && priceFrom.trim() !== '' && priceFrom !== '0' && priceFrom !== 'R$ 0' && priceFrom !== 'R$ 0,00' && (
                  <p className="text-center text-xs line-through opacity-60 mb-0.5" style={{ color: textColor }}>
                    De {priceFrom}
                  </p>
                )}

                {/* Price to - only show if not empty */}
                {priceTo && priceTo.trim() !== '' && priceTo !== '0' && priceTo !== 'R$ 0' && priceTo !== 'R$ 0,00' && (
                  <div className="mx-auto rounded-lg py-2 px-6 mb-2" style={{ background: priceBgColor, maxWidth: '80%' }}>
                    <p className="text-center text-lg font-black" style={{ color: priceTextColor }}>
                      {priceTo}
                    </p>
                  </div>
                )}

                {/* Disclaimer */}
                {disclaimerText && (
                  <p className="text-[8px] text-center opacity-50" style={{ color: textColor }}>
                    {disclaimerText}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateStories;
