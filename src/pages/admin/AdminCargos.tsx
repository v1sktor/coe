import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Tables } from "@/integrations/supabase/types";

type CargoRow = Tables<"cargos">;
type PermissaoRow = Tables<"permissoes">;

const AdminCargos = () => {
  const { toast } = useToast();
  const [cargos, setCargos] = useState<(CargoRow & { permissao_ids: string[] })[]>([]);
  const [permissoes, setPermissoes] = useState<PermissaoRow[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formNome, setFormNome] = useState("");
  const [formNivel, setFormNivel] = useState(1);
  const [formPerms, setFormPerms] = useState<string[]>([]);

  const fetchData = async () => {
    const { data: cargosData } = await supabase.from("cargos").select("*").order("nivel_hierarquico");
    const { data: permsData } = await supabase.from("permissoes").select("*");
    const { data: cpData } = await supabase.from("cargo_permissoes").select("*");

    if (permsData) setPermissoes(permsData);
    if (cargosData && cpData) {
      setCargos(
        cargosData.map((c) => ({
          ...c,
          permissao_ids: cpData.filter((cp) => cp.cargo_id === c.id).map((cp) => cp.permissao_id),
        }))
      );
    }
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => {
    setEditingId(null);
    setFormNome("");
    setFormNivel(cargos.length + 1);
    setFormPerms([]);
    setDialogOpen(true);
  };

  const openEdit = (cargo: CargoRow & { permissao_ids: string[] }) => {
    setEditingId(cargo.id);
    setFormNome(cargo.nome);
    setFormNivel(cargo.nivel_hierarquico);
    setFormPerms(cargo.permissao_ids);
    setDialogOpen(true);
  };

  const togglePerm = (permId: string) => {
    setFormPerms((prev) => prev.includes(permId) ? prev.filter((p) => p !== permId) : [...prev, permId]);
  };

  const handleSave = async () => {
    if (!formNome.trim()) {
      toast({ title: "Erro", description: "Nome é obrigatório.", variant: "destructive" });
      return;
    }

    if (editingId) {
      const { error } = await supabase.from("cargos").update({ nome: formNome, nivel_hierarquico: formNivel }).eq("id", editingId);
      if (error) { toast({ title: "Erro", description: error.message, variant: "destructive" }); return; }
      // Sync permissions
      await supabase.from("cargo_permissoes").delete().eq("cargo_id", editingId);
      if (formPerms.length > 0) {
        await supabase.from("cargo_permissoes").insert(formPerms.map((p) => ({ cargo_id: editingId, permissao_id: p })));
      }
      toast({ title: "Cargo atualizado" });
    } else {
      const { data, error } = await supabase.from("cargos").insert({ nome: formNome, nivel_hierarquico: formNivel }).select().single();
      if (error || !data) { toast({ title: "Erro", description: error?.message, variant: "destructive" }); return; }
      if (formPerms.length > 0) {
        await supabase.from("cargo_permissoes").insert(formPerms.map((p) => ({ cargo_id: data.id, permissao_id: p })));
      }
      toast({ title: "Cargo criado" });
    }
    setDialogOpen(false);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("cargos").delete().eq("id", id);
    if (error) { toast({ title: "Erro", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Cargo removido" });
    fetchData();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold uppercase tracking-wide">Cargos e Funções</h1>
          <p className="text-muted-foreground mt-1">Gerencie cargos, níveis hierárquicos e permissões</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate} className="font-display uppercase tracking-wider">
              <Plus className="mr-2 h-4 w-4" />
              Novo Cargo
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="font-display uppercase tracking-wide">
                {editingId ? "Editar Cargo" : "Novo Cargo"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Nome do Cargo</Label>
                <Input value={formNome} onChange={(e) => setFormNome(e.target.value)} placeholder="Ex: Tenente" className="bg-secondary border-border" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Nível Hierárquico</Label>
                <Input type="number" min={1} value={formNivel} onChange={(e) => setFormNivel(Number(e.target.value))} className="bg-secondary border-border" />
                <p className="text-xs text-muted-foreground">1 = mais alto (Comandante)</p>
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Permissões</Label>
                <div className="space-y-2 bg-secondary/50 rounded-lg p-3">
                  {permissoes.map((perm) => (
                    <label key={perm.id} className="flex items-center gap-3 cursor-pointer py-1">
                      <Checkbox checked={formPerms.includes(perm.id)} onCheckedChange={() => togglePerm(perm.id)} />
                      <div>
                        <span className="text-sm font-medium">{perm.nome}</span>
                        {perm.descricao && <span className="text-xs text-muted-foreground ml-2">— {perm.descricao}</span>}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <Button onClick={handleSave} className="w-full font-display uppercase tracking-wider">
                {editingId ? "Salvar Alterações" : "Criar Cargo"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="font-display uppercase tracking-wide text-sm flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            Cargos Cadastrados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-display uppercase text-xs">Nível</TableHead>
                <TableHead className="font-display uppercase text-xs">Cargo</TableHead>
                <TableHead className="font-display uppercase text-xs">Permissões</TableHead>
                <TableHead className="font-display uppercase text-xs text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cargos.map((cargo) => (
                <TableRow key={cargo.id}>
                  <TableCell className="font-mono text-primary font-bold">{cargo.nivel_hierarquico}</TableCell>
                  <TableCell className="font-display font-semibold uppercase">{cargo.nome}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {cargo.permissao_ids.map((permId) => {
                        const perm = permissoes.find((p) => p.id === permId);
                        return perm ? (
                          <Badge key={permId} variant="outline" className="text-xs border-primary/30 text-primary">{perm.nome}</Badge>
                        ) : null;
                      })}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(cargo)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(cargo.id)} className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {cargos.length === 0 && (
                <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">Nenhum cargo cadastrado.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCargos;
