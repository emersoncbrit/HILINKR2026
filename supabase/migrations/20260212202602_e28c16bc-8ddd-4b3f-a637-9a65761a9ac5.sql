
CREATE TABLE public.story_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL DEFAULT 'Meu Template',
  bg_color TEXT NOT NULL DEFAULT '#FF6B35',
  card_border_color TEXT DEFAULT NULL,
  price_bg_color TEXT NOT NULL DEFAULT '#FF0000',
  title_text TEXT DEFAULT 'PROMO',
  disclaimer_text TEXT DEFAULT '*Promoção sujeita a alteração a qualquer momento',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.story_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own story templates"
ON public.story_templates FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own story templates"
ON public.story_templates FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own story templates"
ON public.story_templates FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own story templates"
ON public.story_templates FOR DELETE USING (auth.uid() = user_id);
