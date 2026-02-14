-- Data da última alteração do username: troca permitida apenas 1 vez a cada 15 dias
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS username_changed_at timestamptz;

COMMENT ON COLUMN public.profiles.username_changed_at IS 'Última vez que o username foi alterado; troca permitida apenas a cada 15 dias.';
