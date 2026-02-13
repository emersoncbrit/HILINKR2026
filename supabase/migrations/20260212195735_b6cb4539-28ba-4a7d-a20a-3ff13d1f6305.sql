
-- Add store configuration fields to hub_configs
ALTER TABLE public.hub_configs
ADD COLUMN IF NOT EXISTS store_name TEXT,
ADD COLUMN IF NOT EXISTS store_description TEXT,
ADD COLUMN IF NOT EXISTS logo_url TEXT,
ADD COLUMN IF NOT EXISTS favicon_url TEXT,
ADD COLUMN IF NOT EXISTS primary_color TEXT DEFAULT '#e05500',
ADD COLUMN IF NOT EXISTS secondary_color TEXT DEFAULT '#1a4baf',
ADD COLUMN IF NOT EXISTS header_color TEXT DEFAULT '#1a4baf',
ADD COLUMN IF NOT EXISTS header_text_color TEXT DEFAULT '#ffffff',
ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{}';

-- Create storage bucket for store logos if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('store-assets', 'store-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for store assets
CREATE POLICY "Store assets are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'store-assets');

CREATE POLICY "Users can upload store assets"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'store-assets' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their store assets"
ON storage.objects FOR UPDATE
USING (bucket_id = 'store-assets' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their store assets"
ON storage.objects FOR DELETE
USING (bucket_id = 'store-assets' AND auth.uid()::text = (storage.foldername(name))[1]);
