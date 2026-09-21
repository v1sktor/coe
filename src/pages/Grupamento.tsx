import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Crosshair, Radio, Shield, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/logo-4bpchq.png";

type Grupamento = "TOR" | "ROCAM";

interface Member {
  id: string;
  membro_nome: string;
  rg: string | null;
  discord_id: string | null;
  funcao: string | null;
  data_entrada: string | null;
  cargo_nome?: string;
  cargo_imagem?: string | null;
  cargo_nivel?: number;
}

const META: Record<Grupamento, {
  title: string;
  subtitle: string;
  motto: string;
  description: string;
  icon: typeof Crosshair;
  pills: string[];
}> = {
  TOR: {
    title: "TOR",
    subtitle: "Tático de Operações Rodoviárias",
    motto: "Precisão · Velocidade · Resultado",
    description:
      "Pelotão de elite especializado em operações de alto risco em rodovias. Atuação tática em apoio a ocorrências críticas, abordagens de alta complexidade e enfrentamento ao crime organizado em vias federais e estaduais.",
    icon: Crosshair,
    pills: ["Operações Especiais", "Abordagem Tática", "Apoio Crítico"],
  },
  ROCAM: {
    title: "ROCAM",
    subtitle: "Rondas Ostensivas com Apoio de Motocicletas",
    motto: "Mobilidade · Vigilância · Pronta Resposta",
    description:
      "Grupamento motorizado de pronta resposta. Patrulhamento ostensivo, escolta e perseguição em ambientes urbanos e rodoviários, garantindo presença, deterrência e ação imediata.",
    icon: Radio,
    pills: ["Patrulha Motorizada", "Pronta Resposta", "Escolta"],
  },
};

