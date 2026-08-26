
-- 1) Hierarquia: apenas autenticados
DROP POLICY IF EXISTS "Hierarquia visível por todos" ON public.hierarquia;
CREATE POLICY "Hierarquia visivel por autenticados"
ON public.hierarquia FOR SELECT TO authenticated USING (true);
REVOKE SELECT ON public.hierarquia FROM anon;

-- 2) Profiles: próprio perfil ou gestores
DROP POLICY IF EXISTS "Perfis visíveis por autenticados" ON public.profiles;
CREATE POLICY "Perfis visiveis para si ou gestores"
ON public.profiles FOR SELECT TO authenticated
USING (user_id = auth.uid() OR public.has_permission_or_admin(auth.uid(), 'usuarios.manage'));

-- 3) rsos.autor_email: não legível por usuários comuns
REVOKE SELECT (autor_email) ON public.rsos FROM authenticated, anon;

-- 4) Inserções públicas
DROP POLICY IF EXISTS "Qualquer pessoa pode criar AIT" ON public.ait;
CREATE POLICY "Autenticados podem criar AIT"
ON public.ait FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Qualquer pessoa pode criar RSO" ON public.rsos;
CREATE POLICY "Autenticados podem criar RSO"
ON public.rsos FOR INSERT TO authenticated WITH CHECK (status = 'pendente' AND aprovado_por IS NULL);

DROP POLICY IF EXISTS "Qualquer pessoa pode enviar denuncia" ON public.denuncias;
CREATE POLICY "Qualquer pessoa pode enviar denuncia"
ON public.denuncias FOR INSERT TO anon, authenticated
WITH CHECK (status = 'pendente');

DROP POLICY IF EXISTS "Qualquer um pode enviar prova" ON public.prova_inscricoes;
CREATE POLICY "Qualquer um pode enviar prova"
ON public.prova_inscricoes FOR INSERT TO anon, authenticated
WITH CHECK (status = 'pendente' AND avaliado_por IS NULL AND avaliado_em IS NULL);

-- 5) Storage: bucket documentos
DROP POLICY IF EXISTS "documentos_select_all" ON storage.objects;
DROP POLICY IF EXISTS "documentos_insert_auth" ON storage.objects;
DROP POLICY IF EXISTS "documentos_update_auth" ON storage.objects;
DROP POLICY IF EXISTS "documentos_delete_auth" ON storage.objects;

CREATE POLICY "documentos_select_auth" ON storage.objects
FOR SELECT TO authenticated USING (bucket_id = 'documentos');

CREATE POLICY "documentos_insert_owner" ON storage.objects
FOR INSERT TO authenticated WITH CHECK (bucket_id = 'documentos' AND owner = auth.uid());

CREATE POLICY "documentos_update_owner_or_admin" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'documentos' AND (owner = auth.uid() OR public.has_role(auth.uid(), 'admin'::app_role)))
WITH CHECK (bucket_id = 'documentos' AND (owner = auth.uid() OR public.has_role(auth.uid(), 'admin'::app_role)));

CREATE POLICY "documentos_delete_owner_or_admin" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'documentos' AND (owner = auth.uid() OR public.has_role(auth.uid(), 'admin'::app_role)));

-- 6) Storage: bucket rso-anexos
DROP POLICY IF EXISTS "Qualquer um pode enviar anexos de RSO" ON storage.objects;
DROP POLICY IF EXISTS "Autenticados podem ver anexos de RSO" ON storage.objects;

CREATE POLICY "rso_anexos_insert_owner" ON storage.objects
FOR INSERT TO authenticated WITH CHECK (bucket_id = 'rso-anexos' AND owner = auth.uid());

CREATE POLICY "rso_anexos_select_owner_or_revisor" ON storage.objects
FOR SELECT TO authenticated
USING (
  bucket_id = 'rso-anexos'
  AND (
    owner = auth.uid()
    OR public.has_permission_or_admin(auth.uid(), 'rso.approve')
    OR public.has_permission_or_admin(auth.uid(), 'relatorios.view')
  )
);

-- 7) Funções SECURITY DEFINER: remover execução para anônimos
REVOKE EXECUTE ON FUNCTION public.get_rso_indicadores() FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.submit_rso(jsonb, jsonb) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM anon, authenticated, public;
GRANT EXECUTE ON FUNCTION public.get_rso_indicadores() TO authenticated;
GRANT EXECUTE ON FUNCTION public.submit_rso(jsonb, jsonb) TO authenticated;
