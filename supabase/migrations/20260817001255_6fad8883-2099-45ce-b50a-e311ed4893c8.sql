DROP POLICY IF EXISTS ccomsoc_select ON public.ccomsoc_posts;
DROP POLICY IF EXISTS ccomsoc_insert ON public.ccomsoc_posts;
DROP POLICY IF EXISTS ccomsoc_update_author ON public.ccomsoc_posts;
DROP POLICY IF EXISTS ccomsoc_delete_author ON public.ccomsoc_posts;
DROP POLICY IF EXISTS ccomsoc_update_manager ON public.ccomsoc_posts;
DROP POLICY IF EXISTS ccomsoc_delete_manager ON public.ccomsoc_posts;

GRANT SELECT ON public.ccomsoc_posts TO anon;

CREATE POLICY ccomsoc_select_public ON public.ccomsoc_posts FOR SELECT TO anon, authenticated USING (status = 'aprovado');
CREATE POLICY ccomsoc_select_manager ON public.ccomsoc_posts FOR SELECT TO authenticated USING (public.has_permission_or_admin(auth.uid(), 'ccomsoc.manage'));
CREATE POLICY ccomsoc_insert_manager ON public.ccomsoc_posts FOR INSERT TO authenticated WITH CHECK (public.has_permission_or_admin(auth.uid(), 'ccomsoc.manage'));
CREATE POLICY ccomsoc_update_manager ON public.ccomsoc_posts FOR UPDATE TO authenticated USING (public.has_permission_or_admin(auth.uid(), 'ccomsoc.manage')) WITH CHECK (public.has_permission_or_admin(auth.uid(), 'ccomsoc.manage'));
CREATE POLICY ccomsoc_delete_manager ON public.ccomsoc_posts FOR DELETE TO authenticated USING (public.has_permission_or_admin(auth.uid(), 'ccomsoc.manage'));