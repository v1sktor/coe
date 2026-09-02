CREATE TABLE public.juridico_investigacoes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo text NOT NULL,
  numero text,
  tipo text NOT NULL DEFAULT 'investigacao',
  unidade text,
  envolvidos text,
  descricao text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'em_andamento',
  anexos jsonb NOT NULL DEFAULT '[]'::jsonb,
  criado_por uuid REFERENCES auth.users(id),
  autor_nome text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.juridico_investigacoes TO authenticated;
GRANT ALL ON public.juridico_investigacoes TO service_role;

ALTER TABLE public.juridico_investigacoes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Juridico pode ver investigacoes"
ON public.juridico_investigacoes FOR SELECT TO authenticated
USING (public.has_permission_or_admin(auth.uid(), 'juridico'));

CREATE POLICY "Juridico pode criar investigacoes"
ON public.juridico_investigacoes FOR INSERT TO authenticated
WITH CHECK (public.has_permission_or_admin(auth.uid(), 'juridico'));

CREATE POLICY "Juridico pode editar investigacoes"
ON public.juridico_investigacoes FOR UPDATE TO authenticated
USING (public.has_permission_or_admin(auth.uid(), 'juridico'))
WITH CHECK (public.has_permission_or_admin(auth.uid(), 'juridico'));

CREATE POLICY "Juridico pode excluir investigacoes"
ON public.juridico_investigacoes FOR DELETE TO authenticated
USING (public.has_permission_or_admin(auth.uid(), 'juridico'));

CREATE TRIGGER trg_juridico_updated
BEFORE UPDATE ON public.juridico_investigacoes
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.permissoes (nome, descricao)
VALUES ('juridico', 'Acesso à área Jurídica (investigações e documentos)')
ON CONFLICT (nome) DO NOTHING;