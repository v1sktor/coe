import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Shirt, Upload, Image } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface FrotaItem {
  id: string;
  categoria: string;
  nome: string;
  descricao: string | null;
  imagem_url: string | null;
  ordem: number;
}

const AdminFrota = () => {
  const { toast } = useToast();
  const [itens, setItens] = useState<FrotaItem[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formCategoria, setFormCategoria] = useState<"fardamento" | "viatura">("fardamento");
  const [formNome, setFormNome] = useState("");
  const [formDescricao, setFormDescricao] = useState("");
  const [formOrdem, setFormOrdem] = useState(0);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadTargetId, setUploadTargetId] = useState<string | null>(null);

  const fetchData = async () => {
    const { data } = await supabase.from("frota_itens").select("*").order("categoria").order("ordem");
    if (data) setItens(data as FrotaItem[]);
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => {
    setEditingId(null);
    setFormCategoria("fardamento");
    setFormNome("");
    setFormDescricao("");
    setFormOrdem(itens.length);
    setDialogOpen(true);
  };

  const openEdit = (item: FrotaItem) => {
    setEditingId(item.id);
    setFormCategoria(item.categoria as "fardamento" | "viatura");
    setFormNome(item.nome);
    setFormDescricao(item.descricao ?? "");
    setFormOrdem(item.ordem);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formNome.trim()) return;
    const payload = {
      categoria: formCategoria,
      nome: formNome,
      descricao: formDescricao || null,
      ordem: formOrdem,
    };
    if (editingId) {
      const { error } = await supabase.from("frota_itens").update({ ...payload, updated_at: new Date().toISOString() }).eq("id", editingId);
      if (error) { toast({ title: "Erro", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Item atualizado" });
    } else {
      const { error } = await supabase.from("frota_itens").insert(payload);
      if (error) { toast({ title: "Erro", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Item criado" });
    }
    setDialogOpen(false);
    fetchData();
  };

  const handleDelete = async (item: FrotaItem) => {
    if (!confirm(`Excluir "${item.nome}"?`)) return;
    const { error } = await supabase.from("frota_itens").delete().eq("id", item.id);
    if (error) { toast({ title: "Erro", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Item removido" });
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

    await supabase.storage.from("frota").remove([path]);

    const { error: uploadError } = await supabase.storage.from("frota").upload(path, file, { upsert: true });
    if (uploadError) {
      toast({ title: "Erro no upload", description: uploadError.message, variant: "destructive" });
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("frota").getPublicUrl(path);
    const { error: updateError } = await supabase
      .from("frota_itens")
      .update({ imagem_url: urlData.publicUrl, updated_at: new Date().toISOString() })
      .eq("id", uploadTargetId);
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
          <h1 className="font-display text-3xl font-bold uppercase tracking-wide">Fardamentos e Viaturas</h1>
          <p className="text-muted-foreground mt-1">Gerencie o catálogo público exibido na home.</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate} className="font-display uppercase tracking-wider">
              <Plus className="mr-2 h-4 w-4" />
              Novo item
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="font-display uppercase tracking-wide">
                {editingId ? "Editar item" : "Novo item"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Categoria</Label>
                <Select value={formCategoria} onValueChange={(v) => setFormCategoria(v as "fardamento" | "viatura")}>
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fardamento">Fardamento</SelectItem>
                    <SelectItem value="viatura">Viatura</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Nome</Label>
                <Input value={formNome} onChange={(e) => setFormNome(e.target.value)} placeholder="Ex: Uniforme Operacional / Viatura Tática" className="bg-secondary border-border" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Descrição</Label>
                <Textarea rows={4} value={formDescricao} onChange={(e) => setFormDescricao(e.target.value)} className="bg-secondary border-border" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Ordem de exibição</Label>
                <Input type="number" value={formOrdem} onChange={(e) => setFormOrdem(Number(e.target.value))} className="bg-secondary border-border" />
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
            <Shirt className="h-4 w-4 text-primary" />
            Itens cadastrados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-display uppercase text-xs">Foto</TableHead>
                <TableHead className="font-display uppercase text-xs">Categoria</TableHead>
                <TableHead className="font-display uppercase text-xs">Nome</TableHead>
                <TableHead className="font-display uppercase text-xs">Ordem</TableHead>
                <TableHead className="font-display uppercase text-xs text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {itens.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {item.imagem_url ? (
                      <img src={item.imagem_url} alt={item.nome} className="h-10 w-10 object-cover rounded" />
                    ) : (
                      <div className="h-10 w-10 rounded bg-secondary flex items-center justify-center">
                        <Image className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="capitalize text-muted-foreground">{item.categoria}</TableCell>
                  <TableCell className="font-display font-semibold uppercase">{item.nome}</TableCell>
                  <TableCell className="font-mono text-primary">{item.ordem}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleUploadClick(item.id)} disabled={uploading} title="Upload foto">
                        <Upload className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openEdit(item)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(item)} className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {itens.length === 0 && (
                <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">Nenhum item cadastrado.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminFrota;
