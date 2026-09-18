import { useState, useEffect, useRef, Fragment } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2, Star, Upload, Image } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const CATEGORIAS = [
  "Oficiais Superiores",
  "Oficiais Intermediários",
  "Oficiais Subalternos",
  "Praças Especiais",
  "Praças Graduados",
  "Praças",
];

interface Patente {
  id: string;
  nome: string;
  nivel_hierarquico: number;
  categoria: string | null;
  imagem_url: string | null;
}

const AdminPatentes = () => {
  const { toast } = useToast();
  const [patentes, setPatentes] = useState<Patente[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formNome, setFormNome] = useState("");
  const [formNivel, setFormNivel] = useState(1);
  const [formCategoria, setFormCategoria] = useState<string>(CATEGORIAS[0]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadTargetId, setUploadTargetId] = useState<string | null>(null);

  const fetchData = async () => {
    const { data } = await supabase.from("cargos").select("id, nome, nivel_hierarquico, categoria, imagem_url").order("nivel_hierarquico");
    if (data) setPatentes(data as Patente[]);
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => {
    setEditingId(null);
    setFormNome("");
    setFormNivel(patentes.length + 1);
    setFormCategoria(CATEGORIAS[0]);
    setDialogOpen(true);
  };

  const openEdit = (p: Patente) => {
    setEditingId(p.id);
    setFormNome(p.nome);
    setFormNivel(p.nivel_hierarquico);
    setFormCategoria(p.categoria ?? CATEGORIAS[0]);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formNome.trim()) return;
    if (editingId) {
      const { error } = await supabase.from("cargos").update({ nome: formNome, nivel_hierarquico: formNivel, categoria: formCategoria }).eq("id", editingId);
      if (error) { toast({ title: "Erro", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Patente atualizada" });
    } else {
      const { error } = await supabase.from("cargos").insert({ nome: formNome, nivel_hierarquico: formNivel, categoria: formCategoria });
      if (error) { toast({ title: "Erro", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Patente criada" });
    }
    setDialogOpen(false);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("cargos").delete().eq("id", id);
    if (error) { toast({ title: "Erro", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Patente removida" });
    fetchData();
  };

  const handleUploadClick = (id: string) => {
    setUploadTargetId(id);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !uploadTargetId) return;
    setUploading(true);

    const ext = file.name.split(".").pop();
    const path = `${uploadTargetId}.${ext}`;

    // Remove old file if exists
    await supabase.storage.from("patentes").remove([path]);

    const { error: uploadError } = await supabase.storage.from("patentes").upload(path, file, { upsert: true });
    if (uploadError) {
      toast({ title: "Erro no upload", description: uploadError.message, variant: "destructive" });
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("patentes").getPublicUrl(path);
    const { error: updateError } = await supabase.from("cargos").update({ imagem_url: urlData.publicUrl }).eq("id", uploadTargetId);
    if (updateError) {
      toast({ title: "Erro", description: updateError.message, variant: "destructive" });
    } else {
      toast({ title: "Imagem atualizada" });
    }

    setUploading(false);
    setUploadTargetId(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    fetchData();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold uppercase tracking-wide">Patentes</h1>
          <p className="text-muted-foreground mt-1">Gerencie patentes militares e suas insígnias</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate} className="font-display uppercase tracking-wider">
              <Plus className="mr-2 h-4 w-4" />
              Criar Patente
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="font-display uppercase tracking-wide">
                {editingId ? "Editar Patente" : "Nova Patente"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Nome</Label>
                <Input value={formNome} onChange={(e) => setFormNome(e.target.value)} placeholder="Ex: Agente de 2ª Classe" className="bg-secondary border-border" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Categoria</Label>
                <Select value={formCategoria} onValueChange={setFormCategoria}>
                  <SelectTrigger className="bg-secondary border-border"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIAS.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Nível Hierárquico</Label>
                <Input type="number" min={1} value={formNivel} onChange={(e) => setFormNivel(Number(e.target.value))} className="bg-secondary border-border" />
                <p className="text-xs text-muted-foreground">1 = mais alto (Coronel PM), quanto maior o número mais baixo na hierarquia</p>
              </div>
              <Button onClick={handleSave} className="w-full font-display uppercase tracking-wider">
                {editingId ? "Salvar" : "Criar"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="font-display uppercase tracking-wide text-sm flex items-center gap-2">
            <Star className="h-4 w-4 text-primary" />
            Patentes Cadastradas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-display uppercase text-xs">Nível</TableHead>
                <TableHead className="font-display uppercase text-xs">Insígnia</TableHead>
                <TableHead className="font-display uppercase text-xs">Patente</TableHead>
                <TableHead className="font-display uppercase text-xs text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patentes.map((p, idx) => {
                const categoria = p.categoria ?? "Sem categoria";
                const novaCategoria = idx === 0 || (patentes[idx - 1].categoria ?? "Sem categoria") !== categoria;
                return (
                  <Fragment key={p.id}>
                    {novaCategoria && (
                      <TableRow key={`cat-${categoria}`} className="hover:bg-transparent">
                        <TableCell colSpan={4} className="bg-secondary/60 font-display uppercase tracking-widest text-[11px] text-primary py-2">
                          {categoria}
                        </TableCell>
                      </TableRow>
                    )}
                    <TableRow key={p.id}>
                      <TableCell className="font-mono text-primary font-bold">{p.nivel_hierarquico}</TableCell>
                      <TableCell>
                        {p.imagem_url ? (
                          <img src={p.imagem_url} alt={p.nome} className="h-8 w-8 object-contain" />
                        ) : (
                          <div className="h-8 w-8 rounded bg-secondary flex items-center justify-center">
                            <Image className="h-4 w-4 text-muted-foreground" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-display font-semibold uppercase">{p.nome}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => handleUploadClick(p.id)} disabled={uploading} title="Upload insígnia">
                            <Upload className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => openEdit(p)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)} className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  </Fragment>
                );
              })}
              {patentes.length === 0 && (
                <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">Nenhuma patente cadastrada.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPatentes;
