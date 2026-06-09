
-- Activity logs table
CREATE TABLE public.activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  user_nome text NOT NULL DEFAULT '',
  action text NOT NULL,
  details text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin pode ver logs" ON public.activity_logs
FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Autenticados podem inserir logs" ON public.activity_logs
FOR INSERT WITH CHECK (auth.uid() = user_id);
