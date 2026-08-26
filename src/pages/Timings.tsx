import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Timer, FileCheck, Users, Filter, Trophy, Medal, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UNIDADE_SIGLAS } from "@/lib/unidades";

interface MemberStats {
  id: string;
  nome: string;
  cargo_nome?: string;
  cargo_nivel?: number;
  unidade?: string | null;
  totalSeconds: number;
  patrolCount: number;
}

const formatDuration = (totalSeconds: number) => {
  if (!totalSeconds) return "00:00:00";
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
};

const Timings = () => {
  const [stats, setStats] = useState<MemberStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroUnidade, setFiltroUnidade] = useState<string>("TODAS");
  const [busca, setBusca] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [{ data: hierarquia }, { data: rsos }] = await Promise.all([
        supabase
          .from("hierarquia")
          .select("id, membro_nome, ordem, batalhao, cargos(nome, nivel_hierarquico)")
          .order("ordem"),
        supabase
          .from("rsos")
          .select("responsavel_id, encarregado_id, motorista_id, homem3_id, homem4_id, homem5_id, patrulha_inicio, patrulha_fim, status")
          .eq("status", "aprovado"),
      ]);

      if (!hierarquia) {
        setStats([]);
        setLoading(false);
        return;
      }

      const map = new Map<string, MemberStats>();
      hierarquia.forEach((h: any) => {
        map.set(h.id, {
          id: h.id,
          nome: h.membro_nome,
          cargo_nome: h.cargos?.nome,
          cargo_nivel: h.cargos?.nivel_hierarquico,
          unidade: h.batalhao,
          totalSeconds: 0,
          patrolCount: 0,
        });
      });

      (rsos || []).forEach((r: any) => {
        if (!r.patrulha_inicio || !r.patrulha_fim) return;
        const dur = Math.max(
          0,
          Math.floor((new Date(r.patrulha_fim).getTime() - new Date(r.patrulha_inicio).getTime()) / 1000)
        );
        if (!dur) return;
        const ids = [r.responsavel_id, r.encarregado_id, r.motorista_id, r.homem3_id, r.homem4_id, r.homem5_id];
        const seen = new Set<string>();
        ids.forEach((id) => {
          if (!id || seen.has(id)) return;
          seen.add(id);
          const entry = map.get(id);
          if (entry) {
            entry.totalSeconds += dur;
            entry.patrolCount += 1;
          }
        });
      });

      setStats(Array.from(map.values()).sort((a, b) => b.totalSeconds - a.totalSeconds));
      setLoading(false);
    };
    load();
  }, []);

  const filtered = stats
    .filter((s) => (filtroUnidade === "TODAS" ? true : s.unidade === filtroUnidade))
    .filter((s) => (busca ? s.nome.toLowerCase().includes(busca.toLowerCase()) : true));

  const ranking = filtered.filter((s) => s.totalSeconds > 0).slice(0, 3);

  const totalSecondsAll = filtered.reduce((acc, s) => acc + s.totalSeconds, 0);
  const totalPatrols = filtered.reduce((acc, s) => acc + s.patrolCount, 0);
  const activeMembers = filtered.filter((s) => s.totalSeconds > 0).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold uppercase tracking-wide">Timings</h1>
        <p className="text-muted-foreground mt-1">
          Tempo de patrulha acumulado por integrante (somente RSOs aprovados)
        </p>
      </div>

      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="font-display uppercase tracking-wide text-sm flex items-center gap-2">
            <Filter className="h-4 w-4 text-primary" /> Filtros
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-3">
          <Select value={filtroUnidade} onValueChange={setFiltroUnidade}>
            <SelectTrigger className="sm:w-64">
              <SelectValue placeholder="Unidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TODAS">Todas as unidades</SelectItem>
              {UNIDADE_SIGLAS.map((u) => (
                <SelectItem key={u} value={u}>{u}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar integrante..."
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {ranking.length > 0 && (
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="font-display uppercase tracking-wide text-sm flex items-center gap-2">
              <Trophy className="h-4 w-4 text-primary" /> Ranking em serviço de patrulhamento
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-3">
            {ranking.map((m, i) => (
              <div key={m.id} className="rounded-md border border-border bg-secondary/30 p-4">
                <div className="flex items-center gap-2 text-xs uppercase font-display text-muted-foreground">
                  <Medal className="h-4 w-4 text-primary" /> {i + 1}º lugar
                </div>
                <div className="mt-2 font-semibold">{m.nome}</div>
                <div className="text-xs text-muted-foreground">{m.unidade || "—"} · {m.patrolCount} RSOs</div>
                <div className="mt-2 font-mono font-bold text-primary">{formatDuration(m.totalSeconds)}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="pt-4 text-center">
            <div className="text-2xl font-display font-bold text-primary">{formatDuration(totalSecondsAll)}</div>
            <div className="text-xs text-muted-foreground mt-1 flex items-center justify-center gap-1">
              <Timer className="h-3 w-3" /> Tempo total acumulado
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-4 text-center">
            <div className="text-2xl font-display font-bold text-foreground">{totalPatrols}</div>
            <div className="text-xs text-muted-foreground mt-1 flex items-center justify-center gap-1">
              <FileCheck className="h-3 w-3" /> Participações em RSOs
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-4 text-center">
            <div className="text-2xl font-display font-bold text-foreground">{activeMembers}</div>
            <div className="text-xs text-muted-foreground mt-1 flex items-center justify-center gap-1">
              <Users className="h-3 w-3" /> Integrantes com tempo
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="font-display uppercase tracking-wide text-sm flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" /> Tempo por integrante
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="text-left py-3 px-2 font-medium">Integrante</th>
                  <th className="text-left py-3 px-2 font-medium">Cargo</th>
                  <th className="text-left py-3 px-2 font-medium">Unidade</th>
                  <th className="text-right py-3 px-2 font-medium">RSOs</th>
                  <th className="text-right py-3 px-2 font-medium">Tempo total</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr><td colSpan={5} className="text-center text-muted-foreground py-8">Carregando...</td></tr>
                )}
                {!loading && filtered.length === 0 && (
                  <tr><td colSpan={5} className="text-center text-muted-foreground py-8">Nenhum integrante na hierarquia.</td></tr>
                )}
                {!loading && filtered.map((m, i) => (
                  <tr key={m.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                    <td className="py-3 px-2 font-medium">
                      <span className="font-mono text-muted-foreground mr-2">{i + 1}º</span>
                      {m.nome}
                    </td>
                    <td className="py-3 px-2">
                      {m.cargo_nome ? (
                        <Badge variant="outline" className="text-xs">{m.cargo_nome}</Badge>
                      ) : (
                        <span className="text-muted-foreground text-xs">—</span>
                      )}
                    </td>
                    <td className="py-3 px-2 text-xs font-display uppercase text-muted-foreground">{m.unidade || "—"}</td>
                    <td className="py-3 px-2 text-right font-mono">{m.patrolCount}</td>
                    <td className="py-3 px-2 text-right font-mono font-semibold text-primary">
                      {formatDuration(m.totalSeconds)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Timings;
