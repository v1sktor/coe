
DROP POLICY IF EXISTS "Admin can upload patentes" ON storage.objects;
DROP POLICY IF EXISTS "Admin can update patentes" ON storage.objects;
DROP POLICY IF EXISTS "Admin can delete patentes" ON storage.objects;

CREATE POLICY "Admin can upload patentes" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'patentes' AND public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admin can update patentes" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'patentes' AND public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (bucket_id = 'patentes' AND public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admin can delete patentes" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'patentes' AND public.has_role(auth.uid(), 'admin'::app_role));

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.has_permission_or_admin(uuid, text) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_permission_or_admin(uuid, text) TO authenticated;
