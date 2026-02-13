
-- Allow public read access to active products (for public store pages)
CREATE POLICY "Public can read active products"
ON public.products FOR SELECT
USING (status = 'active');
