import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
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
import {
  Gavel,
  Search,
  ThumbsUp,
  ThumbsDown,
  MinusCircle,
  Loader2,
  LogOut,
  ArrowLeft,
  Users,
} from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { ModuleSwitcher } from "@/components/ModuleSwitcher";
import { clearCorregedoriaSession, getCorregedoriaSession } from "@/components/CorregedoriaGate";

interface Denuncia {
  id: string;
  protocolo: string;
  anonima: boolean;
  nome: string | null;
  contato: string | null;
  categoria: string;
  unidade_envolvida: string | null;
  local_fato: string | null;
  data_fato: string | null;
  descricao: string;
  provas_links: string | null;
  status: string;
  relator: string | null;
  parecer: string | null;
  concluida_em: string | null;
  created_at: string;
}

interface Voto {
  id: string;
  denuncia_id: string;
  votante_nome: string;
  voto: string;
  justificativa: string | null;
  created_at: string;
}

const STATUS: Record<string, { label: string; className: string }> = {
  nova: { label: "Nova", className: "bg-primary/10 text-primary border-primary/30" },
  em_analise: { label: "Em análise", className: "bg-amber-500/10 text-amber-700 border-amber-500/30" },
  procedente: { label: "Procedente", className: "bg-emerald-500/10 text-emerald-700 border-emerald-500/30" },
  improcedente: { label: "Improcedente", className: "bg-destructive/10 text-destructive border-destructive/30" },
  arquivada: { label: "Arquivada", className: "bg-muted text-muted-foreground border-border" },
};

const VOTOS: Record<string, { label: string; className: string }> = {
  procedente: { label: "Procedente", className: "text-emerald-700" },
  improcedente: { label: "Improcedente", className: "text-destructive" },
  diligencias: { label: "Mais diligências", className: "text-amber-700" },
  abstencao: { label: "Abstenção", className: "text-muted-foreground" },
};

