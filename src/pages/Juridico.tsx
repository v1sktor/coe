import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { usePermission } from "@/hooks/usePermission";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Pencil, Trash2, Paperclip, Scale, FileText, X, Search, RefreshCw } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { UNIDADES } from "@/lib/unidades";
import { clearJuridicoSession, getJuridicoSession } from "@/components/JuridicoGate";

const MAX_MB = 25;

interface Anexo {
  path: string;
  name: string;
  type: string;
  size: number;
}

interface Investigacao {
  id: string;
  titulo: string;
  numero: string | null;
  tipo: string;
  unidade: string | null;
  envolvidos: string | null;
  descricao: string;
  status: string;
  anexos: Anexo[];
  autor_nome: string | null;
  created_at: string;
}

const STATUS: Record<string, { label: string; className: string }> = {
  em_andamento: { label: "Em andamento", className: "bg-primary/10 text-primary border-primary/30" },
  concluido: { label: "Concluído", className: "bg-emerald-500/10 text-emerald-700 border-emerald-500/30" },
  arquivado: { label: "Arquivado", className: "bg-muted text-muted-foreground border-border" },
};

const TIPOS = [
  { value: "investigacao", label: "Investigação" },
  { value: "inquerito", label: "Inquérito Policial" },
  { value: "processo", label: "Processo" },
  { value: "parecer", label: "Parecer Jurídico" },
  { value: "outro", label: "Outro" },
];

function gerarNumero() {
  const ano = new Date().getFullYear();
  const seq = String(Math.floor(Math.random() * 9999) + 1).padStart(4, "0");
  const dv = String(Math.floor(Math.random() * 90) + 10);
  return `${seq}/${ano}-${dv}`;
}

const emptyForm = {
  titulo: "",
  numero: "",
  tipo: "investigacao",
  unidade: "",
  envolvidos: "",
  descricao: "",
  status: "em_andamento",
};


