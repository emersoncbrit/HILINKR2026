-- ============================================================
-- COPIAR TUDO DAQUI (Ctrl+A) e colar no Supabase > SQL Editor > Run
-- ============================================================

CREATE TABLE IF NOT EXISTS public.site_design_config (
  id text PRIMARY KEY DEFAULT 'default',
  logo_url text,
  favicon_url text,
  site_name text DEFAULT 'Hilinkr',
  primary_color text DEFAULT '#58c411',
  secondary_color text DEFAULT '#e8f5e0',
  accent_color text DEFAULT '#58c411',
  sidebar_primary_color text DEFAULT '#58c411',
  updated_at timestamptz DEFAULT now()
);

INSERT INTO public.site_design_config (id, site_name)
VALUES ('default', 'Hilinkr')
ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.site_design_config ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Site design is public read" ON public.site_design_config;
CREATE POLICY "Site design is public read"
  ON public.site_design_config FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can update site design" ON public.site_design_config;
CREATE POLICY "Authenticated users can update site design"
  ON public.site_design_config FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can insert site design" ON public.site_design_config;
CREATE POLICY "Authenticated users can insert site design"
  ON public.site_design_config FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- ============================================================
-- Fim. Depois de rodar, volte ao site e clique em "Salvar design".
-- ============================================================
