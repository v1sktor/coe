import { ReactNode, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Gavel, Loader2, Lock, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { usePermission } from "@/hooks/usePermission";
import logo from "@/assets/logo-forca-tatica.png";

const STORAGE_KEY = "corregedoria-session";

export type CorregedoriaSession = { id: string; usuario: string; nome: string };

export function getCorregedoriaSession(): CorregedoriaSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CorregedoriaSession) : null;
  } catch {
    return null;
  }
}

export function clearCorregedoriaSession() {
  localStorage.removeItem(STORAGE_KEY);
}

export function CorregedoriaGate({ children }: { children: ReactNode }) {
  const { isAdmin, loading: authLoading } = useAuth();
  const { allowed: temPermissao, loading: permLoading } = usePermission("corregedoria");
  const [sessao, setSessao] = useState<CorregedoriaSession | null>(null);
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    setSessao(getCorregedoriaSession());
  }, []);

  const entrar = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setErro(null);
    const { data, error } = await supabase.rpc("corregedoria_login", {
      _usuario: usuario,
      _senha: senha,
    });
    setEnviando(false);
    if (error) return setErro(error.message);
    if (!data) return setErro("Usuário ou senha inválidos.");
    const s = data as unknown as CorregedoriaSession;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    setSessao(s);
  };

  if (authLoading || permLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );

  if (isAdmin || temPermissao || sessao) return <>{children}</>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-3">
          <img src={logo} alt="Emblema da Força Tática" width={1024} height={1024} className="mx-auto h-20 w-20 object-contain" />
          <h1 className="font-display text-2xl font-bold uppercase tracking-widest flex items-center justify-center gap-2">
            <Gavel className="h-5 w-5" /> Corregedoria
          </h1>
          <p className="text-sm text-muted-foreground">
            Acesso exclusivo com credenciais da Corregedoria.
          </p>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm uppercase tracking-widest text-muted-foreground font-display">
              Autenticação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={entrar} className="space-y-4">
              <div className="space-y-1.5">
                <Label>Usuário</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    className="pl-9"
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}
                    placeholder="usuario"
                    autoComplete="username"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    className="pl-9"
                    type="password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    autoComplete="current-password"
                  />
                </div>
              </div>
              {erro && <p className="text-sm text-destructive">{erro}</p>}
              <Button type="submit" className="w-full" disabled={enviando}>
                {enviando ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Entrar
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button variant="ghost" asChild>
            <Link to="/login">
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao login
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
