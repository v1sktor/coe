CREATE OR REPLACE FUNCTION public.get_hierarquia_publica()
RETURNS TABLE (
  id uuid,
  membro_nome text,
  cargo_id uuid,
  superior_id uuid,
  ordem integer,
  funcao text,
  data_entrada date,
  promocao date,
  grupamento grupamento_tipo,
  batalhao text,
  cargo_nome text,
  cargo_imagem text,
  cargo_nivel integer
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT h.id, h.membro_nome, h.cargo_id, h.superior_id, h.ordem, h.funcao,
         h.data_entrada, h.promocao, h.grupamento, h.batalhao,
         c.nome, c.imagem_url, c.nivel_hierarquico
  FROM public.hierarquia h
  LEFT JOIN public.cargos c ON c.id = h.cargo_id
  ORDER BY COALESCE(c.nivel_hierarquico, 99), h.ordem;
$$;

REVOKE ALL ON FUNCTION public.get_hierarquia_publica() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_hierarquia_publica() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_rso_indicadores() TO anon, authenticated;