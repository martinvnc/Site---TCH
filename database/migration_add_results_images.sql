-- Add image_url column to homepage_results
ALTER TABLE public.homepage_results 
ADD COLUMN IF NOT EXISTS image_url TEXT;
