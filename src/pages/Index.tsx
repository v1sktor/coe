import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Lock, ChevronRight, Network, Crosshair, Radio, Activity, Package, Siren, ScrollText, Settings, UserCircle, Megaphone } from "lucide-react";
import logo from "@/assets/logo-pcsp.png";
import heroBanner from "@/assets/ger-hero.jpg";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const now = new Date();
  const time = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  const date = now.toLocaleDateString("pt-BR");

  const [ind, setInd] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    (supabase.rpc as any)("get_rso_indicadores").then(({ data }: { data: Record<string, number> | null }) => {
      if (data) setInd(data);
    });
  }, []);

  const fmt = (key: string) => {
    const v = ind?.[key];
    return typeof v === "number" && v > 0 ? v.toLocaleString("pt-BR") : "—";
  };

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      {/* Full-screen hero banner — operadores da Polícia Civil em ação */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src={heroBanner}
          alt="Operadores das unidades especializadas da Polícia Civil de São Paulo em ação"
          width={1920}
          height={1080}
          className="w-full h-full object-cover"
        />
        {/* Sobreposição escura para destacar o conteúdo */}
        <div className="absolute inset-0 bg-background/75" />
        <div className="absolute inset-0 [background:linear-gradient(180deg,hsl(0_0%_7%/0.85)_0%,hsl(0_0%_7%/0.55)_45%,hsl(0_0%_7%/0.92)_100%)]" />
        <div className="absolute inset-0 bg-tactical-grid opacity-[0.05]" />
      </div>

      {/* Animated scan line across screen */}
      <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-scan-line pointer-events-none z-0" />

      {/* Header */}
      <header className="relative z-20 flex items-center justify-between px-6 lg:px-12 py-5 border-b border-accent/40 backdrop-blur-md bg-background/60 animate-slide-up">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/15 blur-xl rounded-full group-hover:bg-primary/35 transition-all duration-500" />
            <img src={logo} alt="Brasão da Polícia Civil do Estado de São Paulo" className="relative h-10 w-10 object-contain group-hover:scale-110 transition-transform duration-500" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display text-lg font-bold uppercase tracking-[0.22em] text-foreground">
              Polícia Civil
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.32em] text-primary-glow mt-1">
              Estado de São Paulo
            </span>
          </div>
        </Link>
        <nav className="flex items-center gap-0.5 md:gap-1">
          <NavBtn to="/hierarquia" label="Efetivo" />
          <NavBtn to="/ctb" label="CTB" />
          <NavBtn to="/rso/novo" label="RSO" />
          <NavBtn to="/ccomsoc" label="APCS" />

          <Button asChild size="sm" className="ml-2 md:ml-4 font-display uppercase tracking-[0.18em] text-[10px] md:text-[11px] px-2 md:px-3 bg-primary text-primary-foreground hover:bg-primary-glow transition-all duration-300 hover:scale-105">
            <Link to="/login"><Lock className="mr-1 md:mr-2 h-3 w-3" />Acesso</Link>
          </Button>
        </nav>
      </header>

      {/* Hero — left aligned with side panel */}
      <main className="relative z-10 flex-1 grid lg:grid-cols-[1.4fr_1fr] gap-8 items-center px-6 lg:px-16 py-12">
        {/* LEFT: Title + ctas */}
        <div className="relative">
          {/* Status pill */}
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-accent/60 bg-background/70 backdrop-blur-sm mb-8 animate-slide-right" style={{ animationDelay: "0.1s" }}>
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
              Sistema · Operacional
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-foreground/60 border-l border-accent/60 pl-3">
              {time}
            </span>
          </div>

          {/* Ranking line above */}
          <div className="flex items-center gap-3 mb-3 animate-slide-right" style={{ animationDelay: "0.2s" }}>
            <div className="h-px w-10 bg-primary/60" />
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-primary-glow">Estado de São Paulo · Unidades Especializadas</span>
          </div>

          <h1 className="font-display font-bold uppercase leading-[0.82] tracking-tight">
            <span className="block text-7xl md:text-9xl lg:text-[10rem] text-foreground drop-shadow-[0_8px_32px_rgba(0,0,0,0.9)] animate-slide-up" style={{ animationDelay: "0.3s" }}>
              Polícia Civil
            </span>
            <span className="block text-2xl md:text-4xl lg:text-5xl text-muted-foreground/80 mt-3 animate-slide-up" style={{ animationDelay: "0.4s" }}>
              <span className="text-primary">/</span> Estado de São Paulo
            </span>
          </h1>

          <div className="mt-8 max-w-lg animate-slide-up" style={{ animationDelay: "0.5s" }}>
            <p className="text-base text-muted-foreground leading-relaxed border-l-2 border-primary/60 pl-4">
              Portal operacional e administrativo das unidades especializadas da Polícia Civil do Estado de São Paulo — GOE, GARRA, GER, DEIC, SAP e demais departamentos.
            </p>
            <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.35em] text-foreground/70 pl-4">
              "Investigar, proteger e servir."
            </p>
          </div>

          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row gap-3 animate-slide-up" style={{ animationDelay: "0.6s" }}>
            <Button asChild size="lg" className="font-display uppercase tracking-[0.2em] text-xs bg-primary text-primary-foreground hover:bg-primary-glow transition-all duration-300 hover:scale-[1.03] min-w-[200px] h-12 group">
              <Link to="/login">
                <Shield className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
                Acesso Restrito
                <ChevronRight className="ml-2 h-3 w-3 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="font-display uppercase tracking-[0.2em] text-xs border-accent/70 hover:border-primary/60 hover:bg-card/60 backdrop-blur-sm min-w-[200px] h-12 transition-all hover:scale-[1.03]">
              <Link to="/hierarquia">Ver Efetivo</Link>
            </Button>
          </div>
        </div>

        {/* RIGHT: Analisador RSO */}
        <div className="relative animate-slide-left" style={{ animationDelay: "0.4s" }}>
          <div className="relative card-tactical bg-card/50 backdrop-blur-md p-6 shadow-elevated">
            {/* Corner brackets */}
            <Bracket pos="tl" />
            <Bracket pos="tr" />
            <Bracket pos="bl" />
            <Bracket pos="br" />

            <div className="flex items-center justify-between border-b border-accent/40 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <Activity className="h-3 w-3 text-primary animate-pulse" />
                <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">Resultado de Serviço Operacional</span>
              </div>
              <span className="font-mono text-[10px] text-foreground/60">{date}</span>
            </div>

            <h2 className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-foreground">Indicadores Gerais — RSO</h2>
            <p className="mt-1 text-[11px] text-muted-foreground">Totais consolidados de todos os relatórios aprovados do grupo.</p>

            {/* Ilícitos Apreendidos */}
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-1.5">
                <Package className="h-3 w-3 text-primary" />
                <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-primary-glow">Ilícitos Apreendidos</span>
              </div>
              <div className="grid grid-cols-2 gap-x-6">
                <IndItem label="Cocaína" value={fmt("cocaina")} />
                <IndItem label="Ecstasy" value={fmt("ecstasy")} />
                <IndItem label="Cigarros" value={fmt("cigarros")} />
                <IndItem label="Pistolas" value={fmt("pistolas")} />
                <IndItem label="Fuzis" value={fmt("fuzis")} />
                <IndItem label="Submetralhadoras" value={fmt("submetralhadoras")} />
                <IndItem label="Mun. Pistola" value={fmt("mun_pistola")} />
                <IndItem label="Mun. Fuzil" value={fmt("mun_fuzil")} />
                <IndItem label="Mun. Sub" value={fmt("mun_sub")} />
                <IndItem label="Lockpicks" value={fmt("lockpicks")} />
                <IndItem label="Bombas Caseiras" value={fmt("bombas_caseiras")} />
                <IndItem label="Dinheiro Marcado" value={fmt("dinheiro_marcado")} />
              </div>
            </div>

            {/* Ocorrências */}
            <div className="mt-5">
              <div className="flex items-center gap-2 mb-1.5">
                <Siren className="h-3 w-3 text-primary" />
                <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-primary-glow">Ocorrências</span>
              </div>
              <div className="grid grid-cols-2 gap-x-6">
                <IndItem label="CHAMADOS" value={fmt("chamados_190")} />
                <IndItem label="Roubo Cx. Eletrônico" value={fmt("roubo_caixa_eletronico")} />
                <IndItem label="Roubo Cx. Registr." value={fmt("roubo_caixa_registradora")} />
                <IndItem label="Roubo Residência" value={fmt("roubo_residencia")} />
                <IndItem label="Roubo Veículos" value={fmt("roubo_veiculos")} />
                <IndItem label="Apoios" value={fmt("apoios")} />
                <IndItem label="Tráfico" value={fmt("trafico")} />
                <IndItem label="Ações" value={fmt("acoes")} />
              </div>
            </div>

            {/* Acessos rápidos */}
            <div className="mt-6 pt-4 border-t border-accent/40 grid grid-cols-2 gap-2">
              <NavCard to="/hierarquia" icon={Network} title="Hierarquia" desc="Estrutura de comando e efetivo das unidades." />
              <NavCard to="/diretrizes" icon={ScrollText} title="Regulamento" desc="Manuais internos, viaturas e fardamentos." />
              <NavCard to="/ccomsoc" icon={Megaphone} title="APCS" desc="Assessoria de Imprensa e Comunicação Social — notícias e releases." />
              <NavCard to="/admin/usuarios" icon={Settings} title="Administração" desc="Membros e responsáveis pelo gerenciamento." />
            </div>
          </div>

          {/* Floating crosshair */}
          <div className="absolute -top-3 -right-3 bg-background border border-primary/40 rounded-full p-2 animate-float-slow">
            <Crosshair className="h-4 w-4 text-primary" />
          </div>
        </div>
      </main>

      {/* Unidades da Polícia Civil */}
      <section className="relative z-10 px-6 lg:px-16 pb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px w-10 bg-primary/60" />
          <h2 className="font-display text-sm font-semibold uppercase tracking-[0.28em] text-foreground">
            Unidades Especializadas
          </h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {UNIDADES.map((u) => (
            <div
              key={u.sigla}
              className="card-tactical bg-card/50 backdrop-blur-md p-4 flex flex-col gap-1"
            >
              <span className="font-display text-lg font-bold uppercase tracking-[0.18em] text-foreground">
                {u.sigla}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary-glow leading-snug">
                {u.nome}
              </span>
              <span className="text-[11px] text-muted-foreground leading-snug mt-1">{u.descricao}</span>
            </div>
          ))}
        </div>
      </section>



      {/* Ticker */}
      <div className="relative z-10 border-y border-accent/40 bg-background/60 backdrop-blur-md overflow-hidden">
        <div className="flex animate-ticker whitespace-nowrap py-2.5 font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center gap-12 px-6 shrink-0">
              <span className="flex items-center gap-2"><Radio className="h-3 w-3 text-primary" /> QAP · Frequência limpa</span>
              <span className="text-primary/50">◆</span>
              <span>Operações Especiais · 24/7</span>
              <span className="text-primary/50">◆</span>
              <span className="flex items-center gap-2"><Shield className="h-3 w-3 text-primary" /> Unidade de elite · Polícia Civil SP</span>
              <span className="text-primary/50">◆</span>
              <span>"Garra e determinação, resposta imediata"</span>
              <span className="text-primary/50">◆</span>
              <span className="flex items-center gap-2"><Activity className="h-3 w-3 text-primary animate-pulse" /> Sistema operacional</span>
              <span className="text-primary/50">◆</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 backdrop-blur-md bg-background/40">
        <div className="px-6 lg:px-12 py-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.32em] text-muted-foreground/70">
          <span>Polícia Civil do Estado de São Paulo · {now.getFullYear()}</span>
          <span className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-primary animate-blink" /> Sistema Restrito</span>
        </div>
      </footer>
    </div>
  );
};

