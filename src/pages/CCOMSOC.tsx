import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { usePermission } from "@/hooks/usePermission";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Megaphone } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface Post {
  id: string;
  titulo: string;
  resumo: string | null;
  corpo: string;
  publicado: boolean;
  created_at: string;
}

export default function CCOMSOC() {
  const { user } = useAuth();
  const { allowed } = usePermission("ccomsoc.manage");
  const [posts, setPosts] = useState<Post[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Post | null>(null);
  const [form, setForm] = useState({ titulo: "", resumo: "", corpo: "", publicado: true });

  async function load() {
    const { data, error } = await supabase
      .from("ccomsoc_posts")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setPosts(data as Post[]);
  }

  useEffect(() => {
    load();
  }, []);

  function startCreate() {
    setEditing(null);
    setForm({ titulo: "", resumo: "", corpo: "", publicado: true });
    setOpen(true);
  }

  function startEdit(p: Post) {
    setEditing(p);
    setForm({
      titulo: p.titulo,
      resumo: p.resumo ?? "",
      corpo: p.corpo,
      publicado: p.publicado,
    });
    setOpen(true);
  }

  async function save() {
    if (!form.titulo.trim()) return toast.error("Título obrigatório");
    const payload = {
      titulo: form.titulo,
      resumo: form.resumo || null,
      corpo: form.corpo,
      publicado: form.publicado,
      autor_id: user?.id,
    };
    const res = editing
      ? await supabase.from("ccomsoc_posts").update(payload).eq("id", editing.id)
      : await supabase.from("ccomsoc_posts").insert(payload);
    if (res.error) return toast.error(res.error.message);
    toast.success(editing ? "Post atualizado" : "Post publicado");
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl uppercase tracking-wider flex items-center gap-3">
            <Megaphone className="h-7 w-7 text-primary" /> CCOMSOC
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Comunicação Social do 4º BPChq
          </p>
        </div>
        {allowed && (
          <Button onClick={startCreate}>
            <Plus className="mr-2 h-4 w-4" /> Novo post
          </Button>
        )}
      </div>

      <div className="grid gap-4">
        {posts.length === 0 && (
          <p className="text-muted-foreground text-sm">Nenhum post publicado ainda.</p>
        )}
        {posts.map((p) => (
          <Card key={p.id}>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle className="font-display uppercase tracking-wide">
                    {p.titulo}
                  </CardTitle>
                  <CardDescription>
                    {new Date(p.created_at).toLocaleString("pt-BR")}
                    {!p.publicado && (
                      <Badge variant="outline" className="ml-2">
                        Rascunho
                      </Badge>
                    )}
                  </CardDescription>
                </div>
                {allowed && (
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => startEdit(p)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-destructive"
                      onClick={() => remove(p)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {p.resumo && <p className="text-sm text-muted-foreground italic">{p.resumo}</p>}
              <p className="whitespace-pre-wrap text-sm">{p.corpo}</p>
            </CardContent>
          </Card>
        ))}
      </div>

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
            <div className="flex items-center gap-2">
              <Switch
                checked={form.publicado}
                onCheckedChange={(v) => setForm({ ...form, publicado: v })}
              />
              <Label>Publicado</Label>
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
