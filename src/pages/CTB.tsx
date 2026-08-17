import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Search, Scale, AlertTriangle, FileText, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import logoAsset from "@/assets/logo-coe.png.asset.json";
const logo = logoAsset.url;
import { MULTAS_CTB as MULTAS, SEV_META, formatBRL, type Severity } from "@/lib/ctb-multas";

export default function CTB() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Severity | "all">("all");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return MULTAS.filter((m) => {
      const matchSev = filter === "all" || m.severity === filter;
      const matchQ = !q || m.descricao.toLowerCase().includes(q) || m.artigo.toLowerCase().includes(q);
      return matchSev && matchQ;
    });
  }, [search, filter]);

  const stats = useMemo(() => ({
    total: MULTAS.length,
    gravissima: MULTAS.filter((m) => m.severity === "gravissima").length,
    grave: MULTAS.filter((m) => m.severity === "grave").length,
    media: MULTAS.filter((m) => m.severity === "media").length,
    maxValor: Math.max(...MULTAS.map((m) => m.valor)),
  }), []);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-hero pointer-events-none" />
      <div className="absolute inset-0 bg-tactical-grid opacity-[0.06] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 border-b border-border/60 backdrop-blur-md bg-background/60">
        <div className="px-6 lg:px-10 py-5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="" className="h-10 w-10 object-contain" />
            <div className="flex flex-col leading-none">
              <span className="font-display text-base font-bold uppercase tracking-[0.18em]">4° BPRv</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary/80 mt-0.5">Comando</span>
            </div>
          </Link>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/"><ArrowLeft className="mr-1 h-4 w-4" />Voltar ao início</Link>
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 px-6 lg:px-10 py-12 md:py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-[auto_1fr] gap-8 md:gap-10 items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 blur-3xl rounded-full" />
              <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-2xl bg-gradient-tactical border border-primary/40 flex items-center justify-center shadow-elevated">
                <Scale className="h-14 w-14 md:h-16 md:w-16 text-primary" strokeWidth={1.5} />
              </div>
            </div>
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5">
                <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-primary">Tabela Oficial · Atualizada</span>
              </div>
              <h1 className="font-display text-5xl md:text-7xl font-bold uppercase tracking-tight leading-none text-glow-gold">
                CTB
              </h1>
              <p className="font-display text-base md:text-lg uppercase tracking-[0.2em] text-primary/90">
                Código de Trânsito Brasileiro
              </p>
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 gold-divider max-w-[120px]" />
                <span className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  Tabela de Infrações & Multas
                </span>
              </div>
              <p className="text-sm md:text-base text-muted-foreground max-w-2xl leading-relaxed">
                Valores oficiais aplicados pelo Governo Federal. Consulte abaixo os artigos, a descrição
                da infração e o valor atualizado da multa correspondente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative z-10 px-6 lg:px-10 pb-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={FileText} label="Total" value={String(stats.total).padStart(2, "0")} />
          <StatCard icon={AlertTriangle} label="Gravíssimas" value={String(stats.gravissima).padStart(2, "0")} accent="destructive" />
          <StatCard icon={AlertTriangle} label="Graves" value={String(stats.grave).padStart(2, "0")} accent="primary" />
          <StatCard icon={DollarSign} label="Maior Multa" value={formatBRL(stats.maxValor)} />
        </div>
      </section>

      {/* Filters */}
      <section className="relative z-10 px-6 lg:px-10 pb-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-3 md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por artigo ou descrição..."
              className="pl-9 bg-card/50 border-border/60 backdrop-blur-md font-mono text-sm"
            />
          </div>
          <div className="flex gap-2">
            <FilterChip active={filter === "all"} onClick={() => setFilter("all")} label="Todas" />
            <FilterChip active={filter === "gravissima"} onClick={() => setFilter("gravissima")} label="Gravíssimas" />
            <FilterChip active={filter === "grave"} onClick={() => setFilter("grave")} label="Graves" />
            <FilterChip active={filter === "media"} onClick={() => setFilter("media")} label="Médias" />
          </div>
        </div>
      </section>

      {/* Section divider */}
      <section className="relative z-10 px-6 lg:px-10 pb-4">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="font-display uppercase tracking-[0.3em] text-xs text-primary">
            {filtered.length} infração{filtered.length === 1 ? "" : "ões"}
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>
      </section>

      {/* Cards grid */}
      <section className="relative z-10 px-6 lg:px-10 pb-20">
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((m, i) => {
            const sev = SEV_META[m.severity];
            return (
              <Card
                key={`${m.artigo}-${i}`}
                className="group relative overflow-hidden bg-card/60 backdrop-blur-md border-border/60 hover:border-primary/50 transition-all hover:-translate-y-1 hover:shadow-tactical"
              >
                {/* Severity stripe */}
                <div className={`absolute top-0 left-0 right-0 h-1 ${sev.dot}`} />

                <CardContent className="p-5 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <Badge variant="outline" className="font-mono text-[10px] uppercase tracking-widest border-primary/40 text-primary bg-primary/5">
                      {m.artigo}
                    </Badge>
                    <Badge variant="outline" className={`font-mono text-[10px] uppercase tracking-widest ${sev.classes}`}>
                      {sev.label}
                    </Badge>
                  </div>

                  <p className="text-sm text-foreground leading-relaxed min-h-[3.5rem]">
                    {m.descricao}
                  </p>

                  <div className="pt-3 border-t border-border/60 flex items-end justify-between gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                      Valor da Multa
                    </span>
                    <span className="font-display text-2xl font-bold text-primary text-glow-gold tabular-nums">
                      {formatBRL(m.valor)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {filtered.length === 0 && (
            <div className="col-span-full text-center py-16">
              <Scale className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" strokeWidth={1.5} />
              <p className="text-muted-foreground">Nenhuma infração encontrada.</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/60 backdrop-blur-md bg-background/60">
        <div className="px-6 lg:px-10 py-5 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          Tabela CTB · Valores oficiais · 4° BPRv
        </div>
      </footer>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  accent = "default",
}: {
  icon: typeof FileText;
  label: string;
  value: string;
  accent?: "default" | "primary" | "destructive";
}) {
  const color =
    accent === "destructive" ? "text-destructive" : accent === "primary" ? "text-primary" : "text-foreground";
  return (
    <div className="relative overflow-hidden rounded-lg border border-border/60 bg-card/50 backdrop-blur-md p-5 hover:border-primary/40 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <Icon className={`h-5 w-5 ${color}`} />
        <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground">{label}</span>
      </div>
      <div className={`font-display text-2xl md:text-3xl font-bold uppercase tracking-wider tabular-nums ${color}`}>
        {value}
      </div>
    </div>
  );
}

function FilterChip({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 rounded-md font-mono text-[10px] uppercase tracking-[0.2em] border transition-all ${
        active
          ? "bg-primary text-primary-foreground border-primary shadow-gold"
          : "bg-card/50 border-border/60 text-muted-foreground hover:border-primary/40 hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );
}