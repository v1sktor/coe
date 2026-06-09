import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { usePermission } from "@/hooks/usePermission";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plus, Pencil, Trash2, MapPin } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface Estatica {
  id: string;
  local: string;
  inicio: string;
  fim: string | null;
  efetivo_previsto: number | null;
  observacoes: string | null;
}

export default function Estaticas() {
  const { user } = useAuth();
  const { allowed } = usePermission("estaticas.manage");
  const [items, setItems] = useState<Estatica[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Estatica | null>(null);
  const [form, setForm] = useState({
    local: "",
    inicio: "",
    fim: "",
    efetivo_previsto: "",
    observacoes: "",
  });

  async function load() {
    const { data, error } = await supabase
      .from("estaticas")
      .select("*")
      .order("inicio", { ascending: false });
    if (error) toast.error(error.message);
    else setItems(data as Estatica[]);
  }
  useEffect(() => {
    load();
  }, []);

  function startCreate() {
    setEditing(null);
    setForm({ local: "", inicio: "", fim: "", efetivo_previsto: "", observacoes: "" });
    setOpen(true);
  }
  function startEdit(e: Estatica) {
    setEditing(e);
    setForm({
      local: e.local,
      inicio: e.inicio.slice(0, 16),
      fim: e.fim ? e.fim.slice(0, 16) : "",
      efetivo_previsto: e.efetivo_previsto?.toString() ?? "",
      observacoes: e.observacoes ?? "",
    });
    setOpen(true);
  }

  async function save() {
    if (!form.local.trim() || !form.inicio) return toast.error("Local e início obrigatórios");
    const payload = {
      local: form.local,
      inicio: new Date(form.inicio).toISOString(),
      fim: form.fim ? new Date(form.fim).toISOString() : null,
      efetivo_previsto: form.efetivo_previsto ? parseInt(form.efetivo_previsto) : null,
      observacoes: form.observacoes || null,
      criado_por: user?.id,
    };
    const res = editing
      ? await supabase.from("estaticas").update(payload).eq("id", editing.id)
      : await supabase.from("estaticas").insert(payload);
    if (res.error) return toast.error(res.error.message);
    toast.success("Salvo");
    setOpen(false);
    load();
  }

  async function remove(e: Estatica) {
    if (!confirm(`Excluir estática de ${e.local}?`)) return;
    const { error } = await supabase.from("estaticas").delete().eq("id", e.id);
    if (error) return toast.error(error.message);
    load();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl uppercase tracking-wider flex items-center gap-3">
            <MapPin className="h-7 w-7 text-primary" /> Estáticas
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Postos estáticos e escalas</p>
        </div>
        {allowed && (
          <Button onClick={startCreate}>
            <Plus className="mr-2 h-4 w-4" /> Nova estática
          </Button>
        )}
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {items.length === 0 && (
          <p className="text-muted-foreground text-sm">Nenhuma estática cadastrada.</p>
        )}
        {items.map((e) => (
          <Card key={e.id}>
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <CardTitle className="font-display uppercase tracking-wide text-base">
                    {e.local}
                  </CardTitle>
                  <CardDescription>
                    {new Date(e.inicio).toLocaleString("pt-BR")}
                    {e.fim && ` → ${new Date(e.fim).toLocaleString("pt-BR")}`}
                  </CardDescription>
                </div>
                {allowed && (
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => startEdit(e)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-destructive"
                      onClick={() => remove(e)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              {e.efetivo_previsto && (
                <p>
                  <span className="text-muted-foreground">Efetivo previsto:</span>{" "}
                  {e.efetivo_previsto}
                </p>
              )}
              {e.observacoes && (
                <p className="text-muted-foreground whitespace-pre-wrap">{e.observacoes}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Editar estática" : "Nova estática"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Local</Label>
              <Input
                value={form.local}
                onChange={(e) => setForm({ ...form, local: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Início</Label>
                <Input
                  type="datetime-local"
                  value={form.inicio}
                  onChange={(e) => setForm({ ...form, inicio: e.target.value })}
                />
              </div>
              <div>
                <Label>Fim</Label>
                <Input
                  type="datetime-local"
                  value={form.fim}
                  onChange={(e) => setForm({ ...form, fim: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label>Efetivo previsto</Label>
              <Input
                type="number"
                value={form.efetivo_previsto}
                onChange={(e) => setForm({ ...form, efetivo_previsto: e.target.value })}
              />
            </div>
            <div>
              <Label>Observações</Label>
              <Textarea
                rows={4}
                value={form.observacoes}
                onChange={(e) => setForm({ ...form, observacoes: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={save}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
