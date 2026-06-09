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
  Paperclip,
  Upload,
  FileText,
  Image as ImageIcon,
  Download,
  X,
} from "lucide-react";
import { toast } from "@/components/ui/sonner";

type Status = "pendente" | "aprovado" | "rejeitado";

interface Anexo {
  path: string;
  name: string;
  type: string;
  size: number;
}

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
  anexos: Anexo[];
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

const MAX_MB = 15;
const ACCEPT =
  ".pdf,.png,.jpg,.jpeg,.webp,.gif,application/pdf,image/png,image/jpeg,image/webp,image/gif";

function isImage(type: string) {
  return type.startsWith("image/");
}
function fmtSize(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / (1024 * 1024)).toFixed(1)} MB`;
}

export default function CCOMSOC() {
  const { user } = useAuth();
  const { allowed: canManage } = usePermission("ccomsoc.manage");

  const [posts, setPosts] = useState<Post[]>([]);
  const [tab, setTab] = useState<"todos" | Status>("todos");

  // create/edit
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Post | null>(null);
  const [form, setForm] = useState({ titulo: "", resumo: "", corpo: "" });
  const [anexos, setAnexos] = useState<Anexo[]>([]);
  const [uploading, setUploading] = useState(false);

  // rejection
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectMotivo, setRejectMotivo] = useState("");

  async function load() {
    const { data, error } = await supabase
      .from("ccomsoc_posts")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else
      setPosts(
        (data ?? []).map((p: any) => ({
          ...p,
          anexos: Array.isArray(p.anexos) ? p.anexos : [],
        })) as Post[]
      );
  }
  useEffect(() => {
    load();
  }, []);

  function startCreate() {
    setEditing(null);
    setForm({ titulo: "", resumo: "", corpo: "" });
    setAnexos([]);
    setOpen(true);
  }
  function startEdit(p: Post) {
    setEditing(p);
    setForm({ titulo: p.titulo, resumo: p.resumo ?? "", corpo: p.corpo });
    setAnexos(p.anexos ?? []);
    setOpen(true);
  }

  async function handleUpload(files: FileList | null) {
    if (!files || !files.length || !user) return;
    setUploading(true);
    const folder = editing?.id ?? `tmp/${user.id}/${Date.now()}`;
    const added: Anexo[] = [];
    for (const file of Array.from(files)) {
      if (file.size > MAX_MB * 1024 * 1024) {
        toast.error(`${file.name}: excede ${MAX_MB}MB`);
        continue;
      }
      const safeName = file.name.replace(/[^\w.\-]+/g, "_");
      const path = `ccomsoc/${folder}/${crypto.randomUUID()}-${safeName}`;
      const { error } = await supabase.storage
        .from("documentos")
        .upload(path, file, { contentType: file.type, upsert: false });
      if (error) {
        toast.error(`${file.name}: ${error.message}`);
        continue;
      }
      added.push({ path, name: file.name, type: file.type, size: file.size });
    }
    setUploading(false);
    if (!added.length) return;
    const next = [...anexos, ...added];
    setAnexos(next);
    // Persiste imediatamente se estiver editando um post existente
    if (editing) {
      const { error } = await supabase
        .from("ccomsoc_posts")
        .update({ anexos: next as any })
        .eq("id", editing.id);
      if (error) toast.error(error.message);
      else {
        toast.success(`${added.length} anexo(s) adicionado(s)`);
        load();
      }
    } else {
      toast.success(`${added.length} anexo(s) prontos`);
    }
  }

  async function removeAnexo(a: Anexo) {
    if (!confirm(`Remover anexo "${a.name}"?`)) return;
    await supabase.storage.from("documentos").remove([a.path]);
    const next = anexos.filter((x) => x.path !== a.path);
    setAnexos(next);
    if (editing) {
      await supabase
        .from("ccomsoc_posts")
        .update({ anexos: next as any })
        .eq("id", editing.id);
      load();
    }
  }

  async function openAnexo(a: Anexo) {
    const { data, error } = await supabase.storage
      .from("documentos")
      .createSignedUrl(a.path, 3600);
    if (error || !data?.signedUrl) return toast.error(error?.message ?? "Erro");
    window.open(data.signedUrl, "_blank");
  }

  async function save() {
    if (!form.titulo.trim()) return toast.error("Título obrigatório");
    if (editing) {
      const payload: any = {
        titulo: form.titulo,
        resumo: form.resumo || null,
        corpo: form.corpo,
        anexos: anexos as any,
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
        anexos: anexos as any,
      });
      if (error) return toast.error(error.message);
      toast.success("Post enviado para aprovação");
    }
    setOpen(false);
    load();
  }

  async function remove(p: Post) {
    if (!confirm(`Excluir "${p.titulo}"?`)) return;
    if (p.anexos?.length) {
      await supabase.storage.from("documentos").remove(p.anexos.map((a) => a.path));
    }
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
                          {p.anexos?.length > 0 && (
                            <Badge variant="outline" className="gap-1">
                              <Paperclip className="h-3 w-3" /> {p.anexos.length}
                            </Badge>
                          )}
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
                  <CardContent className="space-y-3">
                    {p.resumo && (
                      <p className="text-sm text-muted-foreground italic">{p.resumo}</p>
                    )}
                    <p className="whitespace-pre-wrap text-sm">{p.corpo}</p>

                    {p.anexos?.length > 0 && (
                      <div className="mt-2 space-y-1.5">
                        <p className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                          <Paperclip className="h-3 w-3" /> Anexos
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {p.anexos.map((a) => (
                            <button
                              key={a.path}
                              onClick={() => openAnexo(a)}
                              className="flex items-center gap-2 rounded-md border border-border bg-card/50 px-3 py-1.5 text-xs hover:bg-card hover:border-primary/50 transition"
                              title={`${a.name} · ${fmtSize(a.size)}`}
                            >
                              {isImage(a.type) ? (
                                <ImageIcon className="h-3.5 w-3.5 text-primary" />
                              ) : (
                                <FileText className="h-3.5 w-3.5 text-primary" />
                              )}
                              <span className="max-w-[200px] truncate">{a.name}</span>
                              <Download className="h-3 w-3 opacity-60" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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

            {/* Anexos */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Paperclip className="h-4 w-4" /> Anexos (PDF / imagens)
                </Label>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    multiple
                    accept={ACCEPT}
                    className="hidden"
                    disabled={uploading}
                    onChange={(e) => {
                      handleUpload(e.target.files);
                      e.target.value = "";
                    }}
                  />
                  <span className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 text-xs hover:bg-accent">
                    <Upload className="h-3.5 w-3.5" />
                    {uploading ? "Enviando..." : "Adicionar arquivos"}
                  </span>
                </label>
              </div>
              <p className="text-xs text-muted-foreground">
                Até {MAX_MB}MB por arquivo. PDF, PNG, JPG, WEBP, GIF.
              </p>
              {anexos.length > 0 && (
                <ul className="space-y-1.5">
                  {anexos.map((a) => (
                    <li
                      key={a.path}
                      className="flex items-center justify-between gap-2 rounded-md border border-border bg-card/50 px-3 py-2 text-sm"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {isImage(a.type) ? (
                          <ImageIcon className="h-4 w-4 text-primary shrink-0" />
                        ) : (
                          <FileText className="h-4 w-4 text-primary shrink-0" />
                        )}
                        <span className="truncate">{a.name}</span>
                        <span className="text-xs text-muted-foreground shrink-0">
                          {fmtSize(a.size)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7"
                          onClick={() => openAnexo(a)}
                          title="Abrir"
                        >
                          <Download className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 text-destructive"
                          onClick={() => removeAnexo(a)}
                          title="Remover"
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
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
            <Button onClick={save} disabled={uploading}>
              Salvar
            </Button>
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
