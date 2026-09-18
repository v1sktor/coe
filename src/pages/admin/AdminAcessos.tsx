import { useEffect, useState } from "react";
import { KeyRound, RefreshCw, Copy, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import JuridicoContas from "@/components/admin/JuridicoContas";
import CorregedoriaContas from "@/components/admin/CorregedoriaContas";

type Codigo = { id: string; chave: string; codigo: string; updated_at: string };

const LABELS: Record<string, string> = {
  bopc: "Modelo BOPM",
  diligencias: "Relatório de Serviço Operacional",
  juridico: "Jurídico",
  corregedoria: "SJD",
};

// BOPM e RSO usam sempre o mesmo código de acesso — alterar um altera o outro.
const CHAVES_SINCRONIZADAS = ["bopc", "diligencias"];

function gerarCodigo() {
  const numeros = String(Math.floor(Math.random() * 10000)).padStart(4, "0");
  return `PMESP-${numeros}`;
}

function formatarCodigo(valor: string) {
  const digitos = valor.replace(/[^0-9]/g, "").slice(0, 4);
  return digitos ? `PMESP-${digitos}` : "";
}

export default function AdminAcessos() {
  const [itens, setItens] = useState<Codigo[]>([]);
  const [rascunho, setRascunho] = useState<Record<string, string>>({});
  const [carregando, setCarregando] = useState(true);

  const carregar = async () => {
    setCarregando(true);
    const { data, error } = await supabase.from("access_codes").select("*").order("chave");
    if (error) toast.error("Erro ao carregar códigos");
    const lista = (data as Codigo[]) ?? [];
    setItens(lista);
    setRascunho(Object.fromEntries(lista.map((i) => [i.chave, i.codigo])));
    setCarregando(false);
  };

  useEffect(() => {
    carregar();
  }, []);

  const salvar = async (item: Codigo) => {
    const novo = (rascunho[item.chave] ?? "").trim().toUpperCase();
    if (!novo) return toast.error("Informe um código");
    const { data: sess } = await supabase.auth.getSession();
    const chavesAlvo = CHAVES_SINCRONIZADAS.includes(item.chave)
      ? itens.filter((i) => CHAVES_SINCRONIZADAS.includes(i.chave)).map((i) => i.id)
      : [item.id];
    const { error } = await supabase
      .from("access_codes")
      .update({ codigo: novo, updated_by: sess.session?.user.id ?? null })
      .in("id", chavesAlvo);
    if (error) return toast.error("Erro ao salvar código");
    toast.success("Código de acesso atualizado");
    carregar();
  };

  const gerarESincronizar = (chave: string) => {
    const novo = gerarCodigo();
    if (CHAVES_SINCRONIZADAS.includes(chave)) {
      setRascunho((p) => {
        const next = { ...p };
        for (const c of CHAVES_SINCRONIZADAS) next[c] = novo;
        return next;
      });
    } else {
      setRascunho((p) => ({ ...p, [chave]: novo }));
    }
  };

  const editarSincronizado = (chave: string, valor: string) => {
    const formatado = formatarCodigo(valor);
    if (CHAVES_SINCRONIZADAS.includes(chave)) {
      setRascunho((p) => {
        const next = { ...p };
        for (const c of CHAVES_SINCRONIZADAS) next[c] = formatado;
        return next;
      });
    } else {
      setRascunho((p) => ({ ...p, [chave]: formatado }));
    }
  };

  const codigosSincronizados = itens.filter((i) => CHAVES_SINCRONIZADAS.includes(i.chave));
  const codigosIndividuais = itens.filter((i) => !CHAVES_SINCRONIZADAS.includes(i.chave));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-primary flex items-center gap-2">
          <KeyRound className="h-5 w-5" /> Códigos de Acesso
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Senhas exigidas para entrar nas áreas públicas restritas. Atualize semanalmente e divulgue apenas ao efetivo.
        </p>
      </div>

      {carregando ? (
        <p className="text-sm text-muted-foreground">Carregando...</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {codigosSincronizados.length > 0 && (
            <Card className="md:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">
                  {codigosSincronizados.map((i) => LABELS[i.chave] ?? i.chave).join(" + ")}
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Mesmo código para as duas áreas — alterar aqui atualiza as duas de uma vez.
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Código atual</Label>
                  <div className="flex gap-2">
                    <Input
                      value={rascunho[codigosSincronizados[0].chave] ?? ""}
                      onChange={(e) => editarSincronizado(codigosSincronizados[0].chave, e.target.value)}
                      className="font-mono tracking-widest"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      title="Gerar novo código"
                      onClick={() => gerarESincronizar(codigosSincronizados[0].chave)}
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      title="Copiar"
                      onClick={() => {
                        navigator.clipboard.writeText(rascunho[codigosSincronizados[0].chave] ?? "");
                        toast.success("Código copiado");
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Última atualização: {new Date(codigosSincronizados[0].updated_at).toLocaleString("pt-BR")}
                </p>
                <Button onClick={() => salvar(codigosSincronizados[0])} className="w-full">
                  <Save className="mr-2 h-4 w-4" /> Salvar código
                </Button>
              </CardContent>
            </Card>
          )}

          {codigosIndividuais.map((item) => (
            <Card key={item.id}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{LABELS[item.chave] ?? item.chave}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Código atual</Label>
                  <div className="flex gap-2">
                    <Input
                      value={rascunho[item.chave] ?? ""}
                      onChange={(e) => editarSincronizado(item.chave, e.target.value)}
                      className="font-mono tracking-widest"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      title="Gerar novo código"
                      onClick={() => gerarESincronizar(item.chave)}
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      title="Copiar"
                      onClick={() => {
                        navigator.clipboard.writeText(rascunho[item.chave] ?? "");
                        toast.success("Código copiado");
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Última atualização: {new Date(item.updated_at).toLocaleString("pt-BR")}
                </p>
                <Button onClick={() => salvar(item)} className="w-full">
                  <Save className="mr-2 h-4 w-4" /> Salvar código
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <JuridicoContas />
      <CorregedoriaContas />
    </div>
  );
}
