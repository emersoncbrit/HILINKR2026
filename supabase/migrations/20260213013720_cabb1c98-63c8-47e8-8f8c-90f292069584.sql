
ALTER TABLE public.campaigns
  ADD COLUMN logo_url text,
  ADD COLUMN description text DEFAULT '',
  ADD COLUMN button_color text DEFAULT '#22c55e',
  ADD COLUMN installment_text text DEFAULT '',
  ADD COLUMN reviews jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN custom_faqs jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN newsletter_enabled boolean DEFAULT false;
