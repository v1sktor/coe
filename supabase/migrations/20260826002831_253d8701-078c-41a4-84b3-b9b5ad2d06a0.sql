DELETE FROM public.rsos WHERE autor_nome IN ('TESTE','TESTE2') AND descricao LIKE 'teste rls%';

CREATE OR REPLACE FUNCTION public.submit_rso(_rso jsonb, _aits jsonb DEFAULT '[]'::jsonb)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_id uuid;
BEGIN
  INSERT INTO public.rsos
  SELECT (jsonb_populate_record(null::public.rsos, _rso - 'id' - 'status' - 'aprovado_por' - 'created_at' - 'updated_at')).*
  RETURNING id INTO new_id;

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