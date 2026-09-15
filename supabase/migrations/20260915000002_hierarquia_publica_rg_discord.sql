-- Expoe RG e Discord ID tambem na visualizacao publica da Hierarquia
drop function if exists public.get_hierarquia_publica();

create function public.get_hierarquia_publica()
returns table (
  id uuid,
  membro_nome text,
  rg text,
  discord_id text,
  cargo_id uuid,
  superior_id uuid,
  ordem integer,
  funcao text,
  data_entrada text,
  promocao text,
  grupamento grupamento_tipo,
  batalhao text,
  cargo_nome text,
  cargo_imagem text,
  cargo_nivel integer
)
language sql
stable
security definer
set search_path = public
as $$
  select
    h.id,
    h.membro_nome,
    h.rg,
    h.discord_id,
    h.cargo_id,
    h.superior_id,
    h.ordem,
    h.funcao,
    h.data_entrada,
    h.promocao,
    h.grupamento,
    h.batalhao,
    c.nome,
    c.imagem_url,
    c.nivel_hierarquico
  from public.hierarquia h
  left join public.cargos c on c.id = h.cargo_id;
$$;

grant execute on function public.get_hierarquia_publica() to anon, authenticated;
