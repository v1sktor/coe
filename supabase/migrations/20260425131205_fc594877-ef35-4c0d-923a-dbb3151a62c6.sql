CREATE TABLE IF NOT EXISTS public.ait (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  rso_id UUID REFERENCES public.rsos(id) ON DELETE CASCADE,
  artigo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  valor INTEGER NOT NULL DEFAULT 0,
  nome_multado TEXT NOT NULL,
  rg_multado TEXT,
  data_infracao DATE NOT NULL DEFAULT CURRENT_DATE,
  observacoes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.ait ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Autenticados podem ver AITs"
  ON public.ait FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Qualquer pessoa pode criar AIT"
  ON public.ait FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admin pode atualizar AITs"
  ON public.ait FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin pode deletar AITs"
  ON public.ait FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX IF NOT EXISTS idx_ait_rso_id ON public.ait(rso_id);

CREATE TRIGGER update_ait_updated_at
  BEFORE UPDATE ON public.ait
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();