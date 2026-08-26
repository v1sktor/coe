GRANT SELECT, INSERT, UPDATE, DELETE ON public.rsos TO authenticated;
GRANT SELECT, INSERT ON public.rsos TO anon;
GRANT ALL ON public.rsos TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.ait TO authenticated;
GRANT SELECT, INSERT ON public.ait TO anon;
GRANT ALL ON public.ait TO service_role;