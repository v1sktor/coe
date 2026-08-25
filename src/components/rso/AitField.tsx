import { useMemo, useState } from "react";
import { Plus, Trash2, Search, Scale, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MULTAS_CTB, SEV_META, formatBRL, type MultaCTB } from "@/lib/ctb-multas";

export interface AitItem {
  artigo: string;
  descricao: string;
  valor: number;
  nome_multado: string;
  rg_multado: string;
  data_infracao: string; // YYYY-MM-DD
  observacoes?: string;
}

interface Props {
  value: AitItem[];
  onChange: (items: AitItem[]) => void;
}

export default function AitField({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [picked, setPicked] = useState<MultaCTB | null>(null);
  const [search, setSearch] = useState("");
  const [nome, setNome] = useState("");
  const [rg, setRg] = useState("");
  const [data, setData] = useState(() => new Date().toISOString().split("T")[0]);
  const [obs, setObs] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return MULTAS_CTB;
    return MULTAS_CTB.filter(
      (m) => m.artigo.toLowerCase().includes(q) || m.descricao.toLowerCase().includes(q)
    );
  }, [search]);

  const total = value.reduce((sum, i) => sum + i.valor, 0);

  const reset = () => {
    setPicked(null);
    setSearch("");
    setNome("");
    setRg("");
    setData(new Date().toISOString().split("T")[0]);
    setObs("");
  };

  const handleAdd = () => {
    if (!picked || !nome.trim() || !data) return;
    onChange([
      ...value,
      {
        artigo: picked.artigo,
        descricao: picked.descricao,
        valor: picked.valor,
        nome_multado: nome.trim(),
        rg_multado: rg.trim(),
        data_infracao: data,
        observacoes: obs.trim() || undefined,
      },
    ]);
    reset();
    setOpen(false);
  };

  const handleRemove = (idx: number) => {
    onChange(value.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <Label className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Receipt className="h-4 w-4 text-primary" />
            Autos de Infração de Trânsito (AIT)
          </Label>
          <p className="text-xs text-muted-foreground mt-1">
            {value.length} multa{value.length === 1 ? "" : "s"} aplicada{value.length === 1 ? "" : "s"} ·{" "}
            <span className="text-primary font-display tabular-nums">{formatBRL(total)}</span>
          </p>
        </div>

        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) reset(); }}>
          <DialogTrigger asChild>
            <Button size="sm" className="font-display uppercase tracking-wider">
              <Plus className="mr-1 h-4 w-4" /> Adicionar AIT
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-display uppercase tracking-wide flex items-center gap-2">
                <Scale className="h-4 w-4 text-primary" /> Novo AIT
              </DialogTitle>
            </DialogHeader>

            {!picked ? (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">Selecione a infração do Código Penal:</p>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    autoFocus
                    placeholder="Buscar artigo ou descrição..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 bg-secondary border-border"
                  />
                </div>
                <div className="max-h-96 overflow-y-auto space-y-2 pr-1">
                  {filtered.map((m, i) => {
                    const sev = SEV_META[m.severity];
                    return (
                      <button
                        key={`${m.artigo}-${i}`}
                        onClick={() => setPicked(m)}
                        className="w-full text-left p-3 rounded-md border border-border/60 bg-secondary/40 hover:border-primary/60 hover:bg-secondary transition-all"
                      >
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <Badge variant="outline" className="font-mono text-[10px] uppercase tracking-widest border-primary/40 text-primary bg-primary/5">
                            {m.artigo}
                          </Badge>
                          <Badge variant="outline" className={`font-mono text-[10px] uppercase tracking-widest ${sev.classes}`}>
                            {sev.label}
                          </Badge>
                        </div>
                        <p className="text-sm text-foreground leading-snug">{m.descricao}</p>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Valor</span>
                          <span className="font-display text-lg font-bold text-primary tabular-nums">{formatBRL(m.valor)}</span>
                        </div>
                      </button>
                    );
                  })}
                  {filtered.length === 0 && (
                    <p className="text-center text-sm text-muted-foreground py-8">Nenhuma infração encontrada.</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Selected multa */}
                <Card className="bg-secondary/40 border-primary/40 p-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <Badge variant="outline" className="font-mono text-[10px] uppercase tracking-widest border-primary/40 text-primary bg-primary/5">
                      {picked.artigo}
                    </Badge>
                    <Badge variant="outline" className={`font-mono text-[10px] uppercase tracking-widest ${SEV_META[picked.severity].classes}`}>
                      {SEV_META[picked.severity].label}
                    </Badge>
                  </div>
                  <p className="text-sm text-foreground leading-snug">{picked.descricao}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Valor da multa</span>
                    <span className="font-display text-xl font-bold text-primary tabular-nums">{formatBRL(picked.valor)}</span>
                  </div>
                  <Button variant="ghost" size="sm" className="mt-2 h-7 text-xs" onClick={() => setPicked(null)}>
                    Trocar infração
                  </Button>
                </Card>

                {/* Multado info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground">Nome do multado *</Label>
                    <Input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome completo" className="bg-secondary border-border" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground">RG</Label>
                    <Input value={rg} onChange={(e) => setRg(e.target.value)} placeholder="RG do multado" className="bg-secondary border-border" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">Data da infração *</Label>
                  <Input type="date" value={data} onChange={(e) => setData(e.target.value)} className="bg-secondary border-border" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">Observações</Label>
                  <Input value={obs} onChange={(e) => setObs(e.target.value)} placeholder="Opcional" className="bg-secondary border-border" />
                </div>

                <Button
                  onClick={handleAdd}
                  disabled={!nome.trim() || !data}
                  className="w-full font-display uppercase tracking-wider"
                >
                  <Plus className="mr-1 h-4 w-4" /> Adicionar este AIT
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* List */}
      {value.length === 0 ? (
        <Card className="bg-secondary/30 border-dashed border-border/60 p-6 text-center">
          <Scale className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Nenhum AIT registrado nesta patrulha.</p>
          <p className="text-xs text-muted-foreground/70 mt-1">Clique em "Adicionar AIT" para registrar uma multa.</p>
        </Card>
      ) : (
        <div className="space-y-2">
          {value.map((item, i) => {
            return (
              <Card key={i} className="bg-secondary/40 border-border/60 p-3 relative overflow-hidden">
                <div className="flex items-start gap-3">
                  <div className="flex-1 space-y-2 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className="font-mono text-[10px] uppercase tracking-widest border-primary/40 text-primary bg-primary/5">
                        {item.artigo}
                      </Badge>
                      <span className="font-display text-sm font-bold text-primary tabular-nums">
                        {formatBRL(item.valor)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-snug line-clamp-2">{item.descricao}</p>
                    <div className="flex items-center gap-3 flex-wrap text-xs">
                      <span className="font-display uppercase tracking-wider text-foreground">
                        {item.nome_multado}
                      </span>
                      {item.rg_multado && (
                        <span className="font-mono text-muted-foreground">RG: {item.rg_multado}</span>
                      )}
                      <span className="font-mono text-muted-foreground">{item.data_infracao}</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive shrink-0"
                    onClick={() => handleRemove(i)}
                    aria-label="Remover AIT"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}