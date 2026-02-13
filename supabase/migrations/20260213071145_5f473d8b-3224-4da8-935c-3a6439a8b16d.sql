
-- Allow admins to read all profiles
CREATE POLICY "Admins can read all profiles"
  ON public.profiles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to read all products
CREATE POLICY "Admins can read all products"
  ON public.products FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to read all campaigns
CREATE POLICY "Admins can read all campaigns"
  ON public.campaigns FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to read all hub_configs
CREATE POLICY "Admins can read all hub configs"
  ON public.hub_configs FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to read all hub_leads
CREATE POLICY "Admins can read all leads"
  ON public.hub_leads FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to read all link_bio_configs
CREATE POLICY "Admins can read all link bios"
  ON public.link_bio_configs FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to read all story_templates
CREATE POLICY "Admins can read all templates"
  ON public.story_templates FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));
