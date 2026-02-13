
-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT,
  hub_slug TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  affiliate_link TEXT NOT NULL,
  platform TEXT DEFAULT '',
  category TEXT DEFAULT '',
  price NUMERIC DEFAULT 0,
  commission_estimate NUMERIC DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'archived')),
  last_activated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own products" ON public.products FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Campaigns table
CREATE TABLE public.campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  campaign_type TEXT NOT NULL DEFAULT 'organic' CHECK (campaign_type IN ('organic', 'paid_ads', 'lead_capture')),
  campaign_goal TEXT NOT NULL DEFAULT 'click' CHECK (campaign_goal IN ('click', 'lead')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  headline TEXT DEFAULT '',
  subheadline TEXT DEFAULT '',
  benefits TEXT[] DEFAULT '{}',
  cta_text TEXT DEFAULT 'Get Started',
  urgency_text TEXT DEFAULT '',
  social_proof_text TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own campaigns" ON public.campaigns FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Public can read campaigns by slug" ON public.campaigns FOR SELECT USING (true);

CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON public.campaigns
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Clicks table
CREATE TABLE public.clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  clicked_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.clicks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert clicks" ON public.clicks FOR INSERT WITH CHECK (true);
CREATE POLICY "Owners can read own clicks" ON public.clicks FOR SELECT USING (auth.uid() = owner_id);

-- Manual sales table
CREATE TABLE public.manual_sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  sale_value NUMERIC NOT NULL DEFAULT 0,
  sale_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.manual_sales ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own sales" ON public.manual_sales FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Hub config table
CREATE TABLE public.hub_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  featured_product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  selected_product_ids UUID[] DEFAULT '{}',
  order_mode TEXT NOT NULL DEFAULT 'manual' CHECK (order_mode IN ('manual', 'most_clicked')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.hub_configs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own hub" ON public.hub_configs FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Public can read hub by slug" ON public.hub_configs FOR SELECT USING (true);

CREATE TRIGGER update_hub_configs_updated_at BEFORE UPDATE ON public.hub_configs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes
CREATE INDEX idx_products_user_id ON public.products(user_id);
CREATE INDEX idx_products_status ON public.products(status);
CREATE INDEX idx_campaigns_user_id ON public.campaigns(user_id);
CREATE INDEX idx_campaigns_slug ON public.campaigns(slug);
CREATE INDEX idx_clicks_campaign_id ON public.clicks(campaign_id);
CREATE INDEX idx_clicks_owner_id ON public.clicks(owner_id);
CREATE INDEX idx_clicks_clicked_at ON public.clicks(clicked_at);
CREATE INDEX idx_manual_sales_user_id ON public.manual_sales(user_id);
CREATE INDEX idx_hub_configs_slug ON public.hub_configs(slug);
