
-- Add new columns to hierarquia
ALTER TABLE public.hierarquia ADD COLUMN IF NOT EXISTS rg text;
ALTER TABLE public.hierarquia ADD COLUMN IF NOT EXISTS discord_id text;
ALTER TABLE public.hierarquia ADD COLUMN IF NOT EXISTS data_entrada date;

-- Add image column to cargos (for rank insignia)
ALTER TABLE public.cargos ADD COLUMN IF NOT EXISTS imagem_url text;

-- Create storage bucket for rank images
INSERT INTO storage.buckets (id, name, public) VALUES ('patentes', 'patentes', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for patentes bucket
CREATE POLICY "Public can view patentes" ON storage.objects FOR SELECT USING (bucket_id = 'patentes');
CREATE POLICY "Admin can upload patentes" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'patentes' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin can update patentes" ON storage.objects FOR UPDATE USING (bucket_id = 'patentes' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin can delete patentes" ON storage.objects FOR DELETE USING (bucket_id = 'patentes' AND public.has_role(auth.uid(), 'admin'));
