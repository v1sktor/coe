CREATE POLICY "rso_anexos_insert_publico" ON storage.objects
FOR INSERT TO anon, authenticated
WITH CHECK (bucket_id = 'rso-anexos' AND (storage.foldername(name))[1] = 'envios');