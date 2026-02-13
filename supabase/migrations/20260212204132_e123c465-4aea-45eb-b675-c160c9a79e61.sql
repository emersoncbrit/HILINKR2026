
-- Table for captured leads
CREATE TABLE public.hub_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  hub_config_id UUID NOT NULL REFERENCES public.hub_configs(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL,
  name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL,
  whatsapp TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.hub_leads ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a lead (public store visitors)
CREATE POLICY "Anyone can insert leads" ON public.hub_leads
  FOR INSERT WITH CHECK (true);

-- Only the store owner can read their leads
CREATE POLICY "Owners can read own leads" ON public.hub_leads
  FOR SELECT USING (auth.uid() = owner_id);

-- Only the store owner can delete their leads
CREATE POLICY "Owners can delete own leads" ON public.hub_leads
  FOR DELETE USING (auth.uid() = owner_id);

-- Add popup configuration columns to hub_configs
ALTER TABLE public.hub_configs
  ADD COLUMN IF NOT EXISTS popup_enabled BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS popup_title TEXT DEFAULT 'Ofertas Exclusivas! 🔥',
  ADD COLUMN IF NOT EXISTS popup_description TEXT DEFAULT 'Cadastre-se e receba as melhores promoções diretamente no seu WhatsApp!',
  ADD COLUMN IF NOT EXISTS popup_button_text TEXT DEFAULT 'Quero receber ofertas!',
  ADD COLUMN IF NOT EXISTS popup_bg_color TEXT DEFAULT '#ffffff',
  ADD COLUMN IF NOT EXISTS popup_text_color TEXT DEFAULT '#1a1a1a',
  ADD COLUMN IF NOT EXISTS popup_button_color TEXT DEFAULT '#e05500',
  ADD COLUMN IF NOT EXISTS store_template TEXT DEFAULT 'default';

CREATE INDEX idx_hub_leads_owner ON public.hub_leads(owner_id);
CREATE INDEX idx_hub_leads_hub ON public.hub_leads(hub_config_id);
