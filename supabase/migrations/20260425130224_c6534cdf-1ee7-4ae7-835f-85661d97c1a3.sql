-- Create grupamento enum
DO $$ BEGIN
  CREATE TYPE public.grupamento_tipo AS ENUM ('GERAL', 'TOR', 'ROCAM');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Add grupamento column to hierarquia
ALTER TABLE public.hierarquia
  ADD COLUMN IF NOT EXISTS grupamento public.grupamento_tipo NOT NULL DEFAULT 'GERAL';

-- Index for filtering
CREATE INDEX IF NOT EXISTS idx_hierarquia_grupamento ON public.hierarquia(grupamento);