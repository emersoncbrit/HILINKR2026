import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Layout, Check } from 'lucide-react';

export interface TemplatePreset {
  id: string;
  name: string;
  description: string;
  preview: string;
  colors: {
    bg: string;
    card: string;
    accent: string;
  };
  preset: {
    primary_color: string;
    secondary_color: string;
    header_color: string;
    header_text_color: string;
    popup_bg_color: string;
    popup_text_color: string;
    popup_button_color: string;
  };
}

const TEMPLATES: TemplatePreset[] = [
  {
    id: 'default',
    name: 'Padrão',
    description: 'Layout clássico com grid de produtos',
    preview: '🏪',
    colors: { bg: '#f9fafb', card: '#ffffff', accent: '#e05500' },
    preset: {
      primary_color: '#e05500',
      secondary_color: '#1a4baf',
      header_color: '#1a4baf',
      header_text_color: '#ffffff',
      popup_bg_color: '#ffffff',
      popup_text_color: '#1a1a1a',
      popup_button_color: '#e05500',
    },
  },
  {
    id: 'minimal',
    name: 'Minimalista',
    description: 'Clean, foco total nos produtos',
    preview: '✨',
    colors: { bg: '#ffffff', card: '#fafafa', accent: '#111111' },
    preset: {
      primary_color: '#111111',
      secondary_color: '#555555',
      header_color: '#ffffff',
      header_text_color: '#111111',
      popup_bg_color: '#ffffff',
      popup_text_color: '#111111',
      popup_button_color: '#111111',
    },
  },
  {
    id: 'bold',
    name: 'Bold',
    description: 'Cores vibrantes, cards grandes',
    preview: '🔥',
    colors: { bg: '#0f0f0f', card: '#1a1a1a', accent: '#ff4500' },
    preset: {
      primary_color: '#ff4500',
      secondary_color: '#ff6a33',
      header_color: '#0f0f0f',
      header_text_color: '#ffffff',
      popup_bg_color: '#1a1a1a',
      popup_text_color: '#ffffff',
      popup_button_color: '#ff4500',
    },
  },
  {
    id: 'elegant',
    name: 'Elegante',
    description: 'Sofisticado com tipografia refinada',
    preview: '💎',
    colors: { bg: '#faf8f5', card: '#ffffff', accent: '#8b6914' },
    preset: {
      primary_color: '#8b6914',
      secondary_color: '#5c4a1e',
      header_color: '#1c1510',
      header_text_color: '#d4b96a',
      popup_bg_color: '#1c1510',
      popup_text_color: '#f5f0e8',
      popup_button_color: '#8b6914',
    },
  },
  {
    id: 'neon',
    name: 'Neon',
    description: 'Estilo dark com destaques neon',
    preview: '⚡',
    colors: { bg: '#0a0a0a', card: '#141414', accent: '#00ff88' },
    preset: {
      primary_color: '#00ff88',
      secondary_color: '#00cc6a',
      header_color: '#0a0a0a',
      header_text_color: '#00ff88',
      popup_bg_color: '#141414',
      popup_text_color: '#e0ffe0',
      popup_button_color: '#00ff88',
    },
  },
];

interface Props {
  value: string;
  onChange: (template: string, preset: TemplatePreset['preset']) => void;
}

const StoreTemplateSelector = ({ value, onChange }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Layout className="h-5 w-5" /> Template da Loja
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Ao escolher um template, as cores e estilo da loja e popup serão atualizados automaticamente
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => onChange(t.id, t.preset)}
              className={`relative rounded-xl border-2 p-3 text-left transition-all hover:scale-[1.02] ${
                value === t.id
                  ? 'border-primary ring-2 ring-primary/20'
                  : 'border-border hover:border-primary/40'
              }`}
            >
              {value === t.id && (
                <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-0.5">
                  <Check className="h-3 w-3" />
                </div>
              )}
              <div
                className="w-full aspect-[3/4] rounded-lg mb-2 flex items-center justify-center text-3xl overflow-hidden"
                style={{ background: t.colors.bg, border: `1px solid ${t.colors.accent}30` }}
              >
                <div className="flex flex-col items-center gap-1">
                  <span>{t.preview}</span>
                  <div className="flex gap-1 mt-1">
                    {Object.values(t.preset).slice(0, 4).map((c, i) => (
                      <div key={i} className="w-3 h-3 rounded-full" style={{ background: c, border: '1px solid rgba(128,128,128,0.3)' }} />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-sm font-semibold">{t.name}</p>
              <p className="text-xs text-muted-foreground leading-tight">{t.description}</p>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export { TEMPLATES };
export default StoreTemplateSelector;
