import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { usePermission } from "@/hooks/usePermission";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Download, Lock, Plus, Pencil, Trash2, Upload } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import logoPcsp from "@/assets/logo-pcsp.png";


interface Block {
  id: string;
  chave: string;
  titulo: string | null;
  conteudo: string;
  ordem: number;
}
interface Doc {
  id: string;
  titulo: string;
  descricao: string | null;
  arquivo_url: string;
  ordem: number;
}

export default function Apresentacao() {
  const { allowed } = usePermission("apresentacao.manage");
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [docs, setDocs] = useState<Doc[]>([]);
  const [blockOpen, setBlockOpen] = useState(false);
  const [docOpen, setDocOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState<Block | null>(null);
  const [editingDoc, setEditingDoc] = useState<Doc | null>(null);
  const [blockForm, setBlockForm] = useState({ chave: "", titulo: "", conteudo: "", ordem: 0 });
  const [docForm, setDocForm] = useState({ titulo: "", descricao: "", arquivo_url: "", ordem: 0 });
  const [uploading, setUploading] = useState(false);

  async function load() {
    const [b, d] = await Promise.all([
      supabase.from("apresentacao_content").select("*").order("ordem"),
      supabase.from("apresentacao_docs").select("*").order("ordem"),
    ]);
    setBlocks((b.data ?? []) as Block[]);
    setDocs((d.data ?? []) as Doc[]);
  }
  useEffect(() => {
    load();
  }, []);

  function editBlock(b: Block) {
    setEditingBlock(b);
    setBlockForm({ chave: b.chave, titulo: b.titulo ?? "", conteudo: b.conteudo, ordem: b.ordem });
    setBlockOpen(true);
  }
  async function saveBlock() {
    if (!blockForm.chave.trim()) return toast.error("Chave obrigatória");
    const payload = { ...blockForm, titulo: blockForm.titulo || null };
    const res = editingBlock
      ? await supabase.from("apresentacao_content").update(payload).eq("id", editingBlock.id)
      : await supabase.from("apresentacao_content").insert(payload);
    if (res.error) return toast.error(res.error.message);
    setBlockOpen(false);
    setEditingBlock(null);
    load();
  }
  async function removeBlock(b: Block) {
    if (!confirm(`Excluir bloco "${b.chave}"?`)) return;
    await supabase.from("apresentacao_content").delete().eq("id", b.id);
    load();
  }

  function editDoc(d: Doc) {
    setEditingDoc(d);
    setDocForm({
      titulo: d.titulo,
      descricao: d.descricao ?? "",
      arquivo_url: d.arquivo_url,
      ordem: d.ordem,
    });
    setDocOpen(true);
  }
  async function uploadDoc(file: File) {
    setUploading(true);
    const path = `apresentacao/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("documentos").upload(path, file);
    if (error) {
      setUploading(false);
      return toast.error(error.message);
    }
    const { data } = await supabase.storage
      .from("documentos")
      .createSignedUrl(path, 60 * 60 * 24 * 365 * 5);
    setDocForm((f) => ({ ...f, arquivo_url: data?.signedUrl ?? "" }));
    setUploading(false);
    toast.success("Arquivo enviado");
  }
  async function saveDoc() {
    if (!docForm.titulo.trim() || !docForm.arquivo_url) return toast.error("Título e arquivo obrigatórios");
    const payload = { ...docForm, descricao: docForm.descricao || null };
    const res = editingDoc
      ? await supabase.from("apresentacao_docs").update(payload).eq("id", editingDoc.id)
      : await supabase.from("apresentacao_docs").insert(payload);
    if (res.error) return toast.error(res.error.message);
    setDocOpen(false);
    setEditingDoc(null);
    setDocForm({ titulo: "", descricao: "", arquivo_url: "", ordem: 0 });
    load();
  }
  async function removeDoc(d: Doc) {
    if (!confirm(`Excluir "${d.titulo}"?`)) return;
    await supabase.from("apresentacao_docs").delete().eq("id", d.id);
    load();
  }

  const get = (key: string) => blocks.find((b) => b.chave === key);
  const heroTitulo = get("hero_titulo")?.conteudo ?? "Polícia Civil SP";
  const heroSubtitulo = get("hero_subtitulo")?.conteudo ?? "";
  const missao = get("missao");
  const historia = get("historia");
  const contato = get("contato");
  const extras = blocks.filter(
    (b) => !["hero_titulo", "hero_subtitulo", "missao", "historia", "contato"].includes(b.chave),
  );

  return (
    <div className="min-h-screen flex flex-col bg-background relative">
      <div className="absolute inset-0 bg-gradient-hero pointer-events-none" />
      <div className="absolute inset-0 bg-tactical-grid opacity-[0.05] pointer-events-none" />

      <header className="relative z-10 bg-primary text-primary-foreground">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-3">
            <img src={logoPcsp} alt="Brasão da Polícia Civil do Estado de São Paulo" className="h-9 w-9 object-contain" />
            <span className="flex flex-col leading-tight">
              <span className="font-display text-base font-semibold tracking-wide">
                Polícia Civil do Estado de São Paulo
              </span>
              <span className="text-[11px] text-primary-foreground/70">
                Secretaria da Segurança Pública
              </span>
            </span>
          </Link>
          <Button asChild size="sm" variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
            <Link to="/login">
              <Lock className="mr-2 h-3 w-3" /> Acesso
            </Link>
          </Button>
        </div>
      </header>


      <main className="relative z-10 flex-1 px-6 lg:px-10 py-10 max-w-5xl mx-auto w-full space-y-10">
        {/* Hero */}
        <section className="text-center py-10">
          <h1 className="font-display text-5xl md:text-7xl uppercase tracking-tight">
            {heroTitulo}
          </h1>
          {heroSubtitulo && (
            <p className="mt-4 text-muted-foreground uppercase tracking-[0.3em] text-sm">
              {heroSubtitulo}
            </p>
          )}
        </section>

        {/* Blocos institucionais */}
        {[missao, historia, contato, ...extras].filter(Boolean).map((b) => (
          <section key={b!.id}>
            <div className="flex items-start justify-between gap-3">
              <h2 className="font-display text-2xl uppercase tracking-wider text-primary">
                {b!.titulo ?? b!.chave}
              </h2>
              {allowed && (
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" onClick={() => editBlock(b!)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-destructive"
                    onClick={() => removeBlock(b!)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            <p className="mt-3 whitespace-pre-wrap text-foreground/90">{b!.conteudo}</p>
          </section>
        ))}

        {allowed && (
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setEditingBlock(null);
                setBlockForm({ chave: "", titulo: "", conteudo: "", ordem: blocks.length });
                setBlockOpen(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" /> Novo bloco
            </Button>
          </div>
        )}

        {/* Documentos */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-2xl uppercase tracking-wider text-primary">
              Documentos
            </h2>
            {allowed && (
              <Button
                size="sm"
                onClick={() => {
                  setEditingDoc(null);
                  setDocForm({ titulo: "", descricao: "", arquivo_url: "", ordem: docs.length });
                  setDocOpen(true);
                }}
              >
                <Plus className="mr-2 h-4 w-4" /> Novo documento
              </Button>
            )}
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {docs.length === 0 && (
              <p className="text-muted-foreground text-sm">Nenhum documento disponível.</p>
            )}
            {docs.map((d) => (
              <Card key={d.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="font-display uppercase tracking-wide text-base">
                      {d.titulo}
                    </CardTitle>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" asChild>
                        <a href={d.arquivo_url} target="_blank" rel="noreferrer">
                          <Download className="h-4 w-4" />
                        </a>
                      </Button>
                      {allowed && (
                        <>
                          <Button size="icon" variant="ghost" onClick={() => editDoc(d)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="text-destructive"
                            onClick={() => removeDoc(d)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardHeader>
                {d.descricao && (
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{d.descricao}</p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        Polícia Civil do Estado de São Paulo
      </footer>

      {/* Dialog: bloco */}
      <Dialog open={blockOpen} onOpenChange={setBlockOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingBlock ? "Editar bloco" : "Novo bloco"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Chave</Label>
              <Input
                value={blockForm.chave}
                disabled={!!editingBlock}
                onChange={(e) => setBlockForm({ ...blockForm, chave: e.target.value })}
              />
            </div>
            <div>
              <Label>Título</Label>
              <Input
                value={blockForm.titulo}
                onChange={(e) => setBlockForm({ ...blockForm, titulo: e.target.value })}
              />
            </div>
            <div>
              <Label>Conteúdo</Label>
              <Textarea
                rows={6}
                value={blockForm.conteudo}
                onChange={(e) => setBlockForm({ ...blockForm, conteudo: e.target.value })}
              />
            </div>
            <div>
              <Label>Ordem</Label>
              <Input
                type="number"
                value={blockForm.ordem}
                onChange={(e) =>
                  setBlockForm({ ...blockForm, ordem: parseInt(e.target.value) || 0 })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setBlockOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={saveBlock}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog: doc */}
      <Dialog open={docOpen} onOpenChange={setDocOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingDoc ? "Editar documento" : "Novo documento"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Título</Label>
              <Input
                value={docForm.titulo}
                onChange={(e) => setDocForm({ ...docForm, titulo: e.target.value })}
              />
            </div>
            <div>
              <Label>Descrição</Label>
              <Textarea
                rows={3}
                value={docForm.descricao}
                onChange={(e) => setDocForm({ ...docForm, descricao: e.target.value })}
              />
            </div>
            <div>
              <Label>Arquivo</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  disabled={uploading}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) uploadDoc(f);
                  }}
                />
                {uploading && <Upload className="h-4 w-4 animate-pulse" />}
              </div>
              {docForm.arquivo_url && (
                <a
                  href={docForm.arquivo_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-primary underline"
                >
                  Ver arquivo enviado
                </a>
              )}
            </div>
            <div>
              <Label>Ordem</Label>
              <Input
                type="number"
                value={docForm.ordem}
                onChange={(e) => setDocForm({ ...docForm, ordem: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDocOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={saveDoc}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
