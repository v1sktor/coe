CREATE OR REPLACE FUNCTION public.submit_rso(_rso jsonb, _aits jsonb DEFAULT '[]'::jsonb)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_id uuid := gen_random_uuid();
  complete_rso jsonb;
BEGIN
  complete_rso := jsonb_build_object(
    'id', new_id,
    'tipo', 'ocorrencia',
    'status', 'pendente',
    'created_at', now(),
    'updated_at', now(),
    'ilicito_cocaina', 0,
    'ilicito_ecstasy', 0,
    'ilicito_cigarros', 0,
    'ilicito_pistolas', 0,
    'ilicito_fuzis', 0,
    'ilicito_submetralhadoras', 0,
    'ilicito_mun_pistola', 0,
    'ilicito_mun_fuzil', 0,
    'ilicito_mun_sub', 0,
    'ilicito_lockpicks', 0,
    'ilicito_bombas', 0,
    'ilicito_dinheiro_marcado', 0,
    'roubo_caixa_registradora', 0
  ) || (_rso - 'id' - 'status' - 'aprovado_por' - 'created_at' - 'updated_at');

  INSERT INTO public.rsos
  SELECT (jsonb_populate_record(null::public.rsos, complete_rso)).*;

  IF jsonb_array_length(COALESCE(_aits, '[]'::jsonb)) > 0 THEN
    INSERT INTO public.ait (rso_id, artigo, descricao, valor, nome_multado, rg_multado, data_infracao, observacoes)
    SELECT new_id,
           a->>'artigo',
           a->>'descricao',
           COALESCE((a->>'valor')::int, 0),
           a->>'nome_multado',
           a->>'rg_multado',
           COALESCE((a->>'data_infracao')::date, CURRENT_DATE),
           a->>'observacoes'
    FROM jsonb_array_elements(_aits) a;
  END IF;

  RETURN new_id;
END;
$$;

REVOKE ALL ON FUNCTION public.submit_rso(jsonb, jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_rso(jsonb, jsonb) TO anon, authenticated;