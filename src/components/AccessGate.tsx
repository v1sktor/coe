import { useEffect, useState, ReactNode } from "react";
import { Link } from "react-router-dom";
import { KeyRound, ArrowLeft, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import logo from "@/assets/logo-4bpchq.png";

const storageKey = (chave: string) => `access-code:${chave}`;

export function AccessGate({
  chave,
  titulo,
  children,
}: {
  chave: string;
  titulo: string;
  children: ReactNode;
}) {
  const [liberado, setLiberado] = useState(false);
  const [checando, setChecando] = useState(true);
  const [codigo, setCodigo] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const validar = async (valor: string) => {
    const { data, error } = await supabase.rpc("verify_access_code", {
      _chave: chave,
      _codigo: valor,
    });
    if (error) throw error;
    return data === true;
  };

  useEffect(() => {
    let ativo = true;
    const salvo = localStorage.getItem(storageKey(chave));
    if (!salvo) {
      setChecando(false);
      return;
    }
    validar(salvo)
      .then((ok) => {
        if (!ativo) return;
        if (!ok) localStorage.removeItem(storageKey(chave));
        setLiberado(ok);
      })
      .catch(() => localStorage.removeItem(storageKey(chave)))
      .finally(() => ativo && setChecando(false));
    return () => {
      ativo = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chave]);

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setErro(null);
    try {
      const ok = await validar(codigo);
      if (ok) {
        localStorage.setItem(storageKey(chave), codigo.trim());
        setLiberado(true);
      } else {
        setErro("Código de acesso inválido.");
      }
    } catch {
      setErro("Não foi possível validar o código. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  };

  if (checando) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  if (liberado) return <>{children}</>;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="items-center text-center space-y-3">
          <img src={logo} alt="Emblema do 4º BPChq COE/GATE" width={1024} height={1024} className="h-16 w-16 object-contain" />
          <CardTitle className="text-lg">{titulo}</CardTitle>
          <p className="text-sm text-muted-foreground">
            Área restrita. Informe o código de acesso semanal fornecido pelo comando.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={enviar} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Código de acesso</Label>
              <Input
                autoFocus
                placeholder="PMESP-0000"
                value={codigo}
                onChange={(e) => {
                  const digitos = e.target.value.replace(/[^0-9]/g, "").slice(0, 4);
                  setCodigo(digitos ? `PMESP-${digitos}` : "");
                }}
                className="font-mono tracking-widest"
              />
            </div>
            {erro && <p className="text-sm text-destructive">{erro}</p>}
            <Button type="submit" className="w-full" disabled={enviando || !codigo.trim()}>
              {enviando ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <KeyRound className="mr-2 h-4 w-4" />}
              Entrar
            </Button>
            <Button variant="ghost" asChild className="w-full">
              <Link to="/"><ArrowLeft className="mr-1 h-4 w-4" />Voltar ao início</Link>
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
