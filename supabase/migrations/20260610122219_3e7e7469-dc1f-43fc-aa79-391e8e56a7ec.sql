ALTER TABLE public.rsos
  ADD COLUMN ilicito_cocaina integer NOT NULL DEFAULT 0,
  ADD COLUMN ilicito_ecstasy integer NOT NULL DEFAULT 0,
  ADD COLUMN ilicito_cigarros integer NOT NULL DEFAULT 0,
  ADD COLUMN ilicito_pistolas integer NOT NULL DEFAULT 0,
  ADD COLUMN ilicito_fuzis integer NOT NULL DEFAULT 0,
  ADD COLUMN ilicito_submetralhadoras integer NOT NULL DEFAULT 0,
  ADD COLUMN ilicito_mun_pistola integer NOT NULL DEFAULT 0,
  ADD COLUMN ilicito_mun_fuzil integer NOT NULL DEFAULT 0,
  ADD COLUMN ilicito_mun_sub integer NOT NULL DEFAULT 0,
  ADD COLUMN ilicito_lockpicks integer NOT NULL DEFAULT 0,
  ADD COLUMN ilicito_bombas integer NOT NULL DEFAULT 0,
  ADD COLUMN ilicito_dinheiro_marcado integer NOT NULL DEFAULT 0,
  ADD COLUMN roubo_caixa_registradora integer NOT NULL DEFAULT 0;

CREATE OR REPLACE FUNCTION public.get_rso_indicadores()
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT jsonb_build_object(
    'total_rsos', count(*),
    'cocaina', COALESCE(sum(ilicito_cocaina), 0),
    'ecstasy', COALESCE(sum(ilicito_ecstasy), 0),
    'cigarros', COALESCE(sum(ilicito_cigarros), 0),
    'pistolas', COALESCE(sum(ilicito_pistolas), 0),
    'fuzis', COALESCE(sum(ilicito_fuzis), 0),
    'submetralhadoras', COALESCE(sum(ilicito_submetralhadoras), 0),
    'mun_pistola', COALESCE(sum(ilicito_mun_pistola), 0),
    'mun_fuzil', COALESCE(sum(ilicito_mun_fuzil), 0),
    'mun_sub', COALESCE(sum(ilicito_mun_sub), 0),
    'lockpicks', COALESCE(sum(ilicito_lockpicks), 0),
    'bombas_caseiras', COALESCE(sum(ilicito_bombas), 0),
    'dinheiro_marcado', COALESCE(sum(ilicito_dinheiro_marcado), 0),
    'chamados_190', COALESCE(sum(chamados_190), 0),
    'roubo_caixa_eletronico', COALESCE(sum(caixa_eletronico), 0),
    'roubo_caixa_registradora', COALESCE(sum(roubo_caixa_registradora), 0),
    'roubo_residencia', COALESCE(sum(roubos_residencias), 0),
    'roubo_veiculos', COALESCE(sum(roubo_veiculo), 0),
    'apoios', COALESCE(sum(pinote_apoio), 0),
    'trafico', COALESCE(sum(trafico_drogas), 0),
    'acoes', COALESCE(sum(acoes_setada), 0)
  )
  FROM public.rsos
  WHERE status = 'aprovado';
$$;

GRANT EXECUTE ON FUNCTION public.get_rso_indicadores() TO anon, authenticated;