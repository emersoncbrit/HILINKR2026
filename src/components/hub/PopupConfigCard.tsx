import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Mail, Eye } from 'lucide-react';
import { useState } from 'react';

interface PopupForm {
  popup_enabled: boolean;
  popup_title: string;
  popup_description: string;
  popup_button_text: string;
  popup_bg_color: string;
  popup_text_color: string;
  popup_button_color: string;
}

interface Props {
  form: PopupForm;
  onChange: (updates: Partial<PopupForm>) => void;
}

const PopupConfigCard = ({ form, onChange }: Props) => {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Mail className="h-5 w-5" /> Popup de Captura
          </CardTitle>
          <div className="flex items-center gap-2">
            <Label htmlFor="popup-switch" className="text-sm">Ativado</Label>
            <Switch
              id="popup-switch"
              checked={form.popup_enabled}
              onCheckedChange={(v) => onChange({ popup_enabled: v })}
            />
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Exiba um popup para capturar nome, email e WhatsApp dos visitantes da sua loja.
        </p>
      </CardHeader>

      {form.popup_enabled && (
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Título do popup</Label>
              <Input
                value={form.popup_title}
                onChange={(e) => onChange({ popup_title: e.target.value })}
                placeholder="Ofertas Exclusivas! 🔥"
              />
            </div>
            <div>
              <Label>Texto do botão</Label>
              <Input
                value={form.popup_button_text}
                onChange={(e) => onChange({ popup_button_text: e.target.value })}
                placeholder="Quero receber ofertas!"
              />
            </div>
          </div>
          <div>
            <Label>Descrição</Label>
            <Input
              value={form.popup_description}
              onChange={(e) => onChange({ popup_description: e.target.value })}
              placeholder="Cadastre-se e receba as melhores promoções..."
            />
          </div>

          <Separator />

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Cor de fundo</Label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="color"
                  value={form.popup_bg_color}
                  onChange={(e) => onChange({ popup_bg_color: e.target.value })}
                  className="h-9 w-9 rounded border border-border cursor-pointer"
                />
                <Input
                  value={form.popup_bg_color}
                  onChange={(e) => onChange({ popup_bg_color: e.target.value })}
                  className="font-mono text-sm"
                />
              </div>
            </div>
            <div>
              <Label>Cor do texto</Label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="color"
                  value={form.popup_text_color}
                  onChange={(e) => onChange({ popup_text_color: e.target.value })}
                  className="h-9 w-9 rounded border border-border cursor-pointer"
                />
                <Input
                  value={form.popup_text_color}
                  onChange={(e) => onChange({ popup_text_color: e.target.value })}
                  className="font-mono text-sm"
                />
              </div>
            </div>
            <div>
              <Label>Cor do botão</Label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="color"
                  value={form.popup_button_color}
                  onChange={(e) => onChange({ popup_button_color: e.target.value })}
                  className="h-9 w-9 rounded border border-border cursor-pointer"
                />
                <Input
                  value={form.popup_button_color}
                  onChange={(e) => onChange({ popup_button_color: e.target.value })}
                  className="font-mono text-sm"
                />
              </div>
            </div>
          </div>

          <Separator />

          <button
            onClick={() => setShowPreview(!showPreview)}
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            <Eye className="h-4 w-4" />
            {showPreview ? 'Ocultar' : 'Ver'} pré-visualização
          </button>

          {showPreview && (
            <div className="border rounded-xl p-6 flex items-center justify-center bg-black/5">
              <div
                className="rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center"
                style={{ backgroundColor: form.popup_bg_color, color: form.popup_text_color }}
              >
                <h3 className="text-xl font-bold mb-2">{form.popup_title}</h3>
                <p className="text-sm opacity-80 mb-5">{form.popup_description}</p>
                <div className="space-y-2 mb-4">
                  <div className="rounded-lg border px-3 py-2 text-sm opacity-50 text-left">Nome</div>
                  <div className="rounded-lg border px-3 py-2 text-sm opacity-50 text-left">Email</div>
                  <div className="rounded-lg border px-3 py-2 text-sm opacity-50 text-left">WhatsApp (opcional)</div>
                </div>
                <div
                  className="rounded-lg py-3 px-6 font-bold text-sm text-white cursor-default"
                  style={{ backgroundColor: form.popup_button_color }}
                >
                  {form.popup_button_text}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};

export default PopupConfigCard;
