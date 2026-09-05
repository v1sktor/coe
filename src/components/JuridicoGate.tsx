import { ReactNode, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2, Lock, Scale, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import logo from "@/assets/logo-pcsp.png";

const STORAGE_KEY = "juridico-session";

export type JuridicoSession = { id: string; usuario: string; nome: string };

export function getJuridicoSession(): JuridicoSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as JuridicoSession) : null;
  } catch {
    return null;
  }
}

export function clearJuridicoSession() {
  localStorage.removeItem(STORAGE_KEY);
}

export function JuridicoGate({ children }: { children: ReactNode }) {
  const { isAdmin, loading: authLoading } = useAuth();
  const [sessao, setSessao] = useState<JuridicoSession | null>(null);
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    setSessao(getJuridicoSession());
  }, []);

  const entrar = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setErro(null);
    const { data, error } = await supabase.rpc("juridico_login", {
      _usuario: usuario,
      _senha: senha,
    });
    setEnviando(false);
    if (error) return setErro(error.message);
    if (!data) return setErro("Usuário ou senha inválidos.");
    const s = data as unknown as JuridicoSession;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    setSessao(s);
  };

  if (sessao) return <>{children}</>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-3">
          <img src={logo} alt="Brasão da Polícia Civil" className="mx-auto h-20 w-20 object-contain" />
          <h1 className="font-display text-2xl font-bold uppercase tracking-widest flex items-center justify-center gap-2">
            <Scale className="h-5 w-5" /> Jurídico
          </h1>
          <p className="text-sm text-muted-foreground">
            Acesso exclusivo com credenciais da área jurídica.
          </p>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm uppercase tracking-widest text-muted-foreground font-display">
              Autenticação jurídica
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={entrar} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="jur-user" className="text-xs uppercase tracking-wider text-muted-foreground">
                  Usuário
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="jur-user"
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}
                    className="pl-10"
                    autoComplete="username"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="jur-pass" className="text-xs uppercase tracking-wider text-muted-foreground">
                  Senha
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="jur-pass"
                    type="password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    className="pl-10"
                    autoComplete="current-password"
                    required
                  />
                </div>
              </div>
              {erro && <p className="text-sm text-destructive">{erro}</p>}
              <Button type="submit" disabled={enviando} className="w-full font-display uppercase tracking-widest">
                {enviando ? <Loader2 className="h-4 w-4 animate-spin" /> : "Entrar"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button variant="ghost" asChild className="text-muted-foreground text-sm">
            <Link to="/login">
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
