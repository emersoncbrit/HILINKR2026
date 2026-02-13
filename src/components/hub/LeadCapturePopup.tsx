import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { X } from 'lucide-react';

interface PopupConfig {
  popup_title: string;
  popup_description: string;
  popup_button_text: string;
  popup_bg_color: string;
  popup_text_color: string;
  popup_button_color: string;
}

interface Props {
  config: PopupConfig;
  hubConfigId: string;
  ownerId: string;
  onClose: () => void;
}

const LeadCapturePopup = ({ config, hubConfigId, ownerId, onClose }: Props) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitting(true);
    try {
      await supabase.from('hub_leads').insert({
        hub_config_id: hubConfigId,
        owner_id: ownerId,
        name: name.trim(),
        email: email.trim(),
        whatsapp: whatsapp.trim() || null,
      });
      setDone(true);
      // Mark as captured in session storage
      sessionStorage.setItem(`lead_captured_${hubConfigId}`, '1');
    } catch {
      // silent fail
    }
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="relative rounded-2xl shadow-2xl p-8 max-w-md w-full animate-in fade-in zoom-in-95 duration-300"
        style={{ backgroundColor: config.popup_bg_color, color: config.popup_text_color }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-black/10 transition-colors"
          style={{ color: config.popup_text_color }}
        >
          <X className="h-5 w-5" />
        </button>

        {done ? (
          <div className="text-center py-4">
            <p className="text-4xl mb-3">🎉</p>
            <h3 className="text-xl font-bold mb-1">Cadastro realizado!</h3>
            <p className="text-sm opacity-70">Você receberá nossas melhores ofertas.</p>
          </div>
        ) : (
          <>
            <h3 className="text-xl font-bold mb-2 text-center">{config.popup_title}</h3>
            <p className="text-sm opacity-80 mb-5 text-center">{config.popup_description}</p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome"
                className="w-full rounded-lg border px-4 py-3 text-sm outline-none focus:ring-2"
                style={{
                  borderColor: `${config.popup_text_color}20`,
                  backgroundColor: `${config.popup_text_color}08`,
                  color: config.popup_text_color,
                }}
              />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Seu email *"
                type="email"
                required
                className="w-full rounded-lg border px-4 py-3 text-sm outline-none focus:ring-2"
                style={{
                  borderColor: `${config.popup_text_color}20`,
                  backgroundColor: `${config.popup_text_color}08`,
                  color: config.popup_text_color,
                }}
              />
              <input
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="WhatsApp (opcional)"
                className="w-full rounded-lg border px-4 py-3 text-sm outline-none focus:ring-2"
                style={{
                  borderColor: `${config.popup_text_color}20`,
                  backgroundColor: `${config.popup_text_color}08`,
                  color: config.popup_text_color,
                }}
              />
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-lg py-3 px-6 font-bold text-sm text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                style={{ backgroundColor: config.popup_button_color }}
              >
                {submitting ? 'Enviando...' : config.popup_button_text}
              </button>
            </form>
            <p className="text-[10px] text-center mt-3 opacity-40">
              Seus dados estão protegidos e não serão compartilhados.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default LeadCapturePopup;
