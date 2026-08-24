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
import { Plus, Pencil, Trash2, ScrollText, Upload, Download } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface Diretriz {
  id: string;
  titulo: string;
  numero: string | null;
  ano: number | null;
  vigencia_inicio: string | null;
  vigencia_fim: string | null;
  corpo: string;
  pdf_url: string | null;
  tags: string[];
}

export default function Diretrizes() {
  const { user } = useAuth();
  const { allowed } = usePermission("diretrizes.manage");
  const [items, setItems] = useState<Diretriz[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Diretriz | null>(null);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    titulo: "",
    numero: "",
    ano: "",
    vigencia_inicio: "",
    vigencia_fim: "",
    corpo: "",
    pdf_url: "",
    tags: "",
  });

  async function load() {
    const { data, error } = await supabase
      .from("diretrizes_coe")
      .select("*")
      .order("ano", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setItems(data as Diretriz[]);
  }
  useEffect(() => {
    load();
  }, []);

  function startCreate() {
    setEditing(null);
    setForm({
      titulo: "",
      numero: "",
      ano: new Date().getFullYear().toString(),
      vigencia_inicio: "",
      vigencia_fim: "",
      corpo: "",
      pdf_url: "",
      tags: "",
    });
    setOpen(true);
  }
  function startEdit(d: Diretriz) {
    setEditing(d);
    setForm({
      titulo: d.titulo,
      numero: d.numero ?? "",
      ano: d.ano?.toString() ?? "",
      vigencia_inicio: d.vigencia_inicio ?? "",
      vigencia_fim: d.vigencia_fim ?? "",
      corpo: d.corpo,
      pdf_url: d.pdf_url ?? "",
      tags: d.tags.join(", "),
    });
    setOpen(true);
  }

  async function uploadPdf(file: File) {
    setUploading(true);
    const path = `diretrizes/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("documentos").upload(path, file);
    if (error) {
      setUploading(false);
      return toast.error(error.message);
    }
    const { data } = await supabase.storage.from("documentos").createSignedUrl(path, 60 * 60 * 24 * 365 * 5);
    setForm((f) => ({ ...f, pdf_url: data?.signedUrl ?? "" }));
    setUploading(false);
    toast.success("PDF enviado");
  }

  async function save() {
    if (!form.titulo.trim()) return toast.error("Título obrigatório");
    const payload = {
      titulo: form.titulo,
      numero: form.numero || null,
      ano: form.ano ? parseInt(form.ano) : null,
      vigencia_inicio: form.vigencia_inicio || null,
      vigencia_fim: form.vigencia_fim || null,
      corpo: form.corpo,
      pdf_url: form.pdf_url || null,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      criado_por: user?.id,
    };
    const res = editing
      ? await supabase.from("diretrizes_coe").update(payload).eq("id", editing.id)
      : await supabase.from("diretrizes_coe").insert(payload);
    if (res.error) return toast.error(res.error.message);
    toast.success("Salvo");
    setOpen(false);
    load();
  }

  async function remove(d: Diretriz) {
    if (!confirm(`Excluir "${d.titulo}"?`)) return;
    const { error } = await supabase.from("diretrizes_coe").delete().eq("id", d.id);
    if (error) return toast.error(error.message);
    load();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl uppercase tracking-wider flex items-center gap-3">
            <ScrollText className="h-7 w-7 text-primary" /> Diretrizes Institucionais
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Documentos oficiais do Comando de Operações Especiais
          </p>
        </div>
        {allowed && (
          <Button onClick={startCreate}>
            <Plus className="mr-2 h-4 w-4" /> Nova diretriz
          </Button>
        )}
      </div>

      <div className="grid gap-3">
        {items.length === 0 && (
          <p className="text-muted-foreground text-sm">Nenhuma diretriz publicada.</p>
        )}
        {items.map((d) => (
          <Card key={d.id}>
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <CardTitle className="font-display uppercase tracking-wide">
                    {d.numero && <span className="text-muted-foreground">[{d.numero}] </span>}
                    {d.titulo}
                  </CardTitle>
                  <CardDescription className="flex flex-wrap gap-1 mt-1">
                    {d.ano && <Badge variant="outline">{d.ano}</Badge>}
                    {d.tags.map((t) => (
                      <Badge key={t} variant="secondary">
                        {t}
                      </Badge>
                    ))}
                  </CardDescription>
                </div>
                <div className="flex gap-1">
                  {d.pdf_url && (
                    <Button size="icon" variant="ghost" asChild>
                      <a href={d.pdf_url} target="_blank" rel="noreferrer">
                        <Download className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                  {allowed && (
                    <>
                      <Button size="icon" variant="ghost" onClick={() => startEdit(d)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-destructive"
                        onClick={() => remove(d)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardHeader>
            {d.corpo && (
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{d.corpo}</p>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar diretriz" : "Nova diretriz"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Título</Label>
              <Input
                value={form.titulo}
                onChange={(e) => setForm({ ...form, titulo: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Número</Label>
                <Input
                  value={form.numero}
                  onChange={(e) => setForm({ ...form, numero: e.target.value })}
                />
              </div>
              <div>
                <Label>Ano</Label>
                <Input
                  type="number"
                  value={form.ano}
                  onChange={(e) => setForm({ ...form, ano: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Vigência início</Label>
                <Input
                  type="date"
                  value={form.vigencia_inicio}
                  onChange={(e) => setForm({ ...form, vigencia_inicio: e.target.value })}
                />
              </div>
              <div>
                <Label>Vigência fim</Label>
                <Input
                  type="date"
                  value={form.vigencia_fim}
                  onChange={(e) => setForm({ ...form, vigencia_fim: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label>Tags (separadas por vírgula)</Label>
              <Input
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
              />
            </div>
            <div>
              <Label>Corpo</Label>
              <Textarea
                rows={6}
                value={form.corpo}
                onChange={(e) => setForm({ ...form, corpo: e.target.value })}
              />
            </div>
            <div>
              <Label>PDF</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  accept="application/pdf"
                  disabled={uploading}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) uploadPdf(f);
                  }}
                />
                {form.pdf_url && (
                  <a
                    href={form.pdf_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-primary underline"
                  >
                    Ver arquivo
                  </a>
                )}
                {uploading && <Upload className="h-4 w-4 animate-pulse" />}
              </div>
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
