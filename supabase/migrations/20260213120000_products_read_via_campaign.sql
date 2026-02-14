-- Allow public to read product when it is linked by an active campaign (so mini-site CTA works)
CREATE POLICY "Public can read products in active campaigns"
  ON public.products FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.campaigns c
      WHERE c.product_id = products.id AND c.status = 'active'
    )
  );
