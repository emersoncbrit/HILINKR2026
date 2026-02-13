
-- 1. Create role enum and user_roles table
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS: users can read their own roles, admins can read all
CREATE POLICY "Users can read own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

-- Assign admin role to the specified user
INSERT INTO public.user_roles (user_id, role)
VALUES ('63ea7902-1b34-4df5-93e5-8af649246a3b', 'admin');

-- 2. Admin-managed platforms table
CREATE TABLE public.admin_platforms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_platforms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read platforms"
  ON public.admin_platforms FOR SELECT USING (true);

CREATE POLICY "Admins can manage platforms"
  ON public.admin_platforms FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 3. Admin-managed categories table
CREATE TABLE public.admin_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read categories"
  ON public.admin_categories FOR SELECT USING (true);

CREATE POLICY "Admins can manage categories"
  ON public.admin_categories FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 4. Admin-managed tutorials table
CREATE TABLE public.admin_tutorials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  duration text,
  icon text DEFAULT 'BookOpen',
  video_url text,
  sort_order int DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_tutorials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read tutorials"
  ON public.admin_tutorials FOR SELECT USING (true);

CREATE POLICY "Admins can manage tutorials"
  ON public.admin_tutorials FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 5. Admin-managed "venda mais" products
CREATE TABLE public.admin_venda_mais (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  image_url text,
  checkout_url text,
  sort_order int DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_venda_mais ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read venda mais"
  ON public.admin_venda_mais FOR SELECT USING (true);

CREATE POLICY "Admins can manage venda mais"
  ON public.admin_venda_mais FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 6. Admin-managed affiliate plans
CREATE TABLE public.admin_affiliate_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  commission text NOT NULL,
  description text,
  affiliate_link text,
  sort_order int DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_affiliate_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read affiliate plans"
  ON public.admin_affiliate_plans FOR SELECT USING (true);

CREATE POLICY "Admins can manage affiliate plans"
  ON public.admin_affiliate_plans FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
