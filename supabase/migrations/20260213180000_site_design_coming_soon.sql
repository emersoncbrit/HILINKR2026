-- Ativar modo "Em breve": quando true, todo o site redireciona para a página Em breve (exceto /admin)
ALTER TABLE public.site_design_config
  ADD COLUMN IF NOT EXISTS coming_soon_enabled boolean DEFAULT false;

COMMENT ON COLUMN public.site_design_config.coming_soon_enabled IS 'Quando true, visitantes veem apenas a página "Em breve" até o lançamento; /admin continua acessível.';
