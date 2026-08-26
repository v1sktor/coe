import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";
import {
  BARCA_FIELDS,
  BARCA_LABELS,
  applyBarcaToRso,
  readBarcaRso,
  subscribeBarcaRso,
  type BarcaSyncPayload,
} from "@/lib/barca-sync";
import {
  Car,
  GripVertical,
  History,
  LogIn,
  LogOut,
  Minus,
  RefreshCw,
  Repeat,
  X,
} from "lucide-react";

const RSO_ROUTES = ["/rso/novo", "/relatorios"];

const STORAGE_KEY = "barca_state_v2";
const POSICOES = BARCA_FIELDS.length;

type Status = "ATIVO" | "AUSENTE" | "LIVRE";

interface Slot {
  membroId: string | null;
  nome: string | null;
  graduacao: string | null;
  status: Status;
  entradaEm: string | null;
}

interface HistoricoItem {
  id: string;
  tipo: "ENTRADA" | "SAÍDA" | "TROCA" | "REMODULAÇÃO" | "STATUS";
  quando: string;
  autor: string;
  descricao: string;
  motivo?: string | null;
}

interface BarcaUi {
  historico: HistoricoItem[];
  open: boolean;
  minimized: boolean;
  pos: { x: number; y: number };
  meta: Record<string, { status: Status; entradaEm: string | null }>;
}

interface Membro {
  id: string;
  membro_nome: string;
  cargo_nome: string | null;
  unidade: string | null;
}

const emptySlot = (): Slot => ({
  membroId: null,
  nome: null,
  graduacao: null,
  status: "LIVRE",
  entradaEm: null,
});

const defaultUi = (): BarcaUi => ({
  historico: [],
  open: false,
  minimized: false,
  pos: { x: Math.max(16, window.innerWidth - 420), y: 96 },
  meta: {},
});

function loadUi(): BarcaUi {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultUi();
    return { ...defaultUi(), ...(JSON.parse(raw) as Partial<BarcaUi>) };
  } catch {
    return defaultUi();
  }
}

const ordinal = (i: number) => BARCA_LABELS[BARCA_FIELDS[i]] ?? `${i + 1}ª posição`;
const hora = (iso: string | null) =>
  iso ? new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) : "--:--";

