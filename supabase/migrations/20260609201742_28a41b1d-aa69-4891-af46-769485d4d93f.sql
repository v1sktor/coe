
CREATE POLICY "documentos_select_all" ON storage.objects FOR SELECT
  USING (bucket_id = 'documentos');
CREATE POLICY "documentos_insert_auth" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'documentos');
CREATE POLICY "documentos_update_auth" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'documentos');
CREATE POLICY "documentos_delete_auth" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'documentos');
