CREATE TABLE public.denuncias (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  protocolo text NOT NULL UNIQUE DEFAULT upper(substr(replace(gen_random_uuid()::text,'-',''),1,10)),
  anonima boolean NOT NULL DEFAULT true,
  nome text,
  contato text,
  categoria text NOT NULL,
  unidade_envolvida text,
  local_fato text,
  data_fato date,
  descricao text NOT NULL,
  status text NOT NULL DEFAULT 'recebida',
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.denuncias TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.denuncias TO authenticated;
GRANT ALL ON public.denuncias TO service_role;

ALTER TABLE public.denuncias ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Qualquer pessoa pode enviar denuncia"
ON public.denuncias FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Admins podem ver denuncias"
ON public.denuncias FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins podem atualizar denuncias"
ON public.denuncias FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins podem excluir denuncias"
ON public.denuncias FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));