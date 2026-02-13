-- Add banners column to hub_configs (array of banner image URLs)
ALTER TABLE public.hub_configs ADD COLUMN IF NOT EXISTS banners text[] DEFAULT '{}'::text[];