export function BarcaPanel() {
  const { user } = useAuth();
  const location = useLocation();
  const isRsoRoute = RSO_ROUTES.some((r) => location.pathname.startsWith(r));

  const [ui, setUi] = useState<BarcaUi>(() => loadUi());
  const [sync, setSync] = useState<BarcaSyncPayload | null>(() => readBarcaRso());
  const [membros, setMembros] = useState<Membro[]>([]);
  const [pulse, setPulse] = useState(false);
  const [showHistorico, setShowHistorico] = useState(false);
  const [remodular, setRemodular] = useState(false);
  const [draft, setDraft] = useState<Slot[]>([]);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const [entradaOpen, setEntradaOpen] = useState(false);
  const [entradaMembro, setEntradaMembro] = useState("");
  const [entradaPos, setEntradaPos] = useState("");

  const [saidaOpen, setSaidaOpen] = useState(false);
  const [saidaPos, setSaidaPos] = useState("");
  const [saidaMotivo, setSaidaMotivo] = useState("");

  const [trocaOpen, setTrocaOpen] = useState(false);
  const [trocaA, setTrocaA] = useState("");
  const [trocaB, setTrocaB] = useState("");

  const dragRef = useRef<{ dx: number; dy: number } | null>(null);

  // Fecha o painel ao sair das abas de RSO
  useEffect(() => {
    if (!isRsoRoute) {
      setUi((p) => ({ ...p, open: false }));
    }
  }, [isRsoRoute]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ui));
  }, [ui]);

  useEffect(() => subscribeBarcaRso((p) => setSync(p)), []);

  useEffect(() => {
    (async () => {
      const { data } = await (supabase.rpc as any)("get_hierarquia_publica");
      if (data)
        setMembros(
          (data as any[]).map((h) => ({
            id: h.id,
            membro_nome: h.membro_nome,
            cargo_nome: h.cargo_nome ?? null,
            unidade: h.batalhao ?? null,
          })),
        );
    })();
  }, []);


  // Slots derivam SEMPRE da guarnição do RSO em preenchimento
  const slots: Slot[] = useMemo(() => {
    const ids = sync?.membros ?? [];
    return Array.from({ length: POSICOES }, (_, i) => {
      const id = ids[i] || null;
      if (!id) return emptySlot();
      const m = membros.find((x) => x.id === id);
      const meta = ui.meta[id];
      return {
        membroId: id,
        nome: m?.membro_nome ?? "—",
        graduacao: m?.cargo_nome ?? null,
        status: meta?.status ?? "ATIVO",
        entradaEm: meta?.entradaEm ?? null,
      };
    });
  }, [sync, membros, ui.meta]);

  // Marca horário de entrada assim que um policial aparece na barca
  useEffect(() => {
    const novos = slots.filter((s) => s.membroId && !ui.meta[s.membroId!]);
    if (novos.length === 0) return;
    setUi((p) => {
      const meta = { ...p.meta };
      novos.forEach((s) => {
        meta[s.membroId!] = { status: "ATIVO", entradaEm: new Date().toISOString() };
      });
      return { ...p, meta };
    });
  }, [slots, ui.meta]);

  const ativo = !!sync?.ativo;
  const ocupadas = slots.filter((s) => s.membroId).length;
  const autor = user?.nome || "Não identificado";
  const prefixo = sync?.prefixo || "SEM PREFIXO";

  const commit = useCallback(
    (item: Omit<HistoricoItem, "id" | "quando" | "autor">, novos: Slot[]) => {
      applyBarcaToRso(novos.map((s) => s.membroId));
      setUi((p) => ({
        ...p,
        historico: [
          { id: crypto.randomUUID(), quando: new Date().toISOString(), autor, ...item },
          ...p.historico,
        ].slice(0, 200),
      }));
      setPulse(true);
      window.setTimeout(() => setPulse(false), 4000);
    },
    [autor],
  );

  // ---- Drag do painel ----
  const onPanelMouseDown = (e: React.MouseEvent) => {
    dragRef.current = { dx: e.clientX - ui.pos.x, dy: e.clientY - ui.pos.y };
    const move = (ev: MouseEvent) => {
      if (!dragRef.current) return;
      const x = Math.min(Math.max(0, ev.clientX - dragRef.current.dx), window.innerWidth - 120);
      const y = Math.min(Math.max(0, ev.clientY - dragRef.current.dy), window.innerHeight - 60);
      setUi((p) => ({ ...p, pos: { x, y } }));
    };
    const up = () => {
      dragRef.current = null;
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };

  const livres = slots.map((s, i) => ({ s, i })).filter(({ s }) => !s.membroId);
  const ocupados = slots.map((s, i) => ({ s, i })).filter(({ s }) => s.membroId);

  const membrosElegiveis = useMemo(() => {
    const base =
      sync?.unidade && sync.unidade !== "DEJEC"
        ? membros.filter((m) => m.unidade === sync.unidade)
        : membros;
    return base.filter((m) => !slots.some((s) => s.membroId === m.id));
  }, [membros, slots, sync]);

  const confirmarEntrada = () => {
    const idx = Number(entradaPos);
    const m = membros.find((x) => x.id === entradaMembro);
    if (!m || Number.isNaN(idx)) return;
    if (slots[idx].membroId) {
      toast({ title: "Posição ocupada", description: "Escolha uma posição livre.", variant: "destructive" });
      return;
    }
    if (slots.some((s) => s.membroId === m.id)) {
      toast({ title: "Conflito", description: "Este policial já está na barca.", variant: "destructive" });
      return;
    }
    const novos = slots.map((s, i) =>
      i === idx
        ? {
            membroId: m.id,
            nome: m.membro_nome,
            graduacao: m.cargo_nome,
            status: "ATIVO" as Status,
            entradaEm: new Date().toISOString(),
          }
        : s,
    );
    commit(
      {
        tipo: "ENTRADA",
        descricao: `${m.cargo_nome ?? ""} ${m.membro_nome} entrou como ${ordinal(idx)}.`.trim(),
      },
      novos,
    );
    setEntradaOpen(false);
    setEntradaMembro("");
    setEntradaPos("");
  };

  const confirmarSaida = () => {
    const idx = Number(saidaPos);
    const slot = slots[idx];
    if (!slot?.membroId) return;
    const novos = slots.map((s, i) => (i === idx ? emptySlot() : s));
    commit(
      {
        tipo: "SAÍDA",
        descricao: `${slot.graduacao ?? ""} ${slot.nome} deixou a barca. ${ordinal(idx)} liberado.`.trim(),
        motivo: saidaMotivo || null,
      },
      novos,
    );
    setSaidaOpen(false);
    setSaidaPos("");
    setSaidaMotivo("");
  };

  const confirmarTroca = () => {
    const a = Number(trocaA);
    const b = Number(trocaB);
    if (Number.isNaN(a) || Number.isNaN(b) || a === b) return;
    const novos = [...slots];
    const tmp = novos[a];
    novos[a] = novos[b];
    novos[b] = tmp;
    const nomeA = slots[a].nome ?? "LIVRE";
    const nomeB = slots[b].nome ?? "LIVRE";
    commit(
      {
        tipo: "TROCA",
        descricao: `${nomeA} passou de ${ordinal(a)} para ${ordinal(b)}. ${nomeB} passou de ${ordinal(b)} para ${ordinal(a)}.`,
      },
      novos,
    );
    setTrocaOpen(false);
    setTrocaA("");
    setTrocaB("");
  };

  const abrirRemodular = () => {
    setDraft(slots.map((s) => ({ ...s })));
    setRemodular(true);
  };

  const dropOn = (target: number) => {
    if (dragIndex === null || dragIndex === target) return;
    const next = [...draft];
    const tmp = next[target];
    next[target] = next[dragIndex];
    next[dragIndex] = tmp;
    setDraft(next);
    setDragIndex(null);
  };

  const confirmarRemodulacao = () => {
    const antes = slots.map((s, i) => `${ordinal(i)}: ${s.nome ?? "LIVRE"}`).join(" · ");
    const depois = draft.map((s, i) => `${ordinal(i)}: ${s.nome ?? "LIVRE"}`).join(" · ");
    commit({ tipo: "REMODULAÇÃO", descricao: `Antes: ${antes} → Depois: ${depois}` }, draft);
    setRemodular(false);
  };

  const alternarStatus = (idx: number) => {
    const slot = slots[idx];
    if (!slot.membroId) return;
    const novo: Status = slot.status === "ATIVO" ? "AUSENTE" : "ATIVO";
    setUi((p) => ({
      ...p,
      meta: { ...p.meta, [slot.membroId!]: { status: novo, entradaEm: slot.entradaEm } },
      historico: [
        {
          id: crypto.randomUUID(),
          quando: new Date().toISOString(),
          autor,
          tipo: "STATUS" as const,
          descricao: `${slot.nome} marcado como ${novo} (${ordinal(idx)}).`,
        },
        ...p.historico,
      ].slice(0, 200),
    }));
  };

  // Só exibe o painel de remodulação nas abas de RSO
  if (!isRsoRoute) return null;



  // ---- Botão flutuante fechado ----
  if (!ui.open) {
    return (
      <button
        onClick={() => setUi((p) => ({ ...p, open: true }))}
        className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-display uppercase tracking-wider shadow-lg hover:bg-secondary"
      >
        <Car className="h-4 w-4 text-primary" />
        Viatura
        <Badge variant="secondary" className="font-mono text-[10px]">
          {ocupadas}/{POSICOES}
        </Badge>
      </button>
    );
  }

  return (
    <>
      <div
        style={{ left: ui.pos.x, top: ui.pos.y }}
        className="fixed z-50 w-[360px] max-w-[calc(100vw-24px)] rounded-lg border border-border bg-card shadow-2xl"
      >
        <div
          onMouseDown={onPanelMouseDown}
          className="flex cursor-move items-center gap-2 rounded-t-lg border-b border-border bg-secondary px-3 py-2"
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
          <Car className="h-4 w-4 text-primary" />
          <span className="font-display text-xs uppercase tracking-wider">Barca {prefixo}</span>
          <Badge variant="secondary" className="font-mono text-[10px]">
            {ocupadas}/{POSICOES}
          </Badge>
          {pulse && <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />}
          <div className="ml-auto flex items-center gap-1">
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6"
              onClick={() => setUi((p) => ({ ...p, minimized: !p.minimized }))}
            >
              <Minus className="h-3.5 w-3.5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6"
              onClick={() => setUi((p) => ({ ...p, open: false }))}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {!ui.minimized && (
          <div className="space-y-3 p-3">
            {!ativo ? (
              <p className="py-6 text-center text-xs text-muted-foreground">
                Nenhum RSO em preenchimento. Inicie um RSO e selecione a unidade/guarnição para
                remodular a barca.
              </p>
            ) : (
              <>
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-muted-foreground">
                  <span>Unidade</span>
                  <Badge variant="outline" className="font-mono text-[10px]">
                    {sync?.unidade || "—"}
                  </Badge>
                  <span className="ml-auto">Viatura</span>
                  <Badge variant="outline" className="font-mono text-[10px]">
                    {prefixo}
                  </Badge>
                </div>

                <div className="space-y-1.5">
                  {slots.map((s, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 rounded border border-border bg-secondary/40 px-2 py-1.5"
                    >
                      <span className="w-20 shrink-0 font-mono text-[10px] uppercase text-primary">
                        {ordinal(i)}
                      </span>
                      <div className="min-w-0 flex-1">
                        {s.membroId ? (
                          <>
                            <div className="truncate text-xs font-semibold">
                              {s.graduacao ? `${s.graduacao} ` : ""}
                              {s.nome}
                            </div>
                            <div className="font-mono text-[10px] text-muted-foreground">
                              entrada {hora(s.entradaEm)}
                            </div>
                          </>
                        ) : (
                          <span className="text-xs text-muted-foreground">LIVRE</span>
                        )}
                      </div>
                      <button
                        onClick={() => alternarStatus(i)}
                        disabled={!s.membroId}
                        className="shrink-0"
                        title="Alternar ATIVO/AUSENTE"
                      >
                        <Badge
                          variant={s.status === "ATIVO" ? "default" : "outline"}
                          className="text-[9px]"
                        >
                          {s.status}
                        </Badge>
                      </button>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  <Button size="sm" variant="outline" className="text-[11px]" onClick={() => setEntradaOpen(true)}>
                    <LogIn className="mr-1 h-3.5 w-3.5" /> Entrada
                  </Button>
                  <Button size="sm" variant="outline" className="text-[11px]" onClick={() => setSaidaOpen(true)}>
                    <LogOut className="mr-1 h-3.5 w-3.5" /> Saída
                  </Button>
                  <Button size="sm" variant="outline" className="text-[11px]" onClick={() => setTrocaOpen(true)}>
                    <Repeat className="mr-1 h-3.5 w-3.5" /> Trocar
                  </Button>
                  <Button size="sm" variant="outline" className="text-[11px]" onClick={abrirRemodular}>
                    <RefreshCw className="mr-1 h-3.5 w-3.5" /> Remodular
                  </Button>
                </div>
              </>
            )}

            <Button
              size="sm"
              variant="ghost"
              className="w-full text-[11px]"
              onClick={() => setShowHistorico(true)}
            >
              <History className="mr-1 h-3.5 w-3.5" /> Histórico ({ui.historico.length})
            </Button>
          </div>
        )}
      </div>

      {/* ENTRADA */}
      <Dialog open={entradaOpen} onOpenChange={setEntradaOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display uppercase text-sm">Entrada na barca</DialogTitle>
            <DialogDescription>Selecione o policial e a posição livre.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-xs uppercase text-muted-foreground">Policial</Label>
              <Select value={entradaMembro} onValueChange={setEntradaMembro}>
                <SelectTrigger><SelectValue placeholder="Selecionar..." /></SelectTrigger>
                <SelectContent className="max-h-64">
                  {membrosElegiveis.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.cargo_nome ? `${m.cargo_nome} ` : ""}{m.membro_nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs uppercase text-muted-foreground">Posição</Label>
              <Select value={entradaPos} onValueChange={setEntradaPos}>
                <SelectTrigger><SelectValue placeholder="Posição livre..." /></SelectTrigger>
                <SelectContent>
                  {livres.map(({ i }) => (
                    <SelectItem key={i} value={String(i)}>{ordinal(i)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={confirmarEntrada} disabled={!entradaMembro || entradaPos === ""}>
              Confirmar entrada
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* SAÍDA */}
      <Dialog open={saidaOpen} onOpenChange={setSaidaOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display uppercase text-sm">Saída da barca</DialogTitle>
            <DialogDescription>A posição ficará LIVRE após a saída.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-xs uppercase text-muted-foreground">Policial</Label>
              <Select value={saidaPos} onValueChange={setSaidaPos}>
                <SelectTrigger><SelectValue placeholder="Selecionar..." /></SelectTrigger>
                <SelectContent>
                  {ocupados.map(({ s, i }) => (
                    <SelectItem key={i} value={String(i)}>
                      {ordinal(i)} — {s.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs uppercase text-muted-foreground">Motivo (opcional)</Label>
              <Input
                value={saidaMotivo}
                onChange={(e) => setSaidaMotivo(e.target.value)}
                placeholder="Ex.: término do turno"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={confirmarSaida} disabled={saidaPos === ""}>Registrar saída</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* TROCA */}
      <Dialog open={trocaOpen} onOpenChange={setTrocaOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display uppercase text-sm">Trocar posição</DialogTitle>
            <DialogDescription>Selecione as duas posições que serão trocadas.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            {[
              { v: trocaA, set: setTrocaA, label: "Posição A" },
              { v: trocaB, set: setTrocaB, label: "Posição B" },
            ].map((f) => (
              <div key={f.label} className="space-y-1">
                <Label className="text-xs uppercase text-muted-foreground">{f.label}</Label>
                <Select value={f.v} onValueChange={f.set}>
                  <SelectTrigger><SelectValue placeholder="..." /></SelectTrigger>
                  <SelectContent>
                    {slots.map((s, i) => (
                      <SelectItem key={i} value={String(i)}>
                        {ordinal(i)} — {s.nome ?? "LIVRE"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button onClick={confirmarTroca} disabled={trocaA === "" || trocaB === "" || trocaA === trocaB}>
              Confirmar troca
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* REMODULAR */}
      <Dialog open={remodular} onOpenChange={setRemodular}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display uppercase text-sm">Remodular barca</DialogTitle>
            <DialogDescription>Arraste os policiais entre as posições.</DialogDescription>
          </DialogHeader>
          <div className="space-y-1.5">
            {draft.map((s, i) => (
              <div
                key={i}
                draggable
                onDragStart={() => setDragIndex(i)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => dropOn(i)}
                className={`flex cursor-grab items-center gap-2 rounded border px-2 py-2 ${
                  dragIndex === i ? "border-primary bg-primary/10" : "border-border bg-secondary/40"
                }`}
              >
                <GripVertical className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="w-20 shrink-0 font-mono text-[10px] uppercase text-primary">
                  {ordinal(i)}
                </span>
                <span className="truncate text-xs">
                  {s.nome ? `${s.graduacao ? s.graduacao + " " : ""}${s.nome}` : "LIVRE"}
                </span>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRemodular(false)}>Cancelar</Button>
            <Button onClick={confirmarRemodulacao}>Confirmar remodulação</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* HISTÓRICO */}
      <Dialog open={showHistorico} onOpenChange={setShowHistorico}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display uppercase text-sm">Histórico da barca</DialogTitle>
            <DialogDescription>Registro de auditoria das alterações.</DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-80 pr-3">
            <div className="space-y-2">
              {ui.historico.length === 0 && (
                <p className="py-6 text-center text-xs text-muted-foreground">
                  Nenhuma alteração registrada.
                </p>
              )}
              {ui.historico.map((h) => (
                <div key={h.id} className="rounded border border-border p-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] text-muted-foreground">
                      {hora(h.quando)}
                    </span>
                    <Badge variant="secondary" className="text-[9px]">{h.tipo}</Badge>
                    <span className="ml-auto truncate text-[10px] text-muted-foreground">
                      {h.autor}
                    </span>
                  </div>
                  <p className="mt-1 text-xs">{h.descricao}</p>
                  {h.motivo && (
                    <p className="mt-0.5 text-[11px] text-muted-foreground">Motivo: {h.motivo}</p>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default BarcaPanel;