export default function Juridico() {
  const { user } = useAuth();
  const { allowed: permitido, loading: loadingPerm } = usePermission("juridico");
  const allowed = permitido || !user;
  const [items, setItems] = useState<Investigacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<string>("todos");
  const [busca, setBusca] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Investigacao | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [anexos, setAnexos] = useState<Anexo[]>([]);
  const [uploading, setUploading] = useState(false);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("juridico_investigacoes")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setItems((data ?? []) as unknown as Investigacao[]);
    setLoading(false);
  }

  useEffect(() => {
    if (allowed) load();
    else setLoading(false);
  }, [allowed]);

  function startCreate() {
    setEditing(null);
    setForm({ ...emptyForm, numero: gerarNumero() });
    setAnexos([]);
    setOpen(true);
  }


  function startEdit(i: Investigacao) {
    setEditing(i);
    setForm({
      titulo: i.titulo,
      numero: i.numero ?? "",
      tipo: i.tipo,
      unidade: i.unidade ?? "",
      envolvidos: i.envolvidos ?? "",
      descricao: i.descricao ?? "",
      status: i.status,
    });
    setAnexos(i.anexos ?? []);
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
      const path = `juridico/${folder}/${crypto.randomUUID()}-${safeName}`;
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
    if (editing) {
      const { error } = await supabase
        .from("juridico_investigacoes")
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
        .from("juridico_investigacoes")
        .update({ anexos: next as any })
        .eq("id", editing.id);
      load();
    }
  }

  async function openAnexo(a: Anexo) {
    const { data, error } = await supabase.storage.from("documentos").createSignedUrl(a.path, 3600);
    if (error || !data?.signedUrl) return toast.error(error?.message ?? "Erro ao abrir anexo");
    window.open(data.signedUrl, "_blank");
  }

  async function save() {
    if (!form.titulo.trim()) return toast.error("Título obrigatório");
    const payload: any = {
      titulo: form.titulo.trim(),
      numero: form.numero.trim() || null,
      tipo: form.tipo,
      unidade: form.unidade || null,
      envolvidos: form.envolvidos.trim() || null,
      descricao: form.descricao,
      status: form.status,
      anexos: anexos as any,
    };
    if (editing) {
      const { error } = await supabase
        .from("juridico_investigacoes")
        .update(payload)
        .eq("id", editing.id);
      if (error) return toast.error(error.message);
      toast.success("Registro atualizado");
    } else {
      payload.criado_por = user?.id ?? null;
      payload.autor_nome = user?.email ?? null;
      const { error } = await supabase.from("juridico_investigacoes").insert(payload);
      if (error) return toast.error(error.message);
      toast.success("Investigação registrada");
    }
    setOpen(false);
    load();
  }

  async function remove(i: Investigacao) {
    if (!confirm(`Excluir "${i.titulo}"? Esta ação não pode ser desfeita.`)) return;
    if (i.anexos?.length) {
      await supabase.storage.from("documentos").remove(i.anexos.map((a) => a.path));
    }
    const { error } = await supabase.from("juridico_investigacoes").delete().eq("id", i.id);
    if (error) return toast.error(error.message);
    toast.success("Registro excluído");
    load();
  }

  const filtrados = items.filter((i) => {
    if (tab !== "todos" && i.status !== tab) return false;
    if (!busca.trim()) return true;
    const q = busca.toLowerCase();
    return (
      i.titulo.toLowerCase().includes(q) ||
      (i.numero ?? "").toLowerCase().includes(q) ||
      (i.envolvidos ?? "").toLowerCase().includes(q)
    );
  });

  if (loadingPerm) return null;

  if (!allowed) {
    return (
      <Card className="max-w-xl mx-auto mt-10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display">
            <Scale className="h-5 w-5 text-primary" /> Área Jurídica
          </CardTitle>
          <CardDescription>
            Acesso restrito. Somente administradores e cargos com a permissão “juridico” podem
            consultar e anexar investigações. Solicite a liberação à administração.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-primary flex items-center gap-2">
            <Scale className="h-6 w-6" /> Jurídico
          </h1>
          <p className="text-[13px] text-muted-foreground">
            Repositório de investigações, inquéritos e pareceres com anexos sigilosos.
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={startCreate}>
            <Plus className="mr-2 h-4 w-4" /> Nova investigação
          </Button>
          {!user && (
            <Button
              variant="outline"
              onClick={() => {
                clearJuridicoSession();
                window.location.href = "/login";
              }}
            >
              Sair
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="todos">Todos</TabsTrigger>
            <TabsTrigger value="em_andamento">Em andamento</TabsTrigger>
            <TabsTrigger value="concluido">Concluídos</TabsTrigger>
            <TabsTrigger value="arquivado">Arquivados</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por título, número ou envolvidos"
            className="pl-9"
          />
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Carregando…</p>
      ) : filtrados.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            Nenhum registro encontrado.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtrados.map((i) => {
            const st = STATUS[i.status] ?? STATUS.em_andamento;
            return (
              <Card key={i.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <CardTitle className="font-display text-base text-primary truncate">
                        {i.titulo}
                      </CardTitle>
                      <CardDescription className="font-mono text-[11px]">
                        {(TIPOS.find((t) => t.value === i.tipo)?.label ?? i.tipo).toUpperCase()}
                        {i.numero ? ` · Nº ${i.numero}` : ""}
                        {i.unidade ? ` · ${i.unidade}` : ""}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className={st.className}>
                      {st.label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {i.envolvidos && (
                    <p className="text-[12px] text-muted-foreground">
                      <span className="font-medium text-foreground">Envolvidos:</span> {i.envolvidos}
                    </p>
                  )}
                  {i.descricao && (
                    <p className="text-[13px] leading-relaxed text-muted-foreground line-clamp-4 whitespace-pre-wrap">
                      {i.descricao}
                    </p>
                  )}
                  {i.anexos?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {i.anexos.map((a) => (
                        <button
                          key={a.path}
                          onClick={() => openAnexo(a)}
                          className="inline-flex items-center gap-1 rounded border border-border bg-secondary px-2 py-1 text-[11px] hover:shadow-tactical"
                        >
                          <FileText className="h-3 w-3" /> {a.name}
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-1">
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {new Date(i.created_at).toLocaleString("pt-BR")}
                      {i.autor_nome ? ` · ${i.autor_nome}` : ""}
                    </span>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => startEdit(i)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive"
                        onClick={() => remove(i)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">
              {editing ? "Editar registro" : "Nova investigação"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label>Título *</Label>
              <Input
                value={form.titulo}
                onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                placeholder="Ex.: Investigação — Organização criminosa Zona Norte"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="grid gap-2">
                <Label>Número</Label>
                <div className="flex gap-2">
                  <Input
                    value={form.numero}
                    onChange={(e) => setForm({ ...form, numero: e.target.value })}
                    placeholder="0000/2026-00"
                    className="font-mono"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    title="Gerar novo número"
                    onClick={() => setForm({ ...form, numero: gerarNumero() })}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Tipo</Label>
                <Select value={form.tipo} onValueChange={(v) => setForm({ ...form, tipo: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TIPOS.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(STATUS).map(([v, s]) => (
                      <SelectItem key={v} value={v}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label>Unidade</Label>
                <Select
                  value={form.unidade || undefined}
                  onValueChange={(v) => setForm({ ...form, unidade: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {UNIDADES.map((u) => (
                      <SelectItem key={u.sigla} value={u.sigla}>
                        {u.sigla}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Envolvidos</Label>
                <Input
                  value={form.envolvidos}
                  onChange={(e) => setForm({ ...form, envolvidos: e.target.value })}
                  placeholder="Nomes / RGs"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Descrição / andamento</Label>
              <Textarea
                rows={6}
                value={form.descricao}
                onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                placeholder="Relato dos fatos, diligências realizadas, conclusões…"
              />
            </div>

            <div className="grid gap-2">
              <Label className="flex items-center gap-2">
                <Paperclip className="h-4 w-4" /> Anexos (PDF, imagens, documentos — até {MAX_MB}MB)
              </Label>
              <Input
                type="file"
                multiple
                disabled={uploading}
                onChange={(e) => {
                  handleUpload(e.target.files);
                  e.target.value = "";
                }}
              />
              {anexos.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {anexos.map((a) => (
                    <span
                      key={a.path}
                      className="inline-flex items-center gap-2 rounded border border-border bg-secondary px-2 py-1 text-[11px]"
                    >
                      <button type="button" onClick={() => openAnexo(a)} className="underline-offset-2 hover:underline">
                        {a.name}
                      </button>
                      <button type="button" onClick={() => removeAnexo(a)} className="text-destructive">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={save} disabled={uploading}>
              {uploading ? "Enviando anexos…" : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
