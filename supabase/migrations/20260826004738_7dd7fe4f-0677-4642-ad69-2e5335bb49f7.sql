CREATE TABLE public.prova_inscricoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome_id text NOT NULL,
  discord_id text NOT NULL,
  idade_real text NOT NULL,
  periodo text NOT NULL,
  respostas jsonb NOT NULL DEFAULT '{}'::jsonb,
  acertos integer NOT NULL DEFAULT 0,
  total_objetivas integer NOT NULL DEFAULT 22,
  status text NOT NULL DEFAULT 'pendente',
  observacoes text,
  avaliado_por uuid REFERENCES auth.users(id),
  avaliado_em timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.prova_inscricoes TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.prova_inscricoes TO authenticated;
GRANT ALL ON public.prova_inscricoes TO service_role;

ALTER TABLE public.prova_inscricoes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Qualquer um pode enviar prova" ON public.prova_inscricoes FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins podem ver provas" ON public.prova_inscricoes FOR SELECT TO authenticated USING (public.has_permission_or_admin(auth.uid(), 'provas.manage'));
CREATE POLICY "Admins podem avaliar provas" ON public.prova_inscricoes FOR UPDATE TO authenticated USING (public.has_permission_or_admin(auth.uid(), 'provas.manage'));
CREATE POLICY "Admins podem excluir provas" ON public.prova_inscricoes FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.permissoes (nome, descricao) VALUES ('provas.manage', 'Gerenciar provas do processo seletivo') ON CONFLICT DO NOTHING;