-- Fardamentos e viaturas: catálogo público, editável somente por admin

create table public.frota_itens (
  id uuid primary key default gen_random_uuid(),
  categoria text not null check (categoria in ('fardamento', 'viatura')),
  nome text not null,
  descricao text,
  imagem_url text,
  ordem integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.frota_itens enable row level security;

create policy "Leitura pública de frota_itens"
  on public.frota_itens for select
  using (true);

create policy "Admin gerencia frota_itens"
  on public.frota_itens for all
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- Bucket público para as fotos de fardamentos/viaturas
insert into storage.buckets (id, name, public)
values ('frota', 'frota', true)
on conflict (id) do nothing;

create policy "Leitura pública do bucket frota"
  on storage.objects for select
  using (bucket_id = 'frota');

create policy "Admin gerencia bucket frota"
  on storage.objects for all
  using (bucket_id = 'frota' and public.has_role(auth.uid(), 'admin'))
  with check (bucket_id = 'frota' and public.has_role(auth.uid(), 'admin'));
