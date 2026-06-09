
ALTER TABLE public.ccomsoc_posts
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'pendente',
  ADD COLUMN IF NOT EXISTS aprovado_por uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS aprovado_em timestamptz,
  ADD COLUMN IF NOT EXISTS motivo_rejeicao text;

ALTER TABLE public.ccomsoc_posts
  DROP CONSTRAINT IF EXISTS ccomsoc_posts_status_check;
ALTER TABLE public.ccomsoc_posts
  ADD CONSTRAINT ccomsoc_posts_status_check
  CHECK (status IN ('pendente', 'aprovado', 'rejeitado'));

CREATE INDEX IF NOT EXISTS ccomsoc_status_idx ON public.ccomsoc_posts(status);

-- Recriar policies de leitura/edição
DROP POLICY IF EXISTS "ccomsoc_select_auth" ON public.ccomsoc_posts;
DROP POLICY IF EXISTS "ccomsoc_insert_perm" ON public.ccomsoc_posts;
DROP POLICY IF EXISTS "ccomsoc_update_perm" ON public.ccomsoc_posts;
DROP POLICY IF EXISTS "ccomsoc_delete_perm" ON public.ccomsoc_posts;

-- SELECT: gestores veem tudo, demais só veem aprovados ou os próprios
CREATE POLICY "ccomsoc_select" ON public.ccomsoc_posts FOR SELECT TO authenticated
  USING (
    status = 'aprovado'
    OR autor_id = auth.uid()
    OR public.has_permission_or_admin(auth.uid(), 'ccomsoc.manage')
  );

-- INSERT: qualquer autenticado, mas precisa ser o próprio autor e status inicial pendente
CREATE POLICY "ccomsoc_insert" ON public.ccomsoc_posts FOR INSERT TO authenticated
  WITH CHECK (autor_id = auth.uid() AND status = 'pendente');

-- UPDATE:
--   - gestores podem tudo
--   - autor pode editar somente se pendente/rejeitado e sem mudar status para aprovado
CREATE POLICY "ccomsoc_update_manager" ON public.ccomsoc_posts FOR UPDATE TO authenticated
  USING (public.has_permission_or_admin(auth.uid(), 'ccomsoc.manage'))
  WITH CHECK (public.has_permission_or_admin(auth.uid(), 'ccomsoc.manage'));

CREATE POLICY "ccomsoc_update_author" ON public.ccomsoc_posts FOR UPDATE TO authenticated
  USING (autor_id = auth.uid() AND status IN ('pendente', 'rejeitado'))
  WITH CHECK (autor_id = auth.uid() AND status IN ('pendente', 'rejeitado'));

-- DELETE: gestor ou autor (se ainda não aprovado)
CREATE POLICY "ccomsoc_delete_manager" ON public.ccomsoc_posts FOR DELETE TO authenticated
  USING (public.has_permission_or_admin(auth.uid(), 'ccomsoc.manage'));

CREATE POLICY "ccomsoc_delete_author" ON public.ccomsoc_posts FOR DELETE TO authenticated
  USING (autor_id = auth.uid() AND status IN ('pendente', 'rejeitado'));
