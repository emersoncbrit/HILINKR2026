-- Tabela única de configuração de design do site (white-label)
-- Uma única linha; atualizar sempre o id = 'default'

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

-- Garantir que existe uma linha
INSERT INTO public.site_design_config (id, site_name)
VALUES ('default', 'Hilinkr')
ON CONFLICT (id) DO NOTHING;

-- Política: leitura pública (qualquer um pode ver o design)
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

-- Bucket para assets do site (logo, favicon) - executar no Supabase Dashboard > Storage se necessário
-- Criar bucket 'site-assets' público para leitura

COMMENT ON TABLE public.site_design_config IS 'Configuração global de design/white-label do site (logo, cores, nome).';
