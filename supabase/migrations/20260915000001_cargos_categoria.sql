-- Categoria hierárquica das patentes (Oficiais Superiores, Oficiais Intermediários, etc.)
alter table public.cargos add column if not exists categoria text;
