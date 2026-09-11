-- Contas da corregedoria
CREATE TABLE public.corregedoria_usuarios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario text NOT NULL UNIQUE,
  nome text NOT NULL,
  senha_hash text NOT NULL,
  ativo boolean NOT NULL DEFAULT true,
  criado_por uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.corregedoria_usuarios TO authenticated;
GRANT ALL ON public.corregedoria_usuarios TO service_role;
ALTER TABLE public.corregedoria_usuarios ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins gerenciam contas da corregedoria"
  ON public.corregedoria_usuarios FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_corregedoria_usuarios_updated BEFORE UPDATE ON public.corregedoria_usuarios
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.corregedoria_criar_usuario(_usuario text, _nome text, _senha text)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public','extensions' AS $$
DECLARE novo uuid;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Somente administradores podem criar contas da corregedoria';
  END IF;
  INSERT INTO public.corregedoria_usuarios (usuario, nome, senha_hash, criado_por)
  VALUES (lower(trim(_usuario)), _nome, extensions.crypt(_senha, extensions.gen_salt('bf')), auth.uid())
  RETURNING id INTO novo;
  RETURN novo;
END; $$;

CREATE OR REPLACE FUNCTION public.corregedoria_definir_senha(_id uuid, _senha text)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public','extensions' AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Somente administradores podem alterar senhas da corregedoria';
  END IF;
  UPDATE public.corregedoria_usuarios
     SET senha_hash = extensions.crypt(_senha, extensions.gen_salt('bf'))
   WHERE id = _id;
  RETURN FOUND;
END; $$;

CREATE OR REPLACE FUNCTION public.corregedoria_login(_usuario text, _senha text)
RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public','extensions' AS $$
  SELECT COALESCE(
    (SELECT jsonb_build_object('id', u.id, 'usuario', u.usuario, 'nome', u.nome)
       FROM public.corregedoria_usuarios u
      WHERE u.usuario = lower(trim(_usuario))
        AND u.ativo
        AND u.senha_hash = extensions.crypt(_senha, u.senha_hash)
      LIMIT 1),
    'null'::jsonb);
$$;

-- Campos de andamento nas denúncias
ALTER TABLE public.denuncias
  ADD COLUMN IF NOT EXISTS relator text,
  ADD COLUMN IF NOT EXISTS parecer text,
  ADD COLUMN IF NOT EXISTS concluida_em timestamptz;

-- Votação
CREATE TABLE public.corregedoria_votos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  denuncia_id uuid NOT NULL REFERENCES public.denuncias(id) ON DELETE CASCADE,
  votante_nome text NOT NULL,
  voto text NOT NULL CHECK (voto IN ('procedente','improcedente','diligencias','abstencao')),
  justificativa text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (denuncia_id, votante_nome)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.corregedoria_votos TO authenticated, anon;
GRANT ALL ON public.corregedoria_votos TO service_role;
ALTER TABLE public.corregedoria_votos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Corregedoria gerencia votos" ON public.corregedoria_votos FOR ALL TO anon, authenticated
  USING (true) WITH CHECK (true);
CREATE TRIGGER trg_corregedoria_votos_updated BEFORE UPDATE ON public.corregedoria_votos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Leitura e andamento das denúncias pela corregedoria
GRANT SELECT, UPDATE ON public.denuncias TO anon, authenticated;
DROP POLICY IF EXISTS "Corregedoria le denuncias" ON public.denuncias;
CREATE POLICY "Corregedoria le denuncias" ON public.denuncias FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Corregedoria atualiza denuncias" ON public.denuncias;
CREATE POLICY "Corregedoria atualiza denuncias" ON public.denuncias FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

-- Permissão granular
INSERT INTO public.permissoes (nome, descricao)
VALUES ('corregedoria', 'Acesso à área da Corregedoria (denúncias e votação)')
ON CONFLICT (nome) DO NOTHING;

-- Código de acesso opcional
INSERT INTO public.access_codes (chave, codigo)
VALUES ('corregedoria', 'CORR-2026')
ON CONFLICT DO NOTHING;