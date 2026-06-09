import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Lock, ChevronRight, Network, FileText, Scale, Crosshair, Radio, Activity } from "lucide-react";
import logo from "@/assets/logo-bprv.png";

const Index = () => {
  const now = new Date();
  const time = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  const date = now.toLocaleDateString("pt-BR");

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      {/* Ambient layers */}
      <div className="absolute inset-0 bg-gradient-hero pointer-events-none" />
      <div className="absolute inset-0 bg-tactical-grid opacity-[0.05] pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none [background:radial-gradient(ellipse_at_center,transparent_30%,hsl(0_0%_0%/0.9)_100%)]" />

      {/* Animated scan line across screen */}
      <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-primary/60 to-transparent animate-scan-line pointer-events-none z-0" />

      {/* Rotating insignia background */}
      <img
        src={logo}
        alt=""
        aria-hidden
        className="absolute -right-40 top-1/2 -translate-y-1/2 w-[700px] h-[700px] object-contain opacity-[0.06] pointer-events-none select-none grayscale animate-rotate-slow"
      />

      {/* Header */}
      <header className="relative z-20 flex items-center justify-between px-6 lg:px-12 py-5 border-b border-border/40 backdrop-blur-md bg-background/50 animate-slide-up">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/10 blur-xl rounded-full group-hover:bg-primary/30 transition-all duration-500" />
            <img src={logo} alt="ROTA" className="relative h-10 w-10 object-contain grayscale brightness-110 group-hover:scale-110 transition-transform duration-500" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display text-lg font-bold uppercase tracking-[0.22em] text-foreground">
              ROTA
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.32em] text-muted-foreground mt-1">
              Tobias de Aguiar
            </span>
          </div>
        </Link>
        <nav className="flex items-center gap-0.5 md:gap-1">
          <NavBtn to="/hierarquia" label="Efetivo" />
          <NavBtn to="/ctb" label="CTB" />
          <NavBtn to="/rso/novo" label="RSO" />
          <Button asChild size="sm" className="ml-2 md:ml-4 font-display uppercase tracking-[0.18em] text-[10px] md:text-[11px] px-2 md:px-3 bg-foreground text-background hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-105">
            <Link to="/login"><Lock className="mr-1 md:mr-2 h-3 w-3" />Acesso</Link>
          </Button>
        </nav>
      </header>

      {/* Hero — left aligned with side panel */}
      <main className="relative z-10 flex-1 grid lg:grid-cols-[1.4fr_1fr] gap-8 items-center px-6 lg:px-16 py-12">
        {/* LEFT: Title + ctas */}
        <div className="relative">
          {/* Status pill */}
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-border/60 bg-background/70 backdrop-blur-sm mb-8 animate-slide-right" style={{ animationDelay: "0.1s" }}>
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
              Sistema · Operacional
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-foreground/60 border-l border-border/60 pl-3">
              {time}
            </span>
          </div>

          {/* Ranking line above */}
          <div className="flex items-center gap-3 mb-3 animate-slide-right" style={{ animationDelay: "0.2s" }}>
            <div className="h-px w-10 bg-primary/60" />
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-primary/80">9° BPM/M · Tropa de Elite</span>
          </div>

          <h1 className="font-display font-bold uppercase leading-[0.82] tracking-tight">
            <span className="block text-7xl md:text-9xl lg:text-[10rem] text-foreground drop-shadow-[0_8px_32px_rgba(0,0,0,0.9)] animate-slide-up" style={{ animationDelay: "0.3s" }}>
              ROTA
            </span>
            <span className="block text-2xl md:text-4xl lg:text-5xl text-muted-foreground/80 mt-3 animate-slide-up" style={{ animationDelay: "0.4s" }}>
              <span className="text-primary">/</span> Tobias de Aguiar
            </span>
          </h1>

          <div className="mt-8 max-w-lg animate-slide-up" style={{ animationDelay: "0.5s" }}>
            <p className="text-base text-muted-foreground leading-relaxed border-l-2 border-primary/60 pl-4">
              Rondas Ostensivas Tobias de Aguiar — tropa de elite da Polícia Militar do Estado de São Paulo.
            </p>
            <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.35em] text-foreground/70 pl-4">
              "Não existem dois lados, apenas o nosso."
            </p>
          </div>

          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row gap-3 animate-slide-up" style={{ animationDelay: "0.6s" }}>
            <Button asChild size="lg" className="font-display uppercase tracking-[0.2em] text-xs bg-foreground text-background hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-[1.03] min-w-[200px] h-12 group">
              <Link to="/login">
                <Shield className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
                Acesso Restrito
                <ChevronRight className="ml-2 h-3 w-3 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="font-display uppercase tracking-[0.2em] text-xs border-border/60 hover:border-primary/60 hover:bg-card/60 backdrop-blur-sm min-w-[200px] h-12 transition-all hover:scale-[1.03]">
              <Link to="/hierarquia">Ver Efetivo</Link>
            </Button>
          </div>
        </div>

        {/* RIGHT: Tactical info panel */}
        <div className="relative animate-slide-left" style={{ animationDelay: "0.4s" }}>
          <div className="relative border border-border/50 bg-card/40 backdrop-blur-md p-6 shadow-elevated">
            {/* Corner brackets */}
            <Bracket pos="tl" />
            <Bracket pos="tr" />
            <Bracket pos="bl" />
            <Bracket pos="br" />

            <div className="flex items-center justify-between border-b border-border/40 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Activity className="h-3 w-3 text-primary animate-pulse" />
                <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-muted-foreground">Status Tático</span>
              </div>
              <span className="font-mono text-[10px] text-foreground/60">{date}</span>
            </div>

            <div className="space-y-4">
              <StatRow label="Operação" value="ATIVA" highlight />
              <StatRow label="Comando" value="9° BPM/M" />
              <StatRow label="Setor" value="METROPOLITANO" />
              <StatRow label="Frequência" value="VHF · 156.800" />
              <StatRow label="Código" value="QAP · QSL" />
            </div>

            <div className="mt-6 pt-4 border-t border-border/40 grid grid-cols-3 gap-2">
              <QuickLink to="/hierarquia" icon={Network} label="Efetivo" />
              <QuickLink to="/ctb" icon={Scale} label="CTB" />
              <QuickLink to="/rso/novo" icon={FileText} label="RSO" />
            </div>
          </div>

          {/* Floating crosshair */}
          <div className="absolute -top-3 -right-3 bg-background border border-primary/40 rounded-full p-2 animate-float-slow">
            <Crosshair className="h-4 w-4 text-primary" />
          </div>
        </div>
      </main>

      {/* Ticker */}
      <div className="relative z-10 border-y border-border/40 bg-background/60 backdrop-blur-md overflow-hidden">
        <div className="flex animate-ticker whitespace-nowrap py-2.5 font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center gap-12 px-6 shrink-0">
              <span className="flex items-center gap-2"><Radio className="h-3 w-3 text-primary" /> QAP · Frequência limpa</span>
              <span className="text-foreground/40">◆</span>
              <span>Operação Tobias · 24/7</span>
              <span className="text-foreground/40">◆</span>
              <span className="flex items-center gap-2"><Shield className="h-3 w-3 text-primary" /> Tropa de elite · PMESP</span>
              <span className="text-foreground/40">◆</span>
              <span>"Não existem dois lados, apenas o nosso"</span>
              <span className="text-foreground/40">◆</span>
              <span className="flex items-center gap-2"><Activity className="h-3 w-3 text-primary animate-pulse" /> Sistema operacional</span>
              <span className="text-foreground/40">◆</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 backdrop-blur-md bg-background/40">
        <div className="px-6 lg:px-12 py-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.32em] text-muted-foreground/70">
          <span>ROTA · {now.getFullYear()}</span>
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

const StatRow = ({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) => (
  <div className="flex items-center justify-between font-mono text-[11px]">
    <span className="uppercase tracking-[0.3em] text-muted-foreground">{label}</span>
    <span className={`uppercase tracking-[0.2em] ${highlight ? "text-primary flex items-center gap-2" : "text-foreground"}`}>
      {highlight && <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />}
      {value}
    </span>
  </div>
);

const QuickLink = ({ to, icon: Icon, label }: { to: string; icon: any; label: string }) => (
  <Link
    to={to}
    className="flex flex-col items-center gap-1.5 p-3 border border-border/40 bg-background/40 hover:border-primary/60 hover:bg-card/60 transition-all hover:-translate-y-0.5 group"
  >
    <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
    <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground group-hover:text-foreground">{label}</span>
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
