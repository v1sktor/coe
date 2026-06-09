import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

interface HierarquiaItem {
  id: string;
  membro_nome: string;
  rg: string | null;
  discord_id: string | null;
  data_entrada: string | null;
  cargo_id: string | null;
  superior_id: string | null;
  ordem: number;
  funcao: string | null;
  promocao: string | null;
  grupamento: string;
  cargo_nome?: string;
  cargo_imagem?: string | null;
  cargo_nivel?: number;
}

interface CargoOption {
  id: string;
  nome: string;
  nivel_hierarquico: number;
  imagem_url: string | null;
}

type GrupamentoFilter = "TOR" | "ROCAM" | "GERAL";

const Hierarquia = ({
  showAdmin = false,
  filterGrupamento,
}: {
  showAdmin?: boolean;
  filterGrupamento?: GrupamentoFilter;
}) => {
  const { isAdmin } = useAuth();
  const canEdit = isAdmin && showAdmin;
  const { toast } = useToast();
  const [items, setItems] = useState<HierarquiaItem[]>([]);
  const [cargos, setCargos] = useState<CargoOption[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<HierarquiaItem | null>(null);

  const [formNome, setFormNome] = useState("");
  const [formRg, setFormRg] = useState("");
  const [formDiscord, setFormDiscord] = useState("");
  const [formEntrada, setFormEntrada] = useState("");
  const [formCargoId, setFormCargoId] = useState("");
  const [formFuncao, setFormFuncao] = useState("");
  const [formPromocao, setFormPromocao] = useState("");
  const [formGrupamento, setFormGrupamento] = useState<GrupamentoFilter>("GERAL");

  const fetchData = async () => {
    const { data: hierData } = await supabase.from("hierarquia").select("*, cargos(nome, imagem_url, nivel_hierarquico)");
    const { data: cargosData } = await supabase.from("cargos").select("id, nome, nivel_hierarquico, imagem_url").order("nivel_hierarquico");
    if (hierData) {
      setItems(
        hierData.map((h: any) => ({
          id: h.id,
          membro_nome: h.membro_nome,
          rg: h.rg,
          discord_id: h.discord_id,
          data_entrada: h.data_entrada,
          cargo_id: h.cargo_id,
          superior_id: h.superior_id,
          ordem: h.ordem,
          funcao: h.funcao,
          promocao: h.promocao,
          grupamento: h.grupamento ?? "GERAL",
          cargo_nome: h.cargos?.nome,
          cargo_imagem: h.cargos?.imagem_url,
          cargo_nivel: h.cargos?.nivel_hierarquico,
        }))
      );
    }
    if (cargosData) setCargos(cargosData as CargoOption[]);
  };

  useEffect(() => { fetchData(); }, []);

  const filteredItems = filterGrupamento
    ? items.filter((i) => i.grupamento === filterGrupamento)
    : items;
  const sortedItems = [...filteredItems].sort((a, b) => (a.cargo_nivel ?? 99) - (b.cargo_nivel ?? 99));

  const openCreate = () => {
    setEditing(null);
    setFormNome(""); setFormRg(""); setFormDiscord(""); setFormEntrada("");
    setFormCargoId(""); setFormFuncao(""); setFormPromocao("");
    setFormGrupamento(filterGrupamento ?? "GERAL");
    setDialogOpen(true);
  };

  const openEdit = (item: HierarquiaItem) => {
    setEditing(item);
    setFormNome(item.membro_nome);
    setFormRg(item.rg ?? "");
    setFormDiscord(item.discord_id ?? "");
    setFormEntrada(item.data_entrada ?? "");
    setFormCargoId(item.cargo_id ?? "");
    setFormFuncao(item.funcao ?? "");
    setFormPromocao(item.promocao ?? "");
    setFormGrupamento((item.grupamento as GrupamentoFilter) ?? "GERAL");
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formNome.trim()) return;
    const payload = {
      membro_nome: formNome,
      rg: formRg || null,
      discord_id: formDiscord || null,
      data_entrada: formEntrada || null,
      cargo_id: formCargoId || null,
      funcao: formFuncao || null,
      promocao: formPromocao || null,
      grupamento: formGrupamento,
      ordem: 0,
    };

    if (editing) {
      const { error } = await supabase.from("hierarquia").update(payload).eq("id", editing.id);
      if (error) { toast({ title: "Erro", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Policial atualizado" });
    } else {
      const { error } = await supabase.from("hierarquia").insert(payload);
      if (error) { toast({ title: "Erro", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Policial adicionado" });
    }
    setDialogOpen(false);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("hierarquia").delete().eq("id", id);
    if (error) { toast({ title: "Erro", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Policial removido" });
    fetchData();
  };

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild className="-ml-2">
        <Link to="/">
          <ArrowLeft className="mr-1 h-4 w-4" /> Voltar ao início
        </Link>
      </Button>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold uppercase tracking-wide">
            {filterGrupamento ? `Hierarquia · ${filterGrupamento}` : "Hierarquia"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {filterGrupamento ? `Efetivo do grupamento ${filterGrupamento}` : "Efetivo do 4° BPRv"}
          </p>
        </div>
        {canEdit && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreate} className="font-display uppercase tracking-wider">
                <Plus className="mr-2 h-4 w-4" /> Adicionar Policial
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-display uppercase tracking-wide">
                  {editing ? "Editar Policial" : "Novo Policial"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground">Nome</Label>
                    <Input value={formNome} onChange={(e) => setFormNome(e.target.value)} placeholder="Nome completo" className="bg-secondary border-border" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground">RG</Label>
                    <Input value={formRg} onChange={(e) => setFormRg(e.target.value)} placeholder="RG" className="bg-secondary border-border" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground">ID Discord</Label>
                    <Input value={formDiscord} onChange={(e) => setFormDiscord(e.target.value)} placeholder="ID Discord" className="bg-secondary border-border" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground">Graduação (Patente)</Label>
                    <Select value={formCargoId} onValueChange={setFormCargoId}>
                      <SelectTrigger className="bg-secondary border-border"><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>
                        {cargos.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            <span className="flex items-center gap-2">
                              {c.imagem_url && <img src={c.imagem_url} alt="" className="h-4 w-4 object-contain inline" />}
                              {c.nome}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground">Função</Label>
                    <Input value={formFuncao} onChange={(e) => setFormFuncao(e.target.value)} placeholder="Ex: Patrulheiro" className="bg-secondary border-border" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground">Promoção</Label>
                    <Input type="date" value={formPromocao} onChange={(e) => setFormPromocao(e.target.value)} className="bg-secondary border-border" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">Data de Entrada</Label>
                  <Input type="date" value={formEntrada} onChange={(e) => setFormEntrada(e.target.value)} className="bg-secondary border-border" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">Grupamento</Label>
                  <Select value={formGrupamento} onValueChange={(v) => setFormGrupamento(v as GrupamentoFilter)}>
                    <SelectTrigger className="bg-secondary border-border"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GERAL">Geral</SelectItem>
                      <SelectItem value="TOR">TOR — Tático Op. Rodoviárias</SelectItem>
                      <SelectItem value="ROCAM">ROCAM — Rondas Motorizadas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleSave} className="w-full font-display uppercase tracking-wider">
                  {editing ? "Salvar" : "Adicionar"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="font-display uppercase tracking-wide text-sm">Efetivo</CardTitle>
        </CardHeader>
        <CardContent>
          {sortedItems.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Nenhum policial cadastrado.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-display uppercase text-xs">RG</TableHead>
                    <TableHead className="font-display uppercase text-xs">Nome</TableHead>
                    <TableHead className="font-display uppercase text-xs">Discord ID</TableHead>
                    <TableHead className="font-display uppercase text-xs">Insígnia</TableHead>
                    <TableHead className="font-display uppercase text-xs">Graduação</TableHead>
                    <TableHead className="font-display uppercase text-xs">Função</TableHead>
                    <TableHead className="font-display uppercase text-xs">Promoção</TableHead>
                    <TableHead className="font-display uppercase text-xs">Entrada</TableHead>
                    {canEdit && <TableHead className="font-display uppercase text-xs text-right">Ações</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-mono text-sm">{item.rg || "—"}</TableCell>
                      <TableCell className="font-display font-semibold uppercase text-sm">{item.membro_nome}</TableCell>
                      <TableCell className="font-mono text-sm">{item.discord_id || "—"}</TableCell>
                      <TableCell>
                        {item.cargo_imagem ? (
                          <img src={item.cargo_imagem} alt={item.cargo_nome || ""} className="h-8 w-8 object-contain" />
                        ) : (
                          <span className="text-muted-foreground text-xs">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {item.cargo_nome ? (
                          <Badge variant="outline" className="text-xs border-primary/30 text-primary">{item.cargo_nome}</Badge>
                        ) : (
                          <span className="text-muted-foreground text-xs">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm">{item.funcao || "—"}</TableCell>
                      <TableCell className="text-sm">{item.promocao || "—"}</TableCell>
                      <TableCell className="text-sm">{item.data_entrada || "—"}</TableCell>
                      {canEdit && (
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(item)}><Pencil className="h-3 w-3" /></Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete(item.id)}><Trash2 className="h-3 w-3" /></Button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Hierarquia;