const NavBtn = ({ to, label }: { to: string; label: string }) => (
  <Button variant="ghost" asChild size="sm" className="font-display uppercase tracking-[0.18em] text-[10px] md:text-[11px] px-2 md:px-3 text-muted-foreground hover:text-foreground hover:bg-card/40 relative group">
    <Link to={to}>
      {label}
      <span className="absolute bottom-1 left-3 right-3 h-px bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
    </Link>
  </Button>
);

const IndItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between gap-2 border-b border-border/40 py-1 font-mono text-[10px]">
    <span className="uppercase tracking-[0.12em] text-muted-foreground truncate">{label}</span>
    <span className={value === "—" ? "text-muted-foreground/60" : "text-primary-glow font-medium"}>{value}</span>
  </div>
);

const NavCard = ({ to, icon: Icon, title, desc }: { to: string; icon: any; title: string; desc: string }) => (
  <Link
    to={to}
    className="flex flex-col gap-1 p-3 border border-accent/40 bg-background/40 hover:border-primary/60 hover:bg-card/60 transition-all hover:-translate-y-0.5 group rounded-md"
  >
    <span className="flex items-center gap-2">
      <Icon className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
      <span className="font-display text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground">{title}</span>
    </span>
    <span className="text-[10px] leading-snug text-muted-foreground">{desc}</span>
  </Link>
);

const Bracket = ({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) => {
  const map = {
    tl: "top-0 left-0 border-t border-l",
    tr: "top-0 right-0 border-t border-r",
    bl: "bottom-0 left-0 border-b border-l",
    br: "bottom-0 right-0 border-b border-r",
  };
  return <span className={`absolute w-3 h-3 border-primary ${map[pos]}`} />;
};

export default Index;
