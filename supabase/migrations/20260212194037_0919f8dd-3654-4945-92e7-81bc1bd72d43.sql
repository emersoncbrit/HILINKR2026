
-- Create link_bio_configs table for Link na Bio feature
CREATE TABLE public.link_bio_configs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT DEFAULT '',
  bio TEXT DEFAULT '',
  avatar_url TEXT,
  template TEXT DEFAULT 'minimal',
  theme_colors JSONB DEFAULT '{"primary": "#F59E0B", "background": "#0F172A", "text": "#FFFFFF", "cardBg": "#1E293B"}'::jsonb,
  links JSONB DEFAULT '[]'::jsonb,
  social_links JSONB DEFAULT '{}'::jsonb,
  slug TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT link_bio_configs_slug_key UNIQUE (slug)
);

-- Enable RLS
ALTER TABLE public.link_bio_configs ENABLE ROW LEVEL SECURITY;

-- Owner can manage their own config
CREATE POLICY "Users manage own link bio"
ON public.link_bio_configs
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Public can read by slug (for the public page)
CREATE POLICY "Public can read link bio by slug"
ON public.link_bio_configs
FOR SELECT
USING (true);

-- Timestamp trigger
CREATE TRIGGER update_link_bio_configs_updated_at
BEFORE UPDATE ON public.link_bio_configs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket for avatars
INSERT INTO storage.buckets (id, name, public) VALUES ('link-bio-avatars', 'link-bio-avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for avatar uploads
CREATE POLICY "Avatar images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'link-bio-avatars');

CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'link-bio-avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
USING (bucket_id = 'link-bio-avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
USING (bucket_id = 'link-bio-avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
