import { useEffect, useState } from "react";
import { Gavel, Plus, KeyRound, Trash2, Power } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

type Conta = {
  id: string;
  usuario: string;
  nome: string;
  ativo: boolean;
  created_at: string;
};

export default function CorregedoriaContas() {
  const [contas, setContas] = useState<Conta[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [form, setForm] = useState({ usuario: "", nome: "", senha: "" });
  const [salvando, setSalvando] = useState(false);

  const carregar = async () => {
    setCarregando(true);
    const { data, error } = await supabase
      .from("corregedoria_usuarios")
      .select("id, usuario, nome, ativo, created_at")
      .order("usuario");
    if (error) toast.error(error.message);
    setContas((data as Conta[]) ?? []);
    setCarregando(false);
  };

  useEffect(() => {
    carregar();
  }, []);

  const criar = async () => {
    if (!form.usuario.trim() || !form.nome.trim() || form.senha.length < 6) {
      return toast.error("Preencha usuário, nome e senha (mínimo 6 caracteres)");
    }
    setSalvando(true);
    const { error } = await supabase.rpc("corregedoria_criar_usuario", {
      _usuario: form.usuario,
      _nome: form.nome,
      _senha: form.senha,
    });
    setSalvando(false);
    if (error) return toast.error(error.message);
    toast.success("Conta da corregedoria criada");
    setForm({ usuario: "", nome: "", senha: "" });
    carregar();
  };

  const novaSenha = async (c: Conta) => {
    const senha = prompt(`Nova senha para "${c.usuario}" (mínimo 6 caracteres):`);
    if (!senha) return;
    if (senha.length < 6) return toast.error("Senha muito curta");
    const { error } = await supabase.rpc("corregedoria_definir_senha", { _id: c.id, _senha: senha });
    if (error) return toast.error(error.message);
    toast.success("Senha atualizada");
  };

  const alternarAtivo = async (c: Conta) => {
    const { error } = await supabase
      .from("corregedoria_usuarios")
      .update({ ativo: !c.ativo })
      .eq("id", c.id);
    if (error) return toast.error(error.message);
    carregar();
  };

  const excluir = async (c: Conta) => {
    if (!confirm(`Excluir a conta "${c.usuario}"?`)) return;
    const { error } = await supabase.from("corregedoria_usuarios").delete().eq("id", c.id);
    if (error) return toast.error(error.message);
    toast.success("Conta excluída");
    carregar();
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Gavel className="h-4 w-4" /> Contas da Corregedoria
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Logins exclusivos da Corregedoria. Somente administradores podem criar ou alterar.
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-4">
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Usuário</Label>
            <Input
              value={form.usuario}
              onChange={(e) => setForm({ ...form, usuario: e.target.value.toLowerCase() })}
              placeholder="ex.: corregedor.silva"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Nome</Label>
            <Input
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              placeholder="Nome completo"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Senha</Label>
            <Input
              type="text"
              value={form.senha}
              onChange={(e) => setForm({ ...form, senha: e.target.value })}
              placeholder="mínimo 6 caracteres"
            />
          </div>
          <div className="flex items-end">
            <Button onClick={criar} disabled={salvando} className="w-full">
              <Plus className="mr-2 h-4 w-4" /> Criar conta
            </Button>
          </div>
        </div>

        {carregando ? (
          <p className="text-sm text-muted-foreground">Carregando...</p>
        ) : contas.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhuma conta da corregedoria criada.</p>
        ) : (
          <div className="divide-y divide-border rounded border border-border">
            {contas.map((c) => (
              <div key={c.id} className="flex flex-wrap items-center justify-between gap-3 p-3">
                <div className="min-w-0">
                  <p className="font-medium">
                    {c.nome}{" "}
                    <span className="font-mono text-xs text-muted-foreground">@{c.usuario}</span>
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Criada em {new Date(c.created_at).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{c.ativo ? "Ativa" : "Inativa"}</Badge>
                  <Button size="sm" variant="outline" onClick={() => novaSenha(c)}>
                    <KeyRound className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => alternarAtivo(c)}>
                    <Power className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => excluir(c)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
