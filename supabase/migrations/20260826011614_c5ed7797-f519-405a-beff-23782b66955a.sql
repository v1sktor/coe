
DROP POLICY IF EXISTS "Qualquer pessoa pode enviar denuncia" ON public.denuncias;
CREATE POLICY "Qualquer pessoa pode enviar denuncia"
ON public.denuncias FOR INSERT TO anon, authenticated
WITH CHECK (status = 'recebida');
