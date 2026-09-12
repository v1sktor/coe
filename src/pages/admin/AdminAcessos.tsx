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
  bopc: "BOPC / BIC",
  diligencias: "Relatório de Diligências",
  juridico: "Jurídico",
  corregedoria: "Corregedoria",
};

const ALFABETO = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function gerarCodigo() {
  let parte1 = "";
  let parte2 = "";
  for (let i = 0; i < 4; i++) parte1 += ALFABETO[Math.floor(Math.random() * ALFABETO.length)];
  for (let i = 0; i < 4; i++) parte2 += ALFABETO[Math.floor(Math.random() * ALFABETO.length)];
  return `${parte1}-${parte2}`;
}

function formatarCodigo(valor: string) {
  const limpo = valor.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8);
  if (limpo.length <= 4) return limpo;
  return `${limpo.slice(0, 4)}-${limpo.slice(4)}`;
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
    const { error } = await supabase
      .from("access_codes")
      .update({ codigo: novo, updated_by: sess.session?.user.id ?? null })
      .eq("id", item.id);
    if (error) return toast.error("Erro ao salvar código");
    toast.success(`Código de ${LABELS[item.chave] ?? item.chave} atualizado`);
    carregar();
  };

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
          {itens.map((item) => (
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
                      onChange={(e) =>
                        setRascunho((p) => ({
                          ...p,
                          [item.chave]: formatarCodigo(e.target.value),
                        }))
                      }
                      className="font-mono tracking-widest"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      title="Gerar novo código"
                      onClick={() => setRascunho((p) => ({ ...p, [item.chave]: gerarCodigo() }))}
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
