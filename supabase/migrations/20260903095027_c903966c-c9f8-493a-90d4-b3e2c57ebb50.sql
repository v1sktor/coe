CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

CREATE TABLE public.juridico_usuarios (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario text NOT NULL UNIQUE,
  nome text NOT NULL,
  senha_hash text NOT NULL,
  ativo boolean NOT NULL DEFAULT true,
  criado_por uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.juridico_usuarios TO authenticated;
GRANT ALL ON public.juridico_usuarios TO service_role;

ALTER TABLE public.juridico_usuarios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins gerenciam usuarios juridicos"
ON public.juridico_usuarios FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_juridico_usuarios_updated
BEFORE UPDATE ON public.juridico_usuarios
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Criação/atualização de conta (somente admin)
CREATE OR REPLACE FUNCTION public.juridico_criar_usuario(_usuario text, _nome text, _senha text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'extensions'
AS $$
DECLARE novo uuid;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Somente administradores podem criar contas jurídicas';
  END IF;
  INSERT INTO public.juridico_usuarios (usuario, nome, senha_hash, criado_por)
  VALUES (lower(trim(_usuario)), _nome, extensions.crypt(_senha, extensions.gen_salt('bf')), auth.uid())
  RETURNING id INTO novo;
  RETURN novo;
END;
$$;

CREATE OR REPLACE FUNCTION public.juridico_definir_senha(_id uuid, _senha text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'extensions'
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Somente administradores podem alterar senhas jurídicas';
  END IF;
  UPDATE public.juridico_usuarios
     SET senha_hash = extensions.crypt(_senha, extensions.gen_salt('bf'))
   WHERE id = _id;
  RETURN FOUND;
END;
$$;

-- Login do Jurídico (público)
CREATE OR REPLACE FUNCTION public.juridico_login(_usuario text, _senha text)
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public', 'extensions'
AS $$
  SELECT COALESCE(
    (SELECT jsonb_build_object('id', u.id, 'usuario', u.usuario, 'nome', u.nome)
       FROM public.juridico_usuarios u
      WHERE u.usuario = lower(trim(_usuario))
        AND u.ativo
        AND u.senha_hash = extensions.crypt(_senha, u.senha_hash)
      LIMIT 1),
    'null'::jsonb);
$$;

REVOKE ALL ON FUNCTION public.juridico_login(text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.juridico_login(text, text) TO anon, authenticated;
REVOKE ALL ON FUNCTION public.juridico_criar_usuario(text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.juridico_criar_usuario(text, text, text) TO authenticated;
REVOKE ALL ON FUNCTION public.juridico_definir_senha(uuid, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.juridico_definir_senha(uuid, text) TO authenticated;

-- Acesso aos registros jurídicos para sessões da área (anon + autenticados)
DROP POLICY IF EXISTS "Juridico select" ON public.juridico_investigacoes;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.juridico_investigacoes TO anon;
CREATE POLICY "Juridico leitura area" ON public.juridico_investigacoes FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Juridico insert area" ON public.juridico_investigacoes FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Juridico update area" ON public.juridico_investigacoes FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Juridico delete area" ON public.juridico_investigacoes FOR DELETE TO anon, authenticated USING (true);