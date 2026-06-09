
CREATE OR REPLACE FUNCTION public.has_permission_or_admin(_user_id uuid, _permission text)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    public.has_role(_user_id, 'admin'::app_role)
    OR EXISTS (
      SELECT 1
      FROM public.profiles p
      JOIN public.cargo_permissoes cp ON cp.cargo_id = p.cargo_id
      JOIN public.permissoes pe ON pe.id = cp.permissao_id
      WHERE p.user_id = _user_id AND pe.nome = _permission
    );
$$;

CREATE TABLE public.ccomsoc_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo text NOT NULL,
  resumo text,
  corpo text NOT NULL DEFAULT '',
  capa_url text,
  anexos jsonb NOT NULL DEFAULT '[]'::jsonb,
  publicado boolean NOT NULL DEFAULT true,
  autor_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ccomsoc_posts TO authenticated;
GRANT ALL ON public.ccomsoc_posts TO service_role;
ALTER TABLE public.ccomsoc_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ccomsoc_select_auth" ON public.ccomsoc_posts FOR SELECT TO authenticated USING (true);
CREATE POLICY "ccomsoc_insert_perm" ON public.ccomsoc_posts FOR INSERT TO authenticated
  WITH CHECK (public.has_permission_or_admin(auth.uid(), 'ccomsoc.manage'));
CREATE POLICY "ccomsoc_update_perm" ON public.ccomsoc_posts FOR UPDATE TO authenticated
  USING (public.has_permission_or_admin(auth.uid(), 'ccomsoc.manage'))
  WITH CHECK (public.has_permission_or_admin(auth.uid(), 'ccomsoc.manage'));
CREATE POLICY "ccomsoc_delete_perm" ON public.ccomsoc_posts FOR DELETE TO authenticated
  USING (public.has_permission_or_admin(auth.uid(), 'ccomsoc.manage'));
CREATE TRIGGER trg_ccomsoc_updated BEFORE UPDATE ON public.ccomsoc_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.estaticas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  local text NOT NULL,
  inicio timestamptz NOT NULL,
  fim timestamptz,
  efetivo_previsto int,
  observacoes text,
  anexos jsonb NOT NULL DEFAULT '[]'::jsonb,
  criado_por uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.estaticas TO authenticated;
GRANT ALL ON public.estaticas TO service_role;
ALTER TABLE public.estaticas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "estaticas_select_auth" ON public.estaticas FOR SELECT TO authenticated USING (true);
CREATE POLICY "estaticas_insert_perm" ON public.estaticas FOR INSERT TO authenticated
  WITH CHECK (public.has_permission_or_admin(auth.uid(), 'estaticas.manage'));
CREATE POLICY "estaticas_update_perm" ON public.estaticas FOR UPDATE TO authenticated
  USING (public.has_permission_or_admin(auth.uid(), 'estaticas.manage'))
  WITH CHECK (public.has_permission_or_admin(auth.uid(), 'estaticas.manage'));
CREATE POLICY "estaticas_delete_perm" ON public.estaticas FOR DELETE TO authenticated
  USING (public.has_permission_or_admin(auth.uid(), 'estaticas.manage'));
