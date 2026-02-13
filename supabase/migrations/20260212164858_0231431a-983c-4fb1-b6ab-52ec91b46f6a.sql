
-- Add image_url and original_link columns to products
ALTER TABLE public.products 
ADD COLUMN image_url text DEFAULT NULL,
ADD COLUMN original_link text DEFAULT NULL;
