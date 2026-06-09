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
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Plus,
  Pencil,
  Trash2,
  Megaphone,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import { toast } from "@/components/ui/sonner";

type Status = "pendente" | "aprovado" | "rejeitado";

interface Post {
  id: string;
  titulo: string;
  resumo: string | null;
  corpo: string;
  status: Status;
  autor_id: string | null;
  aprovado_por: string | null;
  aprovado_em: string | null;
  motivo_rejeicao: string | null;
  created_at: string;
}

const statusStyle: Record<Status, { label: string; cls: string; icon: any }> = {
  pendente: {
    label: "Pendente",
    cls: "bg-yellow-500/15 text-yellow-400 border-yellow-500/40",
    icon: Clock,
  },
  aprovado: {
    label: "Aprovado",
    cls: "bg-emerald-500/15 text-emerald-400 border-emerald-500/40",
    icon: CheckCircle2,
  },
  rejeitado: {
    label: "Rejeitado",
    cls: "bg-red-500/15 text-red-400 border-red-500/40",
    icon: XCircle,
  },
};

export default function CCOMSOC() {
  const { user } = useAuth();
  const { allowed: canManage } = usePermission("ccomsoc.manage");

  const [posts, setPosts] = useState<Post[]>([]);
  const [tab, setTab] = useState<"todos" | Status>("todos");

  // create/edit
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Post | null>(null);
  const [form, setForm] = useState({ titulo: "", resumo: "", corpo: "" });

  // rejection
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectMotivo, setRejectMotivo] = useState("");

  async function load() {
    const { data, error } = await supabase
      .from("ccomsoc_posts")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setPosts((data ?? []) as Post[]);
  }
  useEffect(() => {
    load();
  }, []);

  function startCreate() {
    setEditing(null);
    setForm({ titulo: "", resumo: "", corpo: "" });
    setOpen(true);
  }
  function startEdit(p: Post) {
    setEditing(p);
    setForm({ titulo: p.titulo, resumo: p.resumo ?? "", corpo: p.corpo });
    setOpen(true);
  }

  async function save() {
    if (!form.titulo.trim()) return toast.error("Título obrigatório");
    if (editing) {
      // Se autor edita rejeitado, volta para pendente para nova análise
      const payload: any = {
        titulo: form.titulo,
        resumo: form.resumo || null,
        corpo: form.corpo,
      };
      if (editing.autor_id === user?.id && editing.status === "rejeitado") {
        payload.status = "pendente";
        payload.motivo_rejeicao = null;
      }
      const { error } = await supabase
        .from("ccomsoc_posts")
        .update(payload)
        .eq("id", editing.id);
      if (error) return toast.error(error.message);
      toast.success("Post atualizado");
    } else {
      const { error } = await supabase.from("ccomsoc_posts").insert({
        titulo: form.titulo,
        resumo: form.resumo || null,
        corpo: form.corpo,
        autor_id: user?.id,
        status: "pendente",
      });
      if (error) return toast.error(error.message);
      toast.success("Post enviado para aprovação");
    }
    setOpen(false);
    load();
  }

  async function remove(p: Post) {
    if (!confirm(`Excluir "${p.titulo}"?`)) return;
    const { error } = await supabase.from("ccomsoc_posts").delete().eq("id", p.id);
    if (error) return toast.error(error.message);
    toast.success("Excluído");
    load();
  }

  async function aprovar(p: Post) {
    const { error } = await supabase
      .from("ccomsoc_posts")
      .update({
        status: "aprovado",
        aprovado_por: user?.id,
        aprovado_em: new Date().toISOString(),
        motivo_rejeicao: null,
      })
      .eq("id", p.id);
    if (error) return toast.error(error.message);
    toast.success("Post aprovado");
    load();
  }

  function startRejeitar(p: Post) {
    setRejectingId(p.id);
    setRejectMotivo(p.motivo_rejeicao ?? "");
  }
  async function confirmarRejeicao() {
    if (!rejectingId) return;
    if (!rejectMotivo.trim()) return toast.error("Informe o motivo da rejeição");
    const { error } = await supabase
      .from("ccomsoc_posts")
      .update({
        status: "rejeitado",
        aprovado_por: user?.id,
        aprovado_em: new Date().toISOString(),
        motivo_rejeicao: rejectMotivo.trim(),
      })
      .eq("id", rejectingId);
    if (error) return toast.error(error.message);
    toast.success("Post rejeitado");
    setRejectingId(null);
    setRejectMotivo("");
    load();
  }

  const counts = {
    todos: posts.length,
    pendente: posts.filter((p) => p.status === "pendente").length,
    aprovado: posts.filter((p) => p.status === "aprovado").length,
    rejeitado: posts.filter((p) => p.status === "rejeitado").length,
  };
  const visible =
    tab === "todos" ? posts : posts.filter((p) => p.status === tab);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-3xl uppercase tracking-wider flex items-center gap-3">
            <Megaphone className="h-7 w-7 text-primary" /> CCOMSOC
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Comunicação Social do 4º BPChq · workflow de aprovação
          </p>
        </div>
        <Button onClick={startCreate}>
          <Plus className="mr-2 h-4 w-4" /> Novo post
        </Button>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
        <TabsList>
          <TabsTrigger value="todos">Todos ({counts.todos})</TabsTrigger>
          <TabsTrigger value="pendente">
            Pendentes ({counts.pendente})
          </TabsTrigger>
          <TabsTrigger value="aprovado">Aprovados ({counts.aprovado})</TabsTrigger>
          <TabsTrigger value="rejeitado">
            Rejeitados ({counts.rejeitado})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={tab} className="mt-4">
          <div className="grid gap-4">
            {visible.length === 0 && (
              <p className="text-muted-foreground text-sm">Nenhum post nesta aba.</p>
            )}
            {visible.map((p) => {
              const s = statusStyle[p.status];
              const Icon = s.icon;
              const isAuthor = p.autor_id === user?.id;
              const canEdit =
                canManage || (isAuthor && p.status !== "aprovado");
              const canDelete = canEdit;
              return (
                <Card key={p.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1.5">
                        <CardTitle className="font-display uppercase tracking-wide">
                          {p.titulo}
                        </CardTitle>
                        <CardDescription className="flex flex-wrap items-center gap-2">
                          <span>{new Date(p.created_at).toLocaleString("pt-BR")}</span>
                          <Badge
                            variant="outline"
                            className={`gap-1 ${s.cls}`}
                          >
                            <Icon className="h-3 w-3" /> {s.label}
                          </Badge>
                          {isAuthor && (
                            <Badge variant="outline" className="text-xs">
                              Meu post
                            </Badge>
                          )}
                        </CardDescription>
                      </div>
                      <div className="flex flex-wrap gap-1 justify-end">
                        {canManage && p.status !== "aprovado" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-emerald-500/40 text-emerald-400 hover:text-emerald-300"
                            onClick={() => aprovar(p)}
                          >
                            <CheckCircle2 className="mr-1 h-4 w-4" /> Aprovar
                          </Button>
                        )}
                        {canManage && p.status !== "rejeitado" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-500/40 text-red-400 hover:text-red-300"
                            onClick={() => startRejeitar(p)}
                          >
                            <XCircle className="mr-1 h-4 w-4" /> Rejeitar
                          </Button>
                        )}
                        {canEdit && (
                          <Button size="icon" variant="ghost" onClick={() => startEdit(p)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                        )}
                        {canDelete && (
                          <Button
                            size="icon"
                            variant="ghost"
                            className="text-destructive"
                            onClick={() => remove(p)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {p.resumo && (
                      <p className="text-sm text-muted-foreground italic">{p.resumo}</p>
                    )}
                    <p className="whitespace-pre-wrap text-sm">{p.corpo}</p>
                    {p.status === "rejeitado" && p.motivo_rejeicao && (
                      <div className="mt-3 rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm">
                        <p className="text-red-300 font-semibold uppercase tracking-wide text-xs mb-1">
                          Motivo da rejeição
                        </p>
                        <p className="text-red-100/90 whitespace-pre-wrap">
                          {p.motivo_rejeicao}
                        </p>
                      </div>
                    )}
                    {p.status === "aprovado" && p.aprovado_em && (
                      <p className="text-xs text-muted-foreground">
                        Aprovado em {new Date(p.aprovado_em).toLocaleString("pt-BR")}
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialog criar/editar */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar post" : "Novo post"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Título</Label>
              <Input
                value={form.titulo}
                onChange={(e) => setForm({ ...form, titulo: e.target.value })}
              />
            </div>
            <div>
              <Label>Resumo</Label>
              <Input
                value={form.resumo}
                onChange={(e) => setForm({ ...form, resumo: e.target.value })}
              />
            </div>
            <div>
              <Label>Corpo</Label>
              <Textarea
                rows={8}
                value={form.corpo}
                onChange={(e) => setForm({ ...form, corpo: e.target.value })}
              />
            </div>
            {!editing && (
              <p className="text-xs text-muted-foreground">
                O post será enviado como <strong>pendente</strong> e ficará visível para o
                público após aprovação do comando.
              </p>
            )}
            {editing?.status === "rejeitado" && editing.autor_id === user?.id && (
              <p className="text-xs text-yellow-400">
                Ao salvar, o post voltará para a fila de pendentes.
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={save}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog rejeição */}
      <Dialog open={!!rejectingId} onOpenChange={(o) => !o && setRejectingId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejeitar post</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label>Motivo da rejeição</Label>
            <Textarea
              rows={4}
              value={rejectMotivo}
              onChange={(e) => setRejectMotivo(e.target.value)}
              placeholder="Explique brevemente para que o autor possa corrigir..."
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setRejectingId(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmarRejeicao}>
              <XCircle className="mr-2 h-4 w-4" /> Confirmar rejeição
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