CREATE TRIGGER trg_estaticas_updated BEFORE UPDATE ON public.estaticas
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.diretrizes_coe (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo text NOT NULL,
  numero text,
  ano int,
  vigencia_inicio date,
  vigencia_fim date,
  corpo text NOT NULL DEFAULT '',
  pdf_url text,
  tags text[] NOT NULL DEFAULT '{}',
  publicado boolean NOT NULL DEFAULT true,
  criado_por uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.diretrizes_coe TO authenticated;
GRANT ALL ON public.diretrizes_coe TO service_role;
ALTER TABLE public.diretrizes_coe ENABLE ROW LEVEL SECURITY;
CREATE POLICY "diretrizes_select_auth" ON public.diretrizes_coe FOR SELECT TO authenticated USING (true);
CREATE POLICY "diretrizes_insert_perm" ON public.diretrizes_coe FOR INSERT TO authenticated
  WITH CHECK (public.has_permission_or_admin(auth.uid(), 'diretrizes.manage'));
CREATE POLICY "diretrizes_update_perm" ON public.diretrizes_coe FOR UPDATE TO authenticated
  USING (public.has_permission_or_admin(auth.uid(), 'diretrizes.manage'))
  WITH CHECK (public.has_permission_or_admin(auth.uid(), 'diretrizes.manage'));
CREATE POLICY "diretrizes_delete_perm" ON public.diretrizes_coe FOR DELETE TO authenticated
  USING (public.has_permission_or_admin(auth.uid(), 'diretrizes.manage'));
CREATE TRIGGER trg_diretrizes_updated BEFORE UPDATE ON public.diretrizes_coe
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.apresentacao_docs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo text NOT NULL,
  descricao text,
  arquivo_url text NOT NULL,
  ordem int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.apresentacao_docs TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.apresentacao_docs TO authenticated;
GRANT ALL ON public.apresentacao_docs TO service_role;
ALTER TABLE public.apresentacao_docs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "apdocs_select_all" ON public.apresentacao_docs FOR SELECT USING (true);
CREATE POLICY "apdocs_insert_perm" ON public.apresentacao_docs FOR INSERT TO authenticated
  WITH CHECK (public.has_permission_or_admin(auth.uid(), 'apresentacao.manage'));
CREATE POLICY "apdocs_update_perm" ON public.apresentacao_docs FOR UPDATE TO authenticated
  USING (public.has_permission_or_admin(auth.uid(), 'apresentacao.manage'))
  WITH CHECK (public.has_permission_or_admin(auth.uid(), 'apresentacao.manage'));
CREATE POLICY "apdocs_delete_perm" ON public.apresentacao_docs FOR DELETE TO authenticated
  USING (public.has_permission_or_admin(auth.uid(), 'apresentacao.manage'));
CREATE TRIGGER trg_apdocs_updated BEFORE UPDATE ON public.apresentacao_docs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.apresentacao_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chave text NOT NULL UNIQUE,
  titulo text,
  conteudo text NOT NULL DEFAULT '',
  ordem int NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.apresentacao_content TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.apresentacao_content TO authenticated;
GRANT ALL ON public.apresentacao_content TO service_role;
ALTER TABLE public.apresentacao_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "apcontent_select_all" ON public.apresentacao_content FOR SELECT USING (true);
CREATE POLICY "apcontent_insert_perm" ON public.apresentacao_content FOR INSERT TO authenticated
  WITH CHECK (public.has_permission_or_admin(auth.uid(), 'apresentacao.manage'));
CREATE POLICY "apcontent_update_perm" ON public.apresentacao_content FOR UPDATE TO authenticated
  USING (public.has_permission_or_admin(auth.uid(), 'apresentacao.manage'))
  WITH CHECK (public.has_permission_or_admin(auth.uid(), 'apresentacao.manage'));
CREATE POLICY "apcontent_delete_perm" ON public.apresentacao_content FOR DELETE TO authenticated
  USING (public.has_permission_or_admin(auth.uid(), 'apresentacao.manage'));
CREATE TRIGGER trg_apcontent_updated BEFORE UPDATE ON public.apresentacao_content
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.permissoes (nome, descricao) VALUES
  ('ccomsoc.manage', 'Gerenciar posts de comunicação social'),
  ('estaticas.manage', 'Gerenciar postos estáticos'),
  ('diretrizes.manage', 'Gerenciar diretrizes do COE'),
  ('apresentacao.manage', 'Editar landing pública e documentos do 4º BPChq')
ON CONFLICT (nome) DO NOTHING;

INSERT INTO public.apresentacao_content (chave, titulo, conteudo, ordem) VALUES
  ('hero_titulo', 'Hero - Título', '4º BPChq', 0),
  ('hero_subtitulo', 'Hero - Subtítulo', 'Batalhão de Polícia de Choque · COE · PMESP', 1),
  ('missao', 'Missão', 'Atuar em operações de manutenção e restabelecimento da ordem pública, garantindo a segurança da população paulista com excelência, técnica e disciplina.', 2),
  ('historia', 'História', 'O 4º Batalhão de Polícia de Choque integra o Comando de Policiamento de Choque (CPChq) da Polícia Militar do Estado de São Paulo, contando com tropas especializadas em operações de alta complexidade.', 3),
  ('contato', 'Contato', 'Para informações institucionais, entre em contato pelos canais oficiais do 4º BPChq.', 4)
ON CONFLICT (chave) DO NOTHING;
