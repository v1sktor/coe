
-- Enum para roles do sistema
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Tabela de cargos
CREATE TABLE public.cargos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  nivel_hierarquico INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de permissões
CREATE TABLE public.permissoes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL UNIQUE,
  descricao TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Relação N:N entre cargos e permissões
CREATE TABLE public.cargo_permissoes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cargo_id UUID NOT NULL REFERENCES public.cargos(id) ON DELETE CASCADE,
  permissao_id UUID NOT NULL REFERENCES public.permissoes(id) ON DELETE CASCADE,
  UNIQUE (cargo_id, permissao_id)
);

-- Tabela de roles de usuário (admin/user)
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'user',
  UNIQUE (user_id, role)
);

-- Tabela de perfis
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL DEFAULT '',
  cargo_id UUID REFERENCES public.cargos(id) ON DELETE SET NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de hierarquia (gerenciada pelo admin, visualização pública)
CREATE TABLE public.hierarquia (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  membro_nome TEXT NOT NULL,
  cargo_id UUID REFERENCES public.cargos(id) ON DELETE SET NULL,
  superior_id UUID REFERENCES public.hierarquia(id) ON DELETE SET NULL,
  ordem INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de RSOs (criação pública, gestão autenticada)
CREATE TABLE public.rsos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  autor_nome TEXT NOT NULL,
  autor_email TEXT,
  descricao TEXT NOT NULL,
  local TEXT NOT NULL,
  data_ocorrencia DATE NOT NULL,
  tipo TEXT DEFAULT 'ocorrencia',
  status TEXT NOT NULL DEFAULT 'pendente',
  aprovado_por UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de timings (controle de ponto)
CREATE TABLE public.timings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  data DATE NOT NULL,
  entrada TIME,
  saida TIME,
  status TEXT NOT NULL DEFAULT 'presente',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Triggers de updated_at
CREATE TRIGGER update_cargos_updated_at BEFORE UPDATE ON public.cargos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_hierarquia_updated_at BEFORE UPDATE ON public.hierarquia FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_rsos_updated_at BEFORE UPDATE ON public.rsos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Função security definer para checar role (evita recursão RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Trigger para criar perfil e role automaticamente no signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, nome)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'nome', NEW.email));
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==================== RLS ====================

-- Cargos: leitura pública (usado na hierarquia), escrita admin
ALTER TABLE public.cargos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Cargos visíveis por todos" ON public.cargos FOR SELECT USING (true);
CREATE POLICY "Admin pode inserir cargos" ON public.cargos FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin pode atualizar cargos" ON public.cargos FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin pode deletar cargos" ON public.cargos FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Permissões: leitura autenticada, escrita admin
ALTER TABLE public.permissoes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permissões visíveis por autenticados" ON public.permissoes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin pode gerenciar permissões" ON public.permissoes FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Cargo-permissões: leitura autenticada, escrita admin
ALTER TABLE public.cargo_permissoes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Cargo_permissoes visíveis por autenticados" ON public.cargo_permissoes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin pode gerenciar cargo_permissoes" ON public.cargo_permissoes FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- User roles: leitura pelo próprio ou admin, escrita admin
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuário pode ver seu próprio role" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin pode gerenciar roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Profiles: leitura autenticada, atualização própria ou admin
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Perfis visíveis por autenticados" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Usuário pode atualizar próprio perfil" ON public.profiles FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Admin pode gerenciar perfis" ON public.profiles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Hierarquia: leitura pública, escrita admin
ALTER TABLE public.hierarquia ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Hierarquia visível por todos" ON public.hierarquia FOR SELECT USING (true);
CREATE POLICY "Admin pode inserir hierarquia" ON public.hierarquia FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin pode atualizar hierarquia" ON public.hierarquia FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin pode deletar hierarquia" ON public.hierarquia FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- RSOs: inserção pública (anon), leitura autenticada, gestão admin
ALTER TABLE public.rsos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Qualquer pessoa pode criar RSO" ON public.rsos FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Autenticados podem ver RSOs" ON public.rsos FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin pode atualizar RSOs" ON public.rsos FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin pode deletar RSOs" ON public.rsos FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Timings: leitura/escrita pelo próprio ou admin
ALTER TABLE public.timings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuário pode ver seus timings" ON public.timings FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Usuário pode criar seus timings" ON public.timings FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admin pode gerenciar timings" ON public.timings FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Inserir permissões padrão
INSERT INTO public.permissoes (nome, descricao) VALUES
  ('aprovar_rso', 'Aprovar ou reprovar RSOs'),
  ('editar_hierarquia', 'Editar organograma da unidade'),
  ('gerenciar_timings', 'Gerenciar controle de ponto'),
  ('gerenciar_usuarios', 'Gerenciar usuários do sistema'),
  ('ver_relatorios', 'Visualizar relatórios'),
  ('gerenciar_cargos', 'Gerenciar cargos e permissões');