export default function GrupamentoPage({ tipo }: { tipo: Grupamento }) {
  const meta = META[tipo];
  const Icon = meta.icon;
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    const fetchMembers = async () => {
      const { data } = await (supabase.rpc as any)("get_hierarquia_publica");
      if (data) {
        setMembers(
          (data as any[])
            .filter((h: any) => h.grupamento === tipo)
            .map((h: any) => ({
              id: h.id,
              membro_nome: h.membro_nome,
              rg: null,
              discord_id: null,
              funcao: h.funcao,
              data_entrada: h.data_entrada,
              cargo_nome: h.cargo_nome,
              cargo_imagem: h.cargo_imagem,
              cargo_nivel: h.cargo_nivel,
            }))
        );
      }
    };
    fetchMembers();
  }, [tipo]);

  const sorted = [...members].sort((a, b) => (a.cargo_nivel ?? 99) - (b.cargo_nivel ?? 99));

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-hero pointer-events-none" />
      <div className="absolute inset-0 bg-tactical-grid opacity-[0.06] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 bg-sidebar text-sidebar-foreground border-b-2 border-primary">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Emblema da Marinha do Brasil" width={1024} height={1024} className="h-11 w-11 object-contain" />
            <span className="flex flex-col leading-tight">
              <span className="font-display text-base font-semibold tracking-wide">
                Vida Carioca · Marinha
              </span>
              <span className="text-[11px] text-primary-foreground/70">
                Marinha do Brasil
              </span>
            </span>
          </Link>
          <Button variant="ghost" size="sm" asChild className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
            <Link to="/"><ArrowLeft className="mr-1 h-4 w-4" />Voltar ao início</Link>
          </Button>
        </div>
      </header>


      {/* Hero */}
      <section className="relative z-10 px-6 lg:px-10 py-16 md:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-[auto_1fr] gap-8 md:gap-12 items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 blur-3xl rounded-full" />
              <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-gradient-tactical border border-primary/40 flex items-center justify-center shadow-elevated">
                <Icon className="h-16 w-16 md:h-20 md:w-20 text-primary" strokeWidth={1.5} />
              </div>
            </div>
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5">
                <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-primary">Grupamento Especial</span>
              </div>
              <h1 className="font-display text-6xl md:text-8xl font-bold uppercase tracking-tight leading-none text-glow-gold">
                {meta.title}
              </h1>
              <p className="font-display text-lg md:text-xl uppercase tracking-[0.2em] text-primary/90">
                {meta.subtitle}
              </p>
              <div className="flex items-center gap-3 pt-1">
                <div className="h-px flex-1 gold-divider max-w-[120px]" />
                <span className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">{meta.motto}</span>
              </div>
              <p className="text-base text-muted-foreground max-w-2xl leading-relaxed pt-2">
                {meta.description}
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {meta.pills.map((p) => (
                  <Badge key={p} variant="outline" className="border-primary/40 text-primary bg-primary/5 font-mono text-[10px] uppercase tracking-widest">
                    {p}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative z-10 px-6 lg:px-10 pb-8">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-4">
          <StatCard icon={Users} label="Efetivo" value={String(sorted.length).padStart(2, "0")} />
          <StatCard icon={Shield} label="Status" value="ATIVO" />
          <StatCard icon={Icon} label="Unidade" value={meta.title} />
        </div>
      </section>

      {/* Effective table */}
      <section className="relative z-10 px-6 lg:px-10 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1 bg-border" />
            <span className="font-display uppercase tracking-[0.3em] text-xs text-primary">Efetivo {meta.title}</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <Card className="bg-card/60 backdrop-blur-md border-border/60 shadow-tactical">
            <CardContent className="p-0">
              {sorted.length === 0 ? (
                <div className="text-center py-16 px-6">
                  <Icon className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" strokeWidth={1.5} />
                  <p className="text-muted-foreground">Nenhum policial alocado neste grupamento.</p>
                  <p className="text-xs text-muted-foreground/60 mt-2 font-mono uppercase tracking-widest">
                    Atribua um policial ao grupamento {meta.title} via painel administrativo.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border/60 hover:bg-transparent">
                        <TableHead className="font-display uppercase text-[10px] tracking-[0.2em] text-primary/80">RG</TableHead>
                        <TableHead className="font-display uppercase text-[10px] tracking-[0.2em] text-primary/80">Insígnia</TableHead>
                        <TableHead className="font-display uppercase text-[10px] tracking-[0.2em] text-primary/80">Nome</TableHead>
                        <TableHead className="font-display uppercase text-[10px] tracking-[0.2em] text-primary/80">Graduação</TableHead>
                        <TableHead className="font-display uppercase text-[10px] tracking-[0.2em] text-primary/80">Função</TableHead>
                        <TableHead className="font-display uppercase text-[10px] tracking-[0.2em] text-primary/80">Entrada</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sorted.map((m) => (
                        <TableRow key={m.id} className="border-border/40 hover:bg-primary/5 transition-colors">
                          <TableCell className="font-mono text-sm">{m.rg || "—"}</TableCell>
                          <TableCell>
                            {m.cargo_imagem ? (
                              <img src={m.cargo_imagem} alt="" className="h-9 w-9 object-contain" />
                            ) : (
                              <span className="text-muted-foreground text-xs">—</span>
                            )}
                          </TableCell>
                          <TableCell className="font-display font-semibold uppercase tracking-wide text-sm">{m.membro_nome}</TableCell>
                          <TableCell>
                            {m.cargo_nome ? (
                              <Badge variant="outline" className="border-primary/40 text-primary bg-primary/5 text-xs">{m.cargo_nome}</Badge>
                            ) : <span className="text-muted-foreground text-xs">—</span>}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">{m.funcao || "—"}</TableCell>
                          <TableCell className="font-mono text-xs text-muted-foreground">{m.data_entrada || "—"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: typeof Users; label: string; value: string }) {
  return (
    <div className="relative overflow-hidden rounded-lg border border-border/60 bg-card/50 backdrop-blur-md p-5 group hover:border-primary/40 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <Icon className="h-5 w-5 text-primary/80" />
        <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground">{label}</span>
      </div>
      <div className="font-display text-3xl md:text-4xl font-bold uppercase tracking-wider text-foreground">
        {value}
      </div>
    </div>
  );
}