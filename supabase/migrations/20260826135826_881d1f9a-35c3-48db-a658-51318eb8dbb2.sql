
CREATE TABLE public.access_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chave text NOT NULL UNIQUE,
  codigo text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.access_codes TO authenticated;
GRANT ALL ON public.access_codes TO service_role;

ALTER TABLE public.access_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins gerenciam codigos" ON public.access_codes
FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER trg_access_codes_updated BEFORE UPDATE ON public.access_codes
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.access_codes (chave, codigo) VALUES
  ('bopc', 'PC26-8K7X'),
  ('diligencias', 'PC26-8K7X');

CREATE OR REPLACE FUNCTION public.verify_access_code(_chave text, _codigo text)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.access_codes
    WHERE chave = _chave AND upper(trim(codigo)) = upper(trim(_codigo))
  );
$$;

REVOKE ALL ON FUNCTION public.verify_access_code(text, text) FROM public;
GRANT EXECUTE ON FUNCTION public.verify_access_code(text, text) TO anon, authenticated;