export default function Corregedoria() {
  const { user } = useAuth();
  const sessao = getCorregedoriaSession();
  const viaAdmin = !!user && !sessao;
  const votanteNome = sessao?.nome ?? user?.email ?? "";

  const [itens, setItens] = useState<Denuncia[]>([]);
  const [votos, setVotos] = useState<Voto[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("todos");
  const [busca, setBusca] = useState("");
  const [aberta, setAberta] = useState<Denuncia | null>(null);
  const [voto, setVoto] = useState("procedente");
  const [justificativa, setJustificativa] = useState("");
  const [salvando, setSalvando] = useState(false);

  async function load() {
    setLoading(true);
    const [d, v] = await Promise.all([
      supabase.from("denuncias").select("*").order("created_at", { ascending: false }),
      supabase.from("corregedoria_votos").select("*").order("created_at", { ascending: false }),
    ]);
    if (d.error) toast.error(d.error.message);
    else setItens((d.data ?? []) as unknown as Denuncia[]);
    if (!v.error) setVotos((v.data ?? []) as unknown as Voto[]);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const votosPorDenuncia = useMemo(() => {
    const map: Record<string, Voto[]> = {};
    for (const v of votos) (map[v.denuncia_id] ??= []).push(v);
    return map;
  }, [votos]);

  function contagem(id: string) {
    const lista = votosPorDenuncia[id] ?? [];
    return {
      total: lista.length,
      procedente: lista.filter((v) => v.voto === "procedente").length,
      improcedente: lista.filter((v) => v.voto === "improcedente").length,
      diligencias: lista.filter((v) => v.voto === "diligencias").length,
      abstencao: lista.filter((v) => v.voto === "abstencao").length,
    };
  }

  function abrir(d: Denuncia) {
    setAberta(d);
    const meu = (votosPorDenuncia[d.id] ?? []).find((v) => v.votante_nome === votanteNome);
    setVoto(meu?.voto ?? "procedente");
    setJustificativa(meu?.justificativa ?? "");
  }

  async function votar() {
    if (!aberta) return;
    if (!votanteNome) return toast.error("Não foi possível identificar seu usuário.");
    setSalvando(true);
    const { error } = await supabase.from("corregedoria_votos").upsert(
      {
        denuncia_id: aberta.id,
        votante_nome: votanteNome,
        voto,
        justificativa: justificativa.trim() || null,
      },
      { onConflict: "denuncia_id,votante_nome" }
    );
    setSalvando(false);
    if (error) return toast.error(error.message);
    toast.success("Voto registrado");
    if (aberta.status === "nova") {
      await supabase.from("denuncias").update({ status: "em_analise" }).eq("id", aberta.id);
    }
    await load();
    setAberta((a) => (a ? { ...a, status: a.status === "nova" ? "em_analise" : a.status } : a));
  }

  async function atualizarDenuncia(d: Denuncia, campos: Partial<Denuncia>) {
    const { error } = await supabase.from("denuncias").update(campos as any).eq("id", d.id);
    if (error) return toast.error(error.message);
    toast.success("Denúncia atualizada");
    load();
    setAberta((a) => (a ? ({ ...a, ...campos } as Denuncia) : a));
  }

  const filtrados = itens.filter((d) => {
    if (tab !== "todos" && d.status !== tab) return false;
    if (!busca.trim()) return true;
    const q = busca.toLowerCase();
    return (
      d.protocolo?.toLowerCase().includes(q) ||
      d.categoria?.toLowerCase().includes(q) ||
      (d.unidade_envolvida ?? "").toLowerCase().includes(q) ||
      (d.nome ?? "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-primary flex items-center gap-2">
            <Gavel className="h-6 w-6" /> SJD
          </h1>
          <p className="text-[13px] text-muted-foreground">
            Denúncias recebidas pelo canal público, com votação colegiada e parecer final.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <ModuleSwitcher />
          {viaAdmin ? (
            <Button variant="outline" onClick={() => (window.location.href = "/admin/usuarios")}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao Admin
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => {
                clearCorregedoriaSession();
                window.location.href = "/login";
              }}
            >
              <LogOut className="mr-2 h-4 w-4" /> Sair
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="todos">Todas</TabsTrigger>
            <TabsTrigger value="nova">Novas</TabsTrigger>
            <TabsTrigger value="em_analise">Em análise</TabsTrigger>
            <TabsTrigger value="procedente">Procedentes</TabsTrigger>
            <TabsTrigger value="improcedente">Improcedentes</TabsTrigger>
            <TabsTrigger value="arquivada">Arquivadas</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por protocolo, categoria ou unidade"
            className="pl-9"
          />
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Carregando…</p>
      ) : filtrados.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            Nenhuma denúncia encontrada.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtrados.map((d) => {
            const st = STATUS[d.status] ?? STATUS.nova;
            const c = contagem(d.id);
            return (
              <Card
                key={d.id}
                className="cursor-pointer transition hover:shadow-tactical"
                onClick={() => abrir(d)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <CardTitle className="font-display text-base text-primary truncate">
                        {d.categoria}
                      </CardTitle>
                      <CardDescription className="font-mono text-[11px]">
                        {d.protocolo}
                        {d.unidade_envolvida ? ` · ${d.unidade_envolvida}` : ""}
                        {d.anonima ? " · ANÔNIMA" : d.nome ? ` · ${d.nome}` : ""}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className={st.className}>
                      {st.label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-[13px] leading-relaxed text-muted-foreground line-clamp-3 whitespace-pre-wrap">
                    {d.descricao}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span className="font-mono">
                      {new Date(d.created_at).toLocaleString("pt-BR")}
                    </span>
                    <span className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-emerald-700">
                        <ThumbsUp className="h-3 w-3" /> {c.procedente}
                      </span>
                      <span className="flex items-center gap-1 text-destructive">
                        <ThumbsDown className="h-3 w-3" /> {c.improcedente}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" /> {c.total}
                      </span>
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={!!aberta} onOpenChange={(o) => !o && setAberta(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {aberta && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display flex items-center gap-2">
                  <Gavel className="h-5 w-5 text-primary" /> {aberta.categoria}
                  <span className="font-mono text-xs text-muted-foreground">{aberta.protocolo}</span>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-5">
                <div className="grid gap-3 sm:grid-cols-2 text-[13px]">
                  <p>
                    <span className="text-muted-foreground">Denunciante: </span>
                    {aberta.anonima ? "Anônima" : aberta.nome || "—"}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Contato: </span>
                    {aberta.anonima ? "—" : aberta.contato || "—"}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Unidade envolvida: </span>
                    {aberta.unidade_envolvida || "—"}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Local: </span>
                    {aberta.local_fato || "—"}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Data do fato: </span>
                    {aberta.data_fato
                      ? new Date(aberta.data_fato + "T00:00:00").toLocaleDateString("pt-BR")
                      : "—"}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Recebida em: </span>
                    {new Date(aberta.created_at).toLocaleString("pt-BR")}
                  </p>
                </div>

                <div>
                  <Label className="text-[11px] uppercase tracking-widest text-muted-foreground">
                    Relato
                  </Label>
                  <p className="mt-1 whitespace-pre-wrap rounded border border-border bg-secondary/50 p-3 text-[13px] leading-relaxed">
                    {aberta.descricao}
                  </p>
                </div>

                {aberta.provas_links && (
                  <div>
                    <Label className="text-[11px] uppercase tracking-widest text-muted-foreground">
                      Provas / Links
                    </Label>
                    <p className="mt-1 break-all text-[12px] text-primary">{aberta.provas_links}</p>
                  </div>
                )}

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label>Status</Label>
                    <Select
                      value={aberta.status}
                      onValueChange={(v) =>
                        atualizarDenuncia(aberta, {
                          status: v,
                          concluida_em:
                            v === "procedente" || v === "improcedente" || v === "arquivada"
                              ? new Date().toISOString()
                              : null,
                        })
                      }
                    >
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
                  <div className="grid gap-2">
                    <Label>Relator</Label>
                    <Input
                      defaultValue={aberta.relator ?? ""}
                      placeholder="Nome do relator"
                      onBlur={(e) =>
                        e.target.value !== (aberta.relator ?? "") &&
                        atualizarDenuncia(aberta, { relator: e.target.value || null })
                      }
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label>Parecer final</Label>
                  <Textarea
                    rows={4}
                    defaultValue={aberta.parecer ?? ""}
                    placeholder="Conclusão da SJD sobre a denúncia…"
                    onBlur={(e) =>
                      e.target.value !== (aberta.parecer ?? "") &&
                      atualizarDenuncia(aberta, { parecer: e.target.value || null })
                    }
                  />
                </div>

                <div className="rounded border border-border p-4 space-y-4">
                  <h3 className="font-display text-sm uppercase tracking-widest text-primary">
                    Votação
                  </h3>

                  <div className="grid gap-3 sm:grid-cols-[200px_1fr_auto] items-end">
                    <div className="grid gap-2">
                      <Label>Seu voto</Label>
                      <Select value={voto} onValueChange={setVoto}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(VOTOS).map(([v, s]) => (
                            <SelectItem key={v} value={v}>
                              {s.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label>Justificativa</Label>
                      <Input
                        value={justificativa}
                        onChange={(e) => setJustificativa(e.target.value)}
                        placeholder="Opcional"
                      />
                    </div>
                    <Button onClick={votar} disabled={salvando}>
                      {salvando ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Registrar voto
                    </Button>
                  </div>

                  {(() => {
                    const c = contagem(aberta.id);
                    return (
                      <div className="flex flex-wrap gap-2 text-[12px]">
                        <Badge variant="outline" className="text-emerald-700 border-emerald-500/30">
                          <ThumbsUp className="mr-1 h-3 w-3" /> Procedente: {c.procedente}
                        </Badge>
                        <Badge variant="outline" className="text-destructive border-destructive/30">
                          <ThumbsDown className="mr-1 h-3 w-3" /> Improcedente: {c.improcedente}
                        </Badge>
                        <Badge variant="outline" className="text-amber-700 border-amber-500/30">
                          Diligências: {c.diligencias}
                        </Badge>
                        <Badge variant="outline">
                          <MinusCircle className="mr-1 h-3 w-3" /> Abstenções: {c.abstencao}
                        </Badge>
                      </div>
                    );
                  })()}

                  <div className="divide-y divide-border rounded border border-border">
                    {(votosPorDenuncia[aberta.id] ?? []).length === 0 ? (
                      <p className="p-3 text-[12px] text-muted-foreground">Nenhum voto ainda.</p>
                    ) : (
                      (votosPorDenuncia[aberta.id] ?? []).map((v) => (
                        <div key={v.id} className="p-3 text-[12px]">
                          <p className="font-medium">
                            {v.votante_nome}{" "}
                            <span className={VOTOS[v.voto]?.className}>
                              · {VOTOS[v.voto]?.label ?? v.voto}
                            </span>
                          </p>
                          {v.justificativa && (
                            <p className="text-muted-foreground">{v.justificativa}</p>
                          )}
                          <p className="font-mono text-[10px] text-muted-foreground">
                            {new Date(v.created_at).toLocaleString("pt-BR")}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
